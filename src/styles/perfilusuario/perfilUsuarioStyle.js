import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const COLOR_HEADER = "#086338";
const COLOR_TINTA = "#065F33";

export const perfilUsuarioStyle = StyleSheet.create({
  opcionBoton: {
    width: "100%",
    height: hp("6%"),
    borderRadius: hp("5%"),
    borderWidth: 1.8,
    borderColor: COLOR_TINTA,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    paddingHorizontal: 20,
  },

  opcionBotonTexto: {
    color: COLOR_HEADER,
    fontFamily: "Poppins-Bold",
    fontSize: 15,
  },
});

export default perfilUsuarioStyle;
