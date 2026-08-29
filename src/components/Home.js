import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FloatingNavButton from "../components/common/FloatingNavButton";
import { homeStyle } from "../styles/home/homeStyle";

export default function Home() {
  const insets = useSafeAreaInsets();
  const topOffset = insets.top + 26;

  return (
    <View style={[homeStyle.container, { paddingTop: topOffset }]}>
      <FloatingNavButton />
      <Text style={homeStyle.title}>Ruta505</Text>
      <Text style={homeStyle.subtitle}>
        Explora tu comunidad, revisa el mapa y publica experiencias desde la
        barra inferior.
      </Text>
    </View>
  );
}