import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { CATEGORIAS_EXPERIENCIA } from "../services/Categoriasexperiencias";
import { tarjetaUbicacionStyle as s } from "../styles/mapanicaragua/TarjetaUbicacionStyle";

const VERDE = "#0E5A34";

/**
 * Hoja "Detalles de la ubicación" que se abre al tocar un punto del mapa.
 * La calificación (estrella) solo se muestra si el documento trae un número
 * en `calificacion`; aún no existe ese dato en Firestore.
 */
export default function TarjetaUbicacion({
  punto,
  ruta,
  cargandoRuta,
  puedeEditar,
  onCerrar,
  onEditar,
  onTrazarRuta,
  onIniciarNavegacion,
}) {
  const { width, height } = useWindowDimensions();

  const categoria = CATEGORIAS_EXPERIENCIA.find((c) => c.id === punto.categoria);
  const fotos = punto.imagenes?.length ? punto.imagenes : punto.imagenUrls ?? [];
  const tieneCalificacion = typeof punto.calificacion === "number";
  const hayRutaAqui = ruta && ruta.destino?.id === punto.id;
  const anchoFoto = fotos.length > 1 ? width * 0.72 : width - 40;

  return (
    <View style={s.hoja}>
      <ScrollView
        style={{ maxHeight: height * 0.5 }}
        contentContainerStyle={s.contenido}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        <View style={s.filaSuperior}>
          <View style={s.badge}>
            <Ionicons
              name={categoria?.icono ?? "location-outline"}
              size={18}
              color={VERDE}
              style={s.badgeIcono}
            />
            <Text style={s.badgeTexto}>{categoria?.label ?? "Lugar"}</Text>
          </View>
          <TouchableOpacity
            style={s.botonCerrar}
            onPress={onCerrar}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Cerrar detalles"
          >
            <Text style={s.botonCerrarTexto}>x</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.titulo}>{punto.titulo}</Text>

        {tieneCalificacion && (
          <View style={s.filaCalificacion}>
            <Ionicons name="star" size={20} color="#111111" />
            <Text style={s.calificacionTexto}>
              {punto.calificacion.toFixed(1)}
            </Text>
          </View>
        )}

        {fotos.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={s.filaFotos}
            contentContainerStyle={s.filaFotosContenido}
            nestedScrollEnabled
          >
            {fotos.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={[s.foto, { width: anchoFoto }]}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        {!!punto.ubicacionExacta && (
          <View style={s.cajaReferencia}>
            <View style={s.referenciaIcono}>
              <Ionicons name="location-sharp" size={22} color={VERDE} />
            </View>
            <View style={s.referenciaTextos}>
              <Text style={s.referenciaEtiqueta}>Referencia registrada</Text>
              <Text style={s.referenciaTexto}>{punto.ubicacionExacta}</Text>
            </View>
          </View>
        )}

        {!!punto.descripcion && (
          <>
            <Text style={s.seccionTitulo}>Sobre este lugar</Text>
            <Text style={s.descripcion}>{punto.descripcion}</Text>
          </>
        )}
      </ScrollView>

      {/* Acciones fijas (siempre visibles aunque la descripción sea larga) */}
      <View style={s.acciones}>
        {hayRutaAqui && (
          <View style={s.etaPill}>
            <Text style={s.etaPillTexto}>
              {ruta.duracionMin} min · {ruta.distanciaKm} km
            </Text>
          </View>
        )}
        <View style={s.filaAcciones}>
          {puedeEditar && (
            <TouchableOpacity
              style={s.botonSecundario}
              onPress={onEditar}
              activeOpacity={0.8}
            >
              <Text style={s.botonSecundarioTexto}>Editar</Text>
            </TouchableOpacity>
          )}
          {hayRutaAqui ? (
            <TouchableOpacity
              style={s.botonPrimario}
              onPress={onIniciarNavegacion}
              activeOpacity={0.85}
            >
              <Text style={s.botonPrimarioTexto}>Iniciar navegación</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={s.botonPrimario}
              onPress={onTrazarRuta}
              disabled={cargandoRuta}
              activeOpacity={0.85}
            >
              {cargandoRuta ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={s.botonPrimarioTexto}>Trazar ruta hasta aquí</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
