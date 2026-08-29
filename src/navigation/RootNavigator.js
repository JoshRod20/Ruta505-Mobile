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
import SeleccionarInteresesScreen from "../screens/auth/SeleccionarInteresesScreen";
import SolicitarUbicacionScreen from "../screens/auth/SolicitarUbicacionScreen";

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
// FORZAR PANTALLA DE DESARROLLO (edición de estilos)
// ==================================================
//
// Útil para entrar directo a "SeleccionarIntereses" o
// "SolicitarUbicacion" sin pasar por todo el flujo de
// registro. Estas pantallas dependen de route.params,
// así que se les inyectan datos de prueba (mock) via
// initialParams cuando la bandera está activa.
//
// IMPORTANTE: cambiar este valor no tiene efecto con
// Fast Refresh (guardar el archivo). Para que tome
// efecto hay que recargar la app por completo:
// presiona "r" en la terminal de Expo, o cierra y
// vuelve a abrir la app en el dispositivo/emulador.
//
// Además, esto solo aplica si el usuario NO está
// autenticado (isLoggedIn === false) y ya completó el
// onboarding, porque solo entonces se monta <AuthStack />.
//
// null                     = comportamiento normal (Welcome)
// "SeleccionarIntereses"   = abre directo en Intereses
// "SolicitarUbicacion"     = abre directo en Ubicación
//

const DEV_START_SCREEN = null; // <- cambia aquí: null | "SeleccionarIntereses" | "SolicitarUbicacion"

// Con qué mock se prueba SolicitarUbicacion cuando
// DEV_START_SCREEN === "SolicitarUbicacion".
// "turista" = flujo con intereses (2 segmentos de progreso)
// "actor"   = flujo directo desde registro de actor cultural
//             (1 segmento de progreso, textos distintos)
const DEV_MOCK_ROL = "turista"; // <- cambia aquí: "turista" | "actor"

// Datos de prueba para que las pantallas no exploten
// al recibir route.params vacío.
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

// ==================================================
// STACK DE AUTENTICACIÓN
// ==================================================

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