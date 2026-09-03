import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import FloatingNavButton from "./common/FloatingNavButton";
import { homeStyle } from "../styles/home/homeStyle";
import perfilUsuarioStyle from "../styles/perfilusuario/perfilUsuarioStyle";

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
        Aquí puedes gestionar tu cuenta y configuración.
      </Text>

      <TouchableOpacity
        style={perfilUsuarioStyle.opcionBoton}
        onPress={() => navigation.navigate("ActivarDobleFactorDrawer")}
        activeOpacity={0.7}
      >
        <Text style={perfilUsuarioStyle.opcionBotonTexto}>
          Verificación en dos pasos
        </Text>
      </TouchableOpacity>
    </View>
  );
}
