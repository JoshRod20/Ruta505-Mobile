// src/styles/onboarding/OnboardingStyle.js

import {
  Dimensions,
  StyleSheet,
} from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({

  // ==================================================
  // CONTENEDOR PRINCIPAL
  // ==================================================

  container: {
    flex: 1,

    position: "relative",

    backgroundColor: "#38BDF8",

    overflow: "hidden",
  },

  // ==================================================
  // CIELO
  // ==================================================

  sky: {
    flex: 1,

    position: "relative",

    overflow: "hidden",

    backgroundColor: "#38BDF8",
  },

  skyGrass: {
    backgroundColor: "#7DD3FC",
  },

  skySoil: {
    backgroundColor: "#7DD3FC",
  },

  // ==================================================
  // BOTÓN SALTAR
  // ==================================================

  skipButton: {
    position: "absolute",

    top: 45,
    right: 18,

    zIndex: 50,

    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  skipText: {
    fontFamily: "Inter-SemiBold",

    fontSize: 14,

    color: "rgba(255,255,255,0.9)",
  },

  // ==================================================
  // NUBES
  // ==================================================

  cloudLeft: {
    position: "absolute",

    top: 15,
    left: -5,

    width: width * 0.55,
    height: 100,

    zIndex: 5,
  },

  cloudRight: {
    position: "absolute",

    top: 110,
    right: -5,

    width: width * 0.42,
    height: 90,

    opacity: 0.8,

    zIndex: 5,
  },

  // ==================================================
  // TÍTULO
  // ==================================================

  titleContainer: {
    position: "absolute",

    top: 180,

    left: 24,
    right: 24,

    alignItems: "center",

    zIndex: 40,
  },

  title: {
    fontFamily: "Poppins-Bold",

    color: "#FFFFFF",

    fontSize: 23,
    lineHeight: 30,

    textAlign: "center",

    textShadowColor: "rgba(0,0,0,0.18)",

    textShadowOffset: {
      width: 0,
      height: 1,
    },

    textShadowRadius: 2,
  },

  subtitle: {
    marginTop: 9,

    maxWidth: 340,

    fontFamily: "Inter-Regular",

    color: "rgba(255,255,255,0.94)",

    fontSize: 14,
    lineHeight: 21,

    textAlign: "center",

    textShadowColor: "rgba(0,0,0,0.22)",

    textShadowOffset: {
      width: 0,
      height: 1,
    },

    textShadowRadius: 3,
  },

  // ==================================================
  // ILUSTRACIÓN GENERAL
  // ==================================================
  //
  // Esta capa queda DETRÁS del footer.
  //
  // Las imágenes que deben pasar por encima del footer
  // se renderizan fuera de esta capa.
  //

  illustration: {
    position: "absolute",

    left: 0,
    right: 0,

    top: 0,
    bottom: 0,

    zIndex: 10,

    pointerEvents: "none",
  },

  scene: {
    width: "100%",
    height: "100%",

    position: "relative",
  },

  // ==================================================
  // SLIDE 1
  // ==================================================

  welcomeBackground: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    width: "100%",
    height: "130%",
  },

  branch: {
    position: "absolute",

    bottom: "-1%",
    left: "-1%",

    width: "72%",
    height: "50%",

    zIndex: 10,
  },

  pinolito: {
    position: "absolute",

    bottom: "10%",
    left: "7%",

    width: "47%",
    height: "52%",

    zIndex: 20,
  },

  // ==================================================
  // SLIDE 2
  // CATEDRAL
  // ==================================================
  //
  // La Catedral queda detrás del footer.
  //

  catedral: {
    position: "absolute",

    bottom: "-6%",

    alignSelf: "center",

    width: "102%",
    height: "100%",

    zIndex: 10,
  },

  // ==================================================
  // SLIDE 2
  // BAILARINA SOBRE EL FOOTER
  // ==================================================

  bailarinaAboveFooter: {
    position: "absolute",

    bottom: "-1%",

    right: "10%",

    width: "47%",
    height: "58%",

    zIndex: 30,

    pointerEvents: "none",
  },

  // ==================================================
  // SLIDE 3
  // GIGANTONA SOBRE EL FOOTER
  // ==================================================

  gigantonaAboveFooter: {
    position: "absolute",

    bottom: "-9%",

    left: "-1%",

    width: "62%",
    height: "100%",

    zIndex: 30,

    pointerEvents: "none",
  },

  // ==================================================
  // SLIDE 4
  // FLORES SOBRE EL FOOTER
  // ==================================================

  flowerLeftAboveFooter: {
    position: "absolute",

    bottom: "10%",

    left: 0,

    width: "32%",
    height: "32%",

    zIndex: 30,

    pointerEvents: "none",
  },

  flowerRightAboveFooter: {
    position: "absolute",

    bottom: "-10%",

    right: 0,

    width: "22%",
    height: "32%",

    zIndex: 30,

    pointerEvents: "none",
  },

  // ==================================================
  // FOOTER
  // ==================================================

  footer: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    minHeight: height * 0.20,

    alignItems: "center",

    paddingHorizontal: 28,

    paddingTop: 16,

    paddingBottom: 25,

    zIndex: 20,

    backgroundColor: "transparent",
  },

  // ==================================================
  // FOOTER — SLIDE 2
  // ==================================================

  footerEsencia: {
    backgroundColor: "#7F6742",
  },

  // ==================================================
  // FOOTER — SLIDE 3
  // ==================================================

  footerComunidades: {
    backgroundColor: "#82AA18",
  },

  // ==================================================
  // FOOTER — SLIDE 4
  // ==================================================

  footerExperiencia: {
    backgroundColor: "#7F6742",
  },

  // ==================================================
  // INDICADORES
  // ==================================================

  dots: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 8,

    marginBottom: 18,
  },

  dot: {
    width: 8,
    height: 8,

    borderRadius: 999,

    backgroundColor: "rgba(255,255,255,0.5)",
  },

  dotActive: {
    width: 24,

    backgroundColor: "#FFFFFF",
  },

  // ==================================================
  // BOTÓN
  // ==================================================

  buttonWrapper: {
    width: "100%",

    alignItems: "center",
  },

  cta: {
    width: "100%",

    maxWidth: 320,

    height: 52,

    borderRadius: 999,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "#F5A623",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 6,
    },

    shadowOpacity: 0.18,

    shadowRadius: 10,

    elevation: 5,
  },

  ctaPressed: {
    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  ctaText: {
    fontFamily: "Inter-SemiBold",

    color: "#FFFFFF",

    fontSize: 15,

    textAlign: "center",
  },

});

export default styles;