// Convención: usar guion solo cuando el valor combina más de una palabra
// (ej. "actor-cultural"). Un valor de una sola palabra no lleva guion
// (ej. "turista", "institucion"). No renombrar estos valores sin también
// actualizar firestore.rules (los usa como strings literales) y sin migrar
// los documentos ya existentes en la colección "users".
export const ROLES = {
  TURISTA: "turista",
  ACTOR_CULTURAL: "actor-cultural",
  INSTITUCION: "institucion",
};

export const ACTOR_TYPES = {
  COMUNIDAD: "comunidad",
  ARTESANO: "artesano",
  GUIA: "guia",
  EMPRENDEDOR: "emprendedor",
};

export const ESTADOS_VERIFICACION = {
  PENDIENTE: "pendiente",
  APROBADO: "aprobado",
  RECHAZADO: "rechazado",
  SUSPENDIDO: "suspendido",
};