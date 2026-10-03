import React from "react";
import { Text, View } from "react-native";

import { generateQrStyle } from "../../styles/actorCultural/generateQrStyle";

export default function GenerateQr() {
  return (
    <View style={generateQrStyle.container}>
      <Text style={generateQrStyle.title}>Generar QR</Text>
      <Text style={generateQrStyle.subtitle}>
        Genera el código QR de tus experiencias para que los turistas lo escaneen y sellen su pasaporte.
      </Text>
    </View>
  );
}