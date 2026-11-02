/**
 * Estilos de culturalRoutesStyle (Rutas Creativas del turista).
 */

import { StyleSheet } from "react-native";
import { VERDE } from "../rutas/crearRutaStyle";

export const culturalRoutesStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  // La lista (desde "Rutas sugeridas") va sobre fondo gris con tarjetas blancas.
  scroll: {
    flex: 1,
    backgroundColor: "#F2F2F2",
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
  // Banda gris de lado a lado que rodea al buscador.
  bandaBuscador: {
    backgroundColor: "#F2F2F2",
    paddingVertical: 14,
  },
  buscador: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
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
    paddingHorizontal: 0,
  },
  // Banda blanca de "Rutas sugeridas" entre el buscador y las tarjetas.
  bandaSeccion: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  listaGris: {
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  seccion: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
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
