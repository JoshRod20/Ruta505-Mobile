import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

import FloatingNavButton from "../../components/common/FloatingNavButton";
import SeleccionarUbicacionMapa from "../../components/Seleccionarubicacionmapa";

import {
  crearExperiencia,
  TIPO_EXPERIENCIA,
} from "../../services/Experienciasservice";
import { useAuth } from "../../context/AuthContext";
import { usePermisos } from "../../hooks/usePermisos";
import { PERMISOS } from "../../constants/permissions";
import { mapFirebaseError } from "../../utils/firebaseErrors";
import { obtenerUbicacionActual } from "../../utils/ubicacion";
import { obtenerNombreLugar } from "../../services/geocodingservice";
import { ESTADOS_VERIFICACION } from "../../constants/roles";
import { CATEGORIAS_EXPERIENCIA } from "../../services/Categoriasexperiencias";
import {
  experienciasCulturalesStyle as s,
  VERDE,
} from "../../styles/experienciascultarales/experienciasCulturalesStyle";

// Las fotos se guardan como Base64 dentro del documento (sin Firebase Storage),
// así que se comprimen y se limitan para no pasar 1 MB por documento.
const MAX_IMAGENES = 3;
const ANCHO_REDIMENSIONADO = 700; // px
const CALIDAD_COMPRESION = 0.5; // 0 a 1
const MAX_PESO_KB = 250;

const ROL_ETIQUETA = {
  comunidad: "Como Comunidad",
  artesano: "Como Artesano",
  guia: "Como Guía turístico",
  emprendedor: "Como Emprendedor",
};

const initialForm = {
  titulo: "",
  categoria: CATEGORIAS_EXPERIENCIA[0].id,
  descripcion: "",
};

// Formulario del botón + de la barra de navegación.
// Publica una EXPERIENCIA que aparece en el Home. Las ubicaciones de negocio
// se publican desde el mapa interactivo (ver Formularioexperiencia.js).
export default function ExperienciasCulturales() {
  const { profile, user, estadoVerificacion } = useAuth();
  const { puede } = usePermisos();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const topOffset = insets.top + 8;

  const [form, setForm] = useState(initialForm);
  const [imagenes, setImagenes] = useState([]); // [{ uri }] con uri = data:image/jpeg;base64,...
  const [procesandoImagen, setProcesandoImagen] = useState(false);
  const [ubicacion, setUbicacion] = useState(null); // { lat, lon }
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const puedePublicar = puede(PERMISOS.PUBLICAR_EXPERIENCIA);
  // El registro móvil guarda el tipo como "tipoActor"; "actorType" es el nombre antiguo.
  const tipoActor = profile?.tipoActor ?? profile?.actorType ?? null;
  const etiquetaRol = ROL_ETIQUETA[tipoActor] ?? null;

  // Sugiere la ubicación actual del usuario (puede cambiarla tocando la tarjeta).
  useEffect(() => {
    if (!puedePublicar) return undefined;
    let activo = true;
    (async () => {
      const actual = await obtenerUbicacionActual();
      if (activo && actual) setUbicacion((prev) => prev ?? actual);
    })();
    return () => {
      activo = false;
    };
  }, [puedePublicar]);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Pantalla independiente: al terminar o al tocar la flecha se regresa al Home.
  const volver = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("MainDrawer", { screen: "Inicio" });
    }
  };

  const handleAgregarImagen = async () => {
    if (imagenes.length >= MAX_IMAGENES) {
      Alert.alert(
        "Límite alcanzado",
        `Puedes agregar hasta ${MAX_IMAGENES} fotos por experiencia.`
      );
      return;
    }

    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert(
        "Permiso necesario",
        "Necesitamos acceso a tus fotos para poder publicarlas."
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGENES - imagenes.length,
      quality: 1,
    });

    if (resultado.canceled) return;

    setProcesandoImagen(true);
    try {
      const nuevas = [];
      let muyPesadas = 0;

      for (const asset of resultado.assets.slice(
        0,
        MAX_IMAGENES - imagenes.length
      )) {
        // Compresión en el dispositivo antes de convertir a Base64
        const manipulado = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: ANCHO_REDIMENSIONADO } }],
          {
            compress: CALIDAD_COMPRESION,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );
        const pesoKB = Math.round((manipulado.base64.length * 0.75) / 1024);
        if (pesoKB > MAX_PESO_KB) {
          muyPesadas += 1;
          continue;
        }
        nuevas.push({ uri: `data:image/jpeg;base64,${manipulado.base64}` });
      }

      if (nuevas.length > 0) setImagenes((prev) => [...prev, ...nuevas]);
      if (muyPesadas > 0) {
        Alert.alert(
          "Imagen muy pesada",
          `${muyPesadas === 1 ? "Una foto superó" : "Algunas fotos superaron"} el tamaño permitido y no se agregó.`
        );
      }
    } catch (err) {
      Alert.alert("No se pudo procesar la imagen", err.message);
    } finally {
      setProcesandoImagen(false);
    }
  };

  const quitarImagen = (indice) => {
    setImagenes((prev) => prev.filter((_, i) => i !== indice));
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.titulo.trim() || !form.descripcion.trim()) {
      setError("Completa el título y la descripción.");
      return;
    }

    if (!ubicacion) {
      setError("Elige la ubicación de tu experiencia.");
      return;
    }

    if (imagenes.length === 0) {
      setError("Agrega al menos una foto de la experiencia.");
      return;
    }

    try {
      setCargando(true);
      // Nombre corto del lugar ("Catarina, Masaya") para mostrarlo en el Home.
      const lugar = await obtenerNombreLugar(ubicacion.lat, ubicacion.lon);

      await crearExperiencia({
        tipo: TIPO_EXPERIENCIA,
        titulo: form.titulo.trim(),
        categoria: form.categoria,
        descripcion: form.descripcion.trim(),
        lat: ubicacion.lat,
        lng: ubicacion.lon,
        lugar,
        verificado: estadoVerificacion === ESTADOS_VERIFICACION.APROBADO,
        imagenes: imagenes.map((imagen) => imagen.uri),
        role: profile?.role ?? null,
        actorType: tipoActor,
        creadoPor: user?.uid ?? null,
      });

      setForm(initialForm);
      setImagenes([]);
      Alert.alert("Listo", "Tu experiencia se publicó correctamente.");
      volver();
    } catch (err) {
      console.error("Error al guardar experiencia:", err);
      const mensaje = mapFirebaseError(err.code);
      setError(
        mensaje === "Ocurrió un error. Inténtalo de nuevo."
          ? `Error al guardar experiencia: ${err.code || err.message || "desconocido"}`
          : mensaje
      );
    } finally {
      setCargando(false);
    }
  };

  if (!puedePublicar) {
    return (
      <View style={[s.container, { paddingTop: insets.top + 36, paddingHorizontal: 24 }]}>
        <FloatingNavButton />
        <Text style={s.avisoTitulo}>Acceso no disponible</Text>
        <Text style={s.avisoTexto}>
          Solo comunidades, artesanos, guías o emprendedores pueden publicar
          experiencias.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[s.container, { paddingTop: topOffset }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Encabezado */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.botonAtras}
          onPress={volver}
          accessibilityLabel="Volver al inicio"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </TouchableOpacity>
        <Text style={s.titulo}>Publicar Experiencia</Text>
        <View style={s.botonAtras} />
      </View>
      {!!etiquetaRol && <Text style={s.rol}>{etiquetaRol}</Text>}

      <ScrollView
        contentContainerStyle={[
          s.scrollContent,
          { paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[s.etiqueta, { marginTop: 4 }]}>Título</Text>
        <TextInput
          style={s.input}
          value={form.titulo}
          onChangeText={(value) => handleChange("titulo", value)}
          placeholder="Ej. Recorrido por talleres de barro"
          placeholderTextColor="#8A8A8A"
        />

        <Text style={s.etiqueta}>Categoría</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filaCategorias}
          keyboardShouldPersistTaps="handled"
        >
          {CATEGORIAS_EXPERIENCIA.map((categoria) => {
            const activa = form.categoria === categoria.id;
            return (
              <TouchableOpacity
                key={categoria.id}
                style={[s.chipCategoria, activa && s.chipCategoriaActiva]}
                onPress={() => handleChange("categoria", categoria.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={categoria.icono}
                  size={16}
                  color={activa ? "#FFFFFF" : VERDE}
                  style={s.chipCategoriaIcono}
                />
                <Text
                  style={[
                    s.chipCategoriaTexto,
                    activa && s.chipCategoriaTextoActivo,
                  ]}
                >
                  {categoria.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={s.etiqueta}>Descripción</Text>
        <TextInput
          style={[s.input, s.inputMultilinea]}
          value={form.descripcion}
          onChangeText={(value) => handleChange("descripcion", value)}
          placeholder="Cuéntale al turista qué va a vivir…"
          placeholderTextColor="#8A8A8A"
          multiline
          numberOfLines={4}
        />

        <Text style={s.etiqueta}>Ubicación</Text>
        <TouchableOpacity
          style={s.tarjetaUbicacion}
          onPress={() => setSelectorVisible(true)}
          activeOpacity={0.75}
        >
          <View style={s.tarjetaUbicacionIcono}>
            <Ionicons
              name={ubicacion ? "location-sharp" : "locate-outline"}
              size={22}
              color={VERDE}
            />
          </View>
          <View style={s.tarjetaUbicacionTexto}>
            {ubicacion ? (
              <>
                <Text style={s.tarjetaUbicacionCoords}>
                  {ubicacion.lat.toFixed(5)}, {ubicacion.lon.toFixed(5)}
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
          <Ionicons name="chevron-forward" size={16} color="#1F2A24" />
        </TouchableOpacity>

        <Text style={s.etiqueta}>Fotos / Vídeos cortos</Text>
        {imagenes.length === 0 ? (
          <TouchableOpacity
            style={s.cajaMultimedia}
            onPress={handleAgregarImagen}
            activeOpacity={0.75}
          >
            <Text style={s.textoMultimedia}>+ Agregar multimedia</Text>
          </TouchableOpacity>
        ) : (
          <View style={[s.cajaMultimedia, { alignItems: "flex-start" }]}>
            <View style={s.filaImagenes}>
              {imagenes.map((imagen, indice) => (
                <View key={`imagen-${indice}`} style={s.miniaturaContenedor}>
                  <Image source={{ uri: imagen.uri }} style={s.miniatura} />
                  <TouchableOpacity
                    style={s.botonQuitarImagen}
                    onPress={() => quitarImagen(indice)}
                  >
                    <Ionicons name="close" size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
              {imagenes.length < MAX_IMAGENES && (
                <TouchableOpacity
                  style={s.botonAgregarMas}
                  onPress={handleAgregarImagen}
                  disabled={procesandoImagen}
                >
                  {procesandoImagen ? (
                    <ActivityIndicator color={VERDE} />
                  ) : (
                    <Ionicons name="add" size={26} color={VERDE} />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {!!error && <Text style={s.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[s.botonPublicar, cargando && s.botonPublicarDeshabilitado]}
          onPress={handleSubmit}
          disabled={cargando}
          activeOpacity={0.85}
        >
          {cargando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={s.botonPublicarTexto}>Publicar</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Selector de ubicación en el mapa */}
      <Modal
        visible={selectorVisible}
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setSelectorVisible(false)}
      >
        <SeleccionarUbicacionMapa
          centroInicial={ubicacion}
          onConfirmar={(coordenadas) => {
            setUbicacion(coordenadas);
            setSelectorVisible(false);
          }}
          onCancelar={() => setSelectorVisible(false)}
        />
      </Modal>
    </KeyboardAvoidingView>
  );
}
