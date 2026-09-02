import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const COLOR_HEADER = "#086338";
const COLOR_TINTA = "#065F33";
const COLOR_PELIGRO = "#d9534f";

const ActivarDobleFactorStyle = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 28,
    paddingTop: 70,
    paddingBottom: 40,
  },

  titulo: {
    color: COLOR_HEADER,
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginBottom: 14,
  },

  subtitulo: {
    color: "#161515",
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 20,
    lineHeight: 20,
  },

  qrWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },

  claveManual: {
    color: "#4a4a4a",
    fontSize: 12,
    fontFamily: "Inter-Regular",
    textAlign: "center",
    marginBottom: 20,
  },

  claveManualTexto: {
    color: COLOR_TINTA,
    fontFamily: "Poppins-Bold",
    letterSpacing: 1,
  },

  input: {
    width: "100%",
    height: 60,
    borderRadius: hp("1.5%"),
    backgroundColor: "#ffffff",
    borderWidth: 1.8,
    borderColor: COLOR_TINTA,
    color: COLOR_TINTA,
    fontSize: 22,
    textAlign: "center",
    letterSpacing: 6,
    marginBottom: 10,
  },

  error: {
    color: COLOR_PELIGRO,
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

  botonPeligro: {
    backgroundColor: COLOR_PELIGRO,
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

export default ActivarDobleFactorStyle;
