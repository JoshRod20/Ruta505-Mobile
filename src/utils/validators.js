/**
 * Patrones de validación compartidos en formularios de autenticación y registro.
 * Fuente única de verdad para EMAIL_REGEX, CEDULA_REGEX y TELEFONO_REGEX.
 */

/** Valida formato básico de correo electrónico. */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Valida cédula nicaragüense (formato 000-000000-0000X). */
export const CEDULA_REGEX = /^\d{3}-\d{6}-\d{4}[A-Za-z]$/;

/** Valida número telefónico (7-20 caracteres, dígitos, +, espacios o guiones). */
export const TELEFONO_REGEX = /^[\d+\s-]{7,20}$/;
