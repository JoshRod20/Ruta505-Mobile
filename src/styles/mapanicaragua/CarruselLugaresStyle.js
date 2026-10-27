/**
 * Estilos de CarruselLugares (tarjetas de recomendación del mapa del turista).
 */

import { StyleSheet } from "react-native";

export const ANCHO_TARJETA = 136;

export const carruselLugaresStyle = StyleSheet.create({
  contenedor: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10,
    paddingBottom: 12,
  },
  lista: {
    paddingHorizontal: 16,
    gap: 10,
  },
  tarjeta: {
    width: ANCHO_TARJETA,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 8,
    elevation: 5,
  },
  foto: {
    width: "100%",
    height: 74,
    borderRadius: 10,
    backgroundColor: "#E8EFEA",
  },
  fotoVacia: {
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
    color: "#0E5A34",
    marginTop: 6,
  },
  categoria: {
    fontFamily: "Inter-Regular",
    fontSize: 10,
    color: "#4A4A4A",
    marginTop: 1,
  },
  filaLugar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  lugarTexto: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 9,
    color: "#5F6F66",
    marginLeft: 2,
  },
  filaPie: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
    minHeight: 14,
  },
  calificacion: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 10,
    color: "#123B63",
    marginLeft: 3,
  },
  distancia: {
    fontFamily: "Inter-Regular",
    fontSize: 9,
    color: "#5F6F66",
    marginLeft: "auto",
  },
  insigniaExterna: {
    fontFamily: "Inter-Regular",
    fontSize: 9,
    color: "#8A99A8",
  },
});
