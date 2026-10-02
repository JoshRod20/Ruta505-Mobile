import React, { useRef, useState, useEffect } from "react";
import { View, TouchableOpacity, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { navigationTabsStyle as styles } from "../styles/navigation/navigationTabsStyle";

const ICONS = {
  Inicio: "home",
  Mapa: "location",
  "Publicar experiencias": "add-circle",
  Rutas: "return-up-back",
  Agenda: "calendar",
  Perfil: "person",
  "Generar QR": "qr-code",
  "Perfil cultural": "person-circle",
};

const ICON_SIZE_ACTIVE = 26;
const ICON_SIZE_INACTIVE = 26;   // más alto = íconos inactivos más grandes

const BAR_HEIGHT = 68;      // altura total de la barra
const NOTCH_RADIUS = 50;    // profundidad del hueco (más alto = más profundo)
const CORNER_RADIUS = 17;   // radio de las esquinas superiores de la barra

const EDGE_INSET = -30; // espacio mínimo entre el hueco y el borde (0 = el hueco toca el borde)

function getBarPath(width, height, cx, tabWidth) {
  const maxHalf = NOTCH_RADIUS * 1.4;

  // Medio ancho simétrico: se reduce solo cerca de los bordes
  const half = Math.max(
    NOTCH_RADIUS * 0.3,
    Math.min(maxHalf, cx - EDGE_INSET, width - cx - EDGE_INSET)
  );

  const left = cx - half;
  const right = cx + half;

  // La esquina se encoge si no hay espacio para ella
  const cl = Math.min(CORNER_RADIUS, Math.max(left, 0));
  const cr = Math.min(CORNER_RADIUS, Math.max(width - right, 0));

  return `
    M0,${cl}
    Q0,0 ${cl},0
    L${left},0
    C${left + half * 0.55},0 ${cx - half * 0.45},${NOTCH_RADIUS} ${cx},${NOTCH_RADIUS}
    C${cx + half * 0.45},${NOTCH_RADIUS} ${right - half * 0.55},0 ${right},0
    L${width - cr},0
    Q${width},0 ${width},${cr}
    L${width},${height}
    L0,${height}
    Z
  `.replace(/\s+/g, " ").trim();
}

export default function CustomTabBar({ state, descriptors, navigation }) {
  const [barWidth, setBarWidth] = useState(Dimensions.get("window").width);
  const numTabs = state.routes.length;
  const tabWidth = barWidth / numTabs;

  const notchX = useRef(
    new Animated.Value(tabWidth * (state.index + 0.5))
  ).current;

  // Estado plano que guarda el path actual, recalculado en cada frame
  const [pathD, setPathD] = useState(
    getBarPath(barWidth, BAR_HEIGHT, tabWidth * (state.index + 0.5), tabWidth)
  );

  const liftAnims = useRef(
    state.routes.map((_, i) => new Animated.Value(i === state.index ? 1 : 0))
  ).current;

  // Escucha cada cambio del valor animado y recalcula el path como JS puro
  useEffect(() => {
    const id = notchX.addListener(({ value }) => {
      setPathD(getBarPath(barWidth, BAR_HEIGHT, value, tabWidth));
    });
    return () => notchX.removeListener(id);
  }, [barWidth, tabWidth]);

  const animateTo = (index) => {
    Animated.spring(notchX, {
      toValue: tabWidth * (index + 0.5),
      useNativeDriver: false,
      friction: 6,   // más alto = menos rebote, más "seco"
      tension: 70,   // más alto = más rápido
    }).start();

    liftAnims.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i === index ? 1 : 0,
        useNativeDriver: true,
        friction: 6,
        tension: 90,
      }).start();
    });
  };

  const onLayout = (e) => {
    const w = e.nativeEvent.layout.width;
    const newTabWidth = w / numTabs;
    setBarWidth(w);
    const cx = newTabWidth * (state.index + 0.5);
    notchX.setValue(cx);
    setPathD(getBarPath(w, BAR_HEIGHT, cx, newTabWidth));
  };

  return (
    <View style={styles.tabBar} onLayout={onLayout}>
      <Svg width={barWidth} height={BAR_HEIGHT} style={styles.svgBackground}>
        <Path fill={styles.barColor} d={pathD} />
      </Svg>

      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const lift = liftAnims[index];

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            animateTo(index);
            navigation.navigate(route.name);
          }
        };

        const translateY = lift.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -18], // translateY: qué tanto sube el ícono (más negativo = sube más)
        });
        const scale = lift.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1], // tamaño del ícono (más alto = ícono inactivo más grande)
        });

        const iconName = ICONS[route.name] || "ellipse";

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.8}
            style={[styles.tabButton, { width: tabWidth }]}
          >
            <Animated.View
              style={[
                styles.iconWrapper,
                { transform: [{ translateY }, { scale }] },
              ]}
            >
              <Animated.View
                style={[
                  styles.iconCircle,
                  {
                    opacity: lift,
                    backgroundColor: styles.activeCircleColor,
                  },
                ]}
              />
              <Ionicons
                name={isFocused ? iconName : `${iconName}-outline`}
                size={isFocused ? ICON_SIZE_ACTIVE : ICON_SIZE_INACTIVE}
                color={isFocused ? styles.activeTintColor : styles.inactiveTintColor}
                style={{ position: "absolute" }}
              />
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}