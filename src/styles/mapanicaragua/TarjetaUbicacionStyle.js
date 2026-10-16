/**
 * Estilos de TarjetaUbicacionStyle.
 */

import { StyleSheet } from "react-native";

const VERDE = "#0E5A34";

export const tarjetaUbicacionStyle = StyleSheet.create({
  // Hoja inferior pegada a la barra de navegación (68 = alto de CustomTabBar)
  hoja: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 100,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  contenido: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },

  // ---- Título + cerrar ----
  filaTitulo: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  titulo: {
    flex: 1,
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    lineHeight: 28,
    color: VERDE,
    marginRight: 12,
  },
  botonCerrar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E3E3E3",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  botonCerrarTexto: {
    fontFamily: "Inter-SemiBold",
    fontSize: 13,
    color: "#4A4A4A",
    marginTop: -1,
  },
  filaCalificacion: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  calificacionTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#2D2D2D",
    marginLeft: 6,
  },

  // ---- Fotos y videos ----
  filaFotos: {
    marginTop: 16,
    marginHorizontal: -20,
  },
  filaFotosContenido: {
    paddingHorizontal: 20,
  },
  foto: {
    height: 140,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: "#EEF2EE",
  },

  // ---- Referencia registrada ----
  cajaReferencia: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 16,
  },
  referenciaIcono: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  referenciaTextos: {
    flex: 1,
  },
  referenciaEtiqueta: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: VERDE,
  },
  referenciaTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#2D2D2D",
    marginTop: 1,
  },

  // ---- Sobre este lugar ----
  seccionTitulo: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: VERDE,
    marginTop: 20,
  },
  descripcion: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#2D2D2D",
    lineHeight: 18,
    marginTop: 6,
  },

  // ---- Acciones ----
  etaPill: {
    alignSelf: "flex-start",
    backgroundColor: "#EAF5DA",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 10,
  },
  etaPillTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: VERDE,
  },
  acciones: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: "#EEF2EE",
  },
  filaAcciones: {
    flexDirection: "row",
    gap: 10,
  },
  botonSecundario: {
    height: 46,
    paddingHorizontal: 22,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: VERDE,
    alignItems: "center",
    justifyContent: "center",
  },
  botonSecundarioTexto: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: VERDE,
  },
  botonPrimario: {
    flex: 1,
    height: 46,
    borderRadius: 999,
    backgroundColor: VERDE,
    alignItems: "center",
    justifyContent: "center",
  },
  botonPrimarioTexto: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#FFFFFF",
  },
});
