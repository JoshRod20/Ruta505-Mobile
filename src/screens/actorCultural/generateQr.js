import React from "react";
import { Text, View } from "react-native";

import { generateQrStyle } from "../../styles/actorCultural/generateQrStyle";

export default function GenerateQr() {
  return (
    <View style={generateQrStyle.container}>
      <Text style={generateQrStyle.title}>Generar QR</Text>
      <Text style={generateQrStyle.subtitle}>
        Aquí podrás generar un código QR para compartir tu perfil o experiencia cultural.
      </Text>
    </View>
  );
}