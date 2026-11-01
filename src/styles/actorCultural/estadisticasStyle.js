/**
 * Estilos de estadisticasStyle.
 */

import { StyleSheet } from "react-native";

// Pantalla "Estadísticas" del espacio cultural (calificación, balance de
// reseñas, reacciones e interacción, última reseña).
export const VERDE = "#0E5A34";
export const NARANJA = "#F29100";

export const estadisticasStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  contenido: {
    paddingHorizontal: 0,
  },
  // Banda blanca de ancho completo (título de pantalla y de cada sección).
  bandaBlanca: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  // Zona gris donde se apoyan las tarjetas blancas.
  zonaGris: {
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 2,
  },

  // ---- Encabezado ----
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  botonAtras: {
    width: 32,
    height: 32,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  tituloPantalla: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: VERDE,
  },
  titulo: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#1A1A1A",
  },
  subtitulo: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    lineHeight: 18,
    color: "#555555",
    marginTop: 4,
  },

  // ---- Tarjetas ----
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  tarjetaFila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  etiquetaTarjeta: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: VERDE,
  },
  insignia: {
    backgroundColor: VERDE,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  insigniaTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: "#FFFFFF",
  },
  insigniaMala: {
    backgroundColor: NARANJA,
  },
  insigniaTextoMala: {
    color: "#1A1A1A",
  },

  // ---- Calificación promedio ----
  promedioFila: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 4,
  },
  promedioNumero: {
    fontFamily: "Poppins-Bold",
    fontSize: 46,
    lineHeight: 54,
    color: "#333333",
  },
  promedioSobre: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#333333",
    marginLeft: 4,
    marginBottom: 10,
  },
  estrellasYBase: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  estrellasFila: {
    flexDirection: "row",
  },
  basadoEn: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#555555",
  },
  sinDatos: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#666666",
    marginTop: 8,
  },

  // ---- Balance de reseñas ----
  totalOpiniones: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#555555",
  },
  balanceCajas: {
    flexDirection: "row",
    marginTop: 14,
  },
  balanceCaja: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  balanceCajaIzquierda: {
    marginRight: 12,
  },
  balanceIcono: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  balanceTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#1A1A1A",
  },
  balanceNumero: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    color: "#333333",
  },
  barra: {
    flexDirection: "row",
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#E3E3E3",
    marginTop: 14,
  },
  barraBuenas: {
    backgroundColor: VERDE,
  },
  barraMalas: {
    backgroundColor: NARANJA,
  },
  porcentajesFila: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  porcentajeTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#555555",
  },

  // ---- Reacciones e interacción ----
  seccionTitulo: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: VERDE,
  },
  metricasFila: {
    flexDirection: "row",
    marginBottom: 16,
  },
  metricaTarjeta: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  metricaIzquierda: {
    marginRight: 14,
  },
  metricaIcono: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: "#F1F1F1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  metricaEtiqueta: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#1A1A1A",
  },
  metricaValorFila: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  metricaValor: {
    fontFamily: "Poppins-Bold",
    fontSize: 32,
    lineHeight: 40,
    color: "#111111",
  },
  metricaNota: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#555555",
    marginLeft: 6,
    marginBottom: 7,
  },

  // ---- Última reseña ----
  ultimaCabecera: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ultimaCalifFila: {
    flexDirection: "row",
    alignItems: "center",
  },
  ultimaCalifNumero: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#555555",
    marginRight: 8,
  },
  ultimaCita: {
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 12,
  },
  ultimaCitaTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#1A1A1A",
  },
  ultimaAutor: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#555555",
    marginTop: 10,
  },
  botonVerTodas: {
    backgroundColor: VERDE,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 14,
  },
  botonVerTodasTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
  },
  ultimaVacia: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#666666",
    textAlign: "center",
    paddingVertical: 8,
  },
});