import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FloatingNavButton from "../components/common/FloatingNavButton";
import { mapaNicaraguaStyle } from "../styles/mapanicaragua/mapaNicaraguaStyle";

export default function MapaNicaragua() {
  const insets = useSafeAreaInsets();
  const topOffset = insets.top + 4 + 28 + 4;

  return (
    <View style={[mapaNicaraguaStyle.container, { paddingTop: topOffset }]}>
      <FloatingNavButton />
      <Text style={mapaNicaraguaStyle.title}>Mapa de Nicaragua</Text>
      <Text style={mapaNicaraguaStyle.subtitle}>
        Aquí puedes integrar el mapa interactivo de ubicaciones y puntos de interés.
      </Text>
    </View>
  );
}