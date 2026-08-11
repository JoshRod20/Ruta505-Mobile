// src/navigation/RootNavigator.js

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

const Stack = createNativeStackNavigator();

// ==================================================
// FORZAR ONBOARDING DURANTE DESARROLLO
// ==================================================
//
// true  = siempre muestra el onboarding
// false = utiliza AsyncStorage normalmente
//
// Cuando termines de probarlo, cambia a false.
//

const FORCE_ONBOARDING = true;


// ==================================================
// STACK DE AUTENTICACIÓN
// ==================================================
//
// Login + todo el flujo de registro.
// Nada de esto es accesible una vez que hay sesión
// iniciada.
//

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen
      name="Login"
      component={LoginScreen}
    />

    <Stack.Screen
      name="SeleccionarTipo"
      component={SeleccionarTipoScreen}
    />

    <Stack.Screen
      name="SeleccionarActor"
      component={SeleccionarActorScreen}
    />

    <Stack.Screen
      name="RegistroTurista"
      component={RegistroTuristaScreen}
    />

    <Stack.Screen
      name="RegistroComunidad"
      component={RegistroComunidadScreen}
    />

    <Stack.Screen
      name="RegistroArtesano"
      component={RegistroArtesanoScreen}
    />

    <Stack.Screen
      name="RegistroGuia"
      component={RegistroGuiaScreen}
    />

    <Stack.Screen
      name="RegistroEmprendedor"
      component={RegistroEmprendedorScreen}
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

  // Estado de carga del onboarding
  const [loadingOnboarding, setLoadingOnboarding] =
    useState(true);

  // Estado de si el onboarding ya fue completado
  const [onboardingCompleted, setOnboardingCompleted] =
    useState(false);


  // ==================================================
  // COMPROBAR ONBOARDING
  // ==================================================

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        // ----------------------------------------------
        // MODO DE PRUEBA
        // ----------------------------------------------
        //
        // Mientras FORCE_ONBOARDING sea true,
        // ignoramos AsyncStorage y mostramos
        // siempre el onboarding.
        //

        if (FORCE_ONBOARDING) {
          setOnboardingCompleted(false);
          return;
        }

        // ----------------------------------------------
        // COMPORTAMIENTO NORMAL
        // ----------------------------------------------

        const completed =
          await hasCompletedOnboarding();

        setOnboardingCompleted(completed);

      } catch (error) {
        console.error(
          "Error comprobando onboarding:",
          error
        );

        // Si ocurre un error, mostramos el onboarding
        // por seguridad.
        setOnboardingCompleted(false);

      } finally {
        setLoadingOnboarding(false);
      }
    };

    checkOnboarding();
  }, []);


  // ==================================================
  // CARGANDO AUTENTICACIÓN / ONBOARDING
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
  //
  // Esto se evalúa ANTES de isLoggedIn.
  //
  // Por lo tanto, si es la primera vez que se abre
  // la aplicación, se mostrará el onboarding.
  //

  if (!onboardingCompleted) {
    return <Onboarding />;
  }


  // ==================================================
  // USUARIO NO AUTENTICADO
  // ==================================================

  if (!isLoggedIn) {
    return <AuthStack />;
  }


  // ==================================================
  // ACTOR CULTURAL PENDIENTE DE APROBACIÓN
  // ==================================================

  const estaPendiente =
    role === ROLES.ACTOR_CULTURAL &&
    estadoVerificacion ===
      ESTADOS_VERIFICACION.PENDIENTE;

  if (estaPendiente) {
    return <PendienteAprobacionScreen />;
  }


  // ==================================================
  // USUARIO AUTENTICADO
  // ==================================================
  //
  // Institución no tiene pantallas propias en móvil.
  // Si alguna vez entra desde el celular, verá
  // igualmente el drawer principal.
  //

  return <NavigationDrawer />;
};

export default RootNavigator;