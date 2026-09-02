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
      <Drawer.Screen
        name="MiCuentaDrawer"
        component={PerfilUsuario}
        options={{ drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="ActivarDobleFactorDrawer"
        component={ActivarDobleFactorScreen}
        options={{ drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="AcercaDeDrawer"
        component={AcercaDe}
        options={{ drawerItemStyle: { height: 0 } }}
      />
    </Drawer.Navigator>
  );
}