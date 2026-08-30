import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Ionicons } from "@expo/vector-icons";
import { formularioExperienciaStyle as s } from "../styles/mapanicaragua/Formularioexperienciastyle.js";
import { CATEGORIAS_EXPERIENCIA } from "../services/Categoriasexperiencias.js";

// Límites para evitar superar el tamaño máximo de documento en Firestore (1MB)
const MAX_IMAGENES = 2;
const ANCHO_REDIMENSIONADO = 700; // px
const CALIDAD_COMPRESION = 0.5; // 0 a 1

export default function FormularioExperiencia({
  visible,
  ubicacionActual,
  onCancelar,
  onGuardar,
  onElegirEnMapa,
  modoEdicion = false,
  valoresIniciales = null,
  sesionId = 0,
}) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ubicacionExacta, setUbicacionExacta] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS_EXPERIENCIA[0]);
  const [imagenes, setImagenes] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [procesandoImagen, setProcesandoImagen] = useState(false);

  useEffect(() => {
    if (modoEdicion && valoresIniciales) {
      setTitulo(valoresIniciales.titulo ?? "");
      setDescripcion(valoresIniciales.descripcion ?? "");
      setUbicacionExacta(valoresIniciales.ubicacionExacta ?? "");
      setCategoria(
        CATEGORIAS_EXPERIENCIA.find(
          (c) => c.id === valoresIniciales.categoria,
        ) || CATEGORIAS_EXPERIENCIA[0],
      );
      setImagenes(valoresIniciales.imagenes ?? []);
    } else {
      limpiarCampos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sesionId]);

  function limpiarCampos() {
    setTitulo("");
    setDescripcion("");
    setUbicacionExacta("");
    setCategoria(CATEGORIAS_EXPERIENCIA[0]);
    setImagenes([]);
  }

  function limpiarYCerrar() {
    limpiarCampos();
    onCancelar();
  }

  /** Selecciona, redimensiona y convierte una imagen a Base64. */
  async function handleAgregarImagen() {
    if (imagenes.length >= MAX_IMAGENES) {
      Alert.alert(
        "Máximo alcanzado",
        `Solo puedes agregar hasta ${MAX_IMAGENES} imágenes por experiencia.`,
      );
      return;
    }

    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert(
        "Permiso necesario",
        "Necesitamos acceso a tus fotos para agregar una imagen.",
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (resultado.canceled) return;

    setProcesandoImagen(true);
    try {
      // Compresión en cliente antes de la conversión a Base64
      const manipulado = await ImageManipulator.manipulateAsync(
        resultado.assets[0].uri,
        [{ resize: { width: ANCHO_REDIMENSIONADO } }],
        {
          compress: CALIDAD_COMPRESION,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        },
      );

      const dataUri = `data:image/jpeg;base64,${manipulado.base64}`;
      const pesoAproxKB = Math.round((manipulado.base64.length * 0.75) / 1024);

      if (pesoAproxKB > 400) {
        Alert.alert(
          "Imagen muy pesada",
          `La imagen comprimida excede el tamaño recomendado (${pesoAproxKB}KB).`,
        );
        return;
      }

      setImagenes((prev) => [...prev, dataUri]);
    } catch (error) {
      Alert.alert("No se pudo procesar la imagen", error.message);
    } finally {
      setProcesandoImagen(false);
    }
  }

  function quitarImagen(index) {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  }

  /** Procesa la solicitud de guardado */
  async function handleGuardar() {
    if (!titulo.trim()) return;

    setGuardando(true);
    try {
      await onGuardar({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        categoria: categoria.id,
        ubicacionExacta: ubicacionExacta.trim(),
        imagenes,
      });
      limpiarCampos();
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={limpiarYCerrar}
    >
      <View style={s.fondoOscuro}>
        <View style={s.hoja}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={s.titulo}>
              {modoEdicion
                ? "Editar experiencia"
                : "Nueva experiencia cultural"}
            </Text>

            <Text style={s.etiqueta}>Título</Text>
            <TextInput
              style={s.input}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Ej. Taller de cerámica Doña Rosa"
              placeholderTextColor="#8A99A8"
            />

            <Text style={s.etiqueta}>Descripción</Text>
            <TextInput
              style={[s.input, s.inputMultilinea]}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Cuéntale al turista qué va a encontrar aquí"
              placeholderTextColor="#8A99A8"
              multiline
              numberOfLines={4}
            />

            <Text style={s.etiqueta}>Ubicación exacta (referencia)</Text>
            <TextInput
              style={s.input}
              value={ubicacionExacta}
              onChangeText={setUbicacionExacta}
              placeholder="Ej. Frente al parque central, 2 cuadras al lago"
              placeholderTextColor="#8A99A8"
            />

            {/* Selector de categorías */}
            <Text style={s.etiqueta}>Categoría</Text>
            <View style={s.filaCategorias}>
              {CATEGORIAS_EXPERIENCIA.map((cat) => {
                const activa = categoria.id === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[s.chipCategoria, activa && s.chipCategoriaActiva]}
                    onPress={() => setCategoria(cat)}
                  >
                    <View style={s.chipCategoriaContenido}>
                      <Ionicons
                        name={cat.icono}
                        size={16}
                        color={activa ? "#FFFFFF" : cat.color}
                        style={s.chipCategoriaIcono}
                      />
                      <Text
                        style={
                          activa
                            ? s.chipCategoriaTextoActivo
                            : s.chipCategoriaTexto
                        }
                      >
                        {cat.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Galería e inserción de imágenes */}
            <Text style={s.etiqueta}>
              Fotos ({imagenes.length}/{MAX_IMAGENES})
            </Text>
            <View style={s.filaImagenes}>
              {imagenes.map((uri, index) => (
                <View key={index} style={s.miniaturaContenedor}>
                  <Image source={{ uri }} style={s.miniatura} />
                  <TouchableOpacity
                    style={s.botonQuitarImagen}
                    onPress={() => quitarImagen(index)}
                  >
                    <Text style={s.botonQuitarImagenTexto}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {imagenes.length < MAX_IMAGENES && (
                <TouchableOpacity
                  style={s.botonAgregarImagen}
                  onPress={handleAgregarImagen}
                  disabled={procesandoImagen}
                >
                  {procesandoImagen ? (
                    <ActivityIndicator color="#123B63" />
                  ) : (
                    <Text style={s.botonAgregarImagenTexto}>+ Foto</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Selector de coordenadas en mapa */}
            <Text style={s.etiqueta}>Ubicación en el mapa</Text>
            <TouchableOpacity
              style={s.tarjetaUbicacion}
              onPress={onElegirEnMapa}
              activeOpacity={0.75}
              disabled={!onElegirEnMapa}
            >
              <View style={s.tarjetaUbicacionIcono}>
                <Ionicons
                  name={ubicacionActual ? "location-sharp" : "locate-outline"}
                  size={22}
                  color={ubicacionActual ? "#1D7A46" : "#123B63"}
                />
              </View>

              <View style={s.tarjetaUbicacionTexto}>
                {ubicacionActual ? (
                  <>
                    <Text style={s.tarjetaUbicacionCoords}>
                      {ubicacionActual.lat.toFixed(5)},{" "}
                      {(ubicacionActual.lon ?? ubicacionActual.lng).toFixed(5)}
                    </Text>
                    <Text style={s.tarjetaUbicacionHint}>
                      Toca para cambiar ubicación
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={s.tarjetaUbicacionTitulo}>
                      Elegir ubicación en el mapa
                    </Text>
                    <Text style={s.tarjetaUbicacionHint}>
                      Necesaria para publicar
                    </Text>
                  </>
                )}
              </View>

              <Ionicons name="chevron-forward" size={18} color="#8A99A8" />
            </TouchableOpacity>

            {/* Acciones de cancelación y guardado */}
            <View style={s.filaBotones}>
              <TouchableOpacity
                style={s.botonCancelar}
                onPress={limpiarYCerrar}
                disabled={guardando}
              >
                <Text style={s.botonCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  s.botonGuardar,
                  (!titulo.trim() || !ubicacionActual || guardando) &&
                    s.botonGuardarDeshabilitado,
                ]}
                onPress={handleGuardar}
                disabled={!titulo.trim() || !ubicacionActual || guardando}
              >
                {guardando ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={s.botonGuardarTexto}>
                    {modoEdicion ? "Guardar cambios" : "Guardar"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
