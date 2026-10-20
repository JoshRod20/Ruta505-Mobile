/**
 * Estilos de planDestacado (pantalla "Experiencias premium").
 */

import { StyleSheet } from "react-native";

const VERDE = "#0E5A34";
const VERDE_BOTON = "#0B5A33";
const FONDO = "#F2F2F2";

export const ALTO_PIE = 64;

export const planDestacadoStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FONDO,
  },

  // ---- Encabezado ----
  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  botonVolver: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  encabezadoTitulo: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: VERDE,
    marginLeft: 12,
  },

  contenido: {
    paddingHorizontal: 16,
  },

  // ---- Introducción ----
  introContenedor: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: -16,
    paddingHorizontal: 32,
    paddingTop: 12,
    paddingBottom: 20,
    marginBottom: 16,
  },
  titulo: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    lineHeight: 32,
    color: "#111111",
    textAlign: "center",
  },
  subtitulo: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    lineHeight: 19,
    color: "#555555",
    textAlign: "center",
    marginTop: 8,
  },

  // ---- Tarjeta de plan ----
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  tarjetaDestacada: {
    borderColor: VERDE,
  },
  insignia: {
    position: "absolute",
    top: -12,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: VERDE,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 4,
  },
  insigniaTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: "#FFFFFF",
  },
  etiqueta: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    letterSpacing: 0.5,
    color: VERDE,
    textTransform: "uppercase",
  },
  nombrePlan: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    color: "#111111",
    marginTop: 2,
  },
  filaPrecio: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 6,
  },
  precio: {
    fontFamily: "Poppins-Bold",
    fontSize: 34,
    lineHeight: 40,
    color: "#111111",
  },
  precioPeriodo: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#666666",
    marginLeft: 4,
    marginBottom: 7,
  },
  pastillaFacturacion: {
    alignSelf: "flex-start",
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 8,
  },
  pastillaFacturacionTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: "#666666",
  },
  notaFacturacion: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    lineHeight: 16,
    color: "#666666",
    marginTop: 6,
  },
  separador: {
    height: 1,
    backgroundColor: "#E6E6E6",
    marginVertical: 16,
  },

  // ---- Beneficios ----
  beneficio: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  beneficioTexto: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#1A1A1A",
    marginLeft: 10,
  },

  // ---- Botones ----
  boton: {
    height: 46,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  botonPrimario: {
    backgroundColor: VERDE_BOTON,
  },
  botonSecundario: {
    backgroundColor: "#E0E0E0",
  },
  botonTextoPrimario: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#FFFFFF",
  },
  botonTextoSecundario: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#555555",
  },

  // ---- Pie fijo ----
  pie: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E6E6E6",
  },
  pieTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: "#444444",
  },
  pieEnlaces: {
    flexDirection: "row",
    gap: 28,
    marginTop: 6,
  },
  pieEnlace: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: VERDE,
    textDecorationLine: "underline",
  },
});
