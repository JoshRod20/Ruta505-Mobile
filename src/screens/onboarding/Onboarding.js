// src/pages/turista/Onboarding.js

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  Image,
  Pressable,
  Animated,
  Easing,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import styles from "../../styles/onboarding/OnboardingStyle";

import {
  completeOnboarding,
} from "../../utils/onboardingStorage";

// ==================================================
// IMÁGENES
// ==================================================

import pinolito from "../../assets/images/pinolito.png";
import rama from "../../assets/images/rama-pinolito.png";
import escenaBienvenida from "../../assets/images/escena-bienvenida.png";

import catedral from "../../assets/images/catedral.png";
import bailarina from "../../assets/images/bailarina.png";

import gigantona from "../../assets/images/gigantona.png";

import nube1 from "../../assets/images/nube-3.png";
import nube2 from "../../assets/images/nube-4.png";

import flor1 from "../../assets/images/flor-1.png";
import flor2 from "../../assets/images/flor-2.png";


// SLIDES
const SLIDES = [
  {
    id: "bienvenida",

    title: "Bienvenid@ a Ruta 505",

    subtitle:
      "Explora la cultura viva de Nicaragua junto a Pinolito, tu guía virtual.",

    cta: "Siguiente",

    ground: "sky",
  },

  {
    id: "esencia",

    title: "Descubre la esencia de Nicaragua",

    cta: "Siguiente",

    ground: "grass",
  },

  {
    id: "comunidades",

    title: "Conecta con comunidades auténticas",

    cta: "Siguiente",

    ground: "grass",
  },

  {
    id: "experiencia",

    title: "Tu próxima experiencia comienza aquí",

    cta: "Comenzar",

    ground: "soil",
  },
];


const Onboarding = () => {

  const navigation = useNavigation();

  const [step, setStep] = useState(0);

  const slide = SLIDES[step];

  const isLast =
    step === SLIDES.length - 1;


  // ANIMACIONES
  const fadeAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const translateYAnim =
    useRef(
      new Animated.Value(20)
    ).current;

  const illustrationAnim =
    useRef(
      new Animated.Value(0.85)
    ).current;

  const buttonScale =
    useRef(
      new Animated.Value(1)
    ).current;



  // ANIMACIÓN DE ENTRADA
  const animateSlide = () => {

    fadeAnim.setValue(0);

    translateYAnim.setValue(20);

    illustrationAnim.setValue(0.85);

    Animated.parallel([

      Animated.timing(
        fadeAnim,
        {
          toValue: 1,

          duration: 500,

          easing:
            Easing.out(
              Easing.ease
            ),

          useNativeDriver: true,
        }
      ),

      Animated.timing(
        translateYAnim,
        {
          toValue: 0,

          duration: 500,

          easing:
            Easing.out(
              Easing.ease
            ),

          useNativeDriver: true,
        }
      ),

      Animated.spring(
        illustrationAnim,
        {
          toValue: 1,

          friction: 7,

          tension: 50,

          useNativeDriver: true,
        }
      ),

    ]).start();
  };


  useEffect(() => {

    animateSlide();

  }, [step]);


  // ==================================================
  // ANIMACIÓN DEL BOTÓN
  // ==================================================

  useEffect(() => {

    const pulse =
      Animated.loop(

        Animated.sequence([

          Animated.timing(
            buttonScale,
            {
              toValue: 1.04,

              duration: 1000,

              easing:
                Easing.inOut(
                  Easing.ease
                ),

              useNativeDriver: true,
            }
          ),

          Animated.timing(
            buttonScale,
            {
              toValue: 1,

              duration: 1000,

              easing:
                Easing.inOut(
                  Easing.ease
                ),

              useNativeDriver: true,
            }
          ),

        ])
      );

    pulse.start();

    return () => {
      pulse.stop();
    };

  }, []);


  // ==================================================
  // FINALIZAR ONBOARDING
  // ==================================================

  const finish = async () => {

    try {

      await completeOnboarding();

      navigation.replace("Login");

    } catch (error) {

      console.error(
        "Error completando onboarding:",
        error
      );

      navigation.replace("Login");
    }
  };


  // ==================================================
  // SALTAR
  // ==================================================

  const skip = async () => {

    try {

      await completeOnboarding();

      navigation.replace("Login");

    } catch (error) {

      console.error(
        "Error guardando onboarding:",
        error
      );

      navigation.replace("Login");
    }
  };


  // ==================================================
  // SIGUIENTE
  // ==================================================

  const handleNext = () => {

    if (isLast) {

      finish();

      return;
    }

    setStep(
      (current) =>
        current + 1
    );
  };


  // ==================================================
  // ILUSTRACIONES QUE VAN DETRÁS
  // ==================================================

  const renderIllustration = () => {

    switch (slide.id) {

      // ==============================================
      // SLIDE 1
      // ==============================================

      case "bienvenida":

        return (
          <View style={styles.scene}>

            <Image
              source={escenaBienvenida}
              style={
                styles.welcomeBackground
              }
              resizeMode="cover"
            />

            <Image
              source={rama}
              style={styles.branch}
              resizeMode="contain"
            />

            <Image
              source={pinolito}
              style={
                styles.pinolito
              }
              resizeMode="contain"
            />

          </View>
        );


      // ==============================================
      // SLIDE 2
      // ==============================================

      case "esencia":

        return (
          <View style={styles.scene}>

            <Image
              source={catedral}
              style={styles.catedral}
              resizeMode="contain"
            />

          </View>
        );


      // ==============================================
      // SLIDE 3
      // ==============================================

      case "comunidades":

        return (
          <View style={styles.scene} />
        );


      // ==============================================
      // SLIDE 4
      // ==============================================

      case "experiencia":

        return (
          <View style={styles.scene} />
        );


      default:

        return null;
    }
  };


  // ==================================================
  // IMÁGENES SOBRE EL FOOTER
  // ==================================================

  const renderAboveFooterIllustration = () => {

    switch (slide.id) {

      // ==============================================
      // SLIDE 2 — BAILARINA
      // ==============================================

      case "esencia":

        return (
          <Animated.Image
            source={bailarina}

            style={[
              styles.bailarinaAboveFooter,

              {
                opacity: fadeAnim,

                transform: [
                  {
                    scale:
                      illustrationAnim,
                  },
                ],
              },
            ]}

            resizeMode="contain"
          />
        );


      // ==============================================
      // SLIDE 3 — GIGANTONA
      // ==============================================

      case "comunidades":

        return (
          <Animated.Image
            source={gigantona}

            style={[
              styles.gigantonaAboveFooter,

              {
                opacity: fadeAnim,

                transform: [
                  {
                    scale:
                      illustrationAnim,
                  },
                ],
              },
            ]}

            resizeMode="contain"
          />
        );


      // ==============================================
      // SLIDE 4 — FLORES
      // ==============================================

      case "experiencia":

        return (
          <>
            <Animated.Image
              source={flor1}

              style={[
                styles.flowerLeftAboveFooter,

                {
                  opacity: fadeAnim,

                  transform: [
                    {
                      scale:
                        illustrationAnim,
                    },
                  ],
                },
              ]}

              resizeMode="contain"
            />

            <Animated.Image
              source={flor2}

              style={[
                styles.flowerRightAboveFooter,

                {
                  opacity: fadeAnim,

                  transform: [
                    {
                      scale:
                        illustrationAnim,
                    },
                  ],
                },
              ]}

              resizeMode="contain"
            />
          </>
        );


      default:

        return null;
    }
  };


  // ==================================================
  // RENDER
  // ==================================================

  return (
    <View
      style={styles.container}
    >

      {/* ==================================================
          ESCENA PRINCIPAL
          ================================================== */}

      <View
        style={[
          styles.sky,

          slide.ground === "grass" &&
            styles.skyGrass,

          slide.ground === "soil" &&
            styles.skySoil,
        ]}
      >

        {/* ==============================================
            NUBE IZQUIERDA
            ============================================== */}

        <Animated.Image
          source={nube1}

          style={[
            styles.cloudLeft,

            {
              opacity: fadeAnim,
            },
          ]}

          resizeMode="contain"
        />


        {/* ==============================================
            NUBE DERECHA
            ============================================== */}

        <Animated.Image
          source={nube2}

          style={[
            styles.cloudRight,

            {
              opacity: fadeAnim,
            },
          ]}

          resizeMode="contain"
        />


        {/* ==============================================
            BOTÓN SALTAR
            ============================================== */}

        <Pressable
          onPress={skip}

          style={
            styles.skipButton
          }

          android_ripple={{
            color:
              "rgba(255,255,255,0.15)",
          }}
        >

          <Text
            style={
              styles.skipText
            }
          >
            Saltar
          </Text>

        </Pressable>


        {/* ==============================================
            TÍTULO
            ============================================== */}

        <Animated.View
          style={[
            styles.titleContainer,

            {
              opacity: fadeAnim,

              transform: [
                {
                  translateY:
                    translateYAnim,
                },
              ],
            },
          ]}
        >

          <Text
            style={styles.title}
          >
            {slide.title}
          </Text>

          <Text
            style={styles.subtitle}
          >
            {slide.subtitle}
          </Text>

        </Animated.View>


        {/* ==============================================
            ILUSTRACIONES DETRÁS DEL FOOTER
            ============================================== */}

        <Animated.View
          style={[
            styles.illustration,

            {
              opacity: fadeAnim,

              transform: [
                {
                  scale:
                    illustrationAnim,
                },
              ],
            },
          ]}
        >

          {renderIllustration()}

        </Animated.View>

      </View>


      {/* ==================================================
          FOOTER
          ================================================== */}

      <View
        style={[
          styles.footer,

          // Slide 2
          slide.id === "esencia" &&
            styles.footerEsencia,

          // Slide 3
          slide.id === "comunidades" &&
            styles.footerComunidades,

          // Slide 4
          slide.id === "experiencia" &&
            styles.footerExperiencia,
        ]}
      >

        {/* ==============================================
            INDICADORES
            ============================================== */}

        <View
          style={styles.dots}
        >

          {SLIDES.map(
            (item, index) => (

              <View
                key={item.id}

                style={[
                  styles.dot,

                  index === step &&
                    styles.dotActive,
                ]}
              />

            )
          )}

        </View>


        {/* ==============================================
            BOTÓN CTA
            ============================================== */}

        <Animated.View
          style={[
            styles.buttonWrapper,

            {
              transform: [
                {
                  scale:
                    buttonScale,
                },
              ],
            },
          ]}
        >

          <Pressable
            onPress={handleNext}

            style={({
              pressed,
            }) => [

              styles.cta,

              pressed &&
                styles.ctaPressed,
            ]}
          >

            <Text
              style={
                styles.ctaText
              }
            >
              {slide.cta}
            </Text>

          </Pressable>

        </Animated.View>

      </View>


      {/* ==================================================
          IMÁGENES QUE DEBEN PASAR SOBRE EL FOOTER
          ================================================== */}

      {renderAboveFooterIllustration()}

    </View>
  );
};

export default Onboarding;