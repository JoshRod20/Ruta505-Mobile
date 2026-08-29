import { useState } from "react";
import { registrarUsuario } from "../services/registro";
import { mapFirebaseError } from "../utils/firebaseErrors";
import { EMAIL_REGEX, CEDULA_REGEX, TELEFONO_REGEX } from "../utils/validators";

// ==================================================
// VALIDACIONES
// ==================================================
// EMAIL_REGEX / CEDULA_REGEX / TELEFONO_REGEX ahora viven en
// utils/validators.js para que LoginScreen use exactamente el
// mismo patrón de correo que las pantallas de registro.

// Etiquetas legibles para los mensajes de error de campos
// requeridos. Cada pantalla decide cuáles de estos campos
// exigir pasándolos como array a validarCredenciales().
const ETIQUETAS_CAMPOS = {
  nombreCompleto: "el nombre completo",
  telefono: "el teléfono",
  edad: "la edad",
  paisOrigen: "el país de origen",
  idiomaPreferido: "el idioma preferido",
  cedula: "la cédula de identidad",
  tipoTurismo: "el tipo de turismo",
};

export function useRegistroForm({ initialValues }) {
  const [form, setForm] = useState(initialValues);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (nombre, valor) => {
    setForm((prev) => ({ ...prev, [nombre]: valor }));
  };

  // camposRequeridos: array opcional de nombres de campo del
  // form (además de email/password/confirmPassword, que
  // siempre se validan) que esta pantalla necesita no-vacíos
  // antes de continuar. Ej: ["nombreCompleto", "telefono", "edad"].
  const validarCredenciales = (camposRequeridos = []) => {
    if (!form.email || !form.email.trim()) {
      setError("Falta completar el correo electrónico.");
      return false;
    }

    if (!EMAIL_REGEX.test(form.email.trim())) {
      setError("Escribe un correo electrónico válido.");
      return false;
    }

    for (const campo of camposRequeridos) {
      if (!form[campo] || !String(form[campo]).trim()) {
        setError(`Falta completar ${ETIQUETAS_CAMPOS[campo] || campo}.`);
        return false;
      }
    }

    if (
      camposRequeridos.includes("cedula") &&
      !CEDULA_REGEX.test(form.cedula.trim())
    ) {
      setError("La cédula debe tener el formato 000-000000-0000X.");
      return false;
    }

    if (
      camposRequeridos.includes("telefono") &&
      !TELEFONO_REGEX.test(form.telefono.trim())
    ) {
      setError("Escribe un número de teléfono válido.");
      return false;
    }

    if (camposRequeridos.includes("edad")) {
      const edadNum = Number(form.edad);
      if (!Number.isFinite(edadNum) || edadNum <= 0 || edadNum > 120) {
        setError("Escribe una edad válida.");
        return false;
      }
      // Nota: no se impone una edad mínima (13/18 años) porque es
      // una decisión de producto/legal, no técnica. Si Ruta 505
      // requiere una edad mínima para registrarse, agregar aquí:
      // if (edadNum < X) { setError(...); return false; }
    }

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return false;
    }

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }

    setError("");
    return true;
  };

  const registrar = async (datosPerfil) => {
    setError("");
    if (!validarCredenciales()) return;

    try {
      setCargando(true);
      await registrarUsuario(form.email.trim(), form.password, datosPerfil);
    } catch (err) {
      setError(mapFirebaseError(err.code));
    } finally {
      setCargando(false);
    }
  };

  return {
    form,
    setForm,
    handleChange,
    mostrarPassword,
    setMostrarPassword,
    mostrarConfirmPassword,
    setMostrarConfirmPassword,
    error,
    setError,
    cargando,
    validarCredenciales,
    registrar,
  };
}