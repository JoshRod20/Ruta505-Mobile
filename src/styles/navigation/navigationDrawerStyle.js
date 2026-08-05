import { StyleSheet } from "react-native";

// Estilos simples para el Drawer. Ajusta colores/tamaños cuando definas
// la identidad visual final de la app.
export const drawerStyle = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#2E7D32", // color base mientras no haya branding definitivo
    paddingTop: 40,
  },
  menuButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  logoContainer: {
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 8,
  },
  logo: {
    width: 110,
    height: 110,
    resizeMode: "contain",
  },
  drawerScroll: {
    paddingTop: 10,
  },
  drawerLabel: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  tabLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  logoutContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    marginTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 10,
  },
});