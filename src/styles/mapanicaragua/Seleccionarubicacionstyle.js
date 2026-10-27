/**
 * Estilos de Seleccionarubicacionstyle.
 */

import { StyleSheet } from "react-native";
import { boton } from "../common/botonStyle";

export const seleccionarUbicacionStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  banner: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: "#123B63",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  bannerTexto: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  // Pin centrado: la punta del icono debe marcar el centro del mapa
  pinFijo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -22, // size 44 / 2
    marginTop: -40, // sube para que la punta (abajo del icono) quede en el centro
    alignItems: "center",
  },
  pinSombra: {
    width: 10,
    height: 4,
    borderRadius: 5,
    backgroundColor: "rgba(0,0,0,0.25)",
    marginTop: -2,
  },
  panelInferior: {
    position: "absolute",
    left: 16,
    right: 16,
    marginBottom: 55,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  coordsFila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  coordenadasTexto: {
    fontSize: 13,
    color: "#4E6780",
    fontWeight: "600",
  },
  filaBotones: {
    flexDirection: "row",
    gap: 10,
  },
  botonCancelar: {
    ...boton.secundario,
    flex: 1,
  },
  botonCancelarTexto: {
    ...boton.secundarioTexto,
  },
  botonConfirmar: {
    ...boton.primario,
    flex: 1.4,
    flexDirection: "row",
  },
  botonConfirmarTexto: {
    ...boton.primarioTexto,
  },
});