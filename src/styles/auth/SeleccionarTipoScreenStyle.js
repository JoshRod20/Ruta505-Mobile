import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// ==================================================
// PALETA (exactamente la misma que LoginScreen)
// ==================================================
const COLOR_HEADER = "#086338";
const COLOR_AZUL = "#009fe3";
const COLOR_VERDE = "#95c11f";
const COLOR_TINTA = "#2b2b2b";

const SeleccionarTipoScreenStyle = StyleSheet.create({
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
  // TARJETA BLANCA
  // ==================================================
  card: {
    flex: 1,
    marginTop: 170,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: "center",
  },

  // ==================================================
  // SWITCHER (idéntico a LoginScreen)
  // ==================================================
  switcherWrap: {
    height: "9%",
    alignSelf: "center",
    flexDirection: "row",
    position: "relative",
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: COLOR_AZUL, // fondo azul
    marginBottom: 40,
  },

  switcherIndicator: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: COLOR_VERDE, // pastilla verde
    borderRadius: 999,
    zIndex: 1,
  },

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
  // TÍTULO
  // ==================================================
  titulo: {
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
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