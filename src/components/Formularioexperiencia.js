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
import { formularioExperienciaStyle as s } from "../styles/mapanicaragua/Formularioexperienciastyle.js";
import { CATEGORIAS_EXPERIENCIA } from "../services/Categoriasexperiencias.js";

// Firestore permite máximo 1MB por documento, y base64 infla el tamaño
// ~33% respecto al binario original. Con 2 imágenes de ~150KB cada una
// en base64 (~450KB total con el resto de campos) nos quedamos con
// margen de sobra. Si necesitas más resolución, baja MAX_IMAGENES en
// vez de subir la calidad/tamaño.
const MAX_IMAGENES = 2;
const ANCHO_REDIMENSIONADO = 700; // px — suficiente para verse bien en el detalle, no para zoom forense
const CALIDAD_COMPRESION = 0.5; // 0 a 1

export default function FormularioExperiencia({
  visible,
  ubicacionActual,
  onCancelar,
  onGuardar,
  onElegirEnMapa,
  modoEdicion = false,
  valoresIniciales = null,
}) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ubicacionExacta, setUbicacionExacta] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS_EXPERIENCIA[0]);
  const [imagenes, setImagenes] = useState([]); // array de strings "data:image/jpeg;base64,...."
  const [guardando, setGuardando] = useState(false);
  const [procesandoImagen, setProcesandoImagen] = useState(false);

  // Precarga los campos cuando se abre en modo edición.
  useEffect(() => {
    if (visible && modoEdicion && valoresIniciales) {
      setTitulo(valoresIniciales.titulo ?? "");
      setDescripcion(valoresIniciales.descripcion ?? "");
      setUbicacionExacta(valoresIniciales.ubicacionExacta ?? "");
      setCategoria(
        CATEGORIAS_EXPERIENCIA.find((c) => c.id === valoresIniciales.categoria) ||
          CATEGORIAS_EXPERIENCIA[0]
      );
      setImagenes(valoresIniciales.imagenes ?? []);
    } else if (visible && !modoEdicion) {
      limpiarCampos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, modoEdicion, valoresIniciales]);

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

  async function handleAgregarImagen() {
    if (imagenes.length >= MAX_IMAGENES) {
      Alert.alert(
        "Máximo alcanzado",
        `Solo puedes agregar hasta ${MAX_IMAGENES} imágenes por experiencia (para no pasarte del límite de tamaño de Firestore).`
      );
      return;
    }

    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert("Permiso necesario", "Necesitamos acceso a tus fotos para agregar una imagen.");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1, // la compresión real la hace ImageManipulator después, aquí pedimos la original
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (resultado.canceled) return;

    setProcesandoImagen(true);
    try {
      // Redimensiona y comprime ANTES de convertir a base64 — es la
      // única forma de mantener el documento de Firestore liviano.
      const manipulado = await ImageManipulator.manipulateAsync(
        resultado.assets[0].uri,
        [{ resize: { width: ANCHO_REDIMENSIONADO } }],
        {
          compress: CALIDAD_COMPRESION,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      const dataUri = `data:image/jpeg;base64,${manipulado.base64}`;
      const pesoAproxKB = Math.round((manipulado.base64.length * 0.75) / 1024);

      if (pesoAproxKB > 400) {
        Alert.alert(
          "Imagen muy pesada",
          `Esta imagen pesaría ~${pesoAproxKB}KB después de comprimida, es mucho para guardarla junto al resto del documento. Prueba con otra foto más simple.`
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

  async function handleGuardar() {
    if (!titulo.trim()) {
      return; // validación mínima — el botón ya está disabled sin título
    }
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
    <Modal visible={visible} animationType="slide" transparent onRequestClose={limpiarYCerrar}>
      <View style={s.fondoOscuro}>
        <View style={s.hoja}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={s.titulo}>
              {modoEdicion ? "Editar experiencia" : "Nueva experiencia cultural"}
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

            <Text style={s.etiqueta}>Categoría</Text>
            <View style={s.filaCategorias}>
              {CATEGORIAS_EXPERIENCIA.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[s.chipCategoria, categoria.id === cat.id && s.chipCategoriaActiva]}
                  onPress={() => setCategoria(cat)}
                >
                  <Text style={s.chipCategoriaTexto}>
                    {cat.icono} {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.etiqueta}>Fotos ({imagenes.length}/{MAX_IMAGENES})</Text>
            <View style={s.filaImagenes}>
              {imagenes.map((uri, index) => (
                <View key={index} style={s.miniaturaContenedor}>
                  <Image source={{ uri }} style={s.miniatura} />
                  <TouchableOpacity style={s.botonQuitarImagen} onPress={() => quitarImagen(index)}>
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

            <Text style={s.etiqueta}>Coordenadas</Text>
            <View style={s.cajaUbicacion}>
              {ubicacionActual ? (
                <Text style={s.textoUbicacion}>
                  📍 {ubicacionActual.lat.toFixed(5)}, {ubicacionActual.lon.toFixed(5)}
                </Text>
              ) : (
                <Text style={s.textoUbicacionError}>
                  ⚠️ No se detecta tu ubicación todavía. Espera unos segundos e inténtalo de nuevo.
                </Text>
              )}
            </View>
            {onElegirEnMapa && (
              <TouchableOpacity onPress={onElegirEnMapa} style={s.enlaceElegirMapa}>
                <Text style={s.enlaceElegirMapaTexto}>📍 Elegir otro lugar en el mapa</Text>
              </TouchableOpacity>
            )}

            <View style={s.filaBotones}>
              <TouchableOpacity style={s.botonCancelar} onPress={limpiarYCerrar} disabled={guardando}>
                <Text style={s.botonCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  s.botonGuardar,
                  (!titulo.trim() || !ubicacionActual || guardando) && s.botonGuardarDeshabilitado,
                ]}
                onPress={handleGuardar}
                disabled={!titulo.trim() || !ubicacionActual || guardando}
              >
                {guardando ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={s.botonGuardarTexto}>{modoEdicion ? "Guardar cambios" : "Guardar"}</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}