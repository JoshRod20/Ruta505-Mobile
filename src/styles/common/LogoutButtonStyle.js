import { StyleSheet } from "react-native";

const COLOR_TINTA = "#2b2b2b";

const LogoutButtonStyle = StyleSheet.create({
  boton: {
    marginTop: 20,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: COLOR_TINTA,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  texto: {
    color: COLOR_TINTA,
    fontWeight: "600",
    fontSize: 14,
  },
});

export default LogoutButtonStyle;