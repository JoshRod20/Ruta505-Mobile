// Mapas de categorías, íconos (Ionicons) y colores para pins y formularios.
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

const ICONO_POR_DEFECTO = "location-outline";
const COLOR_POR_DEFECTO = "#123B63";

// Retorna el nombre de Ionicons según el ID de categoría
export function iconoDeCategoria(categoriaId) {
  const encontrada = CATEGORIAS_EXPERIENCIA.find((c) => c.id === categoriaId);
  return encontrada ? encontrada.icono : ICONO_POR_DEFECTO;
}

// Retorna el color hexadecimal según el ID de categoría
export function colorDeCategoria(categoriaId) {
  const encontrada = CATEGORIAS_EXPERIENCIA.find((c) => c.id === categoriaId);
  return encontrada ? encontrada.color : COLOR_POR_DEFECTO;
}
