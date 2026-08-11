import {
  Dimensions,
  StyleSheet,
} from "react-native";

const {
  width,
  height,
} = Dimensions.get("window");

const styles = StyleSheet.create({
  // ==================================================
  // DIMENSIONES
  // ==================================================

  screenWidth: width,

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
  // CARRUSEL
  // ==================================================

  slidesContainer: {
    flexDirection: "row",

    width: width * 4,

    height: "100%",
  },

  // ==================================================
  // SLIDE
  // ==================================================

  slide: {
    width: width,

    height: "100%",

    position: "relative",

    overflow: "hidden",

    flexShrink: 0,
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

  // ==================================================
  // BOTÓN SALTAR
  // ==================================================

  skipButton: {
    position: "absolute",

    top: 45,
    right: 18,

    zIndex: 100,

    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  skipText: {
    fontFamily: "Inter-SemiBold",

    fontSize: 14,

    color:
      "rgba(255,255,255,0.9)",
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

    pointerEvents: "none",
  },

  cloudRight: {
    position: "absolute",

    top: 110,
    right: -5,

    width: width * 0.42,
    height: 90,

    opacity: 0.8,

    zIndex: 5,

    pointerEvents: "none",
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

    pointerEvents: "none",
  },

  title: {
    fontFamily: "Poppins-Bold",

    color: "#FFFFFF",

    fontSize: 23,

    lineHeight: 30,

    textAlign: "center",

    textShadowColor:
      "rgba(0,0,0,0.18)",

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

    color:
      "rgba(255,255,255,0.94)",

    fontSize: 14,

    lineHeight: 21,

    textAlign: "center",

    textShadowColor:
      "rgba(0,0,0,0.22)",

    textShadowOffset: {
      width: 0,
      height: 1,
    },

    textShadowRadius: 3,
  },

  // ==================================================
  // CAPA DE ILUSTRACIONES
  // ESTA CAPA ESTÁ SOBRE EL FOOTER
  // ==================================================

  illustrationLayer: {
    position: "absolute",

    left: 0,
    right: 0,

    top: 0,
    bottom: 0,

    zIndex: 30,

    pointerEvents: "none",
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

    zIndex: 1,
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
  // BAILARINA
  // ==================================================

  bailarinaAboveFooter: {
    position: "absolute",

    bottom: "-3%",

    right: "6%",

    width: "50%",
    height: "58%",

    zIndex: 30,

    pointerEvents: "none",
  },

  // ==================================================
  // SLIDE 3
  // GIGANTONA
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
  // FLOR IZQUIERDA
  // ==================================================

  flowerLeftAboveFooter: {
    position: "absolute",

    bottom: "8%",

    left: 0,

    width: "32%",
    height: "32%",

    zIndex: 30,

    pointerEvents: "none",
  },

  // ==================================================
  // SLIDE 4
  // FLOR DERECHA
  // AHORA TAMBIÉN EN LA ESQUINA INFERIOR IZQUIERDA
  // ==================================================

  flowerRightAboveFooter: {
    position: "absolute",

    bottom: "-9%",

    left: "78%",

    width: "22%",
    height: "32%",

    zIndex: 31,

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

    zIndex: 20,

    backgroundColor:
      "transparent",
  },

  // ==================================================
  // FOOTER SLIDE 2
  // ==================================================

  footerEsencia: {
    backgroundColor: "#7F6742",
  },

  // ==================================================
  // FOOTER SLIDE 3
  // ==================================================

  footerComunidades: {
    backgroundColor: "#82AA18",
  },

  // ==================================================
  // FOOTER SLIDE 4
  // ==================================================

  footerExperiencia: {
    backgroundColor: "#7F6742",
  },

  // ==================================================
  // CONTROLES DEL FOOTER
  // SIEMPRE SOBRE EL FOOTER
  // ==================================================

  footerControls: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    minHeight: height * 0.20,

    alignItems: "center",

    paddingHorizontal: 28,

    paddingTop: 16,

    paddingBottom: 25,

    zIndex: 50,
  },

  // ==================================================
  // DOTS
  // ==================================================

  dots: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 8,

    marginBottom: 10,
  },

  dot: {
    width: 8,

    height: 8,

    borderRadius: 999,

    backgroundColor:
      "rgba(255,255,255,0.5)",
  },

  dotActive: {
    width: 24,

    backgroundColor: "#FFFFFF",
  },

  // ==================================================
  // INDICADOR DESLIZAR
  // DEBAJO DE LOS DOTS
  // ==================================================

  swipeHint: {
    width: "100%",

    height: 34,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    marginBottom: 2,

    zIndex: 50,

    pointerEvents: "none",
  },

  swipeHintArrow: {
    fontFamily: "Inter-SemiBold",

    fontSize: 24,

    lineHeight: 28,

    color: "#FFFFFF",

    marginRight: 7,

    textShadowColor:
      "rgba(0,0,0,0.20)",

    textShadowOffset: {
      width: 0,
      height: 1,
    },

    textShadowRadius: 2,
  },

  swipeHintText: {
    fontFamily: "Inter-SemiBold",

    fontSize: 13,

    color: "#FFFFFF",

    textAlign: "center",

    textShadowColor:
      "rgba(0,0,0,0.20)",

    textShadowOffset: {
      width: 0,
      height: 1,
    },

    textShadowRadius: 2,
  },

  // ==================================================
  // BOTÓN FINAL
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