import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

// ==================================================
// LIMPIAR CAMPOS UNDEFINED
// ==================================================
//
// Firestore rechaza setDoc si algún campo llega undefined
// (ej. tipoActor undefined si route.params llegó incompleto
// en algún punto del flujo de registro). Preferimos limpiar
// el objeto antes de escribirlo en vez de que setDoc truene
// después de haber creado la cuenta en Auth.
//
const limpiarUndefined = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, valor]) => valor !== undefined)
  );

/**
 * Crea la cuenta en Firebase Auth y el documento de perfil en Firestore.
 * Misma colección "users" que usa la PWA — una cuenta creada desde
 * el móvil es indistinguible de una creada desde la web.
 *
 * Si el setDoc falla después de haber creado la cuenta en Auth, se
 * revierte esa cuenta (credenciales.user.delete()) antes de relanzar
 * el error. Sin esto, un fallo de setDoc dejaría un usuario huérfano
 * en Auth sin perfil, y además bloquearía cualquier reintento con
 * auth/email-already-in-use.
 *
 * @param {string} email
 * @param {string} password
 * @param {object} datosPerfil - role, actorType, estadoVerificacion y
 *   los campos propios del formulario correspondiente.
 */
export const registrarUsuario = async (email, password, datosPerfil) => {
  const credenciales = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const uid = credenciales.user.uid;

  try {
    await setDoc(
      doc(db, "users", uid),
      limpiarUndefined({
        ...datosPerfil,
        email,
        createdAt: serverTimestamp(),
      })
    );
  } catch (err) {
    await credenciales.user.delete().catch((deleteErr) => {
      console.error(
        "No se pudo revertir la cuenta de Auth tras fallo de setDoc:",
        deleteErr
      );
    });
    throw err;
  }

  return uid;
};