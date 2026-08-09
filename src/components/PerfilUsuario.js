import React from "react";
import { Text, View } from "react-native";

import FloatingNavButton from "./common/FloatingNavButton";
import { homeStyle } from "../styles/home/homeStyle";

export default function PerfilUsuario({ navigation }) {
  return (
    <View style={homeStyle.container}>
      <FloatingNavButton
        icon="arrow-back-outline"
        onPress={() => navigation.navigate("MainDrawer")}
        accessibilityLabel="Volver"
      />
      <Text style={homeStyle.title}>Mi cuenta</Text>
      <Text style={homeStyle.subtitle}>
        Aquí puedes mostrar el perfil del usuario, sus datos y opciones de cuenta.
      </Text>
    </View>
  );
}
