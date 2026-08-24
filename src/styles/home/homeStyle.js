import { StyleSheet } from "react-native";

export const homeStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F7EF",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#23412E",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#5F7261",
    textAlign: "center",
    lineHeight: 22,
  },

  // ==================================================
  // AVISO — perfil en revisión (modo explorar)
  // ==================================================

  avisoTarjeta: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#FFF4D6",
    borderWidth: 1,
    borderColor: "#E0B400",
    maxWidth: 340,
  },
  avisoTexto: {
    color: "#7A5B00",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
});