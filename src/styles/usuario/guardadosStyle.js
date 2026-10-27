/**
 * Estilos de guardadosStyle: pantalla de publicaciones guardadas.
 */

import { StyleSheet } from "react-native";

export const guardadosStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  botonAtras: {
    width: 32,
    height: 32,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  titulo: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#086338",
  },
  vacio: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  vacioTitulo: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#086338",
    marginTop: 12,
  },
  vacioTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    lineHeight: 19,
    color: "#6B6B6B",
    textAlign: "center",
    marginTop: 6,
  },
});
