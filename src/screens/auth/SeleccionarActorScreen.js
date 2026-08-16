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
import SeleccionarActorScreenStyle from "../../styles/auth/SeleccionarActorScreenStyle";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const actoresCulturales = [
  {
    id: "comunidad",
    titulo: "Comunidad",
    imagen: require("../../assets/images/Comunidad.png"), 
    ruta: "RegistroComunidad",
  },
  {
    id: "artesano",
    titulo: "Artesano",
    imagen: require("../../assets/images/Artesano.png"), 
    ruta: "RegistroArtesano",
  },
  {
    id: "emprendedor",
    titulo: "Emprendedor\nCultural",
    imagen: require("../../assets/images/Emprendedor Cultural.png"), 
    ruta: "RegistroEmprendedor",
  },
  {
    id: "guia",
    titulo: "Guía",
    imagen: require("../../assets/images/Guía.png"), 
    ruta: "RegistroGuia",
  },
];

const SeleccionarActorScreen = ({ navigation }) => {
  // ==================================================
  // ANIMACIÓN DEL SWITCHER
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
    <View style={SeleccionarActorScreenStyle.contenedor}>
      {/* Fondo verde superior */}
      <View style={SeleccionarActorScreenStyle.header} />

      {/* Tarjeta blanca */}
      <View style={SeleccionarActorScreenStyle.card}>
        {/* ================================================
            SWITCHER
            ================================================ */}
        <View
          style={[
            SeleccionarActorScreenStyle.switcherWrap,
            { width: switcherWidth },
          ]}
        >
          <Animated.View
            style={[
              SeleccionarActorScreenStyle.switcherIndicator,
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

          <TouchableOpacity
            style={SeleccionarActorScreenStyle.switcherBtn}
            activeOpacity={0.8}
            onPress={() => animarSwitcher(0)}
          >
            <Text style={SeleccionarActorScreenStyle.switcherTexto}>
              Registrarse
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={SeleccionarActorScreenStyle.switcherBtn}
            activeOpacity={0.8}
            onPress={handleIrALogin}
          >
            <Text style={SeleccionarActorScreenStyle.switcherTexto}>
              Iniciar sesión
            </Text>
          </TouchableOpacity>
        </View>

        {/* Título */}
        <Text style={SeleccionarActorScreenStyle.titulo}>
          Elige que tipo de{"\n"}Actor eres
        </Text>

        {/* Grid 2x2 */}
        <View style={SeleccionarActorScreenStyle.grid}>
          {actoresCulturales.map((actor) => (
            <TouchableOpacity
              key={actor.id}
              style={SeleccionarActorScreenStyle.opcion}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(actor.ruta)}
            >
              <View style={SeleccionarActorScreenStyle.imagenContainer}>
                <Image
                  source={actor.imagen}
                  style={SeleccionarActorScreenStyle.imagen}
                  resizeMode="contain"
                />
              </View>
              <Text style={SeleccionarActorScreenStyle.opcionTitulo}>
                {actor.titulo}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default SeleccionarActorScreen;