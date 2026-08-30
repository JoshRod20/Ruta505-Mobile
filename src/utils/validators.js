// utils/validators.js
//
// Fuente única de verdad para los patrones de validación usados
// en toda la app (Login, RegistroTurista, RegistroActor, etc.).
// Antes EMAIL_REGEX/CEDULA_REGEX/TELEFONO_REGEX vivían duplicados
// dentro de useRegistroForm.js; ahora se importan desde aquí.

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const CEDULA_REGEX = /^\d{3}-\d{6}-\d{4}[A-Za-z]$/;
export const TELEFONO_REGEX = /^[\d+\s-]{7,20}$/;