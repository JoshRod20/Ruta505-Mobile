import React from "react";
import { Text, View } from "react-native";

import { homeStyle } from "../styles/home/homeStyle";

export default function AcercaDe() {
  return (
    <View style={homeStyle.container}>
      <Text style={homeStyle.title}>Acerca de</Text>
      <Text style={homeStyle.subtitle}>
        Ruta505 conecta comunidad, mapa y experiencias culturales en una sola app.
      </Text>
    </View>
  );
}
