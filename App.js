import 'react-native-gesture-handler';
import { useState, useCallback } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import AnimatedSplashScreen from './src/components/animations/AnimatedSplashScreen';

import { useFonts } from "expo-font";
import fonts from "./src/utils/fonts/fonts.js";

// Evita que el splash nativo (imagen estática) se oculte solo apenas
// arranca el JS. Lo ocultamos nosotros a mano cuando las fuentes ya
// cargaron, justo antes de mostrar el splash animado.
SplashScreen.preventAutoHideAsync();

export default function App() {

  const [fontsLoaded] = useFonts(fonts);
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      try {
        await SplashScreen.hideAsync();
        console.log('[Splash] Native splash oculto correctamente');
      } catch (e) {
        console.warn('[Splash] Error ocultando el splash nativo:', e);
      }
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (showAnimatedSplash) {
    return (
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AnimatedSplashScreen
          onAnimationFinish={() => setShowAnimatedSplash(false)}
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        style="dark"
        backgroundColor="#ffffff"
        translucent={false}
      />
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}