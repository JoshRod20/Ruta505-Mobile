import { ROLES } from "./roles";

export const PERMISOS = {
  // Turista
  VER_MAPA: "ver_mapa",
  VER_EXPERIENCIAS: "ver_experiencias",
  USAR_PINOLITO: "usar_pinolito",
  GUARDAR_FAVORITOS: "guardar_favoritos",
  CALIFICAR_EXPERIENCIA: "calificar_experiencia",
  ESCANEAR_QR: "escanear_qr",
  VER_PASAPORTE: "ver_pasaporte",
  VER_RUTAS_CULTURALES: "ver_rutas_culturales",
  VER_PERFIL_USUARIO: "ver_perfil_usuario",

  // Actor cultural
  CREAR_PERFIL_ACTOR: "crear_perfil_actor",
  PUBLICAR_EXPERIENCIA: "publicar_experiencia",
  GENERAR_QR_EXPERIENCIA: "generar_qr_experiencia",
  VER_ESTADISTICAS_PROPIAS: "ver_estadisticas_propias",
  VER_PERFIL_CULTURAL: "ver_perfil_cultural",

  // Institución
  APROBAR_PERFILES: "aprobar_perfiles",
  OTORGAR_VERIFICACION: "otorgar_verificacion",
  MODERAR_CONTENIDO: "moderar_contenido",
  VER_ESTADISTICAS_GENERALES: "ver_estadisticas_generales",
  EXPORTAR_REPORTES: "exportar_reportes",
};

const PERMISOS_POR_ROL = {
  [ROLES.TURISTA]: [
    PERMISOS.VER_MAPA,
    PERMISOS.VER_EXPERIENCIAS,
    PERMISOS.USAR_PINOLITO,
    PERMISOS.GUARDAR_FAVORITOS,
    PERMISOS.CALIFICAR_EXPERIENCIA,
    PERMISOS.ESCANEAR_QR,
    PERMISOS.VER_PASAPORTE,
    PERMISOS.VER_RUTAS_CULTURALES,
    PERMISOS.VER_PERFIL_USUARIO,
  ],
  [ROLES.ACTOR_CULTURAL]: [
    PERMISOS.VER_MAPA,
    PERMISOS.VER_EXPERIENCIAS,
    PERMISOS.USAR_PINOLITO,
    PERMISOS.CREAR_PERFIL_ACTOR,
    PERMISOS.PUBLICAR_EXPERIENCIA,
    PERMISOS.GENERAR_QR_EXPERIENCIA,
    PERMISOS.VER_ESTADISTICAS_PROPIAS,
    PERMISOS.VER_PERFIL_CULTURAL,
  ],
  [ROLES.INSTITUCION]: [
    PERMISOS.VER_MAPA,
    PERMISOS.VER_EXPERIENCIAS,
    PERMISOS.APROBAR_PERFILES,
    PERMISOS.OTORGAR_VERIFICACION,
    PERMISOS.MODERAR_CONTENIDO,
    PERMISOS.VER_ESTADISTICAS_GENERALES,
    PERMISOS.EXPORTAR_REPORTES,
  ],
};

export function tienePermiso(role, permiso) {
  if (!role) return false;
  return (PERMISOS_POR_ROL[role] || []).includes(permiso);
}