import { StyleSheet, Dimensions } from "react-native";

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const { width, height } = Dimensions.get("window");

// ==================================================
// PALETA (exactamente la misma que LoginScreen)
// ==================================================
const COLOR_HEADER = "#086338";
const COLOR_AZUL = "#009fe3";
const COLOR_VERDE = "#95c11f";
const COLOR_TINTA = "#065F33";

const SeleccionarTipoScreenStyle = StyleSheet.create({
  // ==================================================
  // CONTENEDOR
  // ==================================================
  contenedor: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  // ==================================================
  // HEADER CON PATRÓN + CURVA
  // ==================================================
  header: {
    width: "100%",
    height: "35%",
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
  // CONTENEDOR DEL CONTENIDO
  // ==================================================
  scroll: {
    flex: 1,
    zIndex: 10,
  },

  card: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingTop: 24,
    alignItems: "center",
  },

  // ==================================================
  // TÍTULO
  // ==================================================
  titulo: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: COLOR_HEADER,
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 40,
  },

  // ==================================================
  // OPCIONES
  // ==================================================
  opcionesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 8,
  },

  opcion: {
    alignItems: "center",
    width: (width - 80) / 2,
  },

  imagenContainer: {
    width: 130,
    height: 130,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  imagen: {
    width: "100%",
    height: "100%",
  },

  opcionTitulo: {
    fontSize: 15,
    fontFamily: "Inter-Regular",
    color: COLOR_HEADER,
    textAlign: "center",
  },
});

export default SeleccionarTipoScreenStyle;