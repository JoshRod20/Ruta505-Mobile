import React from "react";
import { Text, View } from "react-native";

import { mapaNicaraguaStyle } from "../styles/mapanicaragua/mapaNicaraguaStyle";

export default function MapaNicaragua() {
  return (
    <View style={mapaNicaraguaStyle.container}>
      <Text style={mapaNicaraguaStyle.title}>Mapa de Nicaragua</Text>
      <Text style={mapaNicaraguaStyle.subtitle}>
        Aquí puedes integrar el mapa interactivo de ubicaciones y puntos de interés.
      </Text>
    </View>
  );
}