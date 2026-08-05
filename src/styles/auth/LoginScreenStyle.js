import { StyleSheet } from "react-native";

const COLOR_CREMA = "#fbf6ec";
const COLOR_HOJA = "#4caf50";
const COLOR_TINTA = "#2b2b2b";
const COLOR_SOL = "#f5a623";

const LoginScreenStyle = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLOR_CREMA,
    padding: 24,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 24,
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
    marginBottom: 24,
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
  enlace: {
    color: COLOR_TINTA,
    opacity: 0.7,
    fontSize: 13,
    marginBottom: 12,
  },
  error: {
    color: "#d9534f",
    fontSize: 13,
    marginBottom: 8,
    textAlign: "center",
  },
  exito: {
    color: COLOR_HOJA,
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
  registrarseWrap: {
    marginTop: 20,
    alignItems: "center",
  },
  registrarseTexto: {
    color: COLOR_TINTA,
    fontSize: 14,
  },
  registrarseEnlace: {
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default LoginScreenStyle;