import { mapFirebaseError } from "../firebaseErrors";

const DEFAULT = "Ocurrió un error. Inténtalo de nuevo.";

test.each([
  ["auth/invalid-email", "El correo electrónico no es válido."],
  ["auth/user-not-found", "Correo o contraseña incorrectos."],
  ["auth/wrong-password", "Correo o contraseña incorrectos."],
  ["auth/invalid-credential", "Correo o contraseña incorrectos."],
  ["auth/email-already-in-use", "Ya existe una cuenta con este correo."],
  ["auth/weak-password", "La contraseña debe tener al menos 6 caracteres."],
  ["auth/too-many-requests", "Demasiados intentos. Espera unos minutos e inténtalo de nuevo."],
  ["auth/network-request-failed", "Problema de conexión. Revisa tu internet e inténtalo de nuevo."],
])("%s → mensaje en español", (code, msg) => {
  expect(mapFirebaseError(code)).toBe(msg);
});

test("código desconocido o ausente devuelve el mensaje por defecto", () => {
  expect(mapFirebaseError("auth/otra-cosa")).toBe(DEFAULT);
  expect(mapFirebaseError(undefined)).toBe(DEFAULT);
});
