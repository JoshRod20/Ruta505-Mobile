import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import PerfilUsuario from "../components/PerfilUsuario";
import AcercaDe from "../screens/acercaDe";
import NavigationTabs from "./navigationTabs";
import { useAuth } from "../context/AuthContext";
import { drawerStyle } from "../styles/navigation/navigationDrawerStyle";

const Drawer = createDrawerNavigator();

// Nombre único de la pantalla del drawer que contiene los tabs.
// Los nombres de las pestañas ("Inicio", "Mapa", "Publicar experiencias")
// viven DENTRO de NavigationTabs, nunca como Drawer.Screen aparte —
// así evitamos tanto la colisión de nombres como tener 3 copias
// distintas del mismo Tab.Navigator con estado independiente.
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
        {/*
          El drawer solo lista lo que NO está en la barra de tabs
          (Inicio, Mapa, Publicar experiencias ya se acceden desde ahí).
          Esto evita el problema de saltar entre tabs "por fuera" del
          Tab.Navigator, que era la causa de los bugs anteriores.
        */}
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
      {/*
        UNA sola pantalla para los tabs. "Inicio", "Mapa" y "Publicar
        experiencias" viven DENTRO de este NavigationTabs, no aquí — el
        drawer nunca navega hacia ellas, solo hacia lo que no está en
        la barra de tabs (Mi cuenta, Acerca de).
      */}
      <Drawer.Screen
        name={MAIN_ROUTE}
        component={NavigationTabs}
        options={{ drawerItemStyle: { height: 0 } }} // no lo listamos aquí, ya está en el menú custom
      />
      <Drawer.Screen
        name="MiCuentaDrawer"
        component={PerfilUsuario}
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