import { StyleSheet } from "react-native";

const COLOR_HEADER = "#086338";
const COLOR_TINTA = "#2b2b2b";

const WelcomeScreenStyle = StyleSheet.create({

  contenedor: {
    flex: 1,

    backgroundColor: "#ffffff",

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 32,
  },

  logo: {
    width: 220,
    height: 140,
    marginBottom: 60,
  },

  boton: {
    width: "100%",
    height: 52,

    backgroundColor: COLOR_HEADER,

    borderRadius: 999,

    alignItems: "center",
    justifyContent: "center",

    elevation: 3,
  },

  botonTexto: {
    color: "#ffffff",
    fontFamily: "Poppins-Bold",
    fontSize: 16,
  },

  enlaceWrap: {
    marginTop: 18,
  },

  enlaceTexto: {
    color: COLOR_TINTA,
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },

});

export default WelcomeScreenStyle;