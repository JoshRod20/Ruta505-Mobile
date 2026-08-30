export const CATEGORIAS_EXPERIENCIA = [
  { id: "comunidad", label: "Comunidad", icono: "🏘️" },
  { id: "artesania", label: "Artesanía", icono: "🧶" },
  { id: "gastronomia", label: "Gastronomía", icono: "🍲" },
  { id: "naturaleza", label: "Naturaleza", icono: "🌳" },
  { id: "historia", label: "Histórico", icono: "⛪" },
];

const ICONO_POR_DEFECTO = "📍";

export function iconoDeCategoria(categoriaId) {
  const encontrada = CATEGORIAS_EXPERIENCIA.find((c) => c.id === categoriaId);
  return encontrada ? encontrada.icono : ICONO_POR_DEFECTO;
}