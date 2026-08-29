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

    backgroundColor: "#1E97E8",

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

    backgroundColor: "#1E97E8",
  },

  // ==================================================
  // FONDO DE CIELO (imagen degradada)
  // ==================================================

  skyBackground: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    width: "100%",
    height: "100%",

    zIndex: 1,
  },

  // ==================================================
  // BOTÓN SALTAR
  // ==================================================

  skipButton: {
    position: "absolute",

    top: 45,
    right: 18,

    zIndex: 100,

    paddingHorizontal: 14,
    paddingVertical: 8,

    alignItems: "center",
    justifyContent: "center",
  },

  skipText: {
    fontFamily: "Inter-SemiBold",

    fontSize: 14,

    color:
      "rgba(255,255,255,0.9)",

    flexShrink: 0,

    includeFontPadding: false,
  },

  // ==================================================
  // NUBES
  // ==================================================

  cloudTopLeft: {
    position: "absolute",

    top: "0%",
    left: "-8%",

    width: "68%",
    height: "18%",

    zIndex: 5,

    pointerEvents: "none",
  },

  cloudTopRight: {
    position: "absolute",

    top: "3%",
    right: "-8%",

    width: "68%",
    height: "18%",

    zIndex: 5,

    transform: [
      { scaleX: -1 },
    ],

    pointerEvents: "none",
  },

  cloudMidRight: {
    position: "absolute",

    top: "31%",
    right: "-10%",

    width: "50%",
    height: "9%",

    opacity: 0.92,

    zIndex: 5,

    transform: [
      { scaleX: -1 },
    ],

    pointerEvents: "none",
  },

  cloudLowerLeft: {
    position: "absolute",

    top: "35%",
    left: "-12%",

    width: "50%",
    height: "9%",

    opacity: 0.85,

    zIndex: 5,

    pointerEvents: "none",
  },

  // ==================================================
  // TÍTULO
  // ==================================================

  titleContainer: {
    position: "absolute",

    top: 135,

    left: 24,
    right: 24,

    alignItems: "center",

    zIndex: 40,

    pointerEvents: "none",
  },

  title: {
    fontFamily: "Poppins-Bold",

    color: "#FFFFFF",

    fontSize: 35,

    lineHeight: 48,

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
  // PINOLITO — SLIDE 1: BIENVENIDA
  // ==================================================

  pinolitoBienvenida: {
    position: "absolute",

    bottom: "0.4%",

    alignSelf: "center",

    width: "84%",
    height: "68%",

    marginLeft: "10%",

    zIndex: 30,
  },

  // ==================================================
  // PINOLITO — SLIDE 2: ESENCIA
  // ==================================================

  pinolitoEsencia: {
    position: "absolute",

    bottom: "3%",

    alignSelf: "center",

    width: "84%",
    height: "68%",

    marginRight: "10%",

    zIndex: 30,
  },

  // ==================================================
  // PINOLITO — SLIDE 3: COMUNIDADES
  // (lleva íconos flotando arriba, necesita otra posición)
  // ==================================================

  pinolitoComunidades: {
    position: "absolute",

    bottom: "7.5%",

    alignSelf: "center",

    width: "84%",
    height: "68%",

    marginLeft: "10%",

    zIndex: 30,
  },

  // ==================================================
  // PINOLITO — SLIDE 4: EXPERIENCIA
  // ==================================================

  pinolitoExperiencia: {
    position: "absolute",

    bottom: "1%",

    alignSelf: "center",

    width: "84%",
    height: "68%",

    marginRight: "3%",

    zIndex: 30,
  },

  // ==================================================
  // FOOTER / SUELO
  // MISMO VERDE EN LAS 4 PANTALLAS
  // ==================================================

  footer: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    minHeight: height * 0.20,

    zIndex: 20,

    backgroundColor: "#82AA18",
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

    marginTop: "7%",

    marginBottom: "5%",
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

    maxWidth: "50%",

    height: 52,

    borderRadius: 999,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "#065F33",

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