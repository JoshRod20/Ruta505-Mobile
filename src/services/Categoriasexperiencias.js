/**
 * Catálogo ÚNICO de categorías de la app (Home del turista, formularios,
 * mapa, búsqueda y rutas). Coincide con las categorías del diseño del turista.
 * Incluye id, etiqueta, ícono Ionicons y color para pins y formularios.
 */
export const CATEGORIAS_EXPERIENCIA = [
  {
    id: "naturaleza",
    label: "Naturaleza",
    icono: "leaf-outline",
    color: "#2F6B4F",
  },
  {
    id: "gastronomia",
    label: "Gastronomía",
    icono: "restaurant-outline",
    color: "#C1443C",
  },
  {
    id: "aventura",
    label: "Aventura",
    icono: "trail-sign-outline",
    color: "#C97B4A",
  },
  {
    id: "cultura",
    label: "Cultura",
    icono: "color-palette-outline",
    color: "#4A5C73",
  },
  {
    id: "artesanias",
    label: "Artesanías",
    icono: "hammer-outline",
    color: "#B8912E",
  },
];

/**
 * Ids antiguos que ya existen guardados en Firestore (publicaciones y
 * negocios creados antes de unificar las categorías) -> id actual.
 */
const ALIAS_CATEGORIAS = {
  comunidad: "cultura",
  historia: "cultura",
  historico: "cultura",
  artesania: "artesanias",
};

/** Ícono Ionicons por defecto cuando la categoría no se encuentra. */
const ICONO_POR_DEFECTO = "location-outline";

/** Color hexadecimal por defecto cuando la categoría no se encuentra. */
const COLOR_POR_DEFECTO = "#123B63";

/** Minúsculas, sin tildes ni espacios sobrantes. */
const limpiar = (valor = "") =>
  String(valor ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

/**
 * Convierte cualquier valor guardado (id actual, id antiguo, con o sin
 * tildes/mayúsculas) al id actual del catálogo. Devuelve "" si no existe.
 * @param {string} valor - Categoría tal como está guardada.
 * @returns {string} Id canónico o "".
 */
export function idCategoria(valor) {
  const v = limpiar(valor);
  if (!v) return "";
  const id = ALIAS_CATEGORIAS[v] ?? v;
  return CATEGORIAS_EXPERIENCIA.some((c) => c.id === id) ? id : "";
}

/**
 * Busca la categoría del catálogo (acepta ids antiguos).
 * @param {string} valor - Categoría tal como está guardada.
 * @returns {Object|undefined} Categoría o undefined.
 */
export function buscarCategoria(valor) {
  const id = idCategoria(valor);
  return CATEGORIAS_EXPERIENCIA.find((c) => c.id === id);
}

/**
 * Devuelve el nombre de ícono Ionicons según el id de categoría.
 * @param {string} categoriaId - Identificador de la categoría.
 * @returns {string} Nombre del ícono.
 */
export function iconoDeCategoria(categoriaId) {
  return buscarCategoria(categoriaId)?.icono ?? ICONO_POR_DEFECTO;
}

/**
 * Devuelve el color hexadecimal según el id de categoría.
 * @param {string} categoriaId - Identificador de la categoría.
 * @returns {string} Color en formato hex.
 */
export function colorDeCategoria(categoriaId) {
  return buscarCategoria(categoriaId)?.color ?? COLOR_POR_DEFECTO;
}
