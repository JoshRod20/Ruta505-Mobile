import { StyleSheet } from "react-native";
import { VERDE } from "../home/homeStyle";

export const pinolitoStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  cargando: { flex: 1, alignItems: "center", justifyContent: "center" },

  // ── Escena
  escena: { width: "100%", justifyContent: "flex-end", alignItems: "center" },
  suelo: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "26%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  pinolito: { marginBottom: 10 },
  capa: { position: "absolute", width: "100%", height: "100%" },

  botonAtras: {
    position: "absolute",
    left: 20,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  botonGuardar: {
    position: "absolute",
    right: 20,
    minWidth: 84,
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  botonGuardarInactivo: { opacity: 0.6 },
  botonGuardarTexto: {
    fontFamily: "Inter-SemiBold",
    fontSize: 13,
    color: VERDE,
  },

  // ── Pestañas
  tabs: {
    flexDirection: "row",
    backgroundColor: "#F3F3F3",
    paddingVertical: 14,
  },
  tab: { flex: 1, alignItems: "center", justifyContent: "center" },

  // ── Cuadrícula
  grilla: { paddingHorizontal: 22, paddingTop: 22 },
  fila: { gap: 12, marginBottom: 12 },
  celda: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
    padding: 6,
  },
  celdaBloqueada: { backgroundColor: "#F0F0F0" },
  celdaPuesta: { borderColor: VERDE, backgroundColor: "#EAF4EE" },
  celdaImagen: { width: "100%", height: "100%" },
  candadoCirculo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
});