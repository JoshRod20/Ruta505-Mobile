import { db } from "../services/firebase";

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

// ==================================================
// NEGOCIOS
// Colección "negocios": el negocio de cada actor cultural, que se ve como un
// punto en el mapa interactivo. El id del documento ES el uid del actor, así
// que cada cuenta tiene como máximo un negocio (las reglas de Firestore lo
// garantizan) y encontrar el de alguien es una lectura directa.
//
// Las publicaciones del Home son otra cosa: viven en "experiencias"
// (ver Experienciasservice.js).
// ==================================================

const COLECCION = "negocios";

// Registra el negocio de un actor. El id del documento es su uid.
export async function crearNegocio(uid, datos) {
  return setDoc(doc(db, COLECCION, uid), {
    ...datos,
    creadoPor: uid,
    createdAt: serverTimestamp(),
  });
}

export async function actualizarNegocio(uid, datos) {
  return updateDoc(doc(db, COLECCION, uid), {
    ...datos,
    updatedAt: serverTimestamp(),
  });
}

// Todos los negocios en vivo (para el mapa y para buscar aliados).
export function escucharNegocios(callback, onError) {
  return onSnapshot(
    collection(db, COLECCION),
    (snapshot) => {
      callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    },
    (error) => {
      console.warn("Error escuchando negocios:", error);
      if (onError) onError(error);
    }
  );
}

// El negocio de un actor en vivo (callback recibe el negocio o null).
export function escucharNegocio(uid, callback, onError) {
  return onSnapshot(
    doc(db, COLECCION, uid),
    (snapshot) => {
      callback(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
    },
    (error) => {
      console.warn("Error escuchando el negocio:", error);
      if (onError) onError(error);
    }
  );
}
