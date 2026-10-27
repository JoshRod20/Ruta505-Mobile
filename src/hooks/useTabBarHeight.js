/**
 * useTabBarHeight: alto total que ocupa la barra de pestañas (incluye el área
 * de la barra de navegación del sistema: 3 botones o línea de gestos).
 *
 * Úsalo para el paddingBottom de listas/scrolls y para el `bottom` de
 * elementos flotantes que deben quedar sobre la barra.
 */
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getMetrics } from "../utils/layout";

export default function useTabBarHeight() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  return getMetrics(width).barHeight + insets.bottom;
}
