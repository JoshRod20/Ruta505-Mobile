import { PermissionsAndroid, Platform } from "react-native";
import Geolocation from "@react-native-community/geolocation";

// Solicita permiso de ubicación (solo Android lo pide en runtime aquí).
export async function pedirPermisoUbicacion() {
  if (Platform.OS !== "android") return true;

  try {
    const resultado = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Permiso de ubicación",
        message:
          "Ruta505 necesita tu ubicación para sugerirte dónde publicar tu experiencia.",
        buttonPositive: "Permitir",
        buttonNegative: "Ahora no",
      }
    );
    return resultado === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.warn("Error pidiendo permiso de ubicación:", error);
    return false;
  }
}

function leerPosicion(opciones) {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(resolve, reject, opciones);
  });
}

/**
 * Devuelve { lat, lon } con la posición actual, o null si no hay permiso
 * o no se pudo obtener (no lanza ni muestra alertas: quien la llame decide).
 * Intenta GPS de alta precisión y, si falla, precisión por red.
 */
export async function obtenerUbicacionActual() {
  const permitido = await pedirPermisoUbicacion();
  if (!permitido) return null;

  try {
    const pos = await leerPosicion({
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 10000,
    });
    return { lat: pos.coords.latitude, lon: pos.coords.longitude };
  } catch {
    try {
      const pos = await leerPosicion({
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 60000,
      });
      return { lat: pos.coords.latitude, lon: pos.coords.longitude };
    } catch (error) {
      console.warn("No se pudo obtener la ubicación actual:", error);
      return null;
    }
  }
}
