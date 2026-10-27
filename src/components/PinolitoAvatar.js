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
 * @param {number} acercar  Zoom sobre Pinolito (1 = cuerpo completo; 1.7 =
 *   se ve la cabeza, ideal para fotos de perfil redondas). El zoom se ancla
 *   arriba y al centro, así la cabeza (y el sombrero) nunca se cortan.
 * @param {number} ajusteVertical  Mueve a Pinolito, en % del alto del círculo
 *   (negativo = sube, positivo = baja). Afina el encuadre si hace falta.
 */
export default function PinolitoAvatar({
  style,
  acercar = 1,
  ajusteVertical = 0,
}) {
  const { equipadoGuardado, cargando } = usePinolito();

  // Capa interna más grande que el círculo, centrada horizontalmente y
  // pegada arriba; el contenedor recorta (overflow: hidden).
  const zoomStyle = {
    position: "absolute",
    width: `${acercar * 100}%`,
    height: `${acercar * 100}%`,
    left: `${-(acercar - 1) * 50}%`,
    top: `${ajusteVertical}%`,
  };

  if (cargando || !equipadoGuardado) {
    return (
      <View style={[style, styles.contenedor]}>
        <Image
          source={require("../assets/images/pinolito.png")}
          style={zoomStyle}
          resizeMode="contain"
        />
      </View>
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
      <View style={zoomStyle}>
        <Image source={cuerpo.capa} style={styles.capa} resizeMode="contain" />
        {accesorio && (
          <Image
            source={accesorio.capa}
            style={styles.capa}
            resizeMode="contain"
          />
        )}
        {sombrero && (
          <Image
            source={sombrero.capa}
            style={styles.capa}
            resizeMode="contain"
          />
        )}
      </View>
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