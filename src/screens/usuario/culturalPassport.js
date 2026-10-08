/**
 * CulturalPassport: componente/pantalla de la aplicación Ruta505.
 */

import React from "react";
import { Text, View } from "react-native";

import { culturalPassportStyle } from "../../styles/usuario/culturalPassportStyle";

/**
 * CulturalPassport.
 */
export default function CulturalPassport() {
  return (
    <View style={culturalPassportStyle.container}>
      <Text style={culturalPassportStyle.title}>Pasaporte cultural</Text>
      <Text style={culturalPassportStyle.subtitle}>
        Aquí verás los sellos que has conseguido al escanear los QR de las experiencias.
      </Text>
    </View>
  );
}