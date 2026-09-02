// services/mfa.js
//
// Envuelve la API de Multi-Factor Authentication de Firebase Auth
// (variante TOTP: Google Authenticator, Authy, etc.). Se eligió TOTP
// en vez de SMS porque el MFA por SMS de Firebase depende de
// RecaptchaVerifier, una API pensada para navegador que no funciona
// de forma confiable en React Native. TOTP no necesita reCAPTCHA ni
// número de teléfono.
//
// IMPORTANTE: para que esto funcione, el proyecto de Firebase debe
// tener Multi-Factor Authentication habilitado en Identity Platform
// (Firebase Console -> Authentication -> Sign-in method -> Advanced).

import {
  multiFactor,
  TotpMultiFactorGenerator,
} from "firebase/auth";

import { auth } from "./firebase";

const NOMBRE_APP = "Ruta505";

// ==================================================
// ESTADO ACTUAL
// ==================================================

/**
 * Indica si el usuario dado ya tiene un factor TOTP inscrito.
 */
export const totpYaActivado = (user) => {
  if (!user) return false;

  return multiFactor(user).enrolledFactors.some(
    (factor) => factor.factorId === TotpMultiFactorGenerator.FACTOR_ID
  );
};

// ==================================================
// ENROLAMIENTO (activar 2FA)
// ==================================================

/**
 * Paso 1 del enrolamiento: genera el secreto TOTP y la URL para el
 * código QR. Debe llamarse con el usuario recién autenticado (Firebase
 * exige una sesión "reciente"; si el usuario tiene mucho tiempo sin
 * volver a iniciar sesión, esto puede lanzar auth/requires-recent-login,
 * en cuyo caso hay que pedirle la contraseña de nuevo antes de reintentar).
 */
export const iniciarEnrolamientoTotp = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No hay sesión activa.");
  }

  const session = await multiFactor(user).getSession();
  const secret = await TotpMultiFactorGenerator.generateSecret(session);

  const qrCodeUrl = secret.generateQrCodeUrl(user.email, NOMBRE_APP);

  return {
    secret, // objeto TotpSecret, se necesita para confirmar
    qrCodeUrl, // uri otpauth:// para el QR
    secretKey: secret.secretKey, // clave en texto plano, por si no puede escanear
  };
};

/**
 * Paso 2 del enrolamiento: confirma el secreto con el código de 6
 * dígitos generado por la app autenticadora del usuario.
 */
export const confirmarEnrolamientoTotp = async (
  secret,
  codigo,
  alias = "App autenticadora"
) => {
  const assertion = TotpMultiFactorGenerator.assertionForEnrollment(
    secret,
    codigo
  );

  await multiFactor(auth.currentUser).enroll(assertion, alias);
};

// ==================================================
// DESACTIVAR
// ==================================================

export const desactivarTotp = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const factor = multiFactor(user).enrolledFactors.find(
    (f) => f.factorId === TotpMultiFactorGenerator.FACTOR_ID
  );

  if (!factor) return;

  await multiFactor(user).unenroll(factor.uid);
};

// ==================================================
// LOGIN (segundo factor)
// ==================================================

/**
 * A partir del resolver que Firebase entrega cuando el login inicial
 * lanza auth/multi-factor-auth-required, arma el assertion para
 * completar el inicio de sesión con el código TOTP ingresado.
 */
export const construirAssertionParaLogin = (resolver, codigo) => {
  const hint = resolver.hints.find(
    (h) => h.factorId === TotpMultiFactorGenerator.FACTOR_ID
  );

  if (!hint) {
    throw new Error(
      "No se encontró un factor de verificación TOTP para esta cuenta."
    );
  }

  return TotpMultiFactorGenerator.assertionForSignIn(hint.uid, codigo);
};
