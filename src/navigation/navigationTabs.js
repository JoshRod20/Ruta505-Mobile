import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../components/Home";
import MapaNicaragua from "../components/MapaNicaragua";
import ExperienciasCulturales from "../screens/comunidad/experienciasCulturales";
import CustomTabBar from "../components/CustomTabBar";

const Tab = createBottomTabNavigator();

export default function NavigationTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Inicio" component={Home} />
      <Tab.Screen name="Mapa" component={MapaNicaragua} />
      <Tab.Screen name="Publicar experiencias" component={ExperienciasCulturales} />
    </Tab.Navigator>
  );
}