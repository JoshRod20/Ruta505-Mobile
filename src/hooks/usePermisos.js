import { useAuth } from "../context/AuthContext";
import { tienePermiso } from "../constants/permissions";

export function usePermisos() {
  const { role, estadoVerificacion } = useAuth();

  const puede = (permiso) => tienePermiso(role, permiso);

  return { role, estadoVerificacion, puede };
}
