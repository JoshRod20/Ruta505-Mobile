import { StyleSheet } from "react-native";

const VERDE = "#0E5A34";
const VERDE_CLARO = "#8CC219";

export const tarjetaUbicacionStyle = StyleSheet.create({
  // Hoja inferior pegada a la barra de navegación (68 = alto de CustomTabBar)
  hoja: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 68,
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

  // ---- Categoría + cerrar ----
  filaSuperior: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: VERDE_CLARO,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeIcono: {
    marginRight: 6,
  },
  badgeTexto: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
    color: VERDE,
  },
  botonCerrar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
  },
  botonCerrarTexto: {
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
    color: "#4A4A4A",
    marginTop: -1,
  },

  // ---- Título y calificación ----
  titulo: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: VERDE,
    marginTop: 14,
  },
  filaCalificacion: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  calificacionTexto: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
    color: "#111111",
    marginLeft: 6,
  },

  // ---- Fotos ----
  filaFotos: {
    marginTop: 14,
    marginHorizontal: -20,
  },
  filaFotosContenido: {
    paddingHorizontal: 20,
  },
  foto: {
    height: 132,
    borderRadius: 14,
    marginRight: 10,
    backgroundColor: "#EEF2EE",
  },

  // ---- Referencia registrada ----
  cajaReferencia: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: VERDE,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 16,
  },
  referenciaIcono: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: VERDE_CLARO,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  referenciaTextos: {
    flex: 1,
  },
  referenciaEtiqueta: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
    color: "#6B6B6B",
    textTransform: "uppercase",
  },
  referenciaTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#2D2D2D",
    marginTop: 2,
  },

  // ---- Sobre este lugar ----
  seccionTitulo: {
    fontFamily: "Poppins-Bold",
    fontSize: 12,
    color: VERDE,
    textTransform: "uppercase",
    marginTop: 16,
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
