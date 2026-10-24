import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { generarRecomendacion } from "../services/geminiService";
import {
  candidatosCercanos,
  elegirSiguiente,
  obtenerUbicacion,
} from "../services/lugaresService";
import { distanciaKm } from "../services/lugaresRecomendadosService";

const DEBUG = process.env.EXPO_PUBLIC_PINOLITO_DEBUG === "true";

// En modo prueba: cada 30 s en vez de 10 min
const INTERVALO_MS = DEBUG ? 30 * 1000 : 10 * 60 * 1000;
const REVISION_MS = DEBUG ? 5 * 1000 : 30 * 1000;

// Distancia que debes moverte desde la última recomendación para que Pinolito
// vuelva a aparecer, y espera mínima entre dos recomendaciones.
const UMBRAL_KM = DEBUG ? 0.05 : 0.5;
const MIN_ENTRE_MS = DEBUG ? 10 * 1000 : 2 * 60 * 1000;

// Ids de los lugares ya recomendados. Se guardan en el dispositivo para que
// la rotación continúe aunque se cierre la app por completo.
const CLAVE_VISTOS = "@ruta505:pinolitoVistos";

async function leerVistos() {
  try {
    const guardado = await AsyncStorage.getItem(CLAVE_VISTOS);
    const lista = guardado ? JSON.parse(guardado) : [];
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

function guardarVistos(lista) {
  AsyncStorage.setItem(CLAVE_VISTOS, JSON.stringify(lista)).catch(() => {});
}

export function usePinolitoRecomendaciones({
  habilitado,
  nombre,
  rol,
  intereses,
}) {
  const [recomendacion, setRecomendacion] = useState(null);
  const ultimaRef = useRef(0); // se reinicia al cerrar la app por completo
  const ocupadoRef = useRef(false);
  const visibleRef = useRef(false);
  const previasRef = useRef([]);
  const posUltimaRecRef = useRef(null); // dónde estabas en la última recomendación

  // nombre, rol e intereses van en un ref: así `lanzar` es estable y un cambio
  // en el perfil (por ejemplo, cuando termina de cargar) no dispara una
  // recomendación extra. Siempre se usan los valores más recientes.
  const datosRef = useRef({ nombre, rol, intereses });
  datosRef.current = { nombre, rol, intereses };

  // Solo se llama desde los botones de la nube
  const cerrar = useCallback(() => {
    visibleRef.current = false;
    ultimaRef.current = Date.now(); // los 10 min cuentan desde que se cierra
    setRecomendacion(null);
  }, []);

  const lanzar = useCallback(async () => {
    if (ocupadoRef.current || visibleRef.current) return;
    ocupadoRef.current = true;
    // Se marca al empezar: si algo falla, el reintento espera el intervalo
    // completo y no se golpea Overpass/Gemini en bucle.
    ultimaRef.current = Date.now();
    try {
      const { nombre: n, rol: r, intereses: i } = datosRef.current;

      // Ubicación actual en este momento
      const ubicacion = await obtenerUbicacion();
      // Se guarda antes de las llamadas de red: si algo falla, el siguiente
      // intento parte de esta posición y no se repite en bucle.
      if (!ubicacion.aproximada) {
        posUltimaRecRef.current = { lat: ubicacion.lat, lon: ubicacion.lon };
      }

      // Pool ordenado: 1) intereses del usuario, 2) más cercanos
      const pool = await candidatosCercanos(ubicacion, i);

      // Rotación: el primero del pool que aún no se haya recomendado
      const { elegido, vistos } = elegirSiguiente(pool, await leerVistos());

      const resultado = await generarRecomendacion({
        nombre: n,
        rol: r,
        // Gemini solo redacta el mensaje sobre el lugar ya elegido
        candidatos: elegido ? [elegido] : [],
        previas: previasRef.current,
      });

      if (elegido) guardarVistos(vistos);
      if (DEBUG) {
        console.log(
          "[Pinolito] elegido:",
          elegido?.nombre ?? "ninguno",
          "| interés:",
          elegido?.interesCoincidente ?? "ninguno",
          "| historial:",
          vistos.length,
        );
      }

      previasRef.current = [...previasRef.current, resultado.mensaje].slice(-5);
      visibleRef.current = true;
      setRecomendacion(resultado);
    } catch (e) {
      console.warn("[Pinolito] error al lanzar recomendación:", e?.message);
    } finally {
      ocupadoRef.current = false;
    }
  }, []);

  const revisar = useCallback(() => {
    if (visibleRef.current || ocupadoRef.current) return;
    if (Date.now() - ultimaRef.current >= INTERVALO_MS) lanzar();
  }, [lanzar]);

  // Entrada a la app (incluye apertura en frío) + revisión periódica.
  // Al cerrar sesión (p. ej. por inactividad) se limpia todo para que la nube
  // no quede bloqueando la pantalla de login.
  useEffect(() => {
    if (!habilitado) {
      visibleRef.current = false;
      ultimaRef.current = 0;
      posUltimaRecRef.current = null;
      setRecomendacion(null);
      return undefined;
    }
    lanzar();
    const id = setInterval(revisar, REVISION_MS);
    return () => clearInterval(id);
  }, [habilitado, lanzar, revisar]);

  // Seguimiento en tiempo real: si te mueves lo suficiente, recomienda de nuevo
  useEffect(() => {
    if (!habilitado) return undefined;
    let sub = null;
    let cancelado = false;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted" || cancelado) return;

        const s = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 100, // m: no despierta el GPS por movimientos pequeños
            timeInterval: 15000,
          },
          (pos) => {
            if (visibleRef.current || ocupadoRef.current) return;
            if (Date.now() - ultimaRef.current < MIN_ENTRE_MS) return;
            const actual = {
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
            };
            const base = posUltimaRecRef.current;
            if (base && distanciaKm(base, actual) >= UMBRAL_KM) lanzar();
          },
        );
        if (cancelado) s.remove();
        else sub = s;
      } catch (e) {
        console.warn("[Pinolito] No se pudo seguir la ubicación:", e?.message);
      }
    })();

    return () => {
      cancelado = true;
      sub?.remove();
    };
  }, [habilitado, lanzar]);

  // Al volver de segundo plano
  useEffect(() => {
    if (!habilitado) return undefined;
    const sub = AppState.addEventListener("change", (estado) => {
      if (estado === "active") revisar();
    });
    return () => sub.remove();
  }, [habilitado, revisar]);

  return { recomendacion, cerrar, mostrarAhora: lanzar };
}