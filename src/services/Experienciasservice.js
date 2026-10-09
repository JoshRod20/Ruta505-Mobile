/**
 * Servicio de experiencias culturales (publicaciones del Home).
 * Colección "experiencias". Los negocios del mapa están en "negocios".
 * Incluye CRUD, likes, comentarios/reseñas y escucha en tiempo real.
 */

import { db } from "../services/firebase";

import {
  collection,
  addDoc,
  updateDoc,
  setDoc,
  getDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";

/** Nombre de la colección de publicaciones en Firestore. */
const COLECCION = "experiencias";

// "experiencias" son SOLO las publicaciones del Home (botón + / Nueva
// publicación). Los negocios del mapa viven en su propia colección: "negocios"
// (ver Negociosservice.js).

/**
 * Crea una nueva experiencia (publicación).
 * @param {Object} datos - Datos de la experiencia.
 * @returns {Promise<DocumentReference>}
 */
export async function crearExperiencia(datos) {
  return addDoc(collection(db, COLECCION), {
    ...datos,
    createdAt: serverTimestamp(),
  });
}

/**
 * Elimina una experiencia existente.
 * @param {string} id - ID del documento.
 * @returns {Promise<void>}
 */
export async function eliminarExperiencia(id) {
  return deleteDoc(doc(db, COLECCION, id));
}

/**
 * Actualiza una experiencia existente.
 * @param {string} id - ID del documento.
 * @param {Object} datos - Campos a actualizar.
 * @returns {Promise<void>}
 */
export async function actualizarExperiencia(id, datos) {
  const ref = doc(db, COLECCION, id);
  return updateDoc(ref, {
    ...datos,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Escucha en tiempo real todas las experiencias ordenadas por fecha.
 * @param {function} callback - Recibe el arreglo de experiencias.
 * @param {function} [onError] - Callback opcional de error.
 * @returns {function} Función de desuscripción.
 */
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

// ==================================================
// CALIFICACIONES
// Las reseñas son los comentarios de las publicaciones: cada comentario lleva
// una calificación de 1 a 5 estrellas (ver sección COMENTARIOS más abajo).
// ==================================================

// 3 estrellas o más cuenta como reseña "Buena"; 1 o 2 como "Mala".
/** Calificación mínima (1-5) para considerar una reseña como "buena". */
export const CALIFICACION_MINIMA_BUENA = 3;

/**
 * Indica si una reseña se considera buena según CALIFICACION_MINIMA_BUENA.
 * @param {{calificacion: number}} resena
 * @returns {boolean}
 */
export function esResenaBuena(resena) {
  return Number(resena.calificacion) >= CALIFICACION_MINIMA_BUENA;
}

// Totales y promedio para mostrar en el perfil y en Estadísticas.
/**
 * Calcula totales y promedio de un conjunto de reseñas.
 * @param {Array<{calificacion: number}>} resenas
 * @returns {{total: number, buenas: number, malas: number, promedio: number|null}}
 */
export function resumirResenas(resenas) {
  const total = resenas.length;
  const buenas = resenas.filter(esResenaBuena).length;
  const suma = resenas.reduce(
    (acc, r) => acc + (Number(r.calificacion) || 0),
    0
  );
  return {
    total,
    buenas,
    malas: total - buenas,
    promedio: total > 0 ? suma / total : null,
  };
}

// ==================================================
// ME GUSTA
// Cada "me gusta" es un documento en experiencias/{id}/likes/{uid}: el id es
// el uid de quien lo da, así que cada persona tiene como máximo uno por
// publicación. Pueden darlo turistas y actores culturales, excepto el autor
// de la publicación (las reglas de Firestore también lo impiden).
// ==================================================

// Escucha en vivo los "me gusta" de una publicación. Devuelve la lista de uids.
/**
 * Escucha en vivo los "me gusta" de una publicación.
 * @param {string} experienciaId
 * @param {function} callback - Recibe arreglo de uids.
 * @param {function} [onError]
 * @returns {function} Desuscripción.
 */
export function escucharLikes(experienciaId, callback, onError) {
  return onSnapshot(
    collection(db, COLECCION, experienciaId, "likes"),
    (snapshot) => callback(snapshot.docs.map((d) => d.id)),
    (error) => {
      console.warn("Error escuchando me gusta:", error);
      if (onError) onError(error);
    }
  );
}

// Da o quita el "me gusta" de la persona según su estado actual.
/**
 * Alterna el "me gusta" del usuario actual sobre una experiencia.
 * @param {string} experienciaId
 * @param {string} uid
 * @returns {Promise<void>}
 */
export async function alternarLike(experienciaId, uid, yaLeDioLike) {
  const ref = doc(db, COLECCION, experienciaId, "likes", uid);
  if (yaLeDioLike) {
    return deleteDoc(ref);
  }
  return setDoc(ref, { uid, createdAt: serverTimestamp() });
}

// ==================================================
// COMENTARIOS (= reseñas)
// Cada publicación del Home tiene su sección de comentarios:
// experiencias/{id}/comentarios/{uid del autor}. Cada comentario lleva
// calificación (1 a 5 estrellas), texto y, opcionalmente, fotos en Base64.
// El id es el uid de quien comenta, así que cada persona tiene un solo
// comentario por publicación (si vuelve a enviar, edita el suyo).
// Pueden comentar turistas y actores culturales, excepto el autor de la
// publicación (las reglas de Firestore también lo impiden). El dueño de la
// publicación puede responder cada comentario.
// ==================================================

function milisegundosComentario(c) {
  // Mientras el servidor no confirma la fecha, createdAt llega como null.
  return c.createdAt?.toMillis?.() ?? Date.now();
}

// Escucha en vivo los comentarios de una publicación (los más antiguos primero).
/**
 * Escucha en tiempo real los comentarios de una experiencia.
 * @param {string} experienciaId
 * @param {function} callback
 * @param {function} [onError]
 * @returns {function} Desuscripción.
 */
export function escucharComentarios(experienciaId, callback, onError) {
  return onSnapshot(
    collection(db, COLECCION, experienciaId, "comentarios"),
    (snapshot) => {
      const comentarios = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => milisegundosComentario(a) - milisegundosComentario(b));
      callback(comentarios);
    },
    (error) => {
      console.warn("Error escuchando comentarios:", error);
      if (onError) onError(error);
    }
  );
}

// Crea el comentario o, si la persona ya tenía uno, actualiza solo lo que
// ella puede editar (calificación, texto y fotos).
/**
 * Guarda o actualiza un comentario/reseña sobre una experiencia.
 * @param {string} experienciaId
 * @param {string} uid
 * @param {Object} datos - texto, calificacion, etc.
 * @returns {Promise<void>}
 */
export async function guardarComentario(
  experienciaId,
  { autorId, autorNombre, calificacion, texto, imagenes }
) {
  const ref = doc(db, COLECCION, experienciaId, "comentarios", autorId);
  const existente = await getDoc(ref);

  if (existente.exists()) {
    return updateDoc(ref, {
      calificacion,
      texto,
      imagenes,
      updatedAt: serverTimestamp(),
    });
  }

  return setDoc(ref, {
    autorId,
    autorNombre,
    calificacion,
    texto,
    imagenes,
    createdAt: serverTimestamp(),
  });
}

// El dueño de la publicación responde un comentario.
/**
 * Añade una respuesta del autor a un comentario existente.
 * @param {string} experienciaId
 * @param {string} comentarioId
 * @param {string} texto
 * @returns {Promise<void>}
 */
export async function responderComentario(experienciaId, comentarioId, texto) {
  return updateDoc(
    doc(db, COLECCION, experienciaId, "comentarios", comentarioId),
    { respuesta: texto, respuestaAt: serverTimestamp() }
  );
}

/**
 * Elimina un comentario de una experiencia.
 * @param {string} experienciaId
 * @param {string} comentarioId
 * @returns {Promise<void>}
 */
export async function eliminarComentario(experienciaId, comentarioId) {
  return deleteDoc(
    doc(db, COLECCION, experienciaId, "comentarios", comentarioId)
  );
}

// ==================================================
// ACTIVIDAD DE UN ACTOR (para Estadísticas y Reseñas)
// Junta, en vivo, las publicaciones del Home de un actor con los comentarios
// y los "me gusta" de cada una. Así no hace falta crear índices en Firestore.
// callback recibe { publicaciones, comentarios (más nuevos primero), likesTotal }.
// ==================================================
/**
 * Escucha reseñas y actividad relacionadas con las experiencias de un actor.
 * @param {string} uidActor
 * @param {function} callback
 * @param {function} [onError]
 * @returns {function} Desuscripción.
 */
export function escucharActividadDeActor(actorId, callback, onError) {
  const datos = new Map(); // idPublicacion -> { comentarios, likes }
  const oyentes = new Map(); // idPublicacion -> [funciones para dejar de escuchar]
  let publicaciones = [];

  const emitir = () => {
    const comentarios = [];
    let likesTotal = 0;
    publicaciones.forEach((pub) => {
      const d = datos.get(pub.id);
      if (!d) return;
      d.comentarios.forEach((c) =>
        comentarios.push({ ...c, experienciaId: pub.id, actorId })
      );
      likesTotal += d.likes;
    });
    comentarios.sort(
      (a, b) => milisegundosComentario(b) - milisegundosComentario(a)
    );
    callback({ publicaciones, comentarios, likesTotal });
  };

  const dejarDeEscuchar = escucharExperiencias((lista) => {
    publicaciones = lista.filter(
      (pub) => pub.creadoPor === actorId
    );
    const ids = new Set(publicaciones.map((pub) => pub.id));

    // Publicaciones eliminadas: se deja de escuchar sus datos.
    for (const [id, fns] of oyentes) {
      if (!ids.has(id)) {
        fns.forEach((fn) => fn());
        oyentes.delete(id);
        datos.delete(id);
      }
    }

    // Publicaciones nuevas: se escuchan sus comentarios y me gusta.
    publicaciones.forEach((pub) => {
      if (oyentes.has(pub.id)) return;
      datos.set(pub.id, { comentarios: [], likes: 0 });
      const alComentarios = escucharComentarios(
        pub.id,
        (lista2) => {
          const d = datos.get(pub.id);
          if (d) d.comentarios = lista2;
          emitir();
        },
        onError
      );
      const alLikes = escucharLikes(
        pub.id,
        (uids) => {
          const d = datos.get(pub.id);
          if (d) d.likes = uids.length;
          emitir();
        },
        onError
      );
      oyentes.set(pub.id, [alComentarios, alLikes]);
    });

    emitir();
  }, onError);

  return () => {
    dejarDeEscuchar();
    oyentes.forEach((fns) => fns.forEach((fn) => fn()));
    oyentes.clear();
    datos.clear();
  };
}
