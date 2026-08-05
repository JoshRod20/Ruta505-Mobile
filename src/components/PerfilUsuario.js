import React from "react";
import { Text, View } from "react-native";

import { homeStyle } from "../styles/home/homeStyle";

export default function PerfilUsuario() {
  return (
    <View style={homeStyle.container}>
      <Text style={homeStyle.title}>Mi cuenta</Text>
      <Text style={homeStyle.subtitle}>
        Aquí puedes mostrar el perfil del usuario, sus datos y opciones de cuenta.
      </Text>
    </View>
  );
}
