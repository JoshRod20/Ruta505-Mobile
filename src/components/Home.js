import React from "react";
import { Text, View } from "react-native";

import { homeStyle } from "../styles/home/homeStyle";

export default function Home() {
  return (
    <View style={homeStyle.container}>
      <Text style={homeStyle.title}>Ruta505</Text>
      <Text style={homeStyle.subtitle}>
        Explora tu comunidad, revisa el mapa y publica experiencias desde la barra inferior.
      </Text>
    </View>
  );
}