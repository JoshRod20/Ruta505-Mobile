import { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import SeleccionarTipoScreenStyle from "../../styles/auth/SeleccionarTipoScreenStyle";

const { width } = Dimensions.get("window");

const tiposUsuario = [
  {
    id: "turista",
    titulo: "Turista",
    imagen: require("../../assets/images/Turista.png"),
    ruta: "RegistroTurista",
  },
  {
    id: "actor-cultural",
    titulo: "Actor Cultural",
    imagen: require("../../assets/images/Actor Cultural.png"),
    ruta: "SeleccionarActor",
  },
];

const SeleccionarTipoScreen = ({ navigation }) => {
  // ==================================================
  // ANIMACIÓN DEL SWITCHER (idéntica a LoginScreen)
  // ==================================================
  const switcherAnimation = useRef(new Animated.Value(0)).current; // 0 = Registrarse

  const switcherWidth = 246;
  const switcherButtonWidth = switcherWidth / 2;

  const animarSwitcher = (valor) => {
    Animated.timing(switcherAnimation, {
      toValue: valor,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const handleIrALogin = () => {
    animarSwitcher(1);

    setTimeout(() => {
      navigation.navigate("Login");
    }, 280);
  };

  return (
    <View style={SeleccionarTipoScreenStyle.contenedor}>
      {/* Fondo verde superior */}
      <View style={SeleccionarTipoScreenStyle.header} />

      {/* Tarjeta blanca */}
      <View style={SeleccionarTipoScreenStyle.card}>
        {/* ================================================
            SWITCHER ANIMADO (idéntico a Login)
            ================================================ */}
        <View
          style={[
            SeleccionarTipoScreenStyle.switcherWrap,
            { width: switcherWidth },
          ]}
        >
          {/* Pastilla verde animada */}
          <Animated.View
            style={[
              SeleccionarTipoScreenStyle.switcherIndicator,
              {
                width: switcherButtonWidth,
                transform: [
                  {
                    translateX: switcherAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, switcherButtonWidth],
                    }),
                  },
                ],
              },
            ]}
          />

          {/* Registrarse */}
          <TouchableOpacity
            style={SeleccionarTipoScreenStyle.switcherBtn}
            activeOpacity={0.8}
            onPress={() => animarSwitcher(0)}
          >
            <Text style={SeleccionarTipoScreenStyle.switcherTexto}>
              Registrarse
            </Text>
          </TouchableOpacity>

          {/* Iniciar sesión */}
          <TouchableOpacity
            style={SeleccionarTipoScreenStyle.switcherBtn}
            activeOpacity={0.8}
            onPress={handleIrALogin}
          >
            <Text style={SeleccionarTipoScreenStyle.switcherTexto}>
              Iniciar sesión
            </Text>
          </TouchableOpacity>
        </View>

        {/* Título */}
        <Text style={SeleccionarTipoScreenStyle.titulo}>
          Elige tu tipo de{"\n"}usuario
        </Text>

        {/* Opciones de usuario */}
        <View style={SeleccionarTipoScreenStyle.opcionesContainer}>
          {tiposUsuario.map((tipo) => (
            <TouchableOpacity
              key={tipo.id}
              style={SeleccionarTipoScreenStyle.opcion}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(tipo.ruta)}
            >
              <View style={SeleccionarTipoScreenStyle.imagenContainer}>
                <Image
                  source={tipo.imagen}
                  style={SeleccionarTipoScreenStyle.imagen}
                  resizeMode="contain"
                />
              </View>
              <Text style={SeleccionarTipoScreenStyle.opcionTitulo}>
                {tipo.titulo}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default SeleccionarTipoScreen;