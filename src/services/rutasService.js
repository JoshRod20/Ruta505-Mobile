/**
 * Servicio de rutas creativas culturales.
 * Gestiona creación, invitaciones, escucha en tiempo real y estado de rutas.
 */

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

// ==================================================
// RUTAS CREATIVAS
//
// rutas_creativas/{rutaId}
//   creadoPor, creadoPorNombre, nombre, estado, createdAt, updatedAt, publicadaAt,
//   canceladaAt
//   estado: "borrador" | "en_espera" | "publicada" | "cancelada"
//   Una ruta sigue activa hasta que su creador la cancela.
//
// paradas_ruta/{rutaId}_{actorId}   (una por actor que participa en la ruta)
//   rutaId, rutaNombre, creadorId, creadorNombre,
//   actorId, ubicacionId, titulo, categoria, lugar   -> el negocio del actor
//   estado: "creador" | "invitado" | "aceptada" | "rechazada"
//   servicio, precio, direccion, horario, imagenes   -> lo llena cada actor
//   publicada (true cuando la ruta se publica), createdAt, respondidoAt
//
// Cada actor tiene un solo negocio (su ubicación en el mapa), así que cada
// actor es una sola parada de la ruta.
// ==================================================
const RUTAS = "rutas_creativas";
const PARADAS = "paradas_ruta";

/** Estados posibles de una ruta creativa. */
export const ESTADO_RUTA = {
  BORRADOR: "borrador",
  EN_ESPERA: "en_espera",
  PUBLICADA: "publicada",
  CANCELADA: "cancelada",
};

/** Estados posibles de una parada/invitación. */
export const ESTADO_PARADA = {
  CREADOR: "creador",
  INVITADO: "invitado",
  ACEPTADA: "aceptada",
  RECHAZADA: "rechazada",
};

// Aliados (sin contar al creador) que deben aceptar para poder publicar.
/** Número mínimo de aliados aceptados para publicar una ruta. */
export const MINIMO_ALIADOS = 3;

export const idParada = (rutaId, actorId) => `${rutaId}_${actorId}`;

function milisegundos(item) {
  return item.createdAt?.toMillis?.() ?? Date.now();
}

/**
 * Filtra las paradas cuyo estado es aceptado.
 * @param {Array} paradas
 * @returns {Array}
 */
export function aliadosAceptados(paradas) {
  return paradas.filter((p) => p.estado === ESTADO_PARADA.ACEPTADA);
}

/**
 * Filtra las paradas cuyo estado es invitado.
 * @param {Array} paradas
 * @returns {Array}
 */
export function aliadosInvitados(paradas) {
  return paradas.filter(
    (p) =>
      p.estado === ESTADO_PARADA.INVITADO ||
      p.estado === ESTADO_PARADA.ACEPTADA
  );
}

// Suma de precios de las paradas que forman parte de la ruta.
/**
 * Suma los precios de las paradas aceptadas.
 * @param {Array} paradas
 * @returns {number}
 */
export function calcularTotal(paradas) {
  return paradas
    .filter(
      (p) =>
        p.estado === ESTADO_PARADA.CREADOR ||
        p.estado === ESTADO_PARADA.ACEPTADA
    )
    .reduce((acc, p) => acc + (Number(p.precio) || 0), 0);
}

/** Formatea un valor numérico como precio en córdobas. */
export const formatearPrecio = (valor) =>
  `C$ ${Number(valor || 0).toLocaleString("en-US")}`;

// ---------------- Lecturas en vivo ----------------

// Rutas que creó un actor (las más nuevas primero).
/**
 * Escucha en tiempo real las rutas creadas por el usuario.
 * @param {string} uid
 * @param {function} callback
 * @param {function} [onError]
 * @returns {function} Desuscripción.
 */
export function escucharMisRutas(uid, callback, onError) {
  const q = query(collection(db, RUTAS), where("creadoPor", "==", uid));
  return onSnapshot(
    q,
    (snapshot) =>
      callback(
        snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => milisegundos(b) - milisegundos(a))
      ),
    (error) => {
      console.warn("Error escuchando rutas:", error);
      if (onError) onError(error);
    }
  );
}

// Todas las paradas de las rutas de un creador (para la lista "Mis rutas").
/**
 * Escucha las paradas de todas las rutas de un creador.
 * @param {string} creadorId
 * @param {function} callback
 * @param {function} [onError]
 * @returns {function} Desuscripción.
 */
export function escucharParadasDeCreador(creadorId, callback, onError) {
  const q = query(
    collection(db, PARADAS),
    where("creadorId", "==", creadorId)
  );
  return onSnapshot(
    q,
    (snapshot) =>
      callback(
        snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => {
            if (a.estado === ESTADO_PARADA.CREADOR) return -1;
            if (b.estado === ESTADO_PARADA.CREADOR) return 1;
            return milisegundos(a) - milisegundos(b);
          })
      ),
    (error) => {
      console.warn("Error escuchando paradas del creador:", error);
      if (onError) onError(error);
    }
  );
}

// Paradas de una ruta, vistas por su creador (él primero).
/**
 * Escucha las paradas de una ruta concreta.
 * @param {string} rutaId
 * @param {string} creadorId
 * @param {function} callback
 * @param {function} [onError]
 * @returns {function} Desuscripción.
 */
export function escucharParadasDeRuta(rutaId, creadorId, callback, onError) {
  const q = query(
    collection(db, PARADAS),
    where("rutaId", "==", rutaId),
    where("creadorId", "==", creadorId)
  );
  return onSnapshot(
    q,
    (snapshot) =>
      callback(
        snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => {
            if (a.estado === ESTADO_PARADA.CREADOR) return -1;
            if (b.estado === ESTADO_PARADA.CREADOR) return 1;
            return milisegundos(a) - milisegundos(b);
          })
      ),
    (error) => {
      console.warn("Error escuchando paradas:", error);
      if (onError) onError(error);
    }
  );
}

// Invitaciones que recibió un actor (de otros creadores).
/**
 * Escucha las invitaciones pendientes de un actor.
 * @param {string} actorId
 * @param {function} callback
 * @param {function} [onError]
 * @returns {function} Desuscripción.
 */
export function escucharInvitaciones(actorId, callback, onError) {
  const q = query(collection(db, PARADAS), where("actorId", "==", actorId));
  return onSnapshot(
    q,
    (snapshot) =>
      callback(
        snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((p) => p.estado !== ESTADO_PARADA.CREADOR)
          .sort((a, b) => milisegundos(b) - milisegundos(a))
      ),
    (error) => {
      console.warn("Error escuchando invitaciones:", error);
      if (onError) onError(error);
    }
  );
}

// ---------------- Escrituras ----------------

// Crea la ruta (borrador) y la parada del creador con su servicio.
/**
 * Crea una nueva ruta creativa en Firestore.
 * @param {Object} params - creador, nombre, negocio, datos.
 * @returns {Promise<string>} ID de la ruta.
 */
export async function crearRuta({ creador, nombre, negocio, datos }) {
  const rutaRef = doc(collection(db, RUTAS));
  await setDoc(rutaRef, {
    creadoPor: creador.uid,
    creadoPorNombre: creador.nombre,
    nombre,
    estado: ESTADO_RUTA.BORRADOR,
    createdAt: serverTimestamp(),
  });

  try {
    await setDoc(doc(db, PARADAS, idParada(rutaRef.id, creador.uid)), {
      rutaId: rutaRef.id,
      rutaNombre: nombre,
      creadorId: creador.uid,
      creadorNombre: creador.nombre,
      actorId: creador.uid,
      ubicacionId: negocio.id,
      titulo: negocio.titulo ?? "",
      categoria: negocio.categoria ?? "",
      lugar: negocio.lugar ?? "",
      estado: ESTADO_PARADA.CREADOR,
      publicada: false,
      servicio: datos.servicio,
      precio: datos.precio,
      direccion: datos.direccion,
      horario: datos.horario,
      imagenes: datos.imagenes,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    // Si falla la parada no se deja una ruta vacía.
    await deleteDoc(rutaRef).catch(() => {});
    throw error;
  }
  return rutaRef.id;
}

// Vuelve al paso 2: actualiza nombre de la ruta y datos del servicio del creador.
/**
 * Actualiza los datos de un paso/parada de la ruta.
 * @param {Object} params
 * @returns {Promise<void>}
 */
export async function actualizarPasoDatos({
  rutaId,
  creadorId,
  nombre,
  datos,
  idsParadas = [],
}) {
  const batch = writeBatch(db);
  batch.update(doc(db, RUTAS, rutaId), {
    nombre,
    updatedAt: serverTimestamp(),
  });
  batch.update(doc(db, PARADAS, idParada(rutaId, creadorId)), {
    rutaNombre: nombre,
    servicio: datos.servicio,
    precio: datos.precio,
    direccion: datos.direccion,
    horario: datos.horario,
    imagenes: datos.imagenes,
    updatedAt: serverTimestamp(),
  });
  // El nombre de la ruta se copia en las invitaciones ya enviadas.
  idsParadas
    .filter((id) => id !== idParada(rutaId, creadorId))
    .forEach((id) =>
      batch.update(doc(db, PARADAS, id), {
        rutaNombre: nombre,
        updatedAt: serverTimestamp(),
      })
    );
  return batch.commit();
}

/**
 * Invita a un actor cultural a participar en una parada.
 * @param {Object} params - ruta, creador, destino.
 * @returns {Promise<void>}
 */
export async function invitarActor({ ruta, creador, destino }) {
  return setDoc(doc(db, PARADAS, idParada(ruta.id, destino.actorId)), {
    rutaId: ruta.id,
    rutaNombre: ruta.nombre,
    creadorId: creador.uid,
    creadorNombre: creador.nombre,
    actorId: destino.actorId,
    ubicacionId: destino.ubicacionId,
    titulo: destino.titulo ?? "",
    categoria: destino.categoria ?? "",
    lugar: destino.lugar ?? "",
    estado: ESTADO_PARADA.INVITADO,
    publicada: false,
    createdAt: serverTimestamp(),
  });
}

/**
 * Cambia el estado de una ruta (borrador, publicada, cancelada, etc.).
 * @param {string} rutaId
 * @param {string} estado
 * @returns {Promise<void>}
 */
export async function cambiarEstadoRuta(rutaId, estado) {
  return updateDoc(doc(db, RUTAS, rutaId), {
    estado,
    updatedAt: serverTimestamp(),
  });
}

// El actor invitado acepta (con su servicio, precio, etc.) o declina.
/**
 * Acepta o rechaza una invitación a una parada.
 * @param {string} paradaId
 * @param {boolean} aceptar
 * @param {Object} [datos]
 * @returns {Promise<void>}
 */
export async function responderInvitacion(paradaId, aceptar, datos) {
  const cambios = {
    estado: aceptar ? ESTADO_PARADA.ACEPTADA : ESTADO_PARADA.RECHAZADA,
    respondidoAt: serverTimestamp(),
  };
  if (aceptar) {
    cambios.servicio = datos.servicio;
    cambios.precio = datos.precio;
    cambios.direccion = datos.direccion;
    cambios.horario = datos.horario;
    cambios.imagenes = datos.imagenes;
  }
  return updateDoc(doc(db, PARADAS, paradaId), cambios);
}

// Publica la ruta: se quedan el creador y quienes aceptaron; las invitaciones
// pendientes o rechazadas se eliminan.
/**
 * Publica una ruta y notifica a las paradas asociadas.
 * @param {Object} params - rutaId, paradas.
 * @returns {Promise<void>}
 */
export async function publicarRuta({ rutaId, paradas }) {
  const batch = writeBatch(db);
  batch.update(doc(db, RUTAS, rutaId), {
    estado: ESTADO_RUTA.PUBLICADA,
    publicadaAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  paradas.forEach((p) => {
    const ref = doc(db, PARADAS, p.id);
    if (
      p.estado === ESTADO_PARADA.CREADOR ||
      p.estado === ESTADO_PARADA.ACEPTADA
    ) {
      batch.update(ref, { publicada: true, updatedAt: serverTimestamp() });
    } else {
      batch.delete(ref);
    }
  });
  return batch.commit();
}

// Cancela una ruta (en cualquier estado). La ruta queda como "cancelada" y se
// borran sus paradas: las invitaciones pendientes dejan de aparecerles a los
// aliados y la ruta desaparece de las listas públicas.
// Se hace en dos pasos para saber exactamente cuál falla (error.paso):
// 1) "ruta": marca la ruta como cancelada; 2) "paradas": retira sus paradas.
/**
 * Cancela una ruta y actualiza el estado de sus paradas.
 * @param {Object} params - rutaId, paradas.
 * @returns {Promise<void>}
 */
export async function cancelarRuta({ rutaId, paradas = [] }) {
  try {
    await updateDoc(doc(db, RUTAS, rutaId), {
      estado: ESTADO_RUTA.CANCELADA,
      canceladaAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    error.paso = "ruta";
    throw error;
  }

  if (paradas.length === 0) return;

  try {
    const batch = writeBatch(db);
    paradas.forEach((p) => batch.delete(doc(db, PARADAS, p.id)));
    await batch.commit();
  } catch (error) {
    error.paso = "paradas";
    throw error;
  }
}
