import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

import {
  View,
  Text,
  Image,
  Pressable,
  Animated,
  Easing,
  PanResponder,
} from "react-native";

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

// ==================================================
// SLIDES
// ==================================================

const SLIDES = [
  {
    id: "bienvenida",
    title: "Bienvenid@ a Ruta 505",
    subtitle:
      "Explora la cultura viva de Nicaragua junto a Pinolito, tu guía virtual.",
  },

  {
    id: "esencia",
    title: "Descubre la esencia de Nicaragua",
  },

  {
    id: "comunidades",
    title: "Conecta con comunidades auténticas",
  },

  {
    id: "experiencia",
    title: "Tu próxima experiencia comienza aquí",
  },
];

const TOTAL_SLIDES = SLIDES.length;

const SWIPE_THRESHOLD = 60;

// ==================================================
// COMPONENTE
// ==================================================

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  // ==================================================
  // CARRUSEL
  // ==================================================

  const translateX = useRef(
    new Animated.Value(0)
  ).current;

  // ==================================================
  // ANIMACIÓN DEL CONTENIDO
  // ==================================================

  const contentOpacity = useRef(
    new Animated.Value(1)
  ).current;

  const contentTranslateY = useRef(
    new Animated.Value(0)
  ).current;

  // ==================================================
  // ANIMACIÓN "DESLIZA"
  // ==================================================

  const swipeHintTranslateX = useRef(
    new Animated.Value(0)
  ).current;

  // ==================================================
  // ANIMACIÓN BOTÓN FINAL
  // ==================================================

  const buttonScale = useRef(
    new Animated.Value(1)
  ).current;

  // ==================================================
  // REFERENCIAS
  // ==================================================

  const currentStepRef = useRef(0);

  const isAnimatingRef = useRef(false);

  // ==================================================
  // POSICIÓN DEL CARRUSEL
  // ==================================================

  const setCarouselPosition = useCallback(
    (index, animated = true) => {
      const targetX =
        -index * styles.screenWidth;

      if (!animated) {
        translateX.setValue(targetX);
        return;
      }

      isAnimatingRef.current = true;

      Animated.timing(translateX, {
        toValue: targetX,
        duration: 380,
        easing: Easing.out(
          Easing.cubic
        ),
        useNativeDriver: true,
      }).start(() => {
        isAnimatingRef.current = false;
      });
    },
    [translateX]
  );

  // ==================================================
  // IR A SLIDE
  // ==================================================

  const goToSlide = useCallback(
    (nextIndex) => {
      if (
        nextIndex < 0 ||
        nextIndex >= TOTAL_SLIDES
      ) {
        return;
      }

      if (isAnimatingRef.current) {
        return;
      }

      currentStepRef.current =
        nextIndex;

      setStep(nextIndex);

      setCarouselPosition(
        nextIndex,
        true
      );
    },
    [setCarouselPosition]
  );

  // ==================================================
  // SIGUIENTE
  // ==================================================

  const goNext = useCallback(() => {
    const current =
      currentStepRef.current;

    if (
      current >=
      TOTAL_SLIDES - 1
    ) {
      return;
    }

    goToSlide(current + 1);
  }, [goToSlide]);

  // ==================================================
  // ANTERIOR
  // ==================================================

  const goPrevious = useCallback(() => {
    const current =
      currentStepRef.current;

    if (current <= 0) {
      return;
    }

    goToSlide(current - 1);
  }, [goToSlide]);

  // ==================================================
  // GESTOS
  // ==================================================

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        return false;
      },

      onMoveShouldSetPanResponder: (
        _,
        gesture
      ) => {
        return (
          Math.abs(gesture.dx) > 10 &&
          Math.abs(gesture.dx) >
            Math.abs(gesture.dy)
        );
      },

      onPanResponderGrant: () => {
        translateX.stopAnimation();

        isAnimatingRef.current = false;
      },

      onPanResponderMove: (
        _,
        gesture
      ) => {
        const current =
          -currentStepRef.current *
          styles.screenWidth;

        let position =
          current + gesture.dx;

        // ------------------------------------------
        // RESISTENCIA AL PRINCIPIO
        // ------------------------------------------

        if (
          currentStepRef.current === 0 &&
          gesture.dx > 0
        ) {
          position =
            current +
            gesture.dx * 0.25;
        }

        // ------------------------------------------
        // RESISTENCIA AL FINAL
        // ------------------------------------------

        if (
          currentStepRef.current ===
            TOTAL_SLIDES - 1 &&
          gesture.dx < 0
        ) {
          position =
            current +
            gesture.dx * 0.25;
        }

        translateX.setValue(position);
      },

      onPanResponderRelease: (
        _,
        gesture
      ) => {
        const dx = gesture.dx;

        const current =
          currentStepRef.current;

        // ------------------------------------------
        // DESLIZAR HACIA IZQUIERDA
        // ------------------------------------------

        if (
          dx < -SWIPE_THRESHOLD &&
          current <
            TOTAL_SLIDES - 1
        ) {
          goNext();
          return;
        }

        // ------------------------------------------
        // DESLIZAR HACIA DERECHA
        // ------------------------------------------

        if (
          dx > SWIPE_THRESHOLD &&
          current > 0
        ) {
          goPrevious();
          return;
        }

        // ------------------------------------------
        // NO COMPLETÓ EL SWIPE
        // ------------------------------------------

        setCarouselPosition(
          current,
          true
        );
      },

      onPanResponderTerminate: () => {
        setCarouselPosition(
          currentStepRef.current,
          true
        );
      },
    })
  ).current;

  // ==================================================
  // ANIMACIÓN DEL CONTENIDO
  // ==================================================

  useEffect(() => {
    contentOpacity.setValue(0);

    contentTranslateY.setValue(10);

    Animated.parallel([
      Animated.timing(
        contentOpacity,
        {
          toValue: 1,
          duration: 220,
          easing: Easing.out(
            Easing.ease
          ),
          useNativeDriver: true,
        }
      ),

      Animated.timing(
        contentTranslateY,
        {
          toValue: 0,
          duration: 260,
          easing: Easing.out(
            Easing.ease
          ),
          useNativeDriver: true,
        }
      ),
    ]).start();
  }, [
    step,
    contentOpacity,
    contentTranslateY,
  ]);

  // ==================================================
  // ANIMACIÓN "DESLIZA"
  // ==================================================

  useEffect(() => {
    if (step !== 0) {
      swipeHintTranslateX.setValue(0);
      return;
    }

    swipeHintTranslateX.setValue(0);

    const animation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            swipeHintTranslateX,
            {
              toValue: 18,
              duration: 650,
              easing:
                Easing.inOut(
                  Easing.ease
                ),
              useNativeDriver: true,
            }
          ),

          Animated.timing(
            swipeHintTranslateX,
            {
              toValue: 0,
              duration: 650,
              easing:
                Easing.inOut(
                  Easing.ease
                ),
              useNativeDriver: true,
            }
          ),
        ])
      );

    animation.start();

    return () => {
      animation.stop();

      swipeHintTranslateX.setValue(0);
    };
  }, [
    step,
    swipeHintTranslateX,
  ]);

  // ==================================================
  // ANIMACIÓN BOTÓN FINAL
  // ==================================================

  useEffect(() => {
    if (
      step !==
      TOTAL_SLIDES - 1
    ) {
      buttonScale.setValue(1);
      return;
    }

    const pulse =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            buttonScale,
            {
              toValue: 1.03,
              duration: 900,
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
              duration: 900,
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
      buttonScale.setValue(1);
    };
  }, [
    step,
    buttonScale,
  ]);

  // ==================================================
  // FINALIZAR ONBOARDING
  // ==================================================

  const finish = async () => {
    if (isAnimatingRef.current) {
      return;
    }

    isAnimatingRef.current = true;

    try {
      console.log(
        "Guardando onboarding..."
      );

      await completeOnboarding();

      console.log(
        "Onboarding completado correctamente"
      );

      console.log(
        "onComplete existe:",
        typeof onComplete
      );

      if (
        typeof onComplete ===
        "function"
      ) {
        console.log(
          "Ejecutando onComplete..."
        );

        onComplete();
      } else {
        console.error(
          "ERROR: onComplete NO fue recibido por Onboarding"
        );
      }
    } catch (error) {
      console.error(
        "Error completando onboarding:",
        error
      );

      // Incluso si falla AsyncStorage,
      // permitimos continuar.
      if (
        typeof onComplete ===
        "function"
      ) {
        onComplete();
      }
    } finally {
      isAnimatingRef.current = false;
    }
  };

  // ==================================================
  // SALTAR ONBOARDING
  // ==================================================

  const skip = async () => {
    if (isAnimatingRef.current) {
      return;
    }

    isAnimatingRef.current = true;

    try {
      console.log(
        "Guardando onboarding al saltar..."
      );

      await completeOnboarding();

      console.log(
        "Onboarding saltado correctamente"
      );

      console.log(
        "onComplete existe:",
        typeof onComplete
      );

      if (
        typeof onComplete ===
        "function"
      ) {
        console.log(
          "Ejecutando onComplete..."
        );

        onComplete();
      } else {
        console.error(
          "ERROR: onComplete NO fue recibido por Onboarding"
        );
      }
    } catch (error) {
      console.error(
        "Error guardando onboarding:",
        error
      );

      if (
        typeof onComplete ===
        "function"
      ) {
        onComplete();
      }
    } finally {
      isAnimatingRef.current = false;
    }
  };

  // ==================================================
  // ILUSTRACIONES
  // ==================================================

  const renderIllustration = (
    slide
  ) => {
    switch (slide.id) {
      // ==============================================
      // SLIDE 1
      // ==============================================

      case "bienvenida":
        return (
          <>
            <Image
              source={
                escenaBienvenida
              }
              style={
                styles.welcomeBackground
              }
              resizeMode="cover"
            />

            <Image
              source={rama}
              style={
                styles.branch
              }
              resizeMode="contain"
            />

            <Image
              source={pinolito}
              style={
                styles.pinolito
              }
              resizeMode="contain"
            />
          </>
        );

      // ==============================================
      // SLIDE 2
      // ==============================================

      case "esencia":
        return (
          <>
            <Image
              source={catedral}
              style={
                styles.catedral
              }
              resizeMode="contain"
            />

            <Image
              source={bailarina}
              style={
                styles.bailarinaAboveFooter
              }
              resizeMode="contain"
            />
          </>
        );

      // ==============================================
      // SLIDE 3
      // ==============================================

      case "comunidades":
        return (
          <Image
            source={gigantona}
            style={
              styles.gigantonaAboveFooter
            }
            resizeMode="contain"
          />
        );

      // ==============================================
      // SLIDE 4
      // ==============================================

      case "experiencia":
        return (
          <>
            <Image
              source={flor1}
              style={
                styles.flowerLeftAboveFooter
              }
              resizeMode="contain"
            />

            <Image
              source={flor2}
              style={
                styles.flowerRightAboveFooter
              }
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
      {...panResponder.panHandlers}
    >
      {/* ==================================================
          CARRUSEL
          ================================================== */}

      <Animated.View
        style={[
          styles.slidesContainer,
          {
            transform: [
              {
                translateX,
              },
            ],
          },
        ]}
      >
        {SLIDES.map(
          (slide, index) => {
            const isFirst =
              index === 0;

            const isLast =
              index ===
              TOTAL_SLIDES - 1;

            return (
              <View
                key={slide.id}
                style={
                  styles.slide
                }
              >
                {/* ==========================================
                    CIELO
                    ========================================== */}

                <View
                  style={
                    styles.sky
                  }
                >
                  {/* ========================================
                      NUBES
                      ======================================== */}

                  <Image
                    source={nube1}
                    style={
                      styles.cloudLeft
                    }
                    resizeMode="contain"
                  />

                  <Image
                    source={nube2}
                    style={
                      styles.cloudRight
                    }
                    resizeMode="contain"
                  />

                  {/* ========================================
                      TÍTULO
                      ======================================== */}

                  <Animated.View
                    style={[
                      styles.titleContainer,

                      index === step
                        ? {
                            opacity:
                              contentOpacity,

                            transform: [
                              {
                                translateY:
                                  contentTranslateY,
                              },
                            ],
                          }
                        : {
                            opacity: 1,
                          },
                    ]}
                  >
                    <Text
                      style={
                        styles.title
                      }
                    >
                      {
                        slide.title
                      }
                    </Text>

                    {slide.subtitle && (
                      <Text
                        style={
                          styles.subtitle
                        }
                      >
                        {
                          slide.subtitle
                        }
                      </Text>
                    )}
                  </Animated.View>

                  {/* ========================================
                      ILUSTRACIONES
                      ======================================== */}

                  <View
                    style={
                      styles.illustrationLayer
                    }
                  >
                    {renderIllustration(
                      slide
                    )}
                  </View>

                  {/* ========================================
                      FOOTER
                      ======================================== */}

                  <View
                    style={[
                      styles.footer,

                      index === 1 &&
                        styles.footerEsencia,

                      index === 2 &&
                        styles.footerComunidades,

                      index === 3 &&
                        styles.footerExperiencia,
                    ]}
                  />

                  {/* ========================================
                      CONTROLES
                      ======================================== */}

                  <View
                    style={
                      styles.footerControls
                    }
                  >
                    {/* ======================================
                        DOTS
                        ====================================== */}

                    <View
                      style={
                        styles.dots
                      }
                    >
                      {SLIDES.map(
                        (
                          item,
                          dotIndex
                        ) => (
                          <View
                            key={
                              item.id
                            }
                            style={[
                              styles.dot,

                              dotIndex ===
                                index &&
                                styles.dotActive,
                            ]}
                          />
                        )
                      )}
                    </View>

                    {/* ======================================
                        INDICACIÓN DESLIZAR
                        ====================================== */}

                    {isFirst && (
                      <Animated.View
                        style={[
                          styles.swipeHint,

                          {
                            transform: [
                              {
                                translateX:
                                  swipeHintTranslateX,
                              },
                            ],
                          },
                        ]}
                      >
                        <Text
                          style={
                            styles.swipeHintArrow
                          }
                        >
                          →
                        </Text>

                        <Text
                          style={
                            styles.swipeHintText
                          }
                        >
                          Desliza para
                          continuar
                        </Text>
                      </Animated.View>
                    )}

                    {/* ======================================
                        BOTÓN FINAL
                        ====================================== */}

                    {isLast && (
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
                          onPress={
                            finish
                          }
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
                            Comenzar
                          </Text>
                        </Pressable>
                      </Animated.View>
                    )}
                  </View>
                </View>
              </View>
            );
          }
        )}
      </Animated.View>

      {/* ==================================================
          BOTÓN SALTAR
          ================================================== */}

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
    </View>
  );
};

export default Onboarding;