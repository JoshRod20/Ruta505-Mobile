/**
 * Catálogo ÚNICO de categorías de la app (Home del turista, formularios,
 * mapa, búsqueda y rutas). Es la ÚNICA fuente: todo lo demás lee de aquí.
 *
 * Categorías finales: Rural, Gastronomía, Playa, Cultura, Agricultura.
 * El id va en minúsculas, sin tildes ni signos.
 *
 * ICONOS PERSONALIZADOS: cada categoría tiene el campo `icono` (hoy un
 * Ionicons temporal). Reemplázalo aquí cuando tengas tus íconos propios.
 * Los lugares que dibujan el ícono están marcados con "ICONO_CATEGORIA"
 * (busca ese texto en el proyecto).
 */
export const CATEGORIAS_EXPERIENCIA = [
  {
    id: "rural",
    label: "Rural",
    // ICONO_CATEGORIA: reemplazar por ícono personalizado de Rural
    icono: require("../assets/categorias/Turismo-rural.png"),
    color: "#2F6B4F",
  },
  {
    id: "gastronomia",
    label: "Gastronomía",
    // ICONO_CATEGORIA: reemplazar por ícono personalizado de Gastronomía
    icono: require("../assets/categorias/Gastronomía.png"),
    color: "#C1443C",
  },
  {
    id: "playa",
    label: "Playa",
    // ICONO_CATEGORIA: reemplazar por ícono personalizado de Playa
    icono: require("../assets/categorias/Playa.png"),
    color: "#2A8BA8",
  },
  {
    id: "cultura",
    label: "Cultura",
    // ICONO_CATEGORIA: reemplazar por ícono personalizado de Cultura
    icono: require("../assets/categorias/cultura.png"),
    color: "#4A5C73",
  },
  {
    id: "agricola",
    label: "Agrícola",
    // ICONO_CATEGORIA: reemplazar por ícono personalizado de Agricultura
    icono: require("../assets/categorias/Agricultura.png"),
    color: "#B8912E",
  },
];

/**
 * Ids antiguos que ya existen guardados en Firestore (publicaciones y
 * negocios creados antes de unificar las categorías) -> id actual.
 */
const ALIAS_CATEGORIAS = {
  // Anteriores a la unificación
  comunidad: "cultura",
  historia: "cultura",
  historico: "cultura",
  artesania: "cultura",
  artesanias: "cultura",
  // Catálogo anterior (naturaleza, aventura, artesanías)
  naturaleza: "rural",
  aventura: "rural",
  // Variantes de las nuevas
  agricultura: "agricola",
  agroturismo: "agricola",
  agro: "agricola",
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
 * Devuelve el ícono de la categoría: un require() de imagen (ícono
 * personalizado) o, si no se encuentra, el nombre de un Ionicons por defecto.
 * OJO: no pasar este valor directo a <Ionicons name=...>; usar el componente
 * <IconoCategoria categoria={...} /> de components/common/IconoCategoria.
 * @param {string} categoriaId - Identificador de la categoría.
 * @returns {number|string} Imagen (require) o nombre de Ionicons.
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
