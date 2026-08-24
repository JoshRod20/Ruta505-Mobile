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
import RegistroActorScreen from "../screens/auth/RegistroActorScreen";
import RegistroTuristaScreen from "../screens/auth/RegistroTuristaScreen";
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
      name="RegistroActor" 
      component={
        RegistroActorScreen
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
  // "EXPLORAR" MIENTRAS EL PERFIL ESTÁ PENDIENTE
  // ==================================================
  //
  // Antes, un actor cultural pendiente solo veía
  // PendienteAprobacionScreen sin poder acceder al resto
  // de la app. Ahora puede elegir "Explorar" desde ahí y
  // pasar a NavigationDrawer (Home) con funcionalidad
  // reducida. No hace falta ningún useEffect para
  // "desbloquear" al aprobarse: en cuanto
  // estadoVerificacion cambia a "aprobado", estaPendiente
  // se vuelve false solo y NavigationDrawer ya se muestra
  // completo.
  //
  // Se reinicia a false al cerrar sesión, para que la
  // próxima cuenta que inicie sesión (aprobada o no) no
  // arrastre el "Explorar" de la sesión anterior.

  const [
    explorando,
    setExplorando,
  ] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setExplorando(false);
    }
  }, [isLoggedIn]);

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

  if (estaPendiente && !explorando) {
    return (
      <PendienteAprobacionScreen
        onExplorar={() =>
          setExplorando(true)
        }
      />
    );
  }

  // ==================================================
  // USUARIO AUTENTICADO
  // ==================================================

  return <NavigationDrawer />;
};

export default RootNavigator;