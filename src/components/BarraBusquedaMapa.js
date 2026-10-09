/**
 * BarraBusquedaMapa: componente/pantalla de la aplicación Ruta505.
 */

import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import {
  CATEGORIAS_EXPERIENCIA,
  iconoDeCategoria,
  colorDeCategoria,
} from "../services/Categoriasexperiencias";
import { buscarLugares } from "../services/geocodingservice";
import { barraBusquedaStyle as s } from "../styles/mapanicaragua/BarraBusquedaStyle";

const VERDE = "#0E5A34";
const MAX_RESULTADOS_PROPIOS = 5;

const normalizar = (valor) =>
  String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const etiquetaCategoria = (id) =>
  CATEGORIAS_EXPERIENCIA.find((c) => c.id === id)?.label ?? "";

/**
 * Barra de búsqueda del mapa.
 * - Mientras escribes filtra las ubicaciones guardadas (título, categoría,
 *   referencia y descripción).
 * - Al enviar (enter o "Buscar lugares o calles") consulta calles, parques y
 *   lugares de Nicaragua en OpenStreetMap.
 */
export default function BarraBusquedaMapa({
  puntos,
  onSeleccionarPunto,
  onSeleccionarLugar,
  onLimpiar,
}) {
  const insets = useSafeAreaInsets();
  const [texto, setTexto] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [lugares, setLugares] = useState(null); // null = aún no se buscó
  const [buscando, setBuscando] = useState(false);
  const [errorLugares, setErrorLugares] = useState(false);

  const consulta = normalizar(texto.trim());

  const resultadosPropios = useMemo(() => {
    if (!consulta) return [];
    return puntos
      .filter((p) =>
        [p.titulo, etiquetaCategoria(p.categoria), p.ubicacionExacta, p.descripcion]
          .map(normalizar)
          .some((campo) => campo.includes(consulta))
      )
      .slice(0, MAX_RESULTADOS_PROPIOS);
  }, [puntos, consulta]);

  const handleCambiarTexto = (valor) => {
    setTexto(valor);
    setAbierto(true);
    setLugares(null);
    setErrorLugares(false);
  };

  const cerrar = () => {
    Keyboard.dismiss();
    setAbierto(false);
  };

  const handleBuscarLugares = async () => {
    if (texto.trim().length < 2) return;
    Keyboard.dismiss();
    setAbierto(true);
    setBuscando(true);
    setErrorLugares(false);
    try {
      setLugares(await buscarLugares(texto));
    } catch (error) {
      console.warn("Error buscando lugares:", error);
      setLugares([]);
      setErrorLugares(true);
    } finally {
      setBuscando(false);
    }
  };

  const handleLimpiar = () => {
    setTexto("");
    setLugares(null);
    setErrorLugares(false);
    cerrar();
    onLimpiar?.();
  };

  const elegirPunto = (punto) => {
    setTexto(punto.titulo);
    cerrar();
    onSeleccionarPunto(punto);
  };

  const elegirLugar = (lugar) => {
    setTexto(lugar.nombre);
    cerrar();
    onSeleccionarLugar(lugar);
  };

  const mostrarPanel = abierto && texto.trim().length > 0;

  return (
    <View style={s.raiz} pointerEvents="box-none">
      {mostrarPanel && (
        <TouchableWithoutFeedback onPress={cerrar}>
          <View style={s.overlay} />
        </TouchableWithoutFeedback>
      )}

      <View style={[s.contenedor, { top: insets.top + 40 }]}>
        <View style={s.barra}>
          <Ionicons name="search" size={18} color={VERDE} />
          <TextInput
            style={s.input}
            value={texto}
            onChangeText={handleCambiarTexto}
            onFocus={() => setAbierto(true)}
            onSubmitEditing={handleBuscarLugares}
            placeholder="Buscar"
            placeholderTextColor="#8A8A8A"
            returnKeyType="search"
            autoCorrect={false}
          />
          {texto.length > 0 && (
            <TouchableOpacity
              style={s.botonLimpiar}
              onPress={handleLimpiar}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Borrar búsqueda"
            >
              <Ionicons name="close-circle" size={18} color="#8A8A8A" />
            </TouchableOpacity>
          )}
        </View>

        {mostrarPanel && (
          <View style={s.panel}>
            {resultadosPropios.length > 0 && (
              <>
                <Text style={s.seccion}>Ubicaciones en Ruta505</Text>
                {resultadosPropios.map((punto) => (
                  <TouchableOpacity
                    key={punto.id}
                    style={s.fila}
                    onPress={() => elegirPunto(punto)}
                    activeOpacity={0.7}
                  >
                    <View style={s.filaIcono}>
                      <Ionicons
                        name={iconoDeCategoria(punto.categoria)}
                        size={16}
                        color={colorDeCategoria(punto.categoria)}
                      />
                    </View>
                    <View style={s.filaTextos}>
                      <Text style={s.filaTitulo} numberOfLines={1}>
                        {punto.titulo}
                      </Text>
                      {!!punto.ubicacionExacta && (
                        <Text style={s.filaDetalle} numberOfLines={1}>
                          {punto.ubicacionExacta}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {lugares === null && !buscando && (
              <TouchableOpacity
                style={s.fila}
                onPress={handleBuscarLugares}
                activeOpacity={0.7}
              >
                <View style={s.filaIcono}>
                  <Ionicons name="map-outline" size={16} color={VERDE} />
                </View>
                <View style={s.filaTextos}>
                  <Text style={s.filaTitulo} numberOfLines={1}>
                    Buscar lugares o calles
                  </Text>
                  <Text style={s.filaDetalle} numberOfLines={1}>
                    “{texto.trim()}” en Nicaragua
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {buscando && (
              <ActivityIndicator style={s.cargando} color={VERDE} />
            )}

            {lugares !== null && !buscando && (
              <>
                <Text style={s.seccion}>Lugares y calles</Text>
                {errorLugares ? (
                  <Text style={s.mensaje}>
                    No se pudo buscar. Revisa tu conexión e inténtalo de nuevo.
                  </Text>
                ) : lugares.length === 0 ? (
                  <Text style={s.mensaje}>Sin resultados para esa búsqueda.</Text>
                ) : (
                  lugares.map((lugar) => (
                    <TouchableOpacity
                      key={lugar.id}
                      style={s.fila}
                      onPress={() => elegirLugar(lugar)}
                      activeOpacity={0.7}
                    >
                      <View style={s.filaIcono}>
                        <Ionicons name="location-outline" size={16} color={VERDE} />
                      </View>
                      <View style={s.filaTextos}>
                        <Text style={s.filaTitulo} numberOfLines={1}>
                          {lugar.nombre}
                        </Text>
                        {!!lugar.detalle && (
                          <Text style={s.filaDetalle} numberOfLines={1}>
                            {lugar.detalle}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
