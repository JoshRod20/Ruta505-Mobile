/**
 * Negociosservice: componente/pantalla de la aplicación Ruta505.
 */

import { db } from "../services/firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Servicio de negocios de actores culturales.
 * Colección "negocios": un documento por actor (id = uid).
 * Representa el punto visible en el mapa interactivo.
 * Las publicaciones del Home viven en "experiencias".
 */
const COLECCION = "negocios";

/**
 * Crea el documento de negocio de un actor cultural.
 * El id del documento es el uid del usuario.
 * @param {string} uid - Identificador del actor.
 * @param {Object} datos - Datos del negocio a persistir.
 * @returns {Promise<void>}
 */
export async function crearNegocio(uid, datos) {
  return setDoc(doc(db, COLECCION, uid), {
    ...datos,
    creadoPor: uid,
    createdAt: serverTimestamp(),
  });
}

/**
 * Actualiza el negocio de un actor cultural.
 * @param {string} uid - Identificador del actor.
 * @param {Object} datos - Campos a actualizar.
 * @returns {Promise<void>}
 */
export async function actualizarNegocio(uid, datos) {
  return updateDoc(doc(db, COLECCION, uid), {
    ...datos,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Escucha en tiempo real todos los negocios (mapa y búsqueda de aliados).
 * @param {function} callback - Recibe el arreglo de negocios.
 * @param {function} [onError] - Callback opcional de error.
 * @returns {function} Función de desuscripción.
 */
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

/**
 * Escucha en tiempo real el negocio de un actor concreto.
 * @param {string} uid - Identificador del actor.
 * @param {function} callback - Recibe el negocio o null.
 * @param {function} [onError] - Callback opcional de error.
 * @returns {function} Función de desuscripción.
 */
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
