/**
 * layout: medidas compartidas para que toda la app sea responsiva.
 *
 * La barra de pestañas (CustomTabBar) flota con position:"absolute", así que no
 * empuja el contenido. Su alto real es  barHeight(ancho) + inset inferior,
 * donde el inset es ~0 con navegación por gestos y ~48 dp con los 3 botones.
 * Todo lo que quede "encima" de la barra debe usar useTabBarHeight() en vez de
 * números fijos (68, 90, 96, 100...).
 */

export const BASE_WIDTH = 360;
export const MIN_SCALE = 0.85;
export const MAX_SCALE = 1.25;

export const BASE = {
  barHeight: 68,
  notchDepth: 50,
  corner: 17,
  edgeInset: -30,
  circle: 52,
  lift: -18,
  iconActive: 26,
  iconInactive: 26,
};

// Escala según el ancho de la ventana (acotada entre MIN_SCALE y MAX_SCALE).
export function getMetrics(width) {
  const s = Math.min(Math.max(width / BASE_WIDTH, MIN_SCALE), MAX_SCALE);
  return {
    barHeight: Math.round(BASE.barHeight * s),
    notchDepth: BASE.notchDepth * s,
    corner: BASE.corner * s,
    edgeInset: BASE.edgeInset * s,
    circle: Math.round(BASE.circle * s),
    lift: BASE.lift * s,
    iconActive: Math.round(BASE.iconActive * s),
    iconInactive: Math.round(BASE.iconInactive * s),
  };
}

// ── Tablets / pantallas anchas ───────────────────────────────────────────────
// En teléfono nada cambia. En tablet (o ventana ancha) el contenido se limita a
// un ancho cómodo y se centra, en vez de estirarse de lado a lado.
export const MAX_ANCHO_FORMULARIO = 520; // login, registro, selección...
export const MAX_ANCHO_FEED = 640; // listas / publicaciones del Home

// paddingHorizontal extra para centrar un formulario en pantallas anchas
// (null en teléfono, así se conserva el padding original de cada pantalla).
export const padLateralTablet = (width) =>
  width > MAX_ANCHO_FORMULARIO
    ? { paddingHorizontal: (width - MAX_ANCHO_FORMULARIO) / 2 }
    : null;
