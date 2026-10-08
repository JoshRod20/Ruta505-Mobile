/**
 * emailVerification: componente/pantalla de la aplicación Ruta505.
 */

import { sendEmailVerification } from "firebase/auth";
import { auth } from "./firebase";

/**
 * Envía el correo de verificación de Firebase al usuario autenticado.
 * Requerido antes de enrolar un segundo factor (MFA).
 * @throws {Error} Si no hay sesión activa.
 */
export const enviarCorreoVerificacion = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No hay sesión activa.");
  }

  await sendEmailVerification(user);
};
