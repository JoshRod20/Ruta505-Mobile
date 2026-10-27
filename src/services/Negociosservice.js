/**
 * Negociosservice: componente/pantalla de la aplicación Ruta505.
 */

import { db } from "../services/firebase";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
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
 * Multimedia (prototipo, sin Firebase Storage): cada foto o video corto se
 * guarda en Base64 como un documento de la subcolección negocios/{uid}/multimedia.
 * Así cada archivo tiene su propio límite de 1 MB y el negocio puede tener
 * todas las fotos y videos que quiera. En el documento del negocio solo queda
 * la primera foto como portada (campo "imagenes") para las vistas pequeñas.
 */
const SUBCOLECCION_MULTIMEDIA = "multimedia";

/**
 * Lee la multimedia de un negocio, en el orden en que se agregó.
 * @param {string} uid - Identificador del actor (id del negocio).
 * @returns {Promise<Array<{id:string, docId:string, tipo:string, uri:string, remota:boolean}>>}
 */
export async function obtenerMultimedia(uid) {
  const snap = await getDocs(
    query(
      collection(db, COLECCION, uid, SUBCOLECCION_MULTIMEDIA),
      orderBy("orden")
    )
  );
  return snap.docs.map((d) => ({
    id: d.id,
    docId: d.id,
    tipo: d.data().tipo,
    uri: d.data().data,
    remota: true,
  }));
}

/** Texto legible de un error de Firestore (con su código, que es lo útil). */
function describirError(error) {
  return [error?.code, error?.message].filter(Boolean).join(": ") || "error desconocido";
}

/**
 * Deja la subcolección igual a la lista del formulario: borra lo que se quitó
 * y agrega lo nuevo (lo que ya existía no se vuelve a escribir).
 *
 * Nunca lanza error: el negocio ya está guardado cuando esto corre, así que un
 * fallo aquí no debe mostrarse como "no se pudo guardar". Devuelve cuántos
 * archivos fallaron y el motivo del primero.
 * @returns {Promise<{fallidos: number, motivo: string|null}>}
 */
async function sincronizarMultimedia(uid, multimedia) {
  const ref = collection(db, COLECCION, uid, SUBCOLECCION_MULTIMEDIA);
  const nuevos = multimedia.filter((x) => !x.docId);
  let fallidos = 0;
  let motivo = null;
  const registrarFallo = (error) => {
    fallidos += 1;
    if (!motivo) motivo = describirError(error);
    console.warn("Fallo al sincronizar multimedia:", error);
  };

  let existentes;
  try {
    existentes = await getDocs(ref);
  } catch (error) {
    // Sin poder leer la subcolección no se puede sincronizar nada.
    fallidos = nuevos.length;
    motivo = describirError(error);
    console.warn("No se pudo leer la multimedia del negocio:", error);
    return { fallidos, motivo };
  }

  const conservar = new Set(
    multimedia.filter((m) => m.docId).map((m) => m.docId)
  );
  const borrados = await Promise.allSettled(
    existentes.docs.filter((d) => !conservar.has(d.id)).map((d) => deleteDoc(d.ref))
  );
  borrados.forEach((r) => {
    if (r.status === "rejected") registrarFallo(r.reason);
  });

  let orden = Date.now();
  for (const m of nuevos) {
    orden += 1;
    try {
      await addDoc(ref, {
        tipo: m.tipo,
        data: m.data,
        orden,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      registrarFallo(error);
    }
  }
  return { fallidos, motivo };
}

/** Separa la multimedia de los datos y calcula la portada (primera foto). */
function separarMultimedia(datos) {
  const { multimedia, ...resto } = datos;
  if (!Array.isArray(multimedia)) return { multimedia: null, resto };
  const portada = multimedia.find((m) => m.tipo === "imagen");
  return {
    multimedia,
    resto: { ...resto, imagenes: portada ? [portada.data] : [] },
  };
}

/**
 * Crea el documento de negocio de un actor cultural.
 * El id del documento es el uid del usuario.
 * @param {string} uid - Identificador del actor.
 * @param {Object} datos - Datos del negocio a persistir.
 * @returns {Promise<void>}
 */
export async function crearNegocio(uid, datos) {
  const { multimedia, resto } = separarMultimedia(datos);
  await setDoc(doc(db, COLECCION, uid), {
    ...resto,
    creadoPor: uid,
    createdAt: serverTimestamp(),
  });
  if (!multimedia) return { fallidos: 0, motivo: null };
  return sincronizarMultimedia(uid, multimedia);
}

/**
 * Actualiza el negocio de un actor cultural.
 * @param {string} uid - Identificador del actor.
 * @param {Object} datos - Campos a actualizar.
 * @returns {Promise<void>}
 */
export async function actualizarNegocio(uid, datos) {
  const { multimedia, resto } = separarMultimedia(datos);
  await updateDoc(doc(db, COLECCION, uid), {
    ...resto,
    updatedAt: serverTimestamp(),
  });
  if (!multimedia) return { fallidos: 0, motivo: null };
  return sincronizarMultimedia(uid, multimedia);
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
