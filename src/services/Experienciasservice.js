import { db } from "../services/firebase";

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const COLECCION = "experiencias";

// Ambos tipos viven en la misma colección, pero se muestran en lugares distintos:
// - "experiencia": publicaciones del Home (botón + de la barra de navegación).
// - "ubicacion":   puntos del mapa interactivo (ubicación de un negocio).
export const TIPO_EXPERIENCIA = "experiencia";
export const TIPO_UBICACION = "ubicacion";

function tieneCoordenadas(pub) {
  return (
    typeof pub.lat === "number" &&
    typeof pub.lng === "number" &&
    !Number.isNaN(pub.lat) &&
    !Number.isNaN(pub.lng)
  );
}

// Los documentos viejos no tienen "tipo": si traen coordenadas se consideran
// ubicaciones del mapa (así se creaban antes); si no, son experiencias del Home.
export function esUbicacionDeMapa(pub) {
  if (pub.tipo === TIPO_UBICACION) return true;
  if (pub.tipo === TIPO_EXPERIENCIA) return false;
  return tieneCoordenadas(pub);
}

export async function crearExperiencia(datos) {
  return addDoc(collection(db, COLECCION), {
    ...datos,
    createdAt: serverTimestamp(),
  });
}

export async function actualizarExperiencia(id, datos) {
  const ref = doc(db, COLECCION, id);
  return updateDoc(ref, {
    ...datos,
    updatedAt: serverTimestamp(),
  });
}

export function escucharExperiencias(callback, onError) {
  const q = query(collection(db, COLECCION), orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const experiencias = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(experiencias);
    },
    (error) => {
      console.warn("Error escuchando experiencias:", error);
      if (onError) onError(error);
    },
  );
}
