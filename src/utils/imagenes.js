/**
 * imagenes: componente/pantalla de la aplicación Ruta505.
 */

import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

/** Ancho máximo de redimensionado en píxeles. */
const ANCHO_REDIMENSIONADO = 700;

/** Calidad de compresión JPEG (0 a 1). */
const CALIDAD_COMPRESION = 0.5;

/** Peso máximo permitido por imagen en KB (almacenamiento Base64 en Firestore). */
const MAX_PESO_KB = 250;

/**
 * Abre la galería y devuelve hasta cantidadMaxima fotos como data URIs JPEG.
 * Comprime y redimensiona en dispositivo para no superar el límite de Firestore.
 * @param {number} cantidadMaxima - Número máximo de fotos a seleccionar.
 * @returns {Promise<string[]>} Arreglo de data URIs o vacío si se cancela/falla.
 */
export async function elegirFotosBase64(cantidadMaxima) {
  if (cantidadMaxima <= 0) {
    Alert.alert("Límite alcanzado", "Ya agregaste el máximo de fotos.");
    return [];
  }

  const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permiso.granted) {
    Alert.alert(
      "Permiso necesario",
      "Necesitamos acceso a tus fotos para adjuntarlas."
    );
    return [];
  }

  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsMultipleSelection: true,
    selectionLimit: cantidadMaxima,
    quality: 1,
  });
  if (resultado.canceled) return [];

  const fotos = [];
  let muyPesadas = 0;
  try {
    for (const asset of resultado.assets.slice(0, cantidadMaxima)) {
      const manipulado = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: ANCHO_REDIMENSIONADO } }],
        {
          compress: CALIDAD_COMPRESION,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );
      const pesoKB = Math.round((manipulado.base64.length * 0.75) / 1024);
      if (pesoKB > MAX_PESO_KB) {
        muyPesadas += 1;
        continue;
      }
      fotos.push(`data:image/jpeg;base64,${manipulado.base64}`);
    }
  } catch (error) {
    Alert.alert("No se pudo procesar la imagen", error.message);
  }

  if (muyPesadas > 0) {
    Alert.alert(
      "Imagen muy pesada",
      `${muyPesadas === 1 ? "Una foto superó" : "Algunas fotos superaron"} el tamaño permitido y no se agregó.`
    );
  }
  return fotos;
}
