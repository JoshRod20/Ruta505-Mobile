/**
 * FormularioExperiencia: componente/pantalla de la aplicación Ruta505.
 */

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
import {
  formularioExperienciaStyle as s,
  COLOR_VERDE_FORMULARIO as VERDE,
} from "../styles/mapanicaragua/Formularioexperienciastyle.js";
import {
  CATEGORIAS_EXPERIENCIA,
  buscarCategoria,
} from "../services/Categoriasexperiencias.js";
import { obtenerMultimedia } from "../services/Negociosservice.js";

// Prototipo: todo se guarda en Base64 dentro de Firestore (máx. 1 MB por documento),
// así que cada archivo se comprime y tiene un tope de peso. Cantidad de archivos: sin límite.
const ANCHO_REDIMENSIONADO = 800; // px
const MAX_FOTO_KB = 250;
const MAX_VIDEO_SEGUNDOS = 10;
const MAX_VIDEO_KB = 650; // en Base64 ocupa ~33% más y debe caber en 1 MB

let contadorMedia = 0;
const nuevoId = () => `m${Date.now()}_${contadorMedia++}`;

/** Lee un archivo local y lo devuelve como data URI Base64. */
async function archivoADataUri(uri) {
  const blob = await (await fetch(uri)).blob();
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onloadend = () => resolve(lector.result);
    lector.onerror = () => reject(new Error("No se pudo leer el archivo."));
    lector.readAsDataURL(blob);
  });
}

/** Comprime una foto; si aún pesa de más, la vuelve a comprimir más fuerte. */
async function fotoADataUri(uri) {
  const intentos = [
    { ancho: ANCHO_REDIMENSIONADO, calidad: 0.5 },
    { ancho: 640, calidad: 0.35 },
    { ancho: 480, calidad: 0.3 },
  ];
  for (const { ancho, calidad } of intentos) {
    const m = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: ancho } }],
      {
        compress: calidad,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      },
    );
    if ((m.base64.length * 0.75) / 1024 <= MAX_FOTO_KB) {
      return `data:image/jpeg;base64,${m.base64}`;
    }
  }
  return null;
}

/**
 * FormularioExperiencia.
 */
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
  const [categoria, setCategoria] = useState(CATEGORIAS_EXPERIENCIA[0]);
  const [media, setMedia] = useState([]); // [{ id, tipo, uri, remota }]
  const [guardando, setGuardando] = useState(false);
  const [procesandoMedia, setProcesandoMedia] = useState(false);

  useEffect(() => {
    if (modoEdicion && valoresIniciales) {
      setTitulo(valoresIniciales.titulo ?? "");
      setDescripcion(valoresIniciales.descripcion ?? "");
      setCategoria(
        buscarCategoria(valoresIniciales.categoria) ||
          CATEGORIAS_EXPERIENCIA[0],
      );
      // Fotos antiguas guardadas directo en el negocio (por si no hay subcolección)
      const antiguas = (valoresIniciales.imagenes ?? []).map((uri) => ({
        id: nuevoId(),
        tipo: "imagen",
        uri,
        remota: true,
      }));
      setMedia(antiguas);
      let vigente = true;
      obtenerMultimedia(valoresIniciales.id)
        .then((items) => {
          if (vigente && items.length > 0) setMedia(items);
        })
        .catch(() => {});
      return () => {
        vigente = false;
      };
    }
    limpiarCampos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sesionId]);

  function limpiarCampos() {
    setTitulo("");
    setDescripcion("");
    setCategoria(CATEGORIAS_EXPERIENCIA[0]);
    setMedia([]);
  }

  function limpiarYCerrar() {
    limpiarCampos();
    onCancelar();
  }

  /** Abre la galería: varias fotos y videos cortos a la vez, sin límite de cantidad. */
  async function handleAgregarMedia() {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert(
        "Permiso necesario",
        "Necesitamos acceso a tu galería para agregar fotos o videos.",
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: true,
      selectionLimit: 0, // 0 = sin límite
      quality: 1,
      videoMaxDuration: MAX_VIDEO_SEGUNDOS,
      videoExportPreset: ImagePicker.VideoExportPreset?.LowQuality, // solo iOS
    });
    if (resultado.canceled) return;

    setProcesandoMedia(true);
    const nuevos = [];
    const rechazados = [];
    try {
      for (const asset of resultado.assets) {
        try {
          if (asset.type === "video") {
            // duration viene en milisegundos
            if (asset.duration && asset.duration > MAX_VIDEO_SEGUNDOS * 1000) {
              rechazados.push(`un video dura más de ${MAX_VIDEO_SEGUNDOS} s`);
              continue;
            }
            const dataUri = await archivoADataUri(asset.uri);
            const pesoKB = Math.round((dataUri.length * 0.75) / 1024);
            if (pesoKB > MAX_VIDEO_KB) {
              rechazados.push(`un video pesa ${pesoKB} KB (máx. ${MAX_VIDEO_KB} KB)`);
              continue;
            }
            nuevos.push({ id: nuevoId(), tipo: "video", uri: dataUri, remota: false });
          } else {
            const dataUri = await fotoADataUri(asset.uri);
            if (!dataUri) {
              rechazados.push("una foto sigue muy pesada tras comprimirla");
              continue;
            }
            nuevos.push({ id: nuevoId(), tipo: "imagen", uri: dataUri, remota: false });
          }
        } catch (error) {
          rechazados.push(error.message);
        }
      }
      if (nuevos.length > 0) setMedia((prev) => [...prev, ...nuevos]);
      if (rechazados.length > 0) {
        Alert.alert(
          "Algunos archivos no se agregaron",
          `Se omitió ${rechazados.join("; ")}.`,
        );
      }
    } finally {
      setProcesandoMedia(false);
    }
  }

  function quitarMedia(id) {
    setMedia((prev) => prev.filter((m) => m.id !== id));
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
        multimedia: media.map((m) => ({
          docId: m.docId ?? null,
          tipo: m.tipo,
          data: m.uri,
        })),
      });
      limpiarCampos();
    } catch (error) {
      Alert.alert("No se pudo guardar", error.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={limpiarYCerrar}
    >
      <View style={s.fondoOscuro}>
        <View style={s.hoja}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={s.titulo}>
              {modoEdicion
                ? "Editar ubicación de mi negocio"
                : "Agregar ubicación de mi negocio"}
            </Text>

            <Text style={s.etiqueta}>Título</Text>
            <TextInput
              style={s.input}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Ej. Recorrido por talleres de barro"
              placeholderTextColor="#8A8A8A"
              maxLength={120}
            />

            <Text style={s.etiqueta}>Descripción</Text>
            <TextInput
              style={[s.input, s.inputMultilinea]}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Cuéntale al turista qué va a vivir..."
              placeholderTextColor="#8A8A8A"
              maxLength={1500}
              multiline
              numberOfLines={4}
            />

            {/* Selector de coordenadas en mapa */}
            <Text style={s.etiqueta}>Ubicación</Text>
            <TouchableOpacity
              style={s.tarjetaUbicacion}
              onPress={onElegirEnMapa}
              activeOpacity={0.75}
              disabled={!onElegirEnMapa}
            >
              <View style={s.tarjetaUbicacionIcono}>
                <Ionicons
                  name={ubicacionActual ? "location-sharp" : "locate-outline"}
                  size={20}
                  color={VERDE}
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
                      Necesaria para guardar
                    </Text>
                  </>
                )}
              </View>

            </TouchableOpacity>

            {/* Selector de categorías */}
            <Text style={s.etiqueta}>Categoría</Text>
            <View style={s.categoriasContenedor}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.filaCategorias}
                keyboardShouldPersistTaps="handled"
                style={{ flex: 1 }}
              >
                {CATEGORIAS_EXPERIENCIA.map((cat) => {
                  const activa = categoria.id === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[s.chipCategoria, activa && s.chipCategoriaActiva]}
                      onPress={() => setCategoria(cat)}
                      activeOpacity={0.8}
                    >
                      {/* ICONO_CATEGORIA: ícono personalizado o de respaldo */}
                      {typeof cat.icono === "string" ? (
                        <Ionicons
                          name={cat.icono}
                          size={15}
                          color={activa ? "#FFFFFF" : VERDE}
                          style={s.chipCategoriaIcono}
                        />
                      ) : (
                        <Image
                          source={cat.icono}
                          style={[
                            { width: 15, height: 15 },
                            s.chipCategoriaIcono,
                            { tintColor: activa ? "#FFFFFF" : VERDE }, // Comenta esta línea si tu PNG ya tiene su propio color y no quieres que cambie
                          ]}
                          resizeMode="contain"
                        />
                      )}
                      <Text
                        style={[
                          s.chipCategoriaTexto,
                          activa && s.chipCategoriaTextoActivo,
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#111111"
                style={s.flechaCategorias}
              />
            </View>

            {/* Fotos y videos cortos (varios, sin límite) */}
            <Text style={s.etiqueta}>Fotos / Videos Cortos</Text>
            {media.length === 0 ? (
              <TouchableOpacity
                style={s.cajaMultimedia}
                onPress={handleAgregarMedia}
                disabled={procesandoMedia || guardando}
                activeOpacity={0.75}
              >
                {procesandoMedia ? (
                  <ActivityIndicator color={VERDE} />
                ) : (
                  <Text style={s.textoMultimedia}>+ Agregar multimedia</Text>
                )}
              </TouchableOpacity>
            ) : (
              <View style={[s.cajaMultimedia, { alignItems: "flex-start" }]}>
                <View style={s.filaImagenes}>
                  {media.map((m) => (
                    <View key={m.id} style={s.miniaturaContenedor}>
                      {m.tipo === "imagen" ? (
                        <Image source={{ uri: m.uri }} style={s.miniatura} />
                      ) : (
                        <View style={s.miniaturaVideo}>
                          <Ionicons name="play-circle" size={30} color="#FFFFFF" />
                        </View>
                      )}
                      <TouchableOpacity
                        style={s.botonQuitarImagen}
                        onPress={() => quitarMedia(m.id)}
                        disabled={guardando}
                      >
                        <Ionicons name="close" size={12} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity
                    style={s.botonAgregarMas}
                    onPress={handleAgregarMedia}
                    disabled={procesandoMedia || guardando}
                  >
                    {procesandoMedia ? (
                      <ActivityIndicator color={VERDE} />
                    ) : (
                      <Ionicons name="add" size={26} color={VERDE} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Acciones de cancelación y guardado */}
            <View style={s.filaBotones}>
              <TouchableOpacity
                style={s.botonCancelar}
                onPress={limpiarYCerrar}
                disabled={guardando}
                activeOpacity={0.8}
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
                activeOpacity={0.85}
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
