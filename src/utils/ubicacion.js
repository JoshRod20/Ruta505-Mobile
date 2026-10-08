/**
 * ubicacion: componente/pantalla de la aplicación Ruta505.
 */

import { PermissionsAndroid, Platform } from "react-native";
import Geolocation from "@react-native-community/geolocation";

/**
 * Solicita permiso de ubicación en tiempo de ejecución (solo Android).
 * En iOS se asume gestionado por Info.plist.
 * @returns {Promise<boolean>} true si el permiso fue concedido.
 */
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

/**
 * Envuelve Geolocation.getCurrentPosition en una Promise.
 * @param {Object} opciones - Opciones de precisión y timeout.
 * @returns {Promise<Object>} Posición GPS.
 */
function leerPosicion(opciones) {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(resolve, reject, opciones);
  });
}

/**
 * Obtiene la posición actual del dispositivo.
 * Intenta GPS de alta precisión y, si falla, precisión por red.
 * No lanza ni muestra alertas; el llamador decide el manejo.
 * @returns {Promise<{lat: number, lon: number}|null>} Coordenadas o null.
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
