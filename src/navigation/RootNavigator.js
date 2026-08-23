import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  View,
} from "react-native";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import { useAuth } from "../context/AuthContext";

import {
  ROLES,
  ESTADOS_VERIFICACION,
} from "../constants/roles";

import {
  hasCompletedOnboarding,
} from "../utils/onboardingStorage";

import Onboarding from "../screens/onboarding/Onboarding";

import WelcomeScreen from "../screens/auth/WelcomeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import SeleccionarTipoScreen from "../screens/auth/SeleccionarTipoScreen";
import SeleccionarActorScreen from "../screens/auth/SeleccionarActorScreen";
import RegistroTuristaScreen from "../screens/auth/RegistroTuristaScreen";
import RegistroComunidadScreen from "../screens/auth/RegistroComunidadScreen";
import RegistroArtesanoScreen from "../screens/auth/RegistroArtesanoScreen";
import RegistroGuiaScreen from "../screens/auth/RegistroGuiaScreen";
import RegistroEmprendedorScreen from "../screens/auth/RegistroEmprendedorScreen";
import PendienteAprobacionScreen from "../screens/auth/PendienteAprobacionScreen";

import NavigationDrawer from "./navigationDrawer";

const Stack =
  createNativeStackNavigator();

// ==================================================
// FORZAR ONBOARDING DURANTE DESARROLLO
// ==================================================
//
// true  = siempre muestra onboarding
// false = utiliza AsyncStorage normalmente
//

const FORCE_ONBOARDING = false;

// ==================================================
// STACK DE AUTENTICACIÓN
// ==================================================

const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="Welcome"
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen
      name="Welcome"
      component={WelcomeScreen}
    />

    <Stack.Screen
      name="Login"
      component={LoginScreen}
    />

    <Stack.Screen
      name="SeleccionarTipo"
      component={
        SeleccionarTipoScreen
      }
    />

    <Stack.Screen
      name="SeleccionarActor"
      component={
        SeleccionarActorScreen
      }
    />

    <Stack.Screen
      name="RegistroTurista"
      component={
        RegistroTuristaScreen
      }
    />

    <Stack.Screen
      name="RegistroComunidad"
      component={
        RegistroComunidadScreen
      }
    />

    <Stack.Screen
      name="RegistroArtesano"
      component={
        RegistroArtesanoScreen
      }
    />

    <Stack.Screen
      name="RegistroGuia"
      component={
        RegistroGuiaScreen
      }
    />

    <Stack.Screen
      name="RegistroEmprendedor"
      component={
        RegistroEmprendedorScreen
      }
    />
  </Stack.Navigator>
);

// ==================================================
// ROOT NAVIGATOR
// ==================================================

const RootNavigator = () => {
  const {
    isLoggedIn,
    loadingAuth,
    role,
    estadoVerificacion,
  } = useAuth();

  // ==================================================
  // ESTADO DE CARGA
  // ==================================================

  const [
    loadingOnboarding,
    setLoadingOnboarding,
  ] = useState(true);

  // ==================================================
  // ESTADO ONBOARDING
  // ==================================================

  const [
    onboardingCompleted,
    setOnboardingCompleted,
  ] = useState(false);

  // ==================================================
  // COMPROBAR ONBOARDING
  // ==================================================

  useEffect(() => {
    const checkOnboarding =
      async () => {
        try {
          console.log(
            "Comprobando onboarding..."
          );

          // ==========================================
          // MODO FORZADO
          // ==========================================

          if (FORCE_ONBOARDING) {
            console.log(
              "FORCE_ONBOARDING activo"
            );

            setOnboardingCompleted(
              false
            );

            return;
          }

          // ==========================================
          // ASYNC STORAGE
          // ==========================================

          const completed =
            await hasCompletedOnboarding();

          console.log(
            "Onboarding completado:",
            completed
          );

          setOnboardingCompleted(
            completed
          );
        } catch (error) {
          console.error(
            "Error comprobando onboarding:",
            error
          );

          setOnboardingCompleted(
            false
          );
        } finally {
          setLoadingOnboarding(
            false
          );
        }
      };

    checkOnboarding();
  }, []);

  // ==================================================
  // CALLBACK DEL ONBOARDING
  // ==================================================

  const handleOnboardingComplete =
    () => {
      console.log(
        "RootNavigator: onboarding completado"
      );

      setOnboardingCompleted(
        true
      );
    };

  // ==================================================
  // CARGANDO
  // ==================================================

  if (
    loadingAuth ||
    loadingOnboarding
  ) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator
          size="large"
        />
      </View>
    );
  }

  // ==================================================
  // ONBOARDING
  // ==================================================

  if (!onboardingCompleted) {
    return (
      <Onboarding
        onComplete={
          handleOnboardingComplete
        }
      />
    );
  }

  // ==================================================
  // USUARIO NO AUTENTICADO
  // ==================================================

  if (!isLoggedIn) {
    return <AuthStack />;
  }

  // ==================================================
  // ACTOR CULTURAL PENDIENTE
  // ==================================================

  const estaPendiente =
    role ===
      ROLES.ACTOR_CULTURAL &&
    estadoVerificacion ===
      ESTADOS_VERIFICACION.PENDIENTE;

  if (estaPendiente) {
    return (
      <PendienteAprobacionScreen />
    );
  }

  // ==================================================
  // USUARIO AUTENTICADO
  // ==================================================

  return <NavigationDrawer />;
};

export default RootNavigator;