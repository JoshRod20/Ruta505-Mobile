import { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Easing,
  ScrollView,
  ImageBackground,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SeleccionarTipoScreenStyle from "../../styles/auth/SeleccionarTipoScreenStyle";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Altura de la banda donde vive la curva SVG (misma que LoginScreen).
const CURVE_HEIGHT = 130;

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
  const insets = useSafeAreaInsets();

  const handleVolver = () => {
    navigation.goBack();
  };

  const handleIrALogin = () => {
    animarSwitcher(1);

    setTimeout(() => {
      navigation.navigate("Login");
    }, 280);
  };

  return (
    <View style={SeleccionarTipoScreenStyle.contenedor} testID="seleccionar-tipo-screen">

      {/* ==================================================
          HEADER CON PATRÓN CULTURAL + CURVA
          ================================================== */}

      <View style={SeleccionarTipoScreenStyle.header}>

        <ImageBackground
          source={require("../../assets/images/PatronRuta505.png")}
          style={SeleccionarTipoScreenStyle.headerPatron}
          resizeMode="cover"
        >

          <TouchableOpacity
            testID="seleccionar-tipo-back-button"
            style={[
              SeleccionarTipoScreenStyle.botonVolver,
              { top: insets.top + 10 },
            ]}
            onPress={handleVolver}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color="#2b2b2b"
            />
          </TouchableOpacity>

        </ImageBackground>

        <Svg
          style={SeleccionarTipoScreenStyle.curva}
          width={SCREEN_WIDTH}
          height={CURVE_HEIGHT}
          viewBox={`0 0 ${SCREEN_WIDTH} ${CURVE_HEIGHT}`}
        >
          <Path
            fill="#ffffff"
            d={`
              M0,${CURVE_HEIGHT * 0.99}
              C${SCREEN_WIDTH * 0.20},${CURVE_HEIGHT * 0.98} ${SCREEN_WIDTH * 0.38},${CURVE_HEIGHT * 0.85} ${SCREEN_WIDTH * 0.50},${CURVE_HEIGHT * 0.62}
              C${SCREEN_WIDTH * 0.62},${CURVE_HEIGHT * 0.40} ${SCREEN_WIDTH * 0.72},${CURVE_HEIGHT * 0.15} ${SCREEN_WIDTH * 0.85},${CURVE_HEIGHT * 0.06}
              C${SCREEN_WIDTH * 0.90},${CURVE_HEIGHT * 0.02} ${SCREEN_WIDTH * 0.95},0 ${SCREEN_WIDTH},0
              L${SCREEN_WIDTH},${CURVE_HEIGHT}
              L0,${CURVE_HEIGHT}
              Z
            `}
          />
        </Svg>

      </View>

      {/* ==================================================
          CONTENIDO
          ================================================== */}

      <ScrollView
        style={SeleccionarTipoScreenStyle.scroll}
        contentContainerStyle={SeleccionarTipoScreenStyle.card}
        showsVerticalScrollIndicator={false}
      >

        {/* Título */}
        <Text style={SeleccionarTipoScreenStyle.titulo}>
          Elige tu tipo de{"\n"}usuario
        </Text>

        {/* Opciones de usuario */}
        <View style={SeleccionarTipoScreenStyle.opcionesContainer}>
          {tiposUsuario.map((tipo) => (
            <TouchableOpacity
              key={tipo.id}
              testID={`seleccionar-tipo-option-${tipo.id}`}
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

      </ScrollView>

    </View>
  );
};

export default SeleccionarTipoScreen;