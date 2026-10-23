import * as Location from "expo-location";
import { escucharNegocios } from "./Negociosservice";
import {
  buscarLugaresDeInteres,
  distanciaKm,
} from "./lugaresRecomendadosService";

const DEBUG = process.env.EXPO_PUBLIC_PINOLITO_DEBUG === "true";

// Mismo centro por defecto que usa la pantalla del mapa (Masaya/Granada).
const CENTRO_POR_DEFECTO = { lat: 11.9744, lon: -86.0942 };
const ESPERA_GPS_MS = 8000;
const ESPERA_OSM_MS = 9000;
const ESPERA_NEGOCIOS_MS = 6000;

// Pool de lugares cercanos entre los que Pinolito va alternando.
const MAX_REGISTRADOS = 5;
const MAX_EXTERNOS = 5;
const MAX_POOL = 6;
// Cuántos lugares ya recomendados se recuerdan (el ciclo se reinicia antes).
export const MAX_VISTOS = 20;

function conTimeout(promesa, ms) {
  let temporizador;
  const limite = new Promise((_, rechazar) => {
    temporizador = setTimeout(() => rechazar(new Error("timeout")), ms);
  });
  return Promise.race([promesa, limite]).finally(() =>
    clearTimeout(temporizador),
  );
}

/**
 * Devuelve { lat, lon }. Si no hay permiso o GPS, devuelve el centro por
 * defecto marcado con `aproximada: true` (no se muestran distancias).
 */
export async function obtenerUbicacion() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      try {
        const pos = await conTimeout(
          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          }),
          ESPERA_GPS_MS,
        );
        return { lat: pos.coords.latitude, lon: pos.coords.longitude };
      } catch {
        const ultima = await Location.getLastKnownPositionAsync();
        if (ultima) {
          return { lat: ultima.coords.latitude, lon: ultima.coords.longitude };
        }
      }
    }
  } catch (e) {
    console.warn("[Pinolito] No se pudo obtener la ubicación:", e?.message);
  }
  return { ...CENTRO_POR_DEFECTO, aproximada: true };
}

/** Lee los negocios registrados una sola vez (Firestore) y se desuscribe. */
function negociosRegistradosUnaVez() {
  return new Promise((resolve) => {
    let terminado = false;
    let cancelar = null;
    let limite = null;

    const terminar = (lista) => {
      if (terminado) return;
      terminado = true;
      clearTimeout(limite);
      cancelar?.();
      resolve(lista);
    };

    limite = setTimeout(() => terminar([]), ESPERA_NEGOCIOS_MS);

    try {
      cancelar = escucharNegocios(
        (negocios) => terminar(negocios ?? []),
        () => terminar([]),
      );
      // Si el callback llegó antes de tener la función para cancelar
      if (terminado) cancelar?.();
    } catch {
      terminar([]);
    }
  });
}

const esCoordenadaValida = (n) =>
  typeof n.lat === "number" &&
  typeof n.lng === "number" &&
  !Number.isNaN(n.lat) &&
  !Number.isNaN(n.lng);

const porDistancia = (a, b) =>
  (a.distanciaKm ?? Infinity) - (b.distanciaKm ?? Infinity);

/**
 * Pool de lugares cercanos, ordenado del más cercano al más lejano:
 *  - los negocios registrados más cercanos (apoyan a la comunidad)
 *  - el lugar de OpenStreetMap más cercano de cada tipo (variedad)
 * Se piden en paralelo; si una fuente falla o tarda, se usa la otra.
 */
export async function candidatosCercanos(ubicacion) {
  if (!ubicacion) return [];

  const distanciaA = (l) =>
    ubicacion.aproximada
      ? null
      : distanciaKm(ubicacion, { lat: l.lat, lon: l.lng });

  const [registradosRaw, externosRaw] = await Promise.all([
    negociosRegistradosUnaVez().catch(() => []),
    conTimeout(
      buscarLugaresDeInteres({ lat: ubicacion.lat, lon: ubicacion.lon }),
      ESPERA_OSM_MS,
    ).catch((e) => {
      console.warn("[Pinolito] Lugares externos no disponibles:", e?.message);
      return []; // la consulta sigue en segundo plano y llena la caché del mapa
    }),
  ]);

  const registrados = registradosRaw
    .filter(esCoordenadaValida)
    .map((n) => ({
      id: n.id,
      nombre: n.titulo,
      categoria: n.categoria,
      etiquetaTipo: "Negocio local",
      municipio: n.lugar,
      lat: n.lat,
      lng: n.lng,
      externo: false,
      distanciaKm: distanciaA(n),
      lugarMapa: n, // el mapa lo encuentra entre sus negocios por nombre/posición
    }))
    .sort(porDistancia)
    .slice(0, MAX_REGISTRADOS);

  // Externos: el más cercano de cada tipo (evita 5 iglesias seguidas)
  const porTipo = new Map();
  for (const l of externosRaw) {
    if (porTipo.has(l.etiquetaTipo)) continue;
    porTipo.set(l.etiquetaTipo, {
      id: l.id,
      nombre: l.titulo,
      categoria: l.categoria,
      etiquetaTipo: l.etiquetaTipo,
      municipio: l.lugar,
      lat: l.lat,
      lng: l.lng,
      externo: true,
      distanciaKm: distanciaA(l),
      lugarMapa: l, // objeto original de buscarLugaresDeInteres
    });
  }
  const externos = [...porTipo.values()].slice(0, MAX_EXTERNOS);

  // Mezcla ambas fuentes por cercanía. Sin distancias (ubicación aproximada)
  // el orden estable deja primero a los negocios registrados.
  const pool = [...registrados, ...externos].sort(porDistancia).slice(0, MAX_POOL);

  if (DEBUG) {
    console.log(
      `[Pinolito] pool: ${registrados.length} registrados + ${externos.length} externos`,
      pool.map(
        (c) =>
          `${c.nombre} (${c.etiquetaTipo}${
            c.distanciaKm != null ? `, ${c.distanciaKm.toFixed(1)} km` : ""
          })`,
      ),
    );
  }

  return pool;
}

/**
 * Rotación: elige el lugar más cercano que aún no se haya recomendado.
 * Cuando ya se recomendaron todos los del pool, reinicia el ciclo (sin
 * repetir justo el último).
 *
 * @param {Array} candidatos  Pool ordenado por cercanía.
 * @param {string[]} vistos   Ids ya recomendados, del más antiguo al más reciente.
 * @returns {{elegido: object|null, vistos: string[]}} Nuevo historial a guardar.
 */
export function elegirSiguiente(candidatos, vistos = []) {
  if (!candidatos.length) return { elegido: null, vistos };

  let historial = vistos;
  let disponibles = candidatos.filter((c) => !historial.includes(c.id));

  if (!disponibles.length) {
    const ultimo = historial[historial.length - 1];
    disponibles = candidatos.filter((c) => c.id !== ultimo);
    if (!disponibles.length) disponibles = candidatos; // pool de un solo lugar
    historial = [];
  }

  const elegido = disponibles[0];
  return {
    elegido,
    vistos: [...historial, elegido.id].slice(-MAX_VISTOS),
  };
}