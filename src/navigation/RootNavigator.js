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
import VerificarCodigoScreen from "../screens/auth/VerificarCodigoScreen";
import SeleccionarTipoScreen from "../screens/auth/SeleccionarTipoScreen";
import SeleccionarActorScreen from "../screens/auth/SeleccionarActorScreen";
import RegistroActorScreen from "../screens/auth/RegistroActorScreen";
import RegistroTuristaScreen from "../screens/auth/RegistroTuristaScreen";
import PendienteAprobacionScreen from "../screens/auth/PendienteAprobacionScreen";
import SeleccionarInteresesScreen from "../screens/auth/SeleccionarInteresesScreen";
import SolicitarUbicacionScreen from "../screens/auth/SolicitarUbicacionScreen";

import NavigationDrawer from "./navigationDrawer";

const Stack =
  createNativeStackNavigator();

// Bandera en __DEV__ para forzar onboarding.
const FORCE_ONBOARDING = __DEV__ && false;

// Configuración para forzar pantalla inicial durante desarrollo.
const DEV_START_SCREEN = __DEV__ ? null : null; // null | "SeleccionarIntereses" | "SolicitarUbicacion"

// Rol mock para pruebas en SolicitarUbicacion ("turista" | "actor").
const DEV_MOCK_ROL = "turista";

// Mocks de datos para pruebas en desarrollo.
const MOCK_DATOS_REGISTRO_TURISTA = {
  role: ROLES.TURISTA,
  nombreCompleto: "Usuario de Prueba",
  email: "prueba@ruta505.com",
  password: "123456",
  telefono: "88888888",
  edad: "25",
  tipoTurista: "nacional",
  paisOrigen: "Nicaragua",
  idiomaPreferido: "Español",
};

const MOCK_DATOS_REGISTRO_ACTOR = {
  role: ROLES.ACTOR_CULTURAL,
  tipoActor: "artesano",
  estadoVerificacion: ESTADOS_VERIFICACION.PENDIENTE,
  nombreCompleto: "Actor de Prueba",
  email: "actor@ruta505.com",
  password: "123456",
  cedula: "001-010101-0001A",
  telefono: "88888888",
  tipoTurismo: "Turismo cultural e histórico",
};

const MOCK_INTERESES = [
  "Turismo de naturaleza / ecoturismo",
  "Turismo cultural e histórico",
];

// Stack de navegación para la autenticación.
const AuthStack = () => (
  <Stack.Navigator
    initialRouteName={DEV_START_SCREEN || "Welcome"}
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
      name="VerificarCodigo"
      component={VerificarCodigoScreen}
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
      component={RegistroTuristaScreen}
    />

    <Stack.Screen
      name="SeleccionarIntereses"
      component={SeleccionarInteresesScreen}
      initialParams={
        DEV_START_SCREEN === "SeleccionarIntereses"
          ? { datosRegistro: MOCK_DATOS_REGISTRO_TURISTA }
          : undefined
      }
    />

    <Stack.Screen
      name="SolicitarUbicacion"
      component={SolicitarUbicacionScreen}
      initialParams={
        DEV_START_SCREEN === "SolicitarUbicacion"
          ? {
              datosRegistro:
                DEV_MOCK_ROL === "actor"
                  ? MOCK_DATOS_REGISTRO_ACTOR
                  : MOCK_DATOS_REGISTRO_TURISTA,
              intereses:
                DEV_MOCK_ROL === "actor" ? undefined : MOCK_INTERESES,
            }
          : undefined
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

// Navegador principal.
const RootNavigator = () => {
  const {
    isLoggedIn,
    loadingAuth,
    profile,
    role,
    estadoVerificacion,
    sancion,
  } = useAuth();

  const [
    loadingOnboarding,
    setLoadingOnboarding,
  ] = useState(true);

  const [
    onboardingCompleted,
    setOnboardingCompleted,
  ] = useState(false);

  // Controla el modo "Explorar" para actores con acceso restringido.
  const [
    explorando,
    setExplorando,
  ] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setExplorando(false);
    }
  }, [isLoggedIn]);

  // Verifica el estado del onboarding en AsyncStorage o modo forzado.
  useEffect(() => {
    const checkOnboarding =
      async () => {
        try {
          console.log(
            "Comprobando onboarding..."
          );

          if (FORCE_ONBOARDING) {
            console.log(
              "FORCE_ONBOARDING activo"
            );

            setOnboardingCompleted(
              false
            );

            return;
          }

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

  const handleOnboardingComplete =
    () => {
      console.log(
        "RootNavigator: onboarding completado"
      );

      setOnboardingCompleted(
        true
      );
    };

  // Pantalla de carga global.
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

  // Renderiza el flujo de Onboarding si no se ha completado.
  if (!onboardingCompleted) {
    return (
      <Onboarding
        onComplete={
          handleOnboardingComplete
        }
      />
    );
  }

  // Flujo para usuarios no autenticados.
  if (!isLoggedIn) {
    return <AuthStack />;
  }

  // Espera a que cargue el perfil en Firestore tras el login.
  if (!profile) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Restricción para actores culturales pendientes, suspendidos o rechazados.
  const estaRestringido =
    role === ROLES.ACTOR_CULTURAL &&
    (estadoVerificacion === ESTADOS_VERIFICACION.PENDIENTE ||
      estadoVerificacion === ESTADOS_VERIFICACION.SUSPENDIDO ||
      estadoVerificacion === ESTADOS_VERIFICACION.RECHAZADO);

  if (estaRestringido && !explorando) {
    return (
      <PendienteAprobacionScreen
        estadoVerificacion={estadoVerificacion}
        sancion={sancion}
        onExplorar={() =>
          setExplorando(true)
        }
      />
    );
  }

  // Vista principal para usuarios autenticados y con permisos completos.
  return <NavigationDrawer />;
};

export default RootNavigator;