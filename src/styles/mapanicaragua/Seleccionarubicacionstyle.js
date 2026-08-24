import { StyleSheet } from "react-native";

export const seleccionarUbicacionStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  banner: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: "#123B63",
    borderRadius: 14,
    padding: 14,
  },
  bannerTexto: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
  },
  // El pin NO es un marcador del mapa (ViewAnnotation) — es una simple
  // View superpuesta, fija en el centro de la pantalla. Como el mapa se
  // mueve por debajo, el pin siempre "apunta" a las coordenadas del
  // centro visible, que es justo lo que necesitamos leer al confirmar.
  pinFijo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -18,
    marginTop: -36, // sube el pin para que la PUNTA (no el centro del ícono) marque el lugar exacto
  },
  pinTexto: {
    fontSize: 36,
  },
  panelInferior: {
    position: "absolute",
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
  },
  coordenadasTexto: {
    fontSize: 13,
    color: "#4E6780",
    textAlign: "center",
    marginBottom: 12,
  },
  filaBotones: {
    flexDirection: "row",
    gap: 10,
  },
  botonCancelar: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#E4E9EF",
  },
  botonCancelarTexto: {
    color: "#123B63",
    fontWeight: "700",
  },
  botonConfirmar: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#1D7A46",
  },
  botonConfirmarTexto: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
