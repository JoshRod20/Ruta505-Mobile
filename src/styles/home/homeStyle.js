/**
 * Estilos de homeStyle.
 */

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { StyleSheet } from "react-native";

export const VERDE = "#0E5A34";

export const homeStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // ---- Encabezado: logo + campana ----
  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  encabezadoIzquierda: {
    flexDirection: "row",
    alignItems: "center",
  },
  botonMenu: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -6,
    marginRight: 8,
  },
  logo: {
    width: "93%",
    height: 30,
    right: 80,
    marginLeft: wp("2.5%"),
  },
  botonCampana: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  // ---- Introducción ----
  intro: {
    fontFamily: "Poppins-Reg",
    fontSize: 13,
    color: "#000000",
    lineHeight: 20,
    paddingHorizontal: 24,
    marginTop: 18,
  },
  introResaltado: {
    fontFamily: "Inter-SemiBold",
    color: VERDE,
  },

  // ---- Botón Nueva publicación ----
  botonNueva: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    fontFamily: "Inter-SemiBold",
    backgroundColor: VERDE,
    borderRadius: 999,
    height: 40,
    paddingHorizontal: 18,
    marginLeft: 24,
    marginTop: 18,
  },
  botonNuevaTexto: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 8,
  },

  etiquetaNuevos: {
    fontFamily: "Poppins-SemiBold",
    fontSize: wp("3.5%"),
    color: VERDE,
    paddingHorizontal: 24,
    marginTop: 22,
    marginBottom: 10,
  },

  // ---- Aviso — perfil en revisión (modo explorar) ----
  avisoTarjeta: {
    marginTop: 16,
    marginHorizontal: 24,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#FFF4D6",
    borderWidth: 1,
    borderColor: "#E0B400",
  },
  avisoTexto: {
    color: "#7A5B00",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },

  // ---- Estados del feed ----
  feedEstadoContenedor: {
    alignItems: "center",
    paddingTop: 24,
  },
  feedEstadoTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#2e302f",
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
