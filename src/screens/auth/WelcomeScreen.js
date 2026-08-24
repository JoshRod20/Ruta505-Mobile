import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import WelcomeScreenStyle from "../../styles/auth/WelcomeScreenStyle";

const WelcomeScreen = ({ navigation }) => {

  const handleIniciarSesion = () => {
    navigation.navigate("Login");
  };

  const handleRegistrarCuenta = () => {
    navigation.navigate("SeleccionarTipo");
  };

  return (
    <View style={WelcomeScreenStyle.contenedor}>

      <Image
        source={require("../../assets/images/LogoRuta505.png")}
        style={WelcomeScreenStyle.logo}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={WelcomeScreenStyle.boton}
        onPress={handleIniciarSesion}
        activeOpacity={0.85}
      >
        <Text style={WelcomeScreenStyle.botonTexto}>
          Iniciar Sesión
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={WelcomeScreenStyle.enlaceWrap}
        onPress={handleRegistrarCuenta}
        activeOpacity={0.7}
      >
        <Text style={WelcomeScreenStyle.enlaceTexto}>
          Registrar cuenta
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default WelcomeScreen;