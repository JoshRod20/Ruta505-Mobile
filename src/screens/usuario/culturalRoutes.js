import React from "react";
import { Text, View } from "react-native";

import { culturalRoutesStyle } from "../../styles/usuario/culturalRoutesStyle";

export default function CulturalRoutes() {
  return (
    <View style={culturalRoutesStyle.container}>
      <Text style={culturalRoutesStyle.title}>Rutas culturales</Text>
      <Text style={culturalRoutesStyle.subtitle}>
        Explora rutas culturales de Nicaragua y planea tu recorrido.
      </Text>
    </View>
  );
}