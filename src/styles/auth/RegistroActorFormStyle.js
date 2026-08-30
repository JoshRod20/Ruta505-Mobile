import { StyleSheet } from "react-native";

import {
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// ==================================================
// PALETA
// ==================================================

const COLOR_HEADER = "#086338";
const COLOR_BORDE = "#0c8046";
const COLOR_TINTA = "#2b2b2b";

const RegistroActorFormStyle = StyleSheet.create({

  // ==================================================
  // CONTENEDOR
  // ==================================================

  contenedor: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  // ==================================================
  // HEADER CON PATRÓN + CURVA SVG
  // IDÉNTICO A REGISTROTURISTASCREEN
  // ==================================================

  header: {
    width: "100%",
    height: "20%",
    marginTop: hp("3.6%"),
    position: "relative",
  },

  headerPatron: {
    width: "100%",
    height: "100%",
  },

  inputInvalido: {
  borderColor: "#d32f2f",
  borderWidth: 1,
},
errorCampo: {
  color: "#d32f2f",
  fontSize: 12,
  marginTop: -8,
  marginBottom: 8,
  marginLeft: 4,
},

  // ==================================================
  // BOTÓN VOLVER
  // ==================================================

  botonVolver: {
    position: "absolute",

    left: 20,

    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor: "#ffffff",

    alignItems: "center",
    justifyContent: "center",

    zIndex: 10,
  },

  // ==================================================
  // CURVA SVG
  // ==================================================

  curva: {
    position: "absolute",

    bottom: -1,
    left: 0,
  },

  // ==================================================
  // TÍTULO DE SECCIÓN
  // ==================================================

  titulo: {
    color: COLOR_HEADER,
        fontSize: 24,
        fontFamily: "Poppins-Bold",
        textAlign: "center",
        marginTop: hp("-1%"),
        marginBottom: hp("1%"),
  },

  // ==================================================
  // FORMULARIO
  // ==================================================

  scroll: {
    flex: 1,

    zIndex: 10,
  },

  card: {
    flexGrow: 1,

    width: "100%",

    backgroundColor: "#ffffff",

    paddingHorizontal: 28,

    paddingTop: 8,

    paddingBottom: 34,
  },

  // ==================================================
  // INPUTS
  // ==================================================

  input: {
    width: "100%",

    height: hp("6%"),

    paddingHorizontal: 22,

    paddingVertical: 0,

    borderRadius: hp("1.5%"),

    backgroundColor: "#ffffff",

    borderWidth: 1.8,

    borderColor: COLOR_BORDE,

    color: COLOR_TINTA,

    fontSize: 14,

    marginBottom: 16,
  },

  inputWrap: {
    width: "100%",

    position: "relative",

    justifyContent: "center",
  },

  inputPassword: {
    paddingRight: 58,
  },

  iconoOjo: {
    position: "absolute",

    right: 16,

    top: 0,

    bottom: 16,

    width: 34,

    alignItems: "center",

    justifyContent: "center",
  },

  // ==================================================
  // DROPDOWN
  // ==================================================

  dropdownInput: {
    width: "100%",

    height: hp("6%"),

    paddingHorizontal: 22,

    borderRadius: hp("1.5%"),

    backgroundColor: "#ffffff",

    borderWidth: 1.8,

    borderColor: COLOR_BORDE,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: 16,
  },

  dropdownTexto: {
    flex: 1,

    color: COLOR_TINTA,

    fontSize: 14,

    marginRight: 8,
  },

  dropdownPlaceholder: {
    color: "#a8a8a8",
  },

  // ==================================================
  // MODAL
  // ==================================================

  modalFondo: {
    flex: 1,

    backgroundColor: "rgba(0,0,0,0.4)",

    justifyContent: "flex-end",
  },

  modalFondoTouch: {
    ...StyleSheet.absoluteFillObject,
  },

  modalCaja: {
    width: "100%",

    maxHeight: "70%",

    backgroundColor: "#ffffff",

    borderTopLeftRadius: 24,

    borderTopRightRadius: 24,

    paddingTop: 20,

    paddingHorizontal: 20,

    paddingBottom: 16,
  },

  modalTitulo: {
    fontSize: 16,

    fontFamily: "Poppins-SemiBold",

    color: COLOR_HEADER,

    textAlign: "center",

    marginBottom: 16,
  },

  modalBusquedaWrap: {
    flexDirection: "row",

    alignItems: "center",

    borderWidth: 1.5,

    borderColor: COLOR_BORDE,

    borderRadius: 999,

    paddingHorizontal: 16,

    height: 46,

    marginBottom: 12,
  },

  modalBusquedaIcono: {
    marginRight: 8,
  },

  modalBusquedaInput: {
    flex: 1,

    fontSize: 14,

    color: COLOR_TINTA,

    padding: 0,
  },

  modalLista: {
    maxHeight: 320,
  },

  modalOpcion: {
    paddingVertical: 14,

    paddingHorizontal: 16,

    borderRadius: 999,

    marginBottom: 8,

    backgroundColor: "#f2f2f2",
  },

  modalOpcionActiva: {
    backgroundColor: COLOR_HEADER,
  },

  modalOpcionTexto: {
    fontSize: 14,

    fontFamily: "Poppins-Regular",

    color: COLOR_TINTA,
  },

  modalOpcionTextoActivo: {
    color: "#ffffff",

    fontFamily: "Poppins-SemiBold",
  },

  modalVacioTexto: {
    textAlign: "center",

    color: "#a8a8a8",

    fontSize: 13,

    fontFamily: "Poppins-Regular",

    paddingVertical: 20,
  },

  // ==================================================
  // ERROR
  // ==================================================

  error: {
    width: "100%",

    color: "#d9534f",

    fontSize: 13,

    fontFamily: "Inter-Regular",

    textAlign: "center",

    marginBottom: 12,
  },

  // ==================================================
  // BOTÓN
  // ==================================================

  boton: {
    width: "100%",

    height: hp("6%"),

    backgroundColor: COLOR_HEADER,

    borderRadius: hp("2.5%"),

    alignItems: "center",

    justifyContent: "center",

    elevation: 3,
  },

  botonDeshabilitado: {
    opacity: 0.6,
  },

  botonTexto: {
    color: "#ffffff",

    fontFamily: "Poppins-SemiBold",

    fontSize: 16,
  },
});

export default RegistroActorFormStyle;