/**
 * usePermisos: componente/pantalla de la aplicación Ruta505.
 */

import { useAuth } from "../context/AuthContext";
import { tienePermiso } from "../constants/permissions";

/**
 * Hook que expone el rol, el estado de verificación y un helper de permisos.
 * @returns {{ role: string|null, estadoVerificacion: string|null, puede: function }}
 */
export function usePermisos() {
  const { role, estadoVerificacion } = useAuth();

  /**
   * Verifica si el usuario actual tiene el permiso indicado.
   * @param {string} permiso - Identificador del permiso.
   * @returns {boolean}
   */
  const puede = (permiso) => tienePermiso(role, permiso);

  return { role, estadoVerificacion, puede };
}
