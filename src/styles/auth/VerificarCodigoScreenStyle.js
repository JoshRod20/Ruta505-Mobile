import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const COLOR_HEADER = "#086338";
const COLOR_TINTA = "#065F33";

const VerificarCodigoScreenStyle = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },

  card: {
    paddingHorizontal: 28,
  },

  titulo: {
    color: COLOR_HEADER,
    fontSize: 26,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    marginBottom: 10,
  },

  subtitulo: {
    color: "#161515",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 26,
  },

  input: {
    width: "100%",
    height: 60,
    borderRadius: hp("1.5%"),
    backgroundColor: "#ffffff",
    borderWidth: 1.8,
    borderColor: COLOR_TINTA,
    color: COLOR_TINTA,
    fontSize: 24,
    textAlign: "center",
    letterSpacing: 6,
    marginBottom: 10,
  },

  error: {
    color: "#d9534f",
    fontSize: 13,
    fontFamily: "Inter-Regular",
    textAlign: "center",
    marginBottom: 8,
  },

  boton: {
    width: "100%",
    height: hp("6%"),
    backgroundColor: COLOR_TINTA,
    borderRadius: hp("5%"),
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
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

  enlaceWrap: {
    alignItems: "center",
    marginTop: 20,
  },

  enlace: {
    color: COLOR_HEADER,
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
});

export default VerificarCodigoScreenStyle;
