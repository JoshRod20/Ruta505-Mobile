import { StyleSheet } from "react-native";

export const navigationTabsStyle = StyleSheet.create({
  tabBar: {
    backgroundColor: "#2E7D32",
    borderTopColor: "rgba(255,255,255,0.12)",
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  activeTintColor: "#fff",
  inactiveTintColor: "rgba(255,255,255,0.75)",
});