/**
 * StampCard: sello coleccionable (desbloqueado) o sello gris con candado (bloqueado).
 * Sirve tanto para insignias como para niveles de perfil.
 *
 * Las imágenes son PNG con fondo transparente y el borde dentado de una
 * estampilla, así que se dibujan completas (resizeMode "contain") sobre su
 * propia proporción, sin recortarlas ni meterlas en un rectángulo redondeado.
 * El sello bloqueado es la MISMA imagen teñida de gris (tintColor): queda la
 * silueta con el borde dentado y el candado encima.
 */

import React from "react";
import { Image, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { culturalPassportStyle as s } from "../../styles/usuario/culturalPassportStyle";

const GRIS_BLOQUEADO = "#ADADAD";
// Margen del borde dentado: la leyenda (si la hay) se coloca dentro de él.
const MARGEN_LEYENDA = 0.1;

/** Alto de un sello del ancho dado, según la proporción real de su imagen. */
export function altoDeSello(image, ancho) {
  const fuente = Image.resolveAssetSource(image);
  if (!fuente?.width || !fuente?.height) return ancho;
  return (ancho * fuente.height) / fuente.width;
}

export default function StampCard({ item, size }) {
  const dims = { width: size, height: altoDeSello(item.image, size) };

  // Si el arte no trae el texto dentro, se escribe encima del sello.
  const leyenda =
    item.location && !item.leyendaIncluida ? (
      <View
        style={[
          s.stampCaption,
          { left: size * MARGEN_LEYENDA, right: size * MARGEN_LEYENDA, bottom: size * MARGEN_LEYENDA },
        ]}
      >
        <Text style={s.stampTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={s.stampLocation}>{item.location}</Text>
      </View>
    ) : null;

  if (!item.unlocked) {
    return (
      <View style={dims}>
        <Image
          source={item.image}
          style={dims}
          resizeMode="contain"
          tintColor={GRIS_BLOQUEADO}
        />
        <View style={[s.stampCandadoZona, dims]}>
          <View style={s.lockCircle}>
            <Ionicons name="lock-closed" size={size * 0.2} color="#A3A3A3" />
          </View>
        </View>
        {leyenda}
      </View>
    );
  }

  return (
    <View style={dims}>
      <Image source={item.image} style={dims} resizeMode="contain" />
      {leyenda}
    </View>
  );
}
