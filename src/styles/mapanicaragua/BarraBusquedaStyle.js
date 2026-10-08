/**
 * Estilos de BarraBusquedaStyle.
 */

import { StyleSheet } from "react-native";

const VERDE = "#0E5A34";
const VERDE_CLARO = "#8CC219";

export const barraBusquedaStyle = StyleSheet.create({
  // Ocupa toda la pantalla pero deja pasar los toques al mapa (box-none)
  raiz: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
    elevation: 30,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contenedor: {
    position: "absolute",
    left: 30, // deja libre el botón del menú
    right: 30,
  },
  barra: {
    flexDirection: "row",
    alignItems: "center",
    height: 42,
    borderWidth: 1.5,
    borderColor: VERDE,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    height: "100%",
    marginLeft: 8,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#1F2A24",
    paddingVertical: 0,
  },
  botonLimpiar: {
    marginLeft: 6,
  },

  // ---- Resultados ----
  panel: {
    marginTop: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E1E8E3",
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 8,
    maxHeight: 360,
  },
  seccion: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
    color: VERDE,
    textTransform: "uppercase",
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 4,
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  filaIcono: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: VERDE_CLARO,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  filaTextos: {
    flex: 1,
  },
  filaTitulo: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: "#1F2A24",
  },
  filaDetalle: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: "#6B6B6B",
    marginTop: 1,
  },
  mensaje: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#6B6B6B",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  cargando: {
    paddingVertical: 12,
  },
});
