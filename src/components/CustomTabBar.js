import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { navigationTabsStyle as styles } from "../styles/navigation/navigationTabsStyle";

const ICONS = {
  Inicio: "home",
  Mapa: "location",
  Rutas: "return-up-back",
  Pasaporte: "book",
  Perfil: "person",
  "Publicar experiencias": "add-circle",
  "Generar QR": "qr-code",
  "Perfil cultural": "person-circle",
  Agenda: "calendar",
};

// Medidas base pensadas para un ancho de 360 dp.
// Todo escala con el ancho de pantalla, entre MIN_SCALE y MAX_SCALE.
const BASE_WIDTH = 360;
const MIN_SCALE = 0.85;
const MAX_SCALE = 1.25;

const BASE = {
  barHeight: 68,     // altura total de la barra
  notchDepth: 50,    // profundidad del hueco (más alto = más profundo)
  corner: 17,        // radio de las esquinas superiores
  edgeInset: -30,    // espacio entre el hueco y el borde (negativo = el hueco se sale de la pantalla)
  circle: 52,        // diámetro del círculo activo
  lift: -18,         // cuánto sube el ícono activo (más negativo = sube más)
  iconActive: 26,
  iconInactive: 26,  // más alto = íconos inactivos más grandes
};

const INACTIVE_SCALE = 0.8; // escala del ícono inactivo (más alto = más grande)

function getMetrics(width) {
  const s = Math.min(Math.max(width / BASE_WIDTH, MIN_SCALE), MAX_SCALE);
  return {
    barHeight: Math.round(BASE.barHeight * s),
    notchDepth: BASE.notchDepth * s,
    corner: BASE.corner * s,
    edgeInset: BASE.edgeInset * s,
    circle: Math.round(BASE.circle * s),
    lift: BASE.lift * s,
    iconActive: Math.round(BASE.iconActive * s),
    iconInactive: Math.round(BASE.iconInactive * s),
  };
}

function getBarPath(width, height, cx, m) {
  const { notchDepth, corner, edgeInset } = m;
  const maxHalf = notchDepth * 1.4;

  // Medio ancho simétrico: se reduce solo cerca de los bordes
  const half = Math.max(
    notchDepth * 0.3,
    Math.min(maxHalf, cx - edgeInset, width - cx - edgeInset)
  );

  let left = cx - notchWidth;
  let right = cx + notchWidth;

  // La esquina se encoge si no hay espacio para ella
  const cl = Math.min(corner, Math.max(left, 0));
  const cr = Math.min(corner, Math.max(width - right, 0));

  return `
    M0,${CORNER_RADIUS}
    Q0,0 ${CORNER_RADIUS},0
    L${left},0
    C${left + half * 0.55},0 ${cx - half * 0.45},${notchDepth} ${cx},${notchDepth}
    C${cx + half * 0.45},${notchDepth} ${right - half * 0.55},0 ${right},0
    L${width - cr},0
    Q${width},0 ${width},${cr}
    L${width},${height}
    L0,${height}
    Z
  `.replace(/\s+/g, " ").trim();
}

export default function CustomTabBar({ state, descriptors, navigation }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const m = useMemo(() => getMetrics(width), [width]);

  const numTabs = state.routes.length;
  const tabWidth = width / numTabs;
  const totalHeight = m.barHeight + insets.bottom;
  const centerOf = (index) => tabWidth * (index + 0.5);

  const notchX = useRef(new Animated.Value(centerOf(state.index))).current;
  const [pathD, setPathD] = useState(() =>
    getBarPath(width, totalHeight, centerOf(state.index), m)
  );

  // Una animación por ruta (por key), así soporta que las pestañas cambien
  const liftAnims = useRef({});
  state.routes.forEach((r, i) => {
    if (!liftAnims.current[r.key]) {
      liftAnims.current[r.key] = new Animated.Value(i === state.index ? 1 : 0);
    }
  });

  // 1) Cada cambio del valor animado recalcula el path
  useEffect(() => {
    const id = notchX.addListener(({ value }) => {
      setPathD(getBarPath(width, totalHeight, value, m));
    });
    return () => notchX.removeListener(id);
  }, [notchX, width, totalHeight, m]);

  // 2) Si cambia el ancho, el inset o el número de pestañas, recoloca sin animar
  useEffect(() => {
    notchX.setValue(centerOf(state.index));
  }, [width, totalHeight, numTabs]);

  // 3) Anima cuando cambia la pestaña activa, sin importar quién la cambió
  useEffect(() => {
    Animated.spring(notchX, {
      toValue: centerOf(state.index),
      useNativeDriver: false,
      friction: 6,   // más alto = menos rebote, más "seco"
      tension: 70,   // más alto = más rápido
    }).start();

    state.routes.forEach((route, i) => {
      Animated.spring(liftAnims.current[route.key], {
        toValue: i === state.index ? 1 : 0,
        useNativeDriver: true,
        friction: 6,
        tension: 90,
      }).start();
    });
  }, [state.index]);

  return (
    <View
      style={[
        styles.tabBar,
        { height: totalHeight, paddingBottom: insets.bottom },
      ]}
    >
      <Svg width={width} height={totalHeight} style={styles.svgBackground}>
        <Path fill={styles.barColor} d={pathD} />
      </Svg>

      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const lift = liftAnims.current[route.key];
        const { options } = descriptors[route.key];

        const onPress = () => {
          // El "+" no cambia de pestaña. TODO: abrir aquí las opciones de
          // registro cuando estén definidas.
          if (route.name === "Agregar") {
            return;
          }

          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const translateY = lift.interpolate({
          inputRange: [0, 1],
          outputRange: [0, m.lift],
        });
        const scale = lift.interpolate({
          inputRange: [0, 1],
          outputRange: [INACTIVE_SCALE, 1],
        });

        const iconName = ICONS[route.name] || "ellipse";

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.8}
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? route.name}
            testID={options.tabBarButtonTestID ?? `tab-${route.name}`}
            style={[styles.tabButton, { width: tabWidth, height: m.barHeight }]}
          >
            <Animated.View
              style={[
                styles.iconWrapper,
                {
                  width: m.circle,
                  height: m.circle,
                  transform: [{ translateY }, { scale }],
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.iconCircle,
                  {
                    width: m.circle,
                    height: m.circle,
                    borderRadius: m.circle / 2,
                    opacity: lift,
                    backgroundColor: styles.activeCircleColor,
                  },
                ]}
              />
              <Ionicons
                name={isFocused ? iconName : `${iconName}-outline`}
                size={isFocused ? m.iconActive : m.iconInactive}
                color={
                  isFocused ? styles.activeTintColor : styles.inactiveTintColor
                }
                style={{ position: "absolute" }}
              />
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}