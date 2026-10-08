/**
 * Estilos de culturalProfileStyle.
 */

import { StyleSheet } from "react-native";

const VERDE = "#086338";
const VERDE_BORDE = "#0c8046";

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
    bottom: -20,
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: VERDE_BORDE,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
    borderColor: VERDE_BORDE,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 10,
  },
  insigniaTexto: {
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
    color: VERDE,
    marginLeft: 6,
  },
  nombre: {
    fontFamily: "Poppins-Bold",
    fontSize: 19,
    color: VERDE,
  },
  subtitulo: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#6B6B6B",
    marginTop: 2,
  },
  filaCalificacion: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  calificacionTexto: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#111111",
    marginLeft: 6,
  },
  descripcion: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#2D2D2D",
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
    fontFamily: "Poppins-Bold",
    fontSize: 12,
    color: VERDE,
    marginTop: 26,
    marginBottom: 10,
  },
  botonAccion: {
    height: 46,
    borderWidth: 1.5,
    borderColor: VERDE_BORDE,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  botonAccionTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: VERDE,
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
