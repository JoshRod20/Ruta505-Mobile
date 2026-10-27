/**
 * Estilos de misRutasCreativasStyle.
 */

import { StyleSheet } from "react-native";
import { VERDE, LIMA, NARANJA, AZUL } from "./crearRutaStyle";

export const misRutasStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  botonAtras: {
    width: 32,
    height: 32,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  titulo: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: VERDE,
  },
  subtitulo: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#5F6F66",
    paddingHorizontal: 24,
    marginTop: 6,
    marginBottom: 14,
  },
  lista: {
    paddingHorizontal: 16,
  },

  // ---- Tarjeta de ruta ----
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    elevation: 3,
    shadowColor: "#0E5A34",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  filaSuperior: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  tarjetaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  puntoDecorativo: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: LIMA,
    marginRight: 8,
  },
  rutaTipo: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 10,
    color: "#3E5A4E",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  pastillaLugares: {
    alignSelf: "flex-start",
    backgroundColor: AZUL,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pastillaLugaresTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
    color: "#FFFFFF",
  },
  pastillaEstado: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pastillaDias: {
    alignSelf: "flex-start",
    backgroundColor: AZUL,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  pastillaDiasTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
    color: "#FFFFFF",
  },
  estadoPublicada: { backgroundColor: "#E9F9D9" },
  estadoEnEspera: { backgroundColor: "#FFF2D8" },
  estadoBorrador: { backgroundColor: "#F0F0F0" },
  estadoTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
    color: "#1E3B2D",
  },
  nombre: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 22,
    color: "#12251A",
    lineHeight: 28,
    marginTop: 2,
  },
  etiquetaItinerario: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#1A1A1A",
    letterSpacing: 0,
    marginTop: 8,
    marginBottom: 8,
  },

  // ---- Paradas (carrusel) ----
  carrusel: {
    marginHorizontal: -16,
  },
  carruselContenido: {
    paddingHorizontal: 16,
    paddingBottom: 2,
  },
  parada: {
    width: 186,
    backgroundColor: "#F5F9F3",
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E2EAE0",
  },
  paradaImagen: {
    width: "100%",
    height: 92,
    backgroundColor: "#EAF4E7",
    alignItems: "center",
    justifyContent: "center",
  },
  paradaCuerpo: {
    padding: 10,
  },
  paradaNombre: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12.5,
    color: "#162C21",
  },
  paradaFilaHorario: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  paradaHorario: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 10,
    color: "#52655E",
    marginLeft: 4,
  },
  paradaPendiente: {
    fontFamily: "Inter-SemiBold",
    fontSize: 10,
    color: "#B66A00",
    marginTop: 5,
  },

  // ---- Pie ----
  filaMapaDias: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  enlaceMapa: {
    flexDirection: "row",
    alignItems: "center",
  },
  botonWhatsApp: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    backgroundColor: VERDE,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 6,
  },
  whatsappCirculo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  botonWhatsAppTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: "#FFFFFF",
    marginLeft: 6,
  },
  enlaceMapaTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: VERDE,
    marginLeft: 6,
  },
  avance: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#5F6F66",
    marginTop: 10,
    flex: 1,
    paddingRight: 12,
  },
  cajaTotal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    marginTop: 10,
  },
  totalEtiqueta: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: "#5F6F66",
  },
  totalValor: {
    fontFamily: "Poppins-Bold",
    fontSize: 26,
    color: "#12251A",
  },
  botonLima: {
    backgroundColor: LIMA,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 11,
    minWidth: 110,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#95C11F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 2,
  },
  botonLimaTexto: {
    fontFamily: "Poppins-Bold",
    fontSize: 13,
    color: "#11261B",
  },
  botonCancelar: {
    alignSelf: "center",
    marginTop: 12,
    paddingVertical: 4,
  },
  botonCancelarTexto: {
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
    color: "#C0392B",
  },

  // ---- Vacío ----
  vacio: {
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 30,
  },
  vacioTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#5F6F66",
    textAlign: "center",
    marginBottom: 16,
  },
  botonNaranja: {
    backgroundColor: NARANJA,
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  botonNaranjaTexto: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#1A1A1A",
  },
});
