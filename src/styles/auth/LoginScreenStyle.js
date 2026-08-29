import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { StyleSheet } from "react-native";

// ==================================================
// PALETA
// ==================================================

const COLOR_HEADER = "#086338";
const COLOR_BORDE = "#0c8046";
const COLOR_NARANJA = "#f39200";
const COLOR_TINTA = "#065F33";

const LoginScreenStyle = StyleSheet.create({

  // ==================================================
  // CONTENEDOR
  // ==================================================

  contenedor: {
    flex: 1,

    backgroundColor: "#ffffff",
  },

  // ==================================================
  // HEADER CON PATRÓN
  // ==================================================

  header: {
    width: "100%",

    height: 290,

    marginTop: hp("3.4%"),

    position: "relative",
  },

  headerPatron: {
    width: "100%",
    height: "100%",
  },

  botonVolver: {
    position: "absolute",

    left: 20,

    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor: "rgb(255, 255, 255)",

    alignItems: "center",
    justifyContent: "center",
  },

  curva: {
    position: "absolute",

    bottom: -1,
    left: 0,
  },

  // ==================================================
  // CONTENEDOR DEL FORMULARIO
  // ==================================================

  scroll: {
    flex: 1,

    zIndex: 10,
  },

  card: {
    flexGrow: 1,

    width: "100%",

    backgroundColor: "#ffffff",

    paddingHorizontal: 28,

    paddingTop: 16,
    paddingBottom: 34,
  },

  // ==================================================
  // TÍTULO
  // ==================================================

  titulo: {
    color: COLOR_HEADER,

    fontSize: 32,

    alignSelf: "center",

    fontFamily: "Poppins-Bold",

    marginBottom: 6,
  },

  subtitulo: {
    color: "#161515",

    fontSize: 13,
    
    alignSelf: "center",

    fontFamily: "Poppins-SemiBold",

    marginBottom: 30,
  },

  subtituloNegrita: {
    color: COLOR_TINTA,

    fontFamily: "Poppins-Bold",
  },

  // ==================================================
  // INPUTS
  // ==================================================

  input: {
    width: "100%",

    height: 54,

    paddingHorizontal: 22,

    paddingVertical: 0,

    borderRadius: hp("1.5%"),

    backgroundColor: "#ffffff",

    borderWidth: 1.8,

    borderColor: COLOR_TINTA,

    color: COLOR_TINTA,

    fontSize: 14,

    marginBottom: 18,
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
    paddingRight: 58,
  },

  // ==================================================
  // ICONO PASSWORD
  // ==================================================

  iconoOjo: {
    position: "absolute",

    right: 16,

    top: 0,

    bottom: 18,

    width: 34,

    alignItems: "center",
    justifyContent: "center",
  },

  // ==================================================
  // OLVIDÉ MI CONTRASEÑA
  // ==================================================

  enlaceWrap: {
    width: "100%",

    alignItems: "flex-end",

    marginTop: "-1.5%",

    marginBottom: 9,
  },

  enlace: {
    color: COLOR_HEADER,

    fontSize: 13,

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

    color: COLOR_HEADER,

    fontSize: 13,

    textAlign: "center",

    marginTop: 8,
  },

  // ==================================================
  // BOTÓN LOGIN
  // ==================================================

  boton: {
    width: "100%",

    height: hp("6%"),

    backgroundColor: COLOR_TINTA,

    borderRadius: hp("5%"),

    alignItems: "center",
    justifyContent: "center",

    marginTop: 26,

    elevation: 3,
  },

  botonDeshabilitado: {
    opacity: 0.6,
  },

  botonTexto: {
    color: "#ffffff",

    fontFamily: "Poppins-Bold",

    fontSize: 16,
  },

  // ==================================================
  // REGISTRO INFERIOR
  // ==================================================

  registrarseWrap: {
    alignItems: "center",

    marginTop: 28,
  },

  registrarseTexto: {
    color: COLOR_TINTA,

    fontFamily: "Poppins-SemiBold",

    fontSize: 15,
  },

  registrarseEnlace: {
    color: COLOR_HEADER,

    fontFamily: "Poppins-SemiBold",
  },

});

export default LoginScreenStyle;