import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Home from "../components/Home";
import MapaNicaragua from "../components/MapaNicaragua";
import ExperienciasCulturales from "../screens/comunidad/experienciasCulturales";
import { drawerStyle } from "../styles/navigation/navigationStyle";

const Tab = createBottomTabNavigator();

export default function NavigationTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#2E7D32",
          borderTopColor: "rgba(255,255,255,0.12)",
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "rgba(255,255,255,0.75)",
        tabBarLabelStyle: drawerStyle.tabLabel,
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Inicio") {
            return <Ionicons name="home-outline" size={size} color={color} />;
          }

          if (route.name === "Mapa") {
            return <Ionicons name="map-outline" size={size} color={color} />;
          }

          return <Ionicons name="add-circle-outline" size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={Home} />
      <Tab.Screen name="Mapa" component={MapaNicaragua} />
      <Tab.Screen name="Publicar experiencias" component={ExperienciasCulturales} />
    </Tab.Navigator>
  );
}
