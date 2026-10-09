/**
 * NavigationTabs: componente/pantalla de la aplicación Ruta505.
 */

import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../components/Home";
import MapaNicaragua from "../components/MapaNicaragua";
import CustomTabBar from "../components/CustomTabBar";
import FloatingNavButton from "../components/common/FloatingNavButton";
import CrearRutaInicio from "../screens/rutas/crearRutaInicio";
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

/**
 * NavigationTabs.
 */
export default function NavigationTabs({ route }) {
  const { role } = useAuth();

  // Las pestañas dependen del rol (la cuarta ocupa el mismo lugar para todos):
  //  - Actor cultural: Inicio, Mapa, +, Generar QR, Perfil cultural.
  //  - Turista: Inicio, Mapa, Pasaporte, Perfil.
  const puedePublicarExperiencia = tienePermiso(
    role,
    PERMISOS.PUBLICAR_EXPERIENCIA
  );
  const puedeGenerarQr = tienePermiso(role, PERMISOS.GENERAR_QR_EXPERIENCIA);
  const puedeVerPerfilCultural = tienePermiso(
    role,
    PERMISOS.VER_PERFIL_CULTURAL
  );
  const puedeVerPasaporte = tienePermiso(role, PERMISOS.VER_PASAPORTE);
  const puedeVerPerfilUsuario = tienePermiso(
    role,
    PERMISOS.VER_PERFIL_USUARIO
  );

  const pestanasDisponibles = [
    "Inicio",
    "Mapa",
    puedePublicarExperiencia && "Publicar experiencias",
    puedeGenerarQr && "Generar QR",
    puedeVerPerfilCultural && "Perfil cultural",
    puedeVerPasaporte && "Pasaporte",
    puedeVerPerfilUsuario && "Perfil",
  ].filter(Boolean);

  const initialTab = pestanasDisponibles.includes(route?.params?.initialTab)
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
            component={CrearRutaInicio}
          />
        )}
        {puedeGenerarQr && (
          <Tab.Screen name="Generar QR" component={GenerateQr} />
        )}
        {puedeVerPerfilCultural && (
          <Tab.Screen name="Perfil cultural" component={CulturalProfile} />
        )}
        {puedeVerPasaporte && (
          <Tab.Screen name="Pasaporte" component={CulturalPassport} />
        )}
        {puedeVerPerfilUsuario && (
          <Tab.Screen name="Perfil" component={UserProfile} />
        )}
      </Tab.Navigator>
    </>
  );
}
