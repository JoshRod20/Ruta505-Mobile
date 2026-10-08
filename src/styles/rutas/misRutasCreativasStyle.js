import { StyleSheet } from "react-native";
import { VERDE, LIMA, NARANJA } from "./crearRutaStyle";

export const misRutasStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
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
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  filaSuperior: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  pastillaLugares: {
    backgroundColor: "#E4E4E4",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pastillaLugaresTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: "#3A3A3A",
  },
  estadoPublicada: { backgroundColor: "#DDEFD2" },
  estadoEnEspera: { backgroundColor: "#FFE8C2" },
  estadoBorrador: { backgroundColor: "#E4E4E4" },
  estadoTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
    color: "#1F3D2B",
  },
  nombre: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: "#1A1A1A",
    lineHeight: 24,
    marginTop: 10,
  },
  etiquetaItinerario: {
    fontFamily: "Inter-SemiBold",
    fontSize: 10,
    color: "#2D2D2D",
    marginTop: 8,
    marginBottom: 6,
  },

  // ---- Paradas (carrusel) ----
  carrusel: {
    marginHorizontal: -14,
  },
  carruselContenido: {
    paddingHorizontal: 14,
  },
  parada: {
    width: 170,
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 10,
  },
  paradaImagen: {
    width: "100%",
    height: 84,
    backgroundColor: "#E7EFE3",
    alignItems: "center",
    justifyContent: "center",
  },
  paradaCuerpo: {
    padding: 8,
  },
  paradaNombre: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: "#1A1A1A",
  },
  paradaFilaHorario: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  paradaHorario: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 10,
    color: "#4A4A4A",
    marginLeft: 4,
  },
  paradaPendiente: {
    fontFamily: "Inter-SemiBold",
    fontSize: 10,
    color: "#B26A00",
    marginTop: 3,
  },

  // ---- Pie ----
  enlaceMapa: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
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
  },
  cajaTotal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  totalEtiqueta: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: "#5F6F66",
  },
  totalValor: {
    fontFamily: "Poppins-Bold",
    fontSize: 19,
    color: "#1A1A1A",
  },
  botonLima: {
    backgroundColor: LIMA,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  botonLimaTexto: {
    fontFamily: "Poppins-Bold",
    fontSize: 13,
    color: "#1A1A1A",
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
