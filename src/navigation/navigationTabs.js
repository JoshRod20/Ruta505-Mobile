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

export default function NavigationTabs({ navigation, route }) {
  const { role } = useAuth();

  const puedeVerRutas = tienePermiso(role, PERMISOS.VER_RUTAS_CULTURALES);
  const puedeVerPasaporte = tienePermiso(role, PERMISOS.VER_PASAPORTE);
  const puedeVerPerfilUsuario = tienePermiso(role, PERMISOS.VER_PERFIL_USUARIO);
  const puedePublicarExperiencia = tienePermiso(role, PERMISOS.PUBLICAR_EXPERIENCIA);
  const puedeGenerarQr = tienePermiso(role, PERMISOS.GENERAR_QR_EXPERIENCIA);
  const puedeVerPerfilCultural = tienePermiso(role, PERMISOS.VER_PERFIL_CULTURAL);

  const tabsDisponibles = [
    "Inicio",
    "Mapa",
    ...(puedeVerRutas ? ["Rutas"] : []),
    ...(puedeVerPasaporte ? ["Pasaporte"] : []),
    ...(puedeVerPerfilUsuario ? ["Perfil"] : []),
    ...(puedePublicarExperiencia ? ["Publicar experiencias"] : []),
    ...(puedeGenerarQr ? ["Generar QR"] : []),
    ...(puedeVerPerfilCultural ? ["Perfil cultural"] : []),
  ];

  const requested = route?.params?.initialTab;
  const initialTab = tabsDisponibles.includes(requested) ? requested : "Inicio";

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

        {/* Turista */}
        {puedeVerRutas && <Tab.Screen name="Rutas" component={CulturalRoutes} />}
        {puedeVerPasaporte && (
          <Tab.Screen name="Pasaporte" component={CulturalPassport} />
        )}
        {puedeVerPerfilUsuario && (
          <Tab.Screen name="Perfil" component={UserProfile} />
        )}

        {/* Actor cultural */}
        {puedePublicarExperiencia && (
          <Tab.Screen name="Publicar experiencias" component={ExperienciasCulturales} />
        )}
        {puedeGenerarQr && <Tab.Screen name="Generar QR" component={GenerateQr} />}
        {puedeVerPerfilCultural && (
          <Tab.Screen name="Perfil cultural" component={CulturalProfile} />
        )}
      </Tab.Navigator>
    </>
  );
}