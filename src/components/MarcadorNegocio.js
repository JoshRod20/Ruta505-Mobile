/**
 * MarcadorNegocio: pin de un negocio registrado en el mapa.
 * Muestra la foto de portada del negocio dentro del círculo del pin. Si el
 * negocio no tiene foto, si la foto pesa demasiado o si no se puede cargar,
 * se deja el ícono de su categoría (el de siempre).
 */

import React, { useState } from "react";
import { Image, Text, View } from "react-native";

import { mapaNicaraguaStyle } from "../styles/mapanicaragua/mapaNicaraguaStyle.js";
import IconoCategoria from "./common/IconoCategoria";
import { colorDeCategoria } from "../services/Categoriasexperiencias.js";

// Tope de la foto de portada para usarla en el pin (caracteres del data URI,
// ~150 KB). Hay muchos pines a la vez, así que las fotos pesadas se omiten.
const MAX_CARACTERES_FOTO = 200000;
const TAMANO_FOTO = 36;

// Burbuja con el nombre (solo en el pin seleccionado).
const COLOR_BURBUJA = "#8DB600";
const ALTO_BURBUJA = 30;
const ALTO_FLECHA = 8;
const ALTO_ETIQUETA = ALTO_BURBUJA + ALTO_FLECHA;

/** Devuelve la portada del negocio si es apta para el pin; si no, null. */
export function portadaParaPin(punto) {
  const foto = punto?.imagenes?.[0] ?? punto?.imagenUrls?.[0];
  if (typeof foto !== "string" || foto.length === 0) return null;
  if (foto.length > MAX_CARACTERES_FOTO) return null;
  return foto;
}

export default function MarcadorNegocio({
  punto,
  seleccionado = false,
  onIconoListo,
  onFotoLista,
}) {
  const portada = portadaParaPin(punto);
  const [fotoFallo, setFotoFallo] = useState(false);
  const mostrarFoto = !!portada && !fotoFallo;

  return (
    <View style={mapaNicaraguaStyle.marcadorContenedor}>
      {seleccionado && !!punto.titulo && (
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              height: ALTO_BURBUJA,
              maxWidth: 240,
              justifyContent: "center",
              backgroundColor: COLOR_BURBUJA,
              borderRadius: 6,
              paddingHorizontal: 12,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 13,
                color: "#1A1A1A",
              }}
            >
              {punto.titulo}
            </Text>
          </View>
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: 7,
              borderRightWidth: 7,
              borderTopWidth: ALTO_FLECHA,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderTopColor: COLOR_BURBUJA,
            }}
          />
        </View>
      )}
      <View
        style={[
          mapaNicaraguaStyle.marcadorPunto,
          mostrarFoto && {
            padding: 0,
            width: TAMANO_FOTO + 4,
            height: TAMANO_FOTO + 4,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        {mostrarFoto ? (
          <Image
            source={{ uri: portada }}
            style={{
              width: TAMANO_FOTO,
              height: TAMANO_FOTO,
              borderRadius: TAMANO_FOTO / 2,
            }}
            resizeMode="cover"
            onLoad={() => onFotoLista?.(`${punto.id}:${portada.length}`)}
            onError={() => setFotoFallo(true)}
          />
        ) : (
          <IconoCategoria
            categoria={punto.categoria}
            size={18}
            color={colorDeCategoria(punto.categoria)}
            onLoad={() => onIconoListo?.(punto.categoria)}
          />
        )}
      </View>
      {/* Espaciador del alto de la etiqueta: el centro del pin queda sobre
          la coordenada aunque la burbuja esté visible. */}
      {seleccionado && !!punto.titulo && <View style={{ height: ALTO_ETIQUETA }} />}
    </View>
  );
}
