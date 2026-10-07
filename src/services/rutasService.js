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
//   creadoPor, creadoPorNombre, nombre, estado, createdAt, updatedAt, publicadaAt
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

export const ESTADO_RUTA = {
  BORRADOR: "borrador",
  EN_ESPERA: "en_espera",
  PUBLICADA: "publicada",
};

export const ESTADO_PARADA = {
  CREADOR: "creador",
  INVITADO: "invitado",
  ACEPTADA: "aceptada",
  RECHAZADA: "rechazada",
};

// Aliados (sin contar al creador) que deben aceptar para poder publicar.
export const MINIMO_ALIADOS = 3;

export const idParada = (rutaId, actorId) => `${rutaId}_${actorId}`;

function milisegundos(item) {
  return item.createdAt?.toMillis?.() ?? Date.now();
}

export function aliadosAceptados(paradas) {
  return paradas.filter((p) => p.estado === ESTADO_PARADA.ACEPTADA);
}

export function aliadosInvitados(paradas) {
  return paradas.filter(
    (p) =>
      p.estado === ESTADO_PARADA.INVITADO ||
      p.estado === ESTADO_PARADA.ACEPTADA
  );
}

// Suma de precios de las paradas que forman parte de la ruta.
export function calcularTotal(paradas) {
  return paradas
    .filter(
      (p) =>
        p.estado === ESTADO_PARADA.CREADOR ||
        p.estado === ESTADO_PARADA.ACEPTADA
    )
    .reduce((acc, p) => acc + (Number(p.precio) || 0), 0);
}

export const formatearPrecio = (valor) =>
  `C$ ${Number(valor || 0).toLocaleString("en-US")}`;

// ---------------- Lecturas en vivo ----------------

// Rutas que creó un actor (las más nuevas primero).
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

// Paradas de una ruta, vistas por su creador (él primero).
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

export async function cambiarEstadoRuta(rutaId, estado) {
  return updateDoc(doc(db, RUTAS, rutaId), {
    estado,
    updatedAt: serverTimestamp(),
  });
}

// El actor invitado acepta (con su servicio, precio, etc.) o declina.
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
