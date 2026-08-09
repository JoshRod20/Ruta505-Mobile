import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../components/Home";
import MapaNicaragua from "../components/MapaNicaragua";
import ExperienciasCulturales from "../screens/comunidad/experienciasCulturales";
import CustomTabBar from "../components/CustomTabBar";
import FloatingNavButton from "../components/common/FloatingNavButton";

const Tab = createBottomTabNavigator();

export default function NavigationTabs({ navigation, route }) {
  const initialTab = route?.params?.initialTab || "Inicio";

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
        <Tab.Screen name="Publicar experiencias" component={ExperienciasCulturales} />
      </Tab.Navigator>
    </>
  );
}