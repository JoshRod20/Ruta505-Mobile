/**
 * CarruselLugares: tarjetas horizontales de lugares recomendados que se
 * muestran sobre la barra de navegación del mapa del turista.
 */

import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import useTabBarHeight from "../hooks/useTabBarHeight";
import { Ionicons } from "@expo/vector-icons";

import {
  buscarCategoria,
  iconoDeCategoria,
  colorDeCategoria,
} from "../services/Categoriasexperiencias";
import { distanciaKm } from "../services/lugaresRecomendadosService";
import {
  carruselLugaresStyle as s,
  ANCHO_TARJETA,
} from "../styles/mapanicaragua/CarruselLugaresStyle";

// Aire entre el carrusel y la barra de tabs custom.
const AIRE = 12;

function TarjetaLugar({ punto, origen, onPress }) {
  const foto = punto.imagenes?.[0] ?? punto.imagenUrls?.[0];
  const categoria = buscarCategoria(punto.categoria)?.label ?? "";
  const tipo = punto.etiquetaTipo ?? categoria;
  const tieneCalificacion = typeof punto.calificacion === "number";
  const km = origen
    ? distanciaKm(origen, { lat: punto.lat, lon: punto.lng })
    : null;

  return (
    <TouchableOpacity style={s.tarjeta} onPress={onPress} activeOpacity={0.85}>
      {foto ? (
        <Image source={{ uri: foto }} style={s.foto} resizeMode="cover" />
      ) : (
        <View style={[s.foto, s.fotoVacia]}>
          <Ionicons
            name={iconoDeCategoria(punto.categoria)}
            size={28}
            color={colorDeCategoria(punto.categoria)}
          />
        </View>
      )}

      <Text style={s.titulo} numberOfLines={2}>
        {punto.titulo}
      </Text>
      {!!tipo && (
        <Text style={s.categoria} numberOfLines={1}>
          {tipo}
        </Text>
      )}

      {!!punto.lugar && (
        <View style={s.filaLugar}>
          <Ionicons name="location-sharp" size={10} color="#0E5A34" />
          <Text style={s.lugarTexto} numberOfLines={1}>
            {punto.lugar}
          </Text>
        </View>
      )}

      <View style={s.filaPie}>
        {tieneCalificacion ? (
          <>
            <Ionicons name="star" size={11} color="#F5A623" />
            <Text style={s.calificacion}>{punto.calificacion.toFixed(1)}</Text>
          </>
        ) : punto.externo ? (
          <Text style={s.insigniaExterna}>Sin registrar</Text>
        ) : null}
        {km != null && (
          <Text style={s.distancia}>
            {km < 10 ? km.toFixed(1) : Math.round(km)} km
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

/**
 * @param {Object} props
 * @param {Array} props.lugares - Negocios registrados + lugares externos.
 * @param {{lat:number, lon:number}|null} props.origen - Ubicación del usuario.
 * @param {function} props.onSeleccionar - Se llama con el lugar tocado.
 */
export default function CarruselLugares({ lugares, origen, onSeleccionar }) {
  const tabBarHeight = useTabBarHeight();
  if (!lugares?.length) return null;

  return (
    <View
      style={[s.contenedor, { bottom: tabBarHeight + AIRE }]}
      pointerEvents="box-none"
    >
      <FlatList
        horizontal
        data={lugares}
        keyExtractor={(p) => p.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.lista}
        snapToInterval={ANCHO_TARJETA + 10}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <TarjetaLugar
            punto={item}
            origen={origen}
            onPress={() => onSeleccionar(item)}
          />
        )}
      />
    </View>
  );
}
