import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { ROLES, ESTADOS_VERIFICACION } from "../constants/roles";

import LoginScreen from "../screens/auth/LoginScreen";
import SeleccionarTipoScreen from "../screens/auth/SeleccionarTipoScreen";
import SeleccionarActorScreen from "../screens/auth/SeleccionarActorScreen";
import RegistroTuristaScreen from "../screens/auth/RegistroTuristaScreen";
import RegistroComunidadScreen from "../screens/auth/RegistroComunidadScreen";
import RegistroArtesanoScreen from "../screens/auth/RegistroArtesanoScreen";
import RegistroGuiaScreen from "../screens/auth/RegistroGuiaScreen";
import RegistroEmprendedorScreen from "../screens/auth/RegistroEmprendedorScreen";
import PendienteAprobacionScreen from "../screens/auth/PendienteAprobacionScreen";
import NavigationTabs from "./navigationTabs";

const Stack = createNativeStackNavigator();

// Stack de autenticación: login + todo el flujo de registro.
// Nada de esto es accesible una vez que hay sesión iniciada.
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SeleccionarTipo" component={SeleccionarTipoScreen} />
    <Stack.Screen name="SeleccionarActor" component={SeleccionarActorScreen} />
    <Stack.Screen name="RegistroTurista" component={RegistroTuristaScreen} />
    <Stack.Screen name="RegistroComunidad" component={RegistroComunidadScreen} />
    <Stack.Screen name="RegistroArtesano" component={RegistroArtesanoScreen} />
    <Stack.Screen name="RegistroGuia" component={RegistroGuiaScreen} />
    <Stack.Screen name="RegistroEmprendedor" component={RegistroEmprendedorScreen} />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const { isLoggedIn, loadingAuth, role, estadoVerificacion } = useAuth();

  if (loadingAuth) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return <AuthStack />;
  }

  const estaPendiente =
    role === ROLES.ACTOR_CULTURAL && estadoVerificacion === ESTADOS_VERIFICACION.PENDIENTE;

  if (estaPendiente) {
    return <PendienteAprobacionScreen />;
  }

  // Institución no tiene pantallas propias en móvil (se maneja solo
  // desde la PWA) — si alguna vez alguien de INTUR entra desde el
  // celular, simplemente ve las pestañas normales como cualquier otro.
  return <NavigationTabs />;
};

export default RootNavigator;