import { StyleSheet } from "react-native";

const COLOR_CREMA = "#fbf6ec";
const COLOR_CORAL = "#e07a5f";
const COLOR_TINTA = "#2b2b2b";

const SeleccionarActorScreenStyle = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLOR_CREMA,
    padding: 24,
  },
  volver: {
    marginBottom: 16,
  },
  volverTexto: {
    color: COLOR_TINTA,
    fontSize: 14,
    fontWeight: "600",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLOR_TINTA,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 13,
    color: COLOR_TINTA,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tarjeta: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLOR_CORAL,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  tarjetaTitulo: {
    fontSize: 15,
    fontWeight: "600",
    color: COLOR_TINTA,
    marginBottom: 4,
  },
  tarjetaDescripcion: {
    fontSize: 12,
    color: COLOR_TINTA,
    opacity: 0.7,
  },
});

export default SeleccionarActorScreenStyle;