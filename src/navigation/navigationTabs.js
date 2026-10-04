import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../components/Home";
import MapaNicaragua from "../components/MapaNicaragua";
import CustomTabBar from "../components/CustomTabBar";
import FloatingNavButton from "../components/common/FloatingNavButton";
import ExperienciasCulturales from "../screens/comunidad/experienciasCulturales";
import GenerateQr from "../screens/actorCultural/generateQr";
import CulturalProfile from "../screens/actorCultural/culturalProfile";
import CulturalRoutes from "../screens/usuario/culturalRoutes";
import CulturalPassport from "../screens/usuario/culturalPassport";
import UserProfile from "../screens/usuario/userProfile";
import { useAuth } from "../context/AuthContext";
import { PERMISOS, tienePermiso } from "../constants/permissions";

const Tab = createBottomTabNavigator();

// El "+" de la barra no es una pantalla de tabs: solo ocupa su lugar en la barra.
// CustomTabBar intercepta su toque; todavía no abre nada (después mostrará
// varias opciones de registro). "Publicar Experiencia" ya es una pantalla
// independiente ("PublicarExperienciaDrawer") que se abre desde el Home.
const BotonAgregar = () => null;

export default function NavigationTabs({ route }) {
  const { role } = useAuth();
  const puedePublicarExperiencia = tienePermiso(
    role,
    PERMISOS.PUBLICAR_EXPERIENCIA
  );

  const initialTab =
    route?.params?.initialTab &&
    (route.params.initialTab !== "Publicar experiencias" ||
      puedePublicarExperiencia)
      ? route.params.initialTab
      : "Inicio";

  return (
    <>
      <Tab.Navigator
        initialRouteName={initialTab}
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tab.Screen name="Inicio" component={Home} />
        <Tab.Screen name="Mapa" component={MapaNicaragua} />
        {puedePublicarExperiencia && (
          <Tab.Screen
            name="Publicar experiencias"
            component={ExperienciasCulturales}
          />
        )}
        <Tab.Screen name="Generar QR" component={GenerateQr} />
        <Tab.Screen name="Perfil cultural" component={CulturalProfile} />
      </Tab.Navigator>
    </>
  );
}