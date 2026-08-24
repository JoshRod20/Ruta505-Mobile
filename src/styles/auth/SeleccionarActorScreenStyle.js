import { StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// ==================================================
// PALETA (igual que Login y SeleccionarTipo)
// ==================================================
const COLOR_HEADER = "#086338";
const COLOR_TINTA = "#065F33";

const SeleccionarActorScreenStyle = StyleSheet.create({
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
    height: 250,
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
    paddingHorizontal: "6%",
    paddingTop: "6%",
    paddingBottom: "6%",
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
    marginBottom: "8%",
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