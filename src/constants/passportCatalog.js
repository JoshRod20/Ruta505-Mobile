/**
 * passportCatalog: catálogo de insignias, niveles y lugares del pasaporte cultural.
 * Los nombres de archivo deben coincidir EXACTAMENTE (mayúsculas incluidas) con
 * los de src/assets/insignias y src/assets/niveles.
 */

export const INSIGNIAS = [
  {
    id: "granada",
    title: "Alma Colonial",
    location: "Granada",
    color: "#1E9BE8",
    image: require("../assets/insignias/Granada.png"),
  },
  {
    id: "ometepe",
    title: "Hijo del Volcán",
    location: "Ometepe",
    color: "#0B5D2E",
    image: require("../assets/insignias/Granada.png"),
  },
  {
    id: "matagalpa",
    title: "Corazón del Café",
    location: "Matagalpa",
    color: "#8DC63F",
    image: require("../assets/insignias/Granada.png"),
  },
  {
    id: "bluefields",
    title: "Raíces del Caribe",
    location: "Bluefields",
    color: "#F7931E",
    image: require("../assets/insignias/Granada.png"),
  },
  {
    id: "leon",
    title: "Espíritu Revolucionario",
    location: "León",
    color: "#1E9BE8",
    image: require("../assets/insignias/Granada.png"),
  },
  {
    id: "masaya",
    title: "Guardián del Folclore",
    location: "Masaya",
    color: "#0B5D2E",
    image: require("../assets/insignias/Granada.png"),
  },
  {
    id: "managua",
    title: "Alma de la Capital",
    location: "Managua",
    color: "#1E9BE8",
    image: require("../assets/insignias/Granada.png"),
  },
  {
    id: "esteli",
    title: "Alma del Norte",
    location: "Estelí",
    color: "#0B5D2E",
    image: require("../assets/insignias/Granada.png"),
  },
  {
    id: "chontales",
    title: "Espíritu Ganadero",
    location: "Chontales",
    color: "#8DC63F",
    image: require("../assets/insignias/Granada.png"),
  },
];

export const NIVELES = [
  {
    id: "lv1",
    title: "Explorador Principiante",
    // Nivel inicial: todo turista lo tiene desbloqueado desde que empieza.
    porDefecto: true,
    image: require("../assets/niveles/Viajero novato.png"),
  },
  {
    id: "lv2",
    title: "Explorador Curioso",
    image: require("../assets/niveles/Granada.png"),
  },
  {
    id: "lv3",
    title: "Explorador Aventurero",
    image: require("../assets/niveles/Granada.png"),
  },
  {
    id: "lv4",
    title: "Viajero Cultural",
    image: require("../assets/niveles/Granada.png"),
  },
  {
    id: "lv5",
    title: "Guardián de la Ruta",
    image: require("../assets/niveles/Granada.png"),
  },
  {
    id: "lv6",
    title: "Leyenda 505",
    image: require("../assets/niveles/Granada.png"),
  },
];

/**
 * Lugares/negocios con QR. Cada lugar suma 1 a "Rutas" y,
 * si tiene insigniaId, desbloquea esa insignia automáticamente.
 */
export const LUGARES = {
  "granada-catedral": { name: "Catedral de Granada", insigniaId: "granada" },
  "granada-calzada": { name: "La Calzada", insigniaId: null },
  "ometepe-maderas": { name: "Volcán Maderas", insigniaId: "ometepe" },
  "matagalpa-cafe": { name: "Finca cafetalera", insigniaId: "matagalpa" },
  "bluefields-muelle": {
    name: "Muelle de Bluefields",
    insigniaId: "bluefields",
  },
  "leon-catedral": { name: "Catedral de León", insigniaId: "leon" },
  "masaya-mercado": { name: "Mercado de Artesanías", insigniaId: "masaya" },
  "managua-malecon": { name: "Malecón de Managua", insigniaId: "managua" },
};
