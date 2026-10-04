import React from "react";
import { Text, View } from "react-native";

import { culturalProfileStyle } from "../../styles/actorCultural/culturalProfileStyle";

export default function CulturalProfile() {
  return (
    <View style={culturalProfileStyle.container}>
      <Text style={culturalProfileStyle.title}>Perfil cultural</Text>
      <Text style={culturalProfileStyle.subtitle}>
        Aquí se mostrará tu perfil de actor cultural: biografía, oficio, experiencias y estadísticas.
      </Text>
    </View>
  );
}