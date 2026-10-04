import { StyleSheet } from "react-native";

export const navigationTabsStyle = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
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
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    position: "absolute",
  },
  barColor: "#065F33",
  activeCircleColor: "#95C11F",
  activeTintColor: "#fff",
  inactiveTintColor: "rgba(255,255,255,0.85)",
});