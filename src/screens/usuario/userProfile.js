/**
 * UserProfile: componente/pantalla de la aplicación Ruta505.
 */

import React from "react";
import { Text, View } from "react-native";

import { userProfileStyle } from "../../styles/usuario/userProfileStyle";

/**
 * UserProfile.
 */
export default function UserProfile() {
  return (
    <View style={userProfileStyle.container}>
      <Text style={userProfileStyle.title}>Mi perfil</Text>
      <Text style={userProfileStyle.subtitle}>
        Aquí verás tus datos, tus favoritos y las opciones de tu cuenta.
      </Text>
    </View>
  );
}