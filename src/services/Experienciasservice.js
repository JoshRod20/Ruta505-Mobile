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
