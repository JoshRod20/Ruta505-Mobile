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

// ───────────────────────── Intereses del usuario ─────────────────────────

/**
 * Cada grupo relaciona palabras que aparecen en el texto del interés
 * ("Turismo gastronómico", "Turismo de naturaleza / ecoturismo"...) con
 * palabras que aparecen en el nombre, la categoría o el tipo del lugar.
 * Todo se compara sin tildes ni mayúsculas, y por "contiene".
 * AGREGA aquí los demás intereses que ofrece tu app.
 */
const GRUPOS = [
  {
    claves: ["naturaleza", "ecoturismo", "ecologic"],
    palabras: ["parque", "volcan", "laguna", "reserva", "mirador", "playa", "sendero", "lago", "cascada", "isla", "bosque", "natural", "rio", "finca"],
  },
  {
    claves: ["gastronom", "comida", "culinari"],
    palabras: ["restaurante", "comida", "cafe", "cafeteria", "fritanga", "cocina", "mercado", "bar", "panaderia", "dulce", "gastronom", "cantina"],
  },
  {
    claves: ["aventura", "deporte"],
    palabras: ["volcan", "sendero", "tirolesa", "canopy", "kayak", "senderismo", "surf", "cueva", "mirador", "laguna", "deslizamiento"],
  },
  {
    claves: ["cultur", "tradicion", "folklor", "artesan"],
    palabras: ["museo", "teatro", "galeria", "artesania", "cultura", "centro cultural", "mercado", "taller", "ceramica"],
  },
  {
    claves: ["histor", "patrimonio", "colonial"],
    palabras: ["museo", "iglesia", "catedral", "monumento", "fortaleza", "plaza", "historico", "convento", "parque central"],
  },
  {
    claves: ["religios", "peregrin"],
    palabras: ["iglesia", "catedral", "santuario", "parroquia", "basilica", "capilla"],
  },
  {
    claves: ["playa", "sol y mar", "costero"],
    palabras: ["playa", "costa", "mar", "surf", "bahia"],
  },
  {
    claves: ["rural", "agroturismo", "comunitario", "agricultur", "agricola", "agro"],
    palabras: ["finca", "hacienda", "cooperativa", "comunidad", "granja", "cafetal", "cultivo", "plantacion", "agricultura", "huerto"],
  },
];

// Palabras del interés que no sirven para comparar
const IGNORAR = ["turismo", "lugares", "actividades", "experiencias"];

const sinTildes = (texto) => {
  const base = String(texto ?? "").toLowerCase();
  try {
    return base.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  } catch {
    return base.trim();
  }
};

/**
 * Acepta ["Turismo gastronómico", ...], [{nombre: "..."}] o "a, b" y devuelve
 * [{ texto: original, norm: sin tildes }] sin repetidos ni vacíos.
 */
export function normalizarIntereses(intereses) {
  if (!intereses) return [];
  const lista = Array.isArray(intereses)
    ? intereses
    : typeof intereses === "string"
      ? intereses.split(/[,;]/)
      : Object.values(intereses);
  const vistos = new Set();
  const salida = [];
  for (const i of lista) {
    const texto = String(
      typeof i === "string" ? i : (i?.nombre ?? i?.label ?? i?.titulo ?? i?.id ?? ""),
    ).trim();
    const norm = sinTildes(texto);
    if (!norm || vistos.has(norm)) continue;
    vistos.add(norm);
    salida.push({ texto, norm });
  }
  return salida;
}

// Palabras con las que se busca un interés en el texto de un lugar
function palabrasDe(interes) {
  const palabras = new Set();
  for (const g of GRUPOS) {
    if (g.claves.some((c) => interes.norm.includes(c))) {
      g.palabras.forEach((p) => palabras.add(p));
    }
  }
  // Respaldo para intereses que no están en los grupos: sus propias palabras
  interes.norm
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 5 && !IGNORAR.includes(w))
    .forEach((w) => palabras.add(w));
  return [...palabras];
}

/**
 * Cuántos intereses del usuario coinciden con el lugar, y el texto original
 * del primero que coincidió.
 * @returns {{puntaje: number, interes: string|null}}
 */
function coincidencia(lugar, intereses) {
  if (!intereses.length) return { puntaje: 0, interes: null };
  const texto = sinTildes(
    `${lugar.nombre ?? ""} ${lugar.categoria ?? ""} ${lugar.etiquetaTipo ?? ""}`,
  );
  let puntaje = 0;
  let interes = null;
  for (const i of intereses) {
    if (palabrasDe(i).some((p) => texto.includes(p))) {
      puntaje += 1;
      if (!interes) interes = i.texto;
    }
  }
  return { puntaje, interes };
}

// ───────────────────────── Utilidades ─────────────────────────

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

// Primero los que coinciden con más intereses; a igual puntaje, el más cercano.
// Sin intereses (puntaje 0 para todos) queda ordenado solo por cercanía.
const porInteresYDistancia = (a, b) =>
  (b.puntaje ?? 0) - (a.puntaje ?? 0) || porDistancia(a, b);

// ───────────────────────── Pool de candidatos ─────────────────────────

/**
 * Pool de lugares cercanos a la ubicación actual:
 *  - negocios registrados (apoyan a la comunidad)
 *  - lugares de OpenStreetMap, el más cercano de cada tipo (variedad)
 * Orden: 1) coinciden con los intereses del usuario, 2) más cercanos.
 * Si el usuario no tiene intereses (o ninguno coincide), queda por cercanía.
 * Se piden en paralelo; si una fuente falla o tarda, se usa la otra.
 *
 * @param {{lat:number, lon:number, aproximada?:boolean}} ubicacion
 * @param {Array|string} intereses  `intereses` del perfil del usuario.
 */
export async function candidatosCercanos(ubicacion, intereses = []) {
  if (!ubicacion) return [];

  const listaIntereses = normalizarIntereses(intereses);

  const distanciaA = (l) =>
    ubicacion.aproximada
      ? null
      : distanciaKm(ubicacion, { lat: l.lat, lon: l.lng });

  const conInteres = (c) => {
    const { puntaje, interes } = coincidencia(c, listaIntereses);
    return { ...c, puntaje, interesCoincidente: interes };
  };

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
    .map((n) =>
      conInteres({
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
      }),
    )
    .sort(porInteresYDistancia)
    .slice(0, MAX_REGISTRADOS);

  // Externos: el más cercano de cada tipo (evita 5 iglesias seguidas)
  const porTipo = new Map();
  for (const l of externosRaw) {
    if (porTipo.has(l.etiquetaTipo)) continue;
    porTipo.set(
      l.etiquetaTipo,
      conInteres({
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
      }),
    );
  }
  const externos = [...porTipo.values()]
    .sort(porInteresYDistancia)
    .slice(0, MAX_EXTERNOS);

  // Mezcla ambas fuentes: intereses primero, luego cercanía. Sin distancias
  // (ubicación aproximada) el orden estable deja primero a los registrados.
  const pool = [...registrados, ...externos]
    .sort(porInteresYDistancia)
    .slice(0, MAX_POOL);

  if (DEBUG) {
    console.log(
      `[Pinolito] intereses: ${listaIntereses.map((i) => i.texto).join(", ") || "ninguno"} | ` +
        `pool: ${registrados.length} registrados + ${externos.length} externos`,
      pool.map(
        (c) =>
          `${c.nombre} (${c.etiquetaTipo}` +
          `${c.distanciaKm != null ? `, ${c.distanciaKm.toFixed(1)} km` : ""}` +
          `${c.puntaje ? `, interés: ${c.interesCoincidente}` : ""})`,
      ),
    );
  }

  return pool;
}

/**
 * Rotación: elige el primer lugar del pool que aún no se haya recomendado
 * (el pool ya viene ordenado por intereses y cercanía). Cuando ya se
 * recomendaron todos, reinicia el ciclo (sin repetir justo el último).
 *
 * @param {Array} candidatos  Pool ordenado.
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