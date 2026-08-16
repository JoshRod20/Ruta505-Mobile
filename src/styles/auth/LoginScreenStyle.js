import { StyleSheet } from "react-native";

// ==================================================
// PALETA
// ==================================================

const COLOR_FONDO = "#ffffff";
const COLOR_HEADER = "#086338";
const COLOR_AZUL = "#009fe3";
const COLOR_VERDE = "#95c11f";
const COLOR_NARANJA = "#f39200";
const COLOR_TINTA = "#2b2b2b";

const LoginScreenStyle = StyleSheet.create({

  // ==================================================
  // CONTENEDOR
  // ==================================================

  contenedor: {
    flex: 1,

    backgroundColor: "#ffffff",
  },

  // ==================================================
  // HEADER VERDE
  // ==================================================

  header: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,

    height: 250,

    backgroundColor: COLOR_HEADER,
  },

  // ==================================================
  // CONTENEDOR DE LA TARJETA
  // ==================================================

  scroll: {
    flex: 1,

    marginTop: 170,

    zIndex: 10,
  },

  // ==================================================
  // TARJETA BLANCA
  // ==================================================

  card: {
    flexGrow: 1,

    width: "100%",

    backgroundColor: "#ffffff",

    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,

    paddingHorizontal: 24,

    paddingTop: 40,
    paddingBottom: 30,

    minHeight: 650,
  },

  // ==================================================
  // SWITCHER
  // ==================================================

  switcherWrap: {
    height: "9%",

    alignSelf: "center",

    flexDirection: "row",

    position: "relative",

    borderRadius: 999,

    overflow: "hidden",

    backgroundColor: COLOR_AZUL,

    marginBottom: 32,
  },

  // ==================================================
  // INDICADOR VERDE ANIMADO
  // ==================================================

  switcherIndicator: {
    position: "absolute",

    top: 0,
    bottom: 0,
    left: 0,

    backgroundColor: COLOR_VERDE,

    borderRadius: 999,

    zIndex: 1,
  },

  // ==================================================
  // BOTONES DEL SWITCHER
  // ==================================================

  switcherBtn: {
    flex: 1,

    height: "100%",

    alignItems: "center",
    justifyContent: "center",

    zIndex: 2,
  },

  switcherTexto: {
    color: "#ffffff",

    fontSize: 13,

    fontFamily: "Poppins-SemiBold",
  },

  // ==================================================
  // INPUTS
  // ==================================================

  input: {
    width: "100%",

    height: 45,

    paddingHorizontal: 20,

    paddingVertical: 0,

    borderRadius: 999,

    backgroundColor: "#ffffff",

    borderWidth: 1.8,

    borderColor: COLOR_VERDE,

    color: COLOR_TINTA,

    fontSize: 13,

      

    marginBottom: 14,
  },

  // ==================================================
  // CONTENEDOR PASSWORD
  // ==================================================

  inputWrap: {
    width: "100%",

    position: "relative",

    justifyContent: "center",
  },

  inputPassword: {
    paddingRight: 55,
  },

  // ==================================================
  // ICONO PASSWORD
  // ==================================================

  iconoOjo: {
    position: "absolute",

    right: 15,

    top: 0,

    bottom: 14,

    width: 32,

    alignItems: "center",
    justifyContent: "center",
  },

  // ==================================================
  // OLVIDÉ MI CONTRASEÑA
  // ==================================================

  enlaceWrap: {
    width: "100%",

    alignItems: "flex-end",

    marginTop: 2,

    marginBottom: 7,
  },

  enlace: {
    color: COLOR_NARANJA,

    fontSize: 12,

    fontFamily: "Inter-Regular",
  },

  // ==================================================
  // MENSAJES
  // ==================================================

  error: {
    width: "100%",

    color: "#d9534f",

    fontSize: 13,

    fontFamily: "Inter-Regular",

    textAlign: "center",

    marginTop: 8,
  },

  exito: {
    width: "100%",

    color: COLOR_VERDE,

    fontSize: 13,

    textAlign: "center",

    marginTop: 8,
  },

  // ==================================================
  // BOTÓN LOGIN
  // ==================================================

  boton: {
    width: "50%",

    height: "7%",

    alignSelf: "center",

    backgroundColor: COLOR_NARANJA,

    borderRadius: 999,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 21,

    elevation: 3,
  },

  botonDeshabilitado: {
    opacity: 0.6,
  },

  botonTexto: {
    color: "#ffffff",

    fontFamily: "Poppins-SemiBold",

    fontSize: 15,
  },

  // ==================================================
  // DIVISOR
  // ==================================================

  dividerWrap: {
    width: "100%",

    flexDirection: "row",

    alignItems: "center",

    marginTop: 29,

    marginBottom: 1,
  },

  dividerLinea: {
    flex: 1,

    height: 1,

    backgroundColor: "#acabab",
  },

  dividerTexto: {
    marginHorizontal: 10,

    color: "#065F33",

    fontSize: 12,

    fontFamily: "Inter-Regular",
  },

  // ==================================================
  // REDES SOCIALES
  // ==================================================

  socialRow: {
    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    gap: 16,

    marginBottom: 20,
  },

  socialCircle: {
    width: "10%",

    height: "31.5%",

    borderRadius: 18,

    alignItems: "center",

    justifyContent: "center",

    borderWidth: 1,

    borderColor: "#ececec",
  },

  // ==================================================
  // REGISTRO INFERIOR
  // ==================================================

  registrarseWrap: {
    alignItems: "center",
  },

  registrarseTexto: {
    color: COLOR_HEADER,

    fontFamily: "Inter-Regular",

    fontSize: 12,
  },

  registrarseEnlace: {
    color: COLOR_NARANJA,

    fontFamily: "Inter-Regular",
  },

});

export default LoginScreenStyle;