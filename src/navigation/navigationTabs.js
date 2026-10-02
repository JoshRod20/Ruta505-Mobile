import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../components/Home";
import MapaNicaragua from "../components/MapaNicaragua";
import ExperienciasCulturales from "../screens/comunidad/experienciasCulturales";
import CustomTabBar from "../components/CustomTabBar";
import FloatingNavButton from "../components/common/FloatingNavButton";
import { useAuth } from "../context/AuthContext";
import { PERMISOS, tienePermiso } from "../constants/permissions";
import GenerateQr from "../screens/actorCultural/generateQr";
import CulturalProfile from "../screens/actorCultural/culturalProfile";

const Tab = createBottomTabNavigator();

export default function NavigationTabs({ navigation, route }) {
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
      <FloatingNavButton
        icon="menu-outline"
        onPress={() => navigation.openDrawer()}
        accessibilityLabel="Abrir menú"
      />
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