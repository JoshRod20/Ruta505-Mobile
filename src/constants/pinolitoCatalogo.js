// src/constants/pinolitoCatalogo.js

export const CATEGORIAS = {
  CUERPO: "cuerpo",
  SOMBRERO: "sombrero",
  ACCESORIO: "accesorio",
};

export const EQUIPADO_INICIAL = {
  cuerpo: "cuerpo_1",
  sombrero: null,
  accesorio: null,
};

export const ESCENARIO = require("../assets/images/escenario.png");

export const LOGROS = {
  primer_qr: {
    titulo: "Explorador",
    descripcion: "Escanea tu primer código QR en una experiencia.",
  },
  primer_sello: {
    titulo: "Viajero",
    descripcion: "Consigue tu primer sello en el pasaporte.",
  },
  ruta_completa: {
    titulo: "Caminante cultural",
    descripcion: "Completa una ruta cultural.",
  },
};

export const ITEMS = [
  {
    id: "cuerpo_1",
    categoria: CATEGORIAS.CUERPO,
    nombre: "Atento",
    logro: null,
    capa: require("../assets/pinolito/Pinolito-Poses-Principal.png"),
  },
  {
    id: "cuerpo_2",
    categoria: CATEGORIAS.CUERPO,
    nombre: "Pose 2",
    logro: null,
    capa: require("../assets/pinolito/Pinolito-Pose-Feliz.png"),
  },
  {
    id: "cuerpo_3",
    categoria: CATEGORIAS.CUERPO,
    nombre: "Pose 3",
    logro: null,
    capa: require("../assets/pinolito/Pinolito-Pose-Alegre.png"),
  },
  {
    id: "cuerpo_4",
    categoria: CATEGORIAS.CUERPO,
    nombre: "Pose 4",
    logro: null,
    capa: require("../assets/pinolito/Pinolito-Pose-Sorprendido.png"),
  },
  {
    id: "cuerpo_5",
    categoria: CATEGORIAS.CUERPO,
    nombre: "Pose 5",
    logro: null,
    capa: require("../assets/pinolito/Pinolito-Pose-Emocionado.png"),
  },
  {
    id: "cuerpo_6",
    categoria: CATEGORIAS.CUERPO,
    nombre: "Pose 6",
    logro: null,
    capa: require("../assets/pinolito/Pinolito-Pose-Bailando.png"),
  },
  {
    id: "cuerpo_7",
    categoria: CATEGORIAS.CUERPO,
    nombre: "Pose 7",
    logro: null,
    capa: require("../assets/pinolito/Pinolito-Volando.png"),
  },
  {
    id: "sombrero_paja",
    categoria: CATEGORIAS.SOMBRERO,
    nombre: "Sombrero de paja",
    logro: "primer_qr",
    icono: require("../assets/pinolito/Pinolito-Poses-Principal.png"),
    capa: require("../assets/pinolito/Pinolito-Poses-Principal.png"),
  },
  {
    id: "vasija",
    categoria: CATEGORIAS.ACCESORIO,
    nombre: "Vasija",
    logro: "primer_sello",
    icono: require("../assets/pinolito/Pinolito-Poses-Principal.png"),
    capa: require("../assets/pinolito/Pinolito-Poses-Principal.png"),
  },

];