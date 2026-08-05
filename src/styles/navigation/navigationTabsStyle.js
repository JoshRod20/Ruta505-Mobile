import { StyleSheet } from "react-native";

export const navigationTabsStyle = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    height: 68,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
  },
  svgBackground: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  iconWrapper: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    position: "absolute",
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  barColor: "#F5A623",
  activeCircleColor: "#29B6E8",
  activeTintColor: "#fff",
  inactiveTintColor: "rgba(255,255,255,0.85)",
  sidePadding: 2, // espacio reservado a cada lado para que el notch nunca choque con la esquina
});