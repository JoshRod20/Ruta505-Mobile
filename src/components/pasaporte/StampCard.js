/**
 * StampCard: sello coleccionable (desbloqueado) o candado (bloqueado).
 * Sirve tanto para insignias como para niveles de perfil.
 */

import React from "react";
import { Image, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { culturalPassportStyle as s } from "../../styles/usuario/culturalPassportStyle";

export default function StampCard({ item, size }) {
  const dims = { width: size, height: size * 1.32 };
  const caption = item.location ? (
    <View style={s.stampCaption}>
      <Text style={s.stampTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={s.stampLocation}>{item.location}</Text>
    </View>
  ) : null;

  if (!item.unlocked) {
    return (
      <View style={[s.stamp, s.stampLocked, dims]}>
        <View style={s.lockCircle}>
          <Ionicons name="lock-closed" size={size * 0.2} color="#A3A3A3" />
        </View>
        {caption}
      </View>
    );
  }

  return (
    <View style={[s.stamp, { backgroundColor: item.color || "#0B5D2E" }, dims]}>
      <Image source={item.image} style={s.stampImage} resizeMode="cover" />
      {caption}
    </View>
  );
}
