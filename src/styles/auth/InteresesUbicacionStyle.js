import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const COLOR_HEADER = "#086338";
const COLOR_BORDE = "#0c8046";
const COLOR_NARANJA = "#f5a623";
const COLOR_TINTA = "#2b2b2b";
const COLOR_GRIS_CLARO = "#e2e2e2";

const InteresesUbicacionStyle = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 28,
  },

  barraProgreso: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 40,
  },

  segmentoProgreso: {
    flex: 1,
    height: 5,
    borderRadius: 999,
    backgroundColor: COLOR_GRIS_CLARO,
  },

  segmentoActivo: {
    backgroundColor: COLOR_HEADER,
  },

  titulo: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: COLOR_HEADER,
    textAlign: "center",
    marginBottom: hp("5%"),
    marginTop: hp("3%"),
    paddingHorizontal: 10,
  },

  listaIntereses: {
    paddingBottom: 20,
  },

  opcionFila: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  checkboxCirculo: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLOR_BORDE,
    marginRight: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxCirculoActivo: {
    backgroundColor: COLOR_HEADER,
    borderColor: COLOR_HEADER,
  },

  opcionTexto: {
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    color: COLOR_TINTA,
    flexShrink: 1,
  },

  centroContenido: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: hp("24%"),
  },

  imagenMapa: {
    width: 220,
    height: 220,
    borderRadius: 24,
    marginBottom: 24,
  },

  tituloUbicacion: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: COLOR_HEADER,
    textAlign: "center",
    marginBottom: hp("3%"),
  },

  subtituloUbicacion: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#5f5f5f",
    textAlign: "center",
    marginBottom: hp("5%"),
    paddingHorizontal: 10,
  },

  botonNaranja: {
    width: "60%",
    height: hp("6%"),
    backgroundColor: COLOR_NARANJA,
    borderRadius: hp("2.5%"),
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  botonNaranjaTexto: {
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },

  boton: {
    width: "60%",
    height: hp("6%"),
    backgroundColor: COLOR_HEADER,
    borderRadius: hp("2.5%"),
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    marginLeft: "20%",
    marginBottom: hp("12%"),
  },

  botonTexto: {
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },

  botonDeshabilitado: {
    opacity: 0.6,
  },

  error: {
    color: "#d9534f",
    fontSize: 13,
    fontFamily: "Inter-Regular",
    textAlign: "center",
    marginBottom: 12,
  },
});

export default InteresesUbicacionStyle;