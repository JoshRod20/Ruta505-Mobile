import { useState } from "react";
import { registrarUsuario } from "../services/registro";
import { mapFirebaseError } from "../utils/firebaseErrors";

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
    validarCredenciales, // <- nuevo, expuesto para validar antes de navegar
    registrar,
  };
}