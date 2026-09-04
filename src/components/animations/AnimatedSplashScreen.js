import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

/**
 * Splash screen animado con Lottie.
 *
 * La animación original ("logo de mayra") dura 900 frames a 30fps = 30s
 * a velocidad normal. El prop `speed` está en 7.5 por defecto para que
 * dure exactamente 4 segundos (900 / 30fps / 7.5 = 4s). Si más adelante
 * quieres otra duración, el cálculo es: speed = 30 / segundosDeseados.
 *
 * El fondo es transparente en el JSON, así que el color de `container`
 * debe coincidir con el color de fondo de tu splash nativo (el que
 * configuraste con expo-splash-screen) para que la transición sea
 * invisible.
 */
export default function AnimatedSplashScreen({
  onAnimationFinish,
  speed = 7.5, // 900 frames / 30fps / 7.5 = 4s
  backgroundColor = '#FFFFFF', // TODO: pon aquí el mismo color que tu splash nativo
}) {
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    console.log('[Lottie] Componente montado, width/height:', width, height);
    if (animationRef.current) {
      console.log('[Lottie] Ref lista, llamando play()');
      startTimeRef.current = Date.now();
      animationRef.current.play();
    } else {
      console.warn('[Lottie] Ref NO disponible al montar');
    }

    // Salvavidas: si por alguna razón onAnimationFinish no llega a
    // dispararse, forzamos el avance a la app después de la duración
    // esperada + margen, para que nunca se quede pegado el splash.
    const expectedDurationMs = (900 / 30 / speed) * 1000 + 1500;
    const fallback = setTimeout(() => {
      const elapsed = Date.now() - (startTimeRef.current ?? Date.now());
      console.warn(`[Lottie] Fallback disparado tras ${elapsed}ms — onAnimationFinish nunca llegó a tiempo`);
      onAnimationFinish?.();
    }, expectedDurationMs);

    return () => clearTimeout(fallback);
  }, [speed, onAnimationFinish]);

  return (
    <View style={[styles.container, { backgroundColor }]} collapsable={false}>
      <LottieView
        ref={animationRef}
        source={require('../../assets/animations/splash.json')}
        autoPlay
        loop={false}
        speed={speed}
        resizeMode="cover"
        renderMode="SOFTWARE"
        enableMergePathsAndroidForKitKatAndAbove
        style={styles.lottie}
        onAnimationFailure={(error) => console.warn('[Lottie] onAnimationFailure:', error)}
        onAnimationFinish={() => {
          const elapsed = Date.now() - (startTimeRef.current ?? Date.now());
          console.log(`[Lottie] onAnimationFinish real disparado tras ${elapsed}ms`);
          onAnimationFinish?.();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  lottie: {
    width,
    height,
  },
});