/**
 * registro: componente/pantalla de la aplicación Ruta505.
 */

import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

/**
 * Elimina campos undefined de un objeto.
 * Firestore rechaza setDoc con valores undefined.
 * @param {Object} obj - Objeto a limpiar.
 * @returns {Object} Copia sin propiedades undefined.
 */
const limpiarUndefined = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, valor]) => valor !== undefined)
  );

/**
 * Crea la cuenta en Firebase Auth y el documento de perfil en Firestore.
 * Si setDoc falla tras crear Auth, revierte la cuenta para evitar huérfanos.
 * @param {string} email - Correo del usuario.
 * @param {string} password - Contraseña.
 * @param {Object} datosPerfil - role, actorType, estadoVerificacion y campos del formulario.
 * @returns {Promise<string>} uid del usuario creado.
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

  try {
    await sendEmailVerification(credenciales.user);
  } catch (err) {
    console.warn("No se pudo enviar el correo de verificación:", err);
  }

  return uid;
};
