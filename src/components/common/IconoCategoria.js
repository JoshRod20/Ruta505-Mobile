/**
 * IconoCategoria: dibuja el ícono de una categoría de experiencia.
 *
 * - Si el ícono del catálogo es una imagen (require de un PNG personalizado),
 *   muestra un <Image> con sus colores originales.
 * - Si es un texto (nombre de Ionicons, p. ej. el de respaldo), muestra un
 *   <Ionicons>.
 *
 * Es el ÚNICO componente que debe usarse para pintar el ícono de una
 * categoría (mapa, listas, rutas, formularios). Así, un <Ionicons> nunca
 * recibe una imagen (eso mostraba el signo de pregunta "?").
 *
 * @param {Object} props
 * @param {string} [props.categoria] - Categoría guardada (id actual o antiguo).
 * @param {number} [props.size=24] - Tamaño en px (ancho y alto).
 * @param {string} [props.color] - Color; solo para el Ionicons de respaldo.
 * @param {string} [props.tintColor] - Pinta el PNG de un solo color (útil en
 *   chips activos). Si no se pasa, el PNG conserva sus colores.
 * @param {Object} [props.style] - Estilo extra.
 */
import React from "react";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { iconoDeCategoria } from "../../services/Categoriasexperiencias";

export default function IconoCategoria({
  categoria,
  size = 24,
  color,
  tintColor,
  style,
}) {
  const icono = iconoDeCategoria(categoria);

  if (typeof icono === "string") {
    return <Ionicons name={icono} size={size} color={color} style={style} />;
  }

  return (
    <Image
      source={icono}
      style={[
        { width: size, height: size },
        tintColor ? { tintColor } : null,
        style,
      ]}
      resizeMode="contain"
      fadeDuration={0}
    />
  );
}
