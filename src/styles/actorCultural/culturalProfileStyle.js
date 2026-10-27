/**
 * Estilos de culturalProfileStyle.
 */

import { Platform, StyleSheet } from "react-native";
import { boton } from "../common/botonStyle";

const VERDE = "#086338";
const NARANJA = "#F29100";

export const culturalProfileStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // ---- Portada ----
  portada: {
    width: "100%",
    height: 170,
    backgroundColor: "#E7F2D3",
  },
  botonPortada: {
    position: "absolute",
    right: 20,
    bottom: -22,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#8CC219",
    alignItems: "center",
    justifyContent: "center",
  },

  // ---- Datos ----
  cuerpo: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  insignia: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderWidth: 1.5,
    borderColor: NARANJA,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 12,
  },
  insigniaTexto: {
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
    color: NARANJA,
    marginLeft: 6,
  },
  nombre: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 19,
    color: VERDE,
  },
  subtitulo: {
    fontFamily: "Inter-Regular",
    fontSize: 12.5,
    color: "#111111",
    marginTop: 2,
  },
  filaCalificacion: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  calificacionTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 17,
    color: "#111111",
    marginLeft: 8,
  },
  descripcion: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#111111",
    lineHeight: 19,
    marginTop: 12,
  },
  descripcionVacia: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#9A9A9A",
    lineHeight: 18,
    marginTop: 12,
  },

  // ---- Acciones ----
  seccion: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: VERDE,
    marginTop: 28,
    marginBottom: 12,
  },
  botonAccion: {
    ...boton.primario,
    marginBottom: 14,
    // La sombra suave del diseño; en Android se omite porque "elevation"
    // dibuja las esquinas redondeadas con cortes.
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
    }),
  },
  botonAccionTexto: {
    ...boton.primarioTexto,
  },

  // ---- Sin permiso ----
  avisoContenedor: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
  },
  avisoTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#4A4A4A",
    lineHeight: 20,
  },
});
