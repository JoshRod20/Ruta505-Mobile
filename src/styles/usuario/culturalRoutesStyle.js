/**
 * Estilos de culturalRoutesStyle (Rutas Creativas del turista).
 */

import { StyleSheet } from "react-native";
import { VERDE } from "../rutas/crearRutaStyle";

export const culturalRoutesStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  titulo: {
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: VERDE,
    marginBottom: 12,
  },
  iconoLupa: {
    width: 20,
    height: 20,
  },
  buscador: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderRadius: 12,
    height: 46,
    paddingHorizontal: 14,
    marginHorizontal: 16,
  },
  buscadorInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#1A1A1A",
  },
  lista: {
    paddingHorizontal: 16,
  },
  seccion: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: VERDE,
    marginTop: 16,
    marginBottom: 4,
  },
  nombreRuta: {
    fontSize: 17,
    lineHeight: 23,
    color: VERDE,
  },
  vacio: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#5F6F66",
    textAlign: "center",
    marginTop: 40,
    paddingHorizontal: 24,
  },
});
