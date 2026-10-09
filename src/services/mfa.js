/**
 * Servicio de Multi-Factor Authentication (TOTP).
 * Usa Google Authenticator / Authy en lugar de SMS (RecaptchaVerifier
 * no es confiable en React Native). Requiere MFA habilitado en Identity Platform.
 */
import {
  multiFactor,
  TotpMultiFactorGenerator,
} from "firebase/auth";
import { auth } from "./firebase";

/** Nombre de la aplicación mostrado en el código QR TOTP. */
const NOMBRE_APP = "Ruta505";

/**
 * Indica si el usuario ya tiene un factor TOTP inscrito.
 * @param {Object|null} user - Usuario de Firebase Auth.
 * @returns {boolean}
 */
export const totpYaActivado = (user) => {
  if (!user) return false;

  return multiFactor(user).enrolledFactors.some(
    (factor) => factor.factorId === TotpMultiFactorGenerator.FACTOR_ID
  );
};

/**
 * Genera el secreto TOTP y la URL del código QR (paso 1 del enrolamiento).
 * Requiere sesión reciente; puede lanzar auth/requires-recent-login.
 * @returns {Promise<{secret: Object, qrCodeUrl: string, secretKey: string}>}
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
    secret,
    qrCodeUrl,
    secretKey: secret.secretKey,
  };
};

/**
 * Confirma el secreto TOTP con el código de 6 dígitos (paso 2 del enrolamiento).
 * @param {Object} secret - Objeto TotpSecret generado en el paso 1.
 * @param {string} codigo - Código de 6 dígitos de la app autenticadora.
 * @param {string} [alias="App autenticadora"] - Nombre del factor.
 * @returns {Promise<void>}
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

/**
 * Desactiva el factor TOTP del usuario autenticado.
 * @returns {Promise<void>}
 */
export const desactivarTotp = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const factor = multiFactor(user).enrolledFactors.find(
    (f) => f.factorId === TotpMultiFactorGenerator.FACTOR_ID
  );

  if (!factor) return;

  await multiFactor(user).unenroll(factor.uid);
};

/**
 * Construye el assertion TOTP para completar el login cuando
 * Firebase lanza auth/multi-factor-auth-required.
 * @param {Object} resolver - MultiFactorResolver de Firebase.
 * @param {string} codigo - Código de 6 dígitos.
 * @returns {Object} Assertion para resolver.completeSignIn.
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
