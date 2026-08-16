import { StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// ==================================================
// PALETA (igual que Login y SeleccionarTipo)
// ==================================================
const COLOR_HEADER = "#086338";
const COLOR_AZUL = "#009fe3";
const COLOR_VERDE = "#95c11f";
const COLOR_TINTA = "#2b2b2b";

const SeleccionarActorScreenStyle = StyleSheet.create({
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
    height: "32%",
    backgroundColor: COLOR_HEADER,
  },

  // ==================================================
  // TARJETA BLANCA
  // ==================================================
  card: {
    flex: 1,
    marginTop: "22%",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: "6%",
    paddingTop: "5%",
    alignItems: "center",
  },

  // ==================================================
  // SWITCHER
  // ==================================================
  switcherWrap: {
    height: "7%",
    width: "68%",
    maxWidth: "100%",
    alignSelf: "center",
    flexDirection: "row",
    position: "relative",
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: COLOR_AZUL,
    marginTop: "7%",
    marginBottom: "12%",
  },

  switcherIndicator: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: COLOR_VERDE,
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
    fontFamily: "Poppins-Bold",
    color: COLOR_HEADER,
    textAlign: "center",
    lineHeight: 32,
    marginBottom: "6%",
  },

  // ==================================================
  // GRID 2x2
  // ==================================================
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: "2%",
  },

  opcion: {
    width: "46%",
    alignItems: "center",
    marginBottom: "6%",
  },

  imagenContainer: {
    width: "100%",
    aspectRatio: 1,
    maxWidth: "100%",
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "6%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  imagen: {
    width: "100%",
    height: "100%",
  },

  opcionTitulo: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: COLOR_HEADER,
    textAlign: "center",
    lineHeight: 18,
  },
});

export default SeleccionarActorScreenStyle;