import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import PerfilUsuario from "../components/PerfilUsuario";
import ActivarDobleFactorScreen from "../screens/perfil/ActivarDobleFactorScreen";
import AcercaDe from "../screens/acercaDe";
import NavigationTabs from "./navigationTabs";
import ExperienciasCulturales from "../screens/comunidad/experienciasCulturales";
import EditCulturalProfile from "../screens/actorCultural/editCulturalProfile";
import Resenas from "../screens/comunidad/resenas";
import Estadisticas from "../screens/actorCultural/estadisticas";
import { useAuth } from "../context/AuthContext";
import { drawerStyle } from "../styles/navigation/navigationDrawerStyle";

const Drawer = createDrawerNavigator();

// Nombre de la ruta principal que agrupa los tabs para evitar duplicados o colisiones.
const MAIN_ROUTE = "MainDrawer";

function CustomDrawerContent(props) {
  const { logout } = useAuth();
  const { navigation } = props;

  return (
    <View style={drawerStyle.drawerContainer}>
      <View style={drawerStyle.logoContainer}>
        <Text style={drawerStyle.drawerLabel}>Ruta505</Text>
        <Text style={drawerStyle.tabLabel}>Menú principal</Text>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={drawerStyle.drawerScroll}>
        {/* Solo muestra pantallas fuera de la barra de tabs para evitar conflictos de navegación. */}
        <DrawerItem
          label="Mi cuenta"
          labelStyle={drawerStyle.drawerLabel}
          onPress={() => {
            navigation.navigate("MiCuentaDrawer");
            navigation.closeDrawer();
          }}
        />
        <DrawerItem
          label="Acerca de"
          labelStyle={drawerStyle.drawerLabel}
          onPress={() => {
            navigation.navigate("AcercaDeDrawer");
            navigation.closeDrawer();
          }}
        />

        <View style={drawerStyle.separator} />
        <DrawerItem
          label="Cerrar sesión"
          onPress={() => logout()}
          labelStyle={drawerStyle.drawerLabel}
        />
      </DrawerContentScrollView>
    </View>
  );
}

export default function NavigationDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName={MAIN_ROUTE}
      // Por defecto el Drawer regresa siempre a la primera pantalla (los tabs).
      // Con "history" la flecha de atrás vuelve a la pantalla de donde venías
      // (por ejemplo, de Verificación en dos pasos a Configuración).
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#f5f5f5",
        drawerLabelStyle: drawerStyle.drawerLabel,
        drawerStyle: { backgroundColor: "#2E7D32" },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {/* Pantalla contenedora de tabs; las pestañas internas se gestionan dentro de NavigationTabs. */}
      <Drawer.Screen
        name={MAIN_ROUTE}
        component={NavigationTabs}
        options={{ drawerItemStyle: { height: 0 } }} // Oculto del drawer por defecto; se maneja en el menú custom.
      />
      {/* Publicar Experiencia: pantalla independiente, sin barra de tabs. Se abre desde el botón "Nueva publicación" del Home. */}
      <Drawer.Screen
        name="PublicarExperienciaDrawer"
        component={ExperienciasCulturales}
        options={{ drawerItemStyle: { height: 0 }, swipeEnabled: false }}
      />
      {/* Edición de perfil cultural: pantalla independiente (sin barra de tabs) */}
      <Drawer.Screen
        name="EditarPerfilCulturalDrawer"
        component={EditCulturalProfile}
        options={{ drawerItemStyle: { height: 0 }, swipeEnabled: false }}
      />
      {/* Estadísticas del espacio cultural: pantalla independiente (sin barra de tabs). Se abre desde el perfil cultural. */}
      <Drawer.Screen
        name="EstadisticasDrawer"
        component={Estadisticas}
        options={{ drawerItemStyle: { height: 0 }, swipeEnabled: false }}
      />
      {/* Reseñas: pantalla independiente (sin barra de tabs). Se abre desde Estadísticas ("Ver todas las reseñas"). */}
      <Drawer.Screen
        name="ResenasDrawer"
        component={Resenas}
        options={{ drawerItemStyle: { height: 0 }, swipeEnabled: false }}
      />
      <Drawer.Screen
        name="MiCuentaDrawer"
        component={PerfilUsuario}
        options={{ drawerItemStyle: { height: 0 }, swipeEnabled: false }}
      />
      <Drawer.Screen
        name="ActivarDobleFactorDrawer"
        component={ActivarDobleFactorScreen}
        options={{ drawerItemStyle: { height: 0 }, swipeEnabled: false }}
      />
      <Drawer.Screen
        name="AcercaDeDrawer"
        component={AcercaDe}
        options={{ drawerItemStyle: { height: 0 } }}
      />
    </Drawer.Navigator>
  );
}