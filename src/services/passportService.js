/**
 * passportService: lectura de QR y progreso del pasaporte cultural en Firestore.
 *
 * Ruta del documento: users/{uid}/pasaporte/progreso
 * Cada turista tiene su propio pasaporte, ligado a su uid.
 *
 * Formatos de QR soportados:
 *   ruta505://lugar/<lugarId>   -> registra la visita y desbloquea su insignia
 *   ruta505://nivel/<nivelId>   -> desbloquea una insignia de nivel de perfil
 */

import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { INSIGNIAS, LUGARES, NIVELES } from "../constants/passportCatalog";
import { db } from "./firebase";

const QR_REGEX = /^ruta505:\/\/(lugar|nivel)\/([a-z0-9-_]+)$/i;

export const EMPTY_PASSPORT = { lugares: [], insignias: [], niveles: [] };

const passportRef = (uid) => doc(db, "users", uid, "pasaporte", "progreso");

const normalize = (data) => ({
  lugares: data?.lugares ?? [],
  insignias: data?.insignias ?? [],
  niveles: data?.niveles ?? [],
});

/**
 * Escucha en tiempo real el pasaporte de un perfil.
 * Devuelve la función para cancelar la suscripción.
 */
export function subscribePassport(uid, onChange, onError) {
  if (!uid) {
    onChange(EMPTY_PASSPORT);
    return () => {};
  }
  return onSnapshot(
    passportRef(uid),
    (snap) => onChange(snap.exists() ? normalize(snap.data()) : EMPTY_PASSPORT),
    (error) => {
      console.error("Error escuchando el pasaporte:", error);
      onError?.(error);
    },
  );
}

/**
 * Procesa el contenido de un QR y actualiza el pasaporte del perfil.
 * Devuelve { ok, status, message, reward }.
 * status: "nueva" | "repetida" | "invalida" | "error"
 */
export async function claimFromQr(uid, data) {
  if (!uid) {
    return {
      ok: false,
      status: "invalida",
      message: "Inicia sesión para reclamar insignias.",
    };
  }

  const match = QR_REGEX.exec((data || "").trim());
  if (!match) {
    return {
      ok: false,
      status: "invalida",
      message: "Este código QR no pertenece a Ruta505.",
    };
  }

  try {
    const snap = await getDoc(passportRef(uid));
    const state = snap.exists() ? normalize(snap.data()) : EMPTY_PASSPORT;
    const [, tipo, id] = match;

    if (tipo === "nivel") {
      const nivel = NIVELES.find((n) => n.id === id);
      if (!nivel)
        return {
          ok: false,
          status: "invalida",
          message: "Este nivel no existe.",
        };
      if (state.niveles.includes(id)) {
        return {
          ok: false,
          status: "repetida",
          message: "Ya tienes esta insignia de nivel.",
          reward: { tipo, item: nivel },
        };
      }
      await setDoc(
        passportRef(uid),
        { niveles: arrayUnion(id), actualizado: serverTimestamp() },
        { merge: true },
      );
      return {
        ok: true,
        status: "nueva",
        message: "¡Nuevo nivel desbloqueado!",
        reward: { tipo, item: nivel },
      };
    }

    const lugar = LUGARES[id];
    if (!lugar)
      return {
        ok: false,
        status: "invalida",
        message: "No reconocemos este lugar.",
      };

    const yaVisitado = state.lugares.includes(id);
    const insignia = lugar.insigniaId
      ? INSIGNIAS.find((i) => i.id === lugar.insigniaId)
      : null;
    const insigniaNueva =
      Boolean(insignia) && !state.insignias.includes(insignia.id);

    if (yaVisitado && !insigniaNueva) {
      return {
        ok: false,
        status: "repetida",
        message: `Ya registraste ${lugar.name}.`,
        reward: { tipo, item: insignia },
      };
    }

    const cambios = { actualizado: serverTimestamp() };
    if (!yaVisitado) cambios.lugares = arrayUnion(id);
    if (insigniaNueva) cambios.insignias = arrayUnion(insignia.id);
    await setDoc(passportRef(uid), cambios, { merge: true });

    return {
      ok: true,
      status: "nueva",
      message: insigniaNueva
        ? "¡Nueva insignia en tu colección!"
        : `Visita registrada en ${lugar.name}.`,
      reward: { tipo, item: insigniaNueva ? insignia : null, lugar },
    };
  } catch (error) {
    console.error("Error al reclamar el QR:", error);
    return {
      ok: false,
      status: "error",
      message:
        "No pudimos registrar el QR. Revisa tu conexión e inténtalo de nuevo.",
    };
  }
}
