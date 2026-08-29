import React from "react";
import { Text, View } from "react-native";

import FloatingNavButton from "../components/common/FloatingNavButton";
import { homeStyle } from "../styles/home/homeStyle";

export default function AcercaDe({ navigation }) {
  return (
    <View style={homeStyle.container}>
      <FloatingNavButton
        icon="arrow-back-outline"
        onPress={() => navigation.navigate("MainDrawer")}
        accessibilityLabel="Volver"
      />
      <Text style={homeStyle.title}>Acerca de</Text>
      <Text style={homeStyle.subtitle}>
        Ruta505 conecta comunidad, mapa y experiencias culturales en una sola app.
      </Text>
    </View>
  );
}
