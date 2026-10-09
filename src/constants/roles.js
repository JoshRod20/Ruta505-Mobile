/**
 * Roles de usuario en la plataforma.
 * Convención: guion solo cuando el valor combina más de una palabra
 * (ej. "actor-cultural"). Valores de una sola palabra sin guion.
 * No renombrar sin actualizar firestore.rules y migrar documentos existentes.
 */
export const ROLES = {
  TURISTA: "turista",
  ACTOR_CULTURAL: "actor-cultural",
  INSTITUCION: "institucion",
};

/**
 * Subtipos de actor cultural dentro del rol ACTOR_CULTURAL.
 */
export const ACTOR_TYPES = {
  COMUNIDAD: "comunidad",
  ARTESANO: "artesano",
  GUIA: "guia",
  EMPRENDEDOR: "emprendedor",
};

/**
 * Estados posibles del proceso de verificación de un perfil.
 */
export const ESTADOS_VERIFICACION = {
  PENDIENTE: "pendiente",
  APROBADO: "aprobado",
  RECHAZADO: "rechazado",
  SUSPENDIDO: "suspendido",
};
