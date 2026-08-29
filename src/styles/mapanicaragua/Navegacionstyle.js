import { StyleSheet } from "react-native";

export const navegacionStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  llegadaContainer: {
    flex: 1,
    backgroundColor: "#1D7A46",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  llegadaIcono: {
    fontSize: 64,
    marginBottom: 16,
  },
  llegadaTitulo: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 32,
    textAlign: "center",
  },

  marcadorDestino: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: "#1D7A46",
  },
  marcadorDestinoIcono: {
    fontSize: 20,
  },

  panelInstruccion: {
    position: "absolute",
    top: 80,
    left: 16,
    right: 16,
    backgroundColor: "#123B63",
    borderRadius: 14,
    padding: 16,
  },
  instruccionTexto: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  instruccionCalle: {
    color: "#CFE0F2",
    fontSize: 14,
    marginTop: 2,
  },
  siguienteTexto: {
    color: "#9FB6CC",
    fontSize: 12,
    marginTop: 8,
  },

  panelInferior: {
    position: "absolute",
    bottom: 90,
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  etaTiempo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1D7A46",
  },
  etaDistancia: {
    fontSize: 13,
    color: "#4E6780",
    marginTop: 2,
  },
  botonSalir: {
    backgroundColor: "#E4E9EF",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  botonSalirTexto: {
    color: "#123B63",
    fontWeight: "700",
  },
});