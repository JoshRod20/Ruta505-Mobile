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
// Envuelto en __DEV__ para que sea imposible que esta bandera
// llegue activa a un build de producción por olvido, sin
// importar el valor que quede escrito abajo.
//

const FORCE_ONBOARDING = __DEV__ && false;

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
// Igual que FORCE_ONBOARDING, va envuelto en __DEV__ para
// que un build de producción nunca pueda arrancar en una
// pantalla de desarrollo aunque el valor quede sin resetear.
//
// null                     = comportamiento normal (Welcome)
// "SeleccionarIntereses"   = abre directo en Intereses
// "SolicitarUbicacion"     = abre directo en Ubicación
//

const DEV_START_SCREEN = __DEV__ ? null : null; // <- cambia aquí: null | "SeleccionarIntereses" | "SolicitarUbicacion"

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
    profile,
    role,
    estadoVerificacion,
    sancion,
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
  // "EXPLORAR" MIENTRAS EL PERFIL NO TIENE ACCESO COMPLETO
  // ==================================================
  //
  // Un actor cultural pendiente/suspendido/rechazado puede
  // elegir "Explorar" desde PendienteAprobacionScreen y pasar
  // a NavigationDrawer (Home) con funcionalidad reducida. No
  // hace falta ningún useEffect para "desbloquear" al
  // aprobarse: en cuanto estadoVerificacion cambia a
  // "aprobado", estaRestringido se vuelve false solo y
  // NavigationDrawer ya se muestra completo.
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
  // CUENTA AUTENTICADA, PERFIL AÚN NO CONFIRMADO
  // ==================================================
  //
  // isLoggedIn ya es true (Firebase Auth ya autenticó al
  // usuario) pero el documento de perfil en Firestore
  // todavía no existe. Esto pasa de forma normal durante los
  // primeros instantes de un registro nuevo: el setDoc en
  // registrarUsuario puede seguir en camino cuando
  // onAuthStateChanged ya disparó. Antes esto caía a
  // NavigationDrawer con role === null; ahora se muestra un
  // loader hasta que el perfil llegue (loadingAuth vuelve a
  // false con snapshot real) o hasta que el registro falle y
  // registrarUsuario revierta la cuenta (isLoggedIn vuelve a
  // false y regresa a AuthStack).
  //
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

  // ==================================================
  // ACTOR CULTURAL SIN ACCESO COMPLETO
  // ==================================================
  //
  // Cubre pendiente de aprobación, suspendido (con sanción
  // vigente) y rechazado. Antes solo se cubría "pendiente";
  // un actor suspendido o rechazado caía directo a
  // NavigationDrawer con acceso completo.
  //
  // Se le pasan estadoVerificacion/sancion a
  // PendienteAprobacionScreen para que pueda mostrar el
  // mensaje correcto según el caso. OJO: no tengo ese
  // componente — hoy probablemente asume que solo existe el
  // estado "pendiente" y su texto/botón "Explorar" habrá que
  // revisarlo para decidir si aplica igual a suspendido y
  // rechazado, o si alguno de esos casos no debería ofrecer
  // "Explorar" en absoluto (decisión de producto).

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

  // ==================================================
  // USUARIO AUTENTICADO
  // ==================================================

  return <NavigationDrawer />;
};

export default RootNavigator;