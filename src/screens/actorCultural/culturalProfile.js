import React from "react";
import { Text, View } from "react-native";

import { culturalProfileStyle } from "../../styles/actorCultural/culturalProfileStyle";

export default function CulturalProfile() {
  return (
    <View style={culturalProfileStyle.container}>
      <Text style={culturalProfileStyle.title}>Perfil cultural</Text>
      <Text style={culturalProfileStyle.subtitle}>
        Aquí se mostrará el perfil público del actor cultural: biografía, oficio y experiencias.
      </Text>
    </View>
  );
}