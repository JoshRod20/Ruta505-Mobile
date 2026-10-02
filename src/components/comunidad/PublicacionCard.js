import React, { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  publicacionCardStyle as styles,
  ANCHO_IMAGEN,
} from "../../styles/home/publicacionCardStyle";
import { formatearTiempoRelativo } from "../../utils/tiempoRelativo";

const VERDE = "#0E5A34";

// TODO: reemplazar por el nombre/foto real del perfil cuando se implemente
// esa parte (por ahora el encabezado muestra el título de la experiencia).
const ETIQUETAS_ACTOR = {
  comunidad: "Comunidad",
  artesano: "Artesano/a",
  guia: "Guía turístico/a",
  emprendedor: "Emprendedor/a",
};

export default function PublicacionCard({ experiencia }) {
  const [indiceImagen, setIndiceImagen] = useState(0);
  // Solo visual por ahora: no hay colección de "likes" ni "guardados"
  // en Firestore todavía, así que esto no se persiste.
  const [likeActivo, setLikeActivo] = useState(false);
  const [guardadoActivo, setGuardadoActivo] = useState(false);

  const imagenes = experiencia.imagenUrls?.length
    ? experiencia.imagenUrls
    : experiencia.imagenes || [];

  const totalLikes = (experiencia.likes || 0) + (likeActivo ? 1 : 0);
  const titulo =
    experiencia.titulo || ETIQUETAS_ACTOR[experiencia.actorType] || "Ruta505";
  const ubicacion = experiencia.lugar || experiencia.ubicacionExacta;

  const handleScrollFin = (evento) => {
    const nuevoIndice = Math.round(
      evento.nativeEvent.contentOffset.x / ANCHO_IMAGEN
    );
    setIndiceImagen(nuevoIndice);
  };

  return (
    <View style={styles.card}>
      {/* Encabezado */}
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person-outline" size={20} color="#8C7B66" />
        </View>
        <View style={styles.headerTextos}>
          <View style={styles.filaTitulo}>
            <Text style={styles.titulo} numberOfLines={1}>
              {titulo}
            </Text>
            {experiencia.verificado === true && (
              <Ionicons
                name="checkmark-circle"
                size={15}
                color="#1A1A1A"
                style={styles.verificado}
              />
            )}
          </View>
          {!!ubicacion && (
            <View style={styles.filaUbicacion}>
              <Ionicons name="location-sharp" size={13} color={VERDE} />
              <Text style={styles.ubicacionTexto} numberOfLines={1}>
                {ubicacion}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Carrusel de fotos */}
      {imagenes.length > 0 ? (
        <View style={styles.carruselContenedor}>
          <FlatList
            data={imagenes}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(uri, index) => `${experiencia.id}-${index}`}
            onMomentumScrollEnd={handleScrollFin}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.imagen} />
            )}
          />

          {imagenes.length > 1 && (
            <View style={styles.contadorBadge}>
              <Text style={styles.contadorBadgeTexto}>
                {indiceImagen + 1}/{imagenes.length}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.imagenPlaceholder}>
          <Ionicons name="image-outline" size={32} color="#8FA391" />
          <Text style={styles.imagenPlaceholderTexto}>Sin fotos</Text>
        </View>
      )}

      {imagenes.length > 1 && (
        <View style={styles.puntosContenedor}>
          {imagenes.map((_, index) => (
            <View
              key={`${experiencia.id}-punto-${index}`}
              style={[
                styles.punto,
                index === indiceImagen && styles.puntoActivo,
              ]}
            />
          ))}
        </View>
      )}

      {/* Descripción y tiempo */}
      {!!experiencia.descripcion && (
        <Text style={styles.descripcion}>{experiencia.descripcion}</Text>
      )}
      <Text style={styles.tiempoTexto}>
        {formatearTiempoRelativo(experiencia.createdAt)}
      </Text>

      {/* Me gusta / Guardar */}
      <View style={styles.accionesFila}>
        <TouchableOpacity
          style={styles.pastilla}
          onPress={() => setLikeActivo((prev) => !prev)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={likeActivo ? "heart" : "heart-outline"}
            size={18}
            color={likeActivo ? "#C1443C" : "#1F1F1F"}
          />
          <Text style={styles.pastillaTexto}>{totalLikes}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.pastilla}
          onPress={() => setGuardadoActivo((prev) => !prev)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={guardadoActivo ? "bookmark" : "bookmark-outline"}
            size={17}
            color="#1F1F1F"
          />
          <Text style={styles.pastillaTexto}>
            {guardadoActivo ? "Guardado" : "Guardar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
