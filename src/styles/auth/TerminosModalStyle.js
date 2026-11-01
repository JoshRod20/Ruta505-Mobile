/**
 * Estilos de TerminosModal.
 */

import { StyleSheet } from "react-native";

const COLOR_HEADER = "#086338";
const COLOR_TINTA = "#2b2b2b";

export const terminosModalStyle = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6",
  },

  headerTitulo: {
    flex: 1,
    color: COLOR_HEADER,
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    marginRight: 12,
  },

  botonCerrar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContenido: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 24,
  },

  actualizacion: {
    color: "#6b6b6b",
    fontSize: 12,
    fontFamily: "Inter-Regular",
    marginBottom: 12,
  },

  intro: {
    color: COLOR_TINTA,
    fontSize: 13.5,
    lineHeight: 20,
    fontFamily: "Inter-Regular",
    marginBottom: 8,
  },

  seccionTitulo: {
    color: COLOR_HEADER,
    fontSize: 14.5,
    fontFamily: "Poppins-SemiBold",
    marginTop: 18,
    marginBottom: 6,
  },

  parrafo: {
    color: COLOR_TINTA,
    fontSize: 13.5,
    lineHeight: 20,
    fontFamily: "Inter-Regular",
    marginBottom: 8,
  },

  itemFila: {
    flexDirection: "row",
    marginBottom: 6,
    paddingRight: 4,
  },

  itemViñeta: {
    color: COLOR_HEADER,
    fontSize: 15,
    lineHeight: 20,
    width: 16,
  },

  itemTexto: {
    flex: 1,
    color: COLOR_TINTA,
    fontSize: 13.5,
    lineHeight: 20,
    fontFamily: "Inter-Regular",
  },

  itemTextoNegrita: {
    fontFamily: "Inter-SemiBold",
  },

  footer: {
    paddingHorizontal: 22,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e6e6e6",
    backgroundColor: "#ffffff",
  },

  avisoScroll: {
    color: "#6b6b6b",
    fontSize: 12,
    fontFamily: "Inter-Regular",
    textAlign: "center",
    marginBottom: 8,
  },

  botonAceptar: {
    height: 46,
    borderRadius: 999,
    backgroundColor: COLOR_HEADER,
    alignItems: "center",
    justifyContent: "center",
  },

  botonAceptarDeshabilitado: {
    opacity: 0.4,
  },

  botonAceptarTexto: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
  },
});

export default terminosModalStyle;
