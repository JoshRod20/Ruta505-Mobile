import { useState } from "react";
import { registrarUsuario } from "../services/registro";
import { mapFirebaseError } from "../utils/firebaseErrors";

/**
 * Hook compartido para los formularios de registro móvil.
 *
 * A diferencia de la web, no recibe `rutaExito` ni navega al terminar:
 * en cuanto la cuenta se crea, Firebase autentica al usuario solo,
 * AuthContext lo detecta, y RootNavigator cambia de pantalla
 * automáticamente (a Home o a Pendiente de aprobación).
 *
 * @param {object} initialValues - valores iniciales del formulario,
 *   incluyendo email, password, confirmPassword y los campos propios
 *   de cada rol (ej. nombreArtesano, especialidad...).
 */
export function useRegistroForm({ initialValues }) {
  const [form, setForm] = useState(initialValues);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (nombre, valor) => {
    setForm((prev) => ({ ...prev, [nombre]: valor }));
  };

  const validarCredenciales = () => {
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return false;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    return true;
  };

  /**
   * @param {object} datosPerfil - role, actorType, estadoVerificacion y
   *   los campos específicos ya armados a partir de `form`.
   */
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
    cargando,
    registrar,
  };
}