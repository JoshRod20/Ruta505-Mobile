import React from "react";
import { Image, StyleSheet, View } from "react-native";

import { usePinolito } from "../hooks/usePinolito";
import { ITEMS } from "../constants/pinolitoCatalogo";

const porId = (id) => ITEMS.find((i) => i.id === id);

/**
 * Pinolito vestido con el atuendo que el usuario guardó.
 * Mismas capas que la pantalla de Pinolito: cuerpo -> accesorio -> sombrero.
 * Mientras carga el atuendo muestra la imagen por defecto.
 *
 * @param {object} style  Estilo del contenedor (tamaño, bordes...).
 */
export default function PinolitoAvatar({ style }) {
  const { equipadoGuardado, cargando } = usePinolito();

  if (cargando || !equipadoGuardado) {
    return (
      <Image
        source={require("../assets/images/pinolito.png")}
        style={style}
        resizeMode="cover"
      />
    );
  }

  const cuerpo = porId(equipadoGuardado.cuerpo) ?? porId("cuerpo_1");
  const sombrero = equipadoGuardado.sombrero
    ? porId(equipadoGuardado.sombrero)
    : null;
  const accesorio = equipadoGuardado.accesorio
    ? porId(equipadoGuardado.accesorio)
    : null;

  return (
    <View style={[style, styles.contenedor]}>
      <Image source={cuerpo.capa} style={styles.capa} resizeMode="contain" />
      {accesorio && (
        <Image source={accesorio.capa} style={styles.capa} resizeMode="contain" />
      )}
      {sombrero && (
        <Image source={sombrero.capa} style={styles.capa} resizeMode="contain" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { overflow: "hidden" },
  capa: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
});