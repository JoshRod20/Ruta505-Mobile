import { StyleSheet } from "react-native";

const COLOR_CREMA = "#fbf6ec";
const COLOR_HOJA = "#4caf50";
const COLOR_TINTA = "#2b2b2b";

const SeleccionarTipoScreenStyle = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLOR_CREMA,
    padding: 24,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLOR_TINTA,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 14,
    color: COLOR_TINTA,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 28,
  },
  tarjeta: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  tarjetaTitulo: {
    fontSize: 17,
    fontWeight: "600",
    color: COLOR_TINTA,
    marginBottom: 4,
  },
  tarjetaDescripcion: {
    fontSize: 13,
    color: COLOR_TINTA,
    opacity: 0.7,
  },
  tarjetaAcento: {
    borderLeftWidth: 4,
    borderLeftColor: COLOR_HOJA,
  },
});

export default SeleccionarTipoScreenStyle;