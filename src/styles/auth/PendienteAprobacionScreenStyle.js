import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const COLOR_CREMA = "#fbf6ec";
const COLOR_TINTA = "#2b2b2b";
const COLOR_ACCENTO = "#086338"; // verde de marca, consistente con el resto de la app

const PendienteAprobacionScreenStyle = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLOR_CREMA,
    padding: 24,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLOR_TINTA,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 14,
    color: COLOR_TINTA,
    opacity: 0.75,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  tarjeta: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  mensaje: {
    fontSize: 13,
    color: COLOR_TINTA,
    opacity: 0.85,
    lineHeight: 19,
    textAlign: "center",
  },

  // ==================================================
  // BOTONES (Explorar / Cerrar sesión)
  // ==================================================

  filaBotones: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
  },
  botonExplorar: {
    alignItems: "center",
    justifyContent: "center",
    width: wp("30%"),
    height: hp("5%"),
    borderRadius: 999,
    borderWidth: 1.8,
    borderColor: COLOR_ACCENTO,
    marginTop: hp("2%"),
    backgroundColor: "#ffffff",
  },
  botonExplorarTexto: {
    color: COLOR_ACCENTO,
    fontWeight: "600",
    fontSize: 14,
  },
});

export default PendienteAprobacionScreenStyle;