/**
 * Catálogo de categorías de experiencias culturales.
 * Incluye id, etiqueta, ícono Ionicons y color para pins y formularios.
 */
export const CATEGORIAS_EXPERIENCIA = [
  {
    id: "comunidad",
    label: "Comunidad",
    icono: "people-outline",
    color: "#C97B4A",
  },
  {
    id: "artesania",
    label: "Artesanía",
    icono: "hammer-outline",
    color: "#B8912E",
  },
  {
    id: "gastronomia",
    label: "Gastronomía",
    icono: "restaurant-outline",
    color: "#C1443C",
  },
  {
    id: "naturaleza",
    label: "Naturaleza",
    icono: "leaf-outline",
    color: "#2F6B4F",
  },
  {
    id: "historia",
    label: "Histórico",
    icono: "library-outline",
    color: "#4A5C73",
  },
];

/** Ícono Ionicons por defecto cuando la categoría no se encuentra. */
const ICONO_POR_DEFECTO = "location-outline";

/** Color hexadecimal por defecto cuando la categoría no se encuentra. */
const COLOR_POR_DEFECTO = "#123B63";

/**
 * Devuelve el nombre de ícono Ionicons según el id de categoría.
 * @param {string} categoriaId - Identificador de la categoría.
 * @returns {string} Nombre del ícono.
 */
export function iconoDeCategoria(categoriaId) {
  const encontrada = CATEGORIAS_EXPERIENCIA.find((c) => c.id === categoriaId);
  return encontrada ? encontrada.icono : ICONO_POR_DEFECTO;
}

/**
 * Devuelve el color hexadecimal según el id de categoría.
 * @param {string} categoriaId - Identificador de la categoría.
 * @returns {string} Color en formato hex.
 */
export function colorDeCategoria(categoriaId) {
  const encontrada = CATEGORIAS_EXPERIENCIA.find((c) => c.id === categoriaId);
  return encontrada ? encontrada.color : COLOR_POR_DEFECTO;
}
