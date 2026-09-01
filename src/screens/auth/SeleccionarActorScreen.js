import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  ImageBackground,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SeleccionarActorScreenStyle from "../../styles/auth/SeleccionarActorScreenStyle";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Altura de la banda donde vive la curva SVG (misma que Login y SeleccionarTipo).
const CURVE_HEIGHT = 130;

import { ACTOR_TYPES } from "../../constants/roles";

const actoresCulturales = [
  {
    id: ACTOR_TYPES.COMUNIDAD,
    titulo: "Comunidad",
    imagen: require("../../assets/images/Comunidad.png"),
  },
  {
    id: ACTOR_TYPES.ARTESANO,
    titulo: "Artesano",
    imagen: require("../../assets/images/Artesano.png"),
  },
  {
    id: ACTOR_TYPES.EMPRENDEDOR,
    titulo: "Emprendedor\nCultural",
    imagen: require("../../assets/images/Emprendedor Cultural.png"),
  },
  {
    id: ACTOR_TYPES.GUIA,
    titulo: "Guía",
    imagen: require("../../assets/images/Guía.png"),
  },
];

const SeleccionarActorScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const handleVolver = () => {
    navigation.goBack();
  };

  return (
    <View style={SeleccionarActorScreenStyle.contenedor} testID="seleccionar-actor-screen">

      {/* ==================================================
          HEADER CON PATRÓN CULTURAL + CURVA
          ================================================== */}

      <View style={SeleccionarActorScreenStyle.header}>

        <ImageBackground
          source={require("../../assets/images/PatronRuta505.png")}
          style={SeleccionarActorScreenStyle.headerPatron}
          resizeMode="cover"
        >

          <TouchableOpacity
            testID="seleccionar-actor-back-button"
            style={[
              SeleccionarActorScreenStyle.botonVolver,
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
          style={SeleccionarActorScreenStyle.curva}
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
        style={SeleccionarActorScreenStyle.scroll}
        contentContainerStyle={SeleccionarActorScreenStyle.card}
        showsVerticalScrollIndicator={false}
      >

        {/* Título */}
        <Text style={SeleccionarActorScreenStyle.titulo}>
          Elige que tipo de{"\n"}Actor eres
        </Text>

        {/* Grid 2x2 */}
        <View style={SeleccionarActorScreenStyle.grid}>
          {actoresCulturales.map((actor) => (
            <TouchableOpacity
              key={actor.id}
              testID={`seleccionar-actor-option-${actor.id}`}
              style={SeleccionarActorScreenStyle.opcion}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("RegistroActor", { tipoActor: actor.id })
              }
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

      </ScrollView>

    </View>
  );
};

export default SeleccionarActorScreen;