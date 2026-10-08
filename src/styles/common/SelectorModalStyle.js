/**
 * Estilos de SelectorModalStyle.
 */

import { StyleSheet } from "react-native";

const COLOR_HEADER = "#086338";
const COLOR_BORDE = "#0c8046";
const COLOR_TINTA = "#2b2b2b";

export const selectorModalStyle = StyleSheet.create({
  modalFondo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalFondoTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCaja: {
    width: "100%",
    maxHeight: "70%",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  modalTitulo: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: COLOR_HEADER,
    textAlign: "center",
    marginBottom: 16,
  },
  modalBusquedaWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLOR_BORDE,
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 46,
    marginBottom: 12,
  },
  modalBusquedaIcono: {
    marginRight: 8,
  },
  modalBusquedaInput: {
    flex: 1,
    fontSize: 14,
    color: COLOR_TINTA,
    padding: 0,
  },
  modalLista: {
    maxHeight: 320,
  },
  modalOpcion: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginBottom: 8,
    backgroundColor: "#f2f2f2",
  },
  modalOpcionActiva: {
    backgroundColor: COLOR_HEADER,
  },
  modalOpcionTexto: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: COLOR_TINTA,
  },
  modalOpcionTextoActivo: {
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
  },
  modalVacioTexto: {
    textAlign: "center",
    color: "#a8a8a8",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    paddingVertical: 20,
  },
});