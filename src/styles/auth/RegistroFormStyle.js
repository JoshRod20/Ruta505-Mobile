import { StyleSheet } from "react-native";

const COLOR_CREMA = "#fbf6ec";
const COLOR_HOJA = "#4caf50";
const COLOR_TINTA = "#2b2b2b";
const COLOR_SOL = "#f5a623";

const RegistroFormStyle = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    backgroundColor: COLOR_CREMA,
    padding: 24,
  },
  volver: {
    marginBottom: 12,
  },
  volverTexto: {
    color: COLOR_TINTA,
    fontSize: 14,
    fontWeight: "600",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLOR_TINTA,
    textAlign: "center",
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 13,
    color: COLOR_TINTA,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: COLOR_HOJA,
    color: "#fff",
    fontSize: 15,
    marginBottom: 12,
  },
  textarea: {
    width: "100%",
    minHeight: 90,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 18,
    backgroundColor: COLOR_HOJA,
    color: "#fff",
    fontSize: 15,
    marginBottom: 12,
    textAlignVertical: "top",
  },
  inputWrap: {
    position: "relative",
    justifyContent: "center",
  },
  inputPassword: {
    paddingRight: 48,
  },
  iconoOjo: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 12,
    justifyContent: "center",
  },
  iconoOjoTexto: {
    fontSize: 16,
  },
  opcionesFila: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  opcionBoton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  opcionBotonActiva: {
    backgroundColor: COLOR_HOJA,
  },
  opcionTexto: {
    color: COLOR_TINTA,
    fontSize: 13,
    fontWeight: "600",
  },
  opcionTextoActivo: {
    color: "#fff",
  },
  error: {
    color: "#d9534f",
    fontSize: 13,
    marginBottom: 8,
    textAlign: "center",
  },
  boton: {
    backgroundColor: COLOR_SOL,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  botonTexto: {
    color: COLOR_TINTA,
    fontWeight: "600",
    fontSize: 16,
  },
});

export default RegistroFormStyle;