import { ACTOR_TYPES } from "./roles";

// ==================================================
// CONFIGURACIÓN POR TIPO DE ACTOR CULTURAL
// Todos comparten el mismo rol (ROLES.ACTOR_CULTURAL);
// esto solo define qué "tipoActor" se guarda y qué
// opciones de turismo se muestran en el formulario.
// ==================================================

export const ACTORES_CULTURALES_CONFIG = {
  [ACTOR_TYPES.COMUNIDAD]: {
    tituloEncabezado: "Datos Generales",
    tiposTurismo: [
      "Turismo comunitario",
      "Turismo rural",
      "Turismo vivencial",
      "Turismo agroecológico",
    ],
  },
  [ACTOR_TYPES.ARTESANO]: {
    tituloEncabezado: "Datos Generales",
    tiposTurismo: [
      "Venta de artesanías",
      "Talleres demostrativos",
      "Turismo artesanal",
    ],
  },
  [ACTOR_TYPES.EMPRENDEDOR]: {
    tituloEncabezado: "Datos Generales",
    tiposTurismo: [
      "Gastronomía local",
      "Hospedaje",
      "Transporte turístico",
      "Eventos culturales",
    ],
  },
  [ACTOR_TYPES.GUIA]: {
    tituloEncabezado: "Datos Generales",
    tiposTurismo: [
      "Tours guiados",
      "Senderismo",
      "Turismo de aventura",
      "Turismo histórico-cultural",
    ],
  },
};