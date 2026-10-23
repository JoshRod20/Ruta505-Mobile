import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generarRecomendacion } from "../services/geminiService";
import {
  candidatosCercanos,
  elegirSiguiente,
  obtenerUbicacion,
} from "../services/lugaresService";

const DEBUG = process.env.EXPO_PUBLIC_PINOLITO_DEBUG === "true";

// En modo prueba: cada 30 s en vez de 10 min
const INTERVALO_MS = DEBUG ? 30 * 1000 : 10 * 60 * 1000;
const REVISION_MS = DEBUG ? 5 * 1000 : 30 * 1000;

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

export function usePinolitoRecomendaciones({ habilitado, nombre, rol }) {
  const [recomendacion, setRecomendacion] = useState(null);
  const ultimaRef = useRef(0); // se reinicia al cerrar la app por completo
  const ocupadoRef = useRef(false);
  const visibleRef = useRef(false);
  const previasRef = useRef([]);

  // nombre y rol van en un ref: así `lanzar` es estable y un cambio en el perfil
  // (por ejemplo, cuando termina de cargar) no dispara una recomendación extra.
  const datosRef = useRef({ nombre, rol });
  datosRef.current = { nombre, rol };

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
      const { nombre: n, rol: r } = datosRef.current;
      const ubicacion = await obtenerUbicacion();
      const pool = await candidatosCercanos(ubicacion);

      // Rotación: el más cercano que aún no se haya recomendado
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
      setRecomendacion(null);
      return undefined;
    }
    lanzar();
    const id = setInterval(revisar, REVISION_MS);
    return () => clearInterval(id);
  }, [habilitado, lanzar, revisar]);

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