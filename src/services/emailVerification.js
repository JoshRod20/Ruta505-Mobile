// services/emailVerification.js
//
// Envío del correo real de verificación (link que Firebase manda al
// usuario). Firebase exige emailVerified=true antes de poder enrolar
// un segundo factor, para evitar que alguien active 2FA usando el
// correo de otra persona.

import { sendEmailVerification } from "firebase/auth";
import { auth } from "./firebase";

export const enviarCorreoVerificacion = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No hay sesión activa.");
  }

  await sendEmailVerification(user);
};
