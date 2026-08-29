import { StyleSheet } from "react-native";

const COLOR_CREMA = "#fbf6ec";
const COLOR_TINTA = "#2b2b2b";

const PendienteAprobacionScreenStyle = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLOR_CREMA,
    padding: 24,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLOR_TINTA,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 14,
    color: COLOR_TINTA,
    opacity: 0.75,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  tarjeta: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  mensaje: {
    fontSize: 13,
    color: COLOR_TINTA,
    opacity: 0.85,
    lineHeight: 19,
    textAlign: "center",
  },
});

export default PendienteAprobacionScreenStyle;