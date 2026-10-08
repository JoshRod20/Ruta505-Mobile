/**
 * actoresCulturales: componente/pantalla de la aplicación Ruta505.
 */

import { ACTOR_TYPES } from "./roles";

/**
 * Configuración de formularios por tipo de actor cultural.
 * Todos comparten el rol ROLES.ACTOR_CULTURAL; define el tipoActor
 * almacenado y las opciones de turismo mostradas en el registro.
 */
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
