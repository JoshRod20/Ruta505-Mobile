import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export const navigationTabsStyle = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    height: hp("8%"),
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
    width: wp("14.5%"),
    height: wp("14.5%"),
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    position: "absolute",
    width: wp("14.5%"),
    height: wp("14.5%"),
    borderRadius: wp("14.5%") / 2,
  },
  barColor: "#065F33",
  activeCircleColor: "#95C11F",
  activeTintColor: "#fff",
  inactiveTintColor: "rgba(255,255,255,0.85)",
  sidePadding: wp("2%"), // espacio reservado a cada lado para que el notch nunca choque con la esquina
});