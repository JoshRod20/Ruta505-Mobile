/**
 * passportService: lectura de QR y progreso del pasaporte cultural en Firestore.
 *
 * Ruta del documento: users/{uid}/pasaporte/progreso
 * Cada turista tiene su propio pasaporte, ligado a su uid.
 *
 * Formatos de QR soportados:
 *   ruta505://lugar/<lugarId>   -> registra la visita y desbloquea su insignia
 *   ruta505://nivel/<nivelId>   -> desbloquea una insignia de nivel de perfil
 *   ruta505://sello/<actorId>   -> QR que genera el actor cultural (pantalla
 *                                  "Generar QR"); su insignia sale de
 *                                  negocios/{actorId}.insigniaId o, si no la
 *                                  tiene, del departamento en negocios/{actorId}.lugar
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

const QR_REGEX = /^ruta505:\/\/(lugar|nivel|sello)\/([a-z0-9-_]+)$/i;

// Insignia que gana el turista al escanear el QR de un actor, según el
// departamento de su negocio. Se busca en el texto `lugar` del negocio
// ("Localidad, Departamento", ya normalizado sin tildes ni mayúsculas).
// Un negocio puede forzar otra insignia con un campo `insigniaId`.
const INSIGNIA_POR_LUGAR = [
  ["granada", "granada"],
  ["ometepe", "ometepe"],
  ["rivas", "ometepe"],
  ["matagalpa", "matagalpa"],
  ["bluefields", "bluefields"],
  ["caribe sur", "bluefields"],
  ["leon", "leon"],
  ["masaya", "masaya"],
  ["managua", "managua"],
  ["esteli", "esteli"],
  ["chontales", "chontales"],
];

const sinTildes = (t) =>
  String(t ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

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

    // "lugar": id fijo del catálogo. "sello": se lee el perfil del actor.
    let lugar;
    let visitaId = id;
    if (tipo.toLowerCase() === "sello") {
      // El negocio del actor es público (id = uid del actor); su perfil en
      // "users" no lo puede leer un turista. Que exista prueba que es un
      // actor aprobado: las reglas solo les dejan crear su negocio.
      const negocioSnap = await getDoc(doc(db, "negocios", id));
      const negocio = negocioSnap.exists() ? negocioSnap.data() : null;
      if (!negocio) {
        return {
          ok: false,
          status: "invalida",
          message: "Este lugar aún no tiene su negocio publicado.",
        };
      }
      const texto = sinTildes(negocio.lugar);
      const insigniaId = INSIGNIAS.some((i) => i.id === negocio.insigniaId)
        ? negocio.insigniaId
        : (INSIGNIA_POR_LUGAR.find(([clave]) => texto.includes(clave))?.[1] ??
          null);
      lugar = { name: negocio.titulo || "este lugar", insigniaId };
      visitaId = `sello-${id}`;
    } else {
      lugar = LUGARES[id];
    }
    if (!lugar)
      return {
        ok: false,
        status: "invalida",
        message: "No reconocemos este lugar.",
      };

    const yaVisitado = state.lugares.includes(visitaId);
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
    if (!yaVisitado) cambios.lugares = arrayUnion(visitaId);
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