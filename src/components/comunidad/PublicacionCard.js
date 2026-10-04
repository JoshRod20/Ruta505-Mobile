import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Ionicons } from "@expo/vector-icons";

import {
  publicacionCardStyle as styles,
  ANCHO_IMAGEN,
} from "../../styles/home/publicacionCardStyle";
import { formatearTiempoRelativo } from "../../utils/tiempoRelativo";
import {
  alternarLike,
  eliminarComentario,
  escucharComentarios,
  escucharLikes,
  guardarComentario,
} from "../../services/Experienciasservice";
import { useAuth } from "../../context/AuthContext";

const VERDE = "#0E5A34";
const NARANJA = "#F29100";
const MAX_COMENTARIO = 500;

// Las fotos de un comentario se guardan como Base64 dentro del documento (sin
// Firebase Storage), así que se comprimen y se limitan.
const MAX_FOTOS = 2;
const ANCHO_REDIMENSIONADO = 700; // px
const CALIDAD_COMPRESION = 0.5; // 0 a 1
const MAX_PESO_KB = 250;

function Estrellas({ valor, size = 14, onChange }) {
  return (
    <>
      {[1, 2, 3, 4, 5].map((n) => {
        const icono = (
          <Ionicons
            name="star"
            size={size}
            color={n <= valor ? NARANJA : "#BDBDBD"}
            style={{ marginRight: 3 }}
          />
        );
        if (!onChange) return <React.Fragment key={n}>{icono}</React.Fragment>;
        return (
          <TouchableOpacity
            key={n}
            onPress={() => onChange(n)}
            hitSlop={{ top: 6, bottom: 6, left: 2, right: 2 }}
            accessibilityLabel={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
          >
            {icono}
          </TouchableOpacity>
        );
      })}
    </>
  );
}

function iniciales(nombre) {
  const partes = (nombre || "").trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0][0].toUpperCase();
  return (partes[0][0] + partes[1][0]).toUpperCase();
}

// TODO: reemplazar por el nombre/foto real del perfil cuando se implemente
// esa parte (por ahora el encabezado muestra el título de la experiencia).
const ETIQUETAS_ACTOR = {
  comunidad: "Comunidad",
  artesano: "Artesano/a",
  guia: "Guía turístico/a",
  emprendedor: "Emprendedor/a",
};

export default function PublicacionCard({ experiencia }) {
  const insets = useSafeAreaInsets();
  const { user, profile } = useAuth();
  const [indiceImagen, setIndiceImagen] = useState(0);
  // Comentarios de la publicación (se actualizan en vivo).
  const [comentarios, setComentarios] = useState([]);
  const [comentariosVisible, setComentariosVisible] = useState(false);
  const [textoComentario, setTextoComentario] = useState("");
  const [calificacion, setCalificacion] = useState(0);
  const [fotosComentario, setFotosComentario] = useState([]); // [data URI]
  const [procesandoFoto, setProcesandoFoto] = useState(false);
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  // Uids de quienes dieron "me gusta" (se actualiza en vivo).
  const [likes, setLikes] = useState([]);
  // "Guardar" sigue siendo solo visual: todavía no se persiste en Firestore.
  const [guardadoActivo, setGuardadoActivo] = useState(false);

  const imagenes = experiencia.imagenUrls?.length
    ? experiencia.imagenUrls
    : experiencia.imagenes || [];

  const totalLikes = likes.length;
  const likeActivo = !!user?.uid && likes.includes(user.uid);
  // El autor ve el contador, pero no puede darse "me gusta" a sí mismo.
  const esAutor = !!user?.uid && experiencia.creadoPor === user.uid;
  const titulo =
    experiencia.titulo || ETIQUETAS_ACTOR[experiencia.actorType] || "Ruta505";
  const ubicacion = experiencia.lugar || experiencia.ubicacionExacta;

  useEffect(() => {
    if (!experiencia.id) return undefined;
    return escucharComentarios(experiencia.id, setComentarios, () =>
      setComentarios([])
    );
  }, [experiencia.id]);

  useEffect(() => {
    if (!experiencia.id) return undefined;
    return escucharLikes(experiencia.id, setLikes, () => setLikes([]));
  }, [experiencia.id]);

  const handleLike = async () => {
    if (!user?.uid || esAutor) return;
    try {
      await alternarLike(experiencia.id, user.uid, likeActivo);
    } catch (error) {
      console.warn("Error al dar me gusta:", error);
      Alert.alert(
        "No se pudo registrar tu me gusta",
        "Inténtalo de nuevo en unos minutos."
      );
    }
  };

  // Comenta cualquier usuario con sesión, menos el autor de la publicación.
  const puedeComentar = !!user?.uid && !esAutor;
  // Cada persona tiene un solo comentario por publicación: si ya comentó, edita.
  const miComentario = comentarios.find((c) => c.id === user?.uid) ?? null;

  useEffect(() => {
    if (!comentariosVisible) return;
    setCalificacion(miComentario?.calificacion ?? 0);
    setTextoComentario(miComentario?.texto ?? "");
    setFotosComentario(miComentario?.imagenes ?? []);
  }, [comentariosVisible]);

  const agregarFotos = async () => {
    if (fotosComentario.length >= MAX_FOTOS) {
      Alert.alert(
        "Límite alcanzado",
        `Puedes agregar hasta ${MAX_FOTOS} fotos por comentario.`
      );
      return;
    }
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert(
        "Permiso necesario",
        "Necesitamos acceso a tus fotos para adjuntarlas."
      );
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: MAX_FOTOS - fotosComentario.length,
      quality: 1,
    });
    if (resultado.canceled) return;

    setProcesandoFoto(true);
    try {
      const nuevas = [];
      let muyPesadas = 0;
      for (const asset of resultado.assets.slice(
        0,
        MAX_FOTOS - fotosComentario.length
      )) {
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
        nuevas.push(`data:image/jpeg;base64,${manipulado.base64}`);
      }
      if (nuevas.length > 0) setFotosComentario((prev) => [...prev, ...nuevas]);
      if (muyPesadas > 0) {
        Alert.alert(
          "Imagen muy pesada",
          `${muyPesadas === 1 ? "Una foto superó" : "Algunas fotos superaron"} el tamaño permitido y no se agregó.`
        );
      }
    } catch (error) {
      Alert.alert("No se pudo procesar la imagen", error.message);
    } finally {
      setProcesandoFoto(false);
    }
  };

  const handleEnviarComentario = async () => {
    const texto = textoComentario.trim();
    if (!puedeComentar) return;
    if (calificacion < 1) {
      Alert.alert("Falta la calificación", "Elige de 1 a 5 estrellas.");
      return;
    }
    if (!texto) {
      Alert.alert("Falta el comentario", "Cuéntanos qué te pareció.");
      return;
    }
    try {
      setEnviandoComentario(true);
      await guardarComentario(experiencia.id, {
        autorId: user.uid,
        autorNombre: profile?.nombreCompleto ?? "Usuario",
        calificacion,
        texto,
        imagenes: fotosComentario,
      });
      if (!miComentario) {
        setTextoComentario("");
        setCalificacion(0);
        setFotosComentario([]);
      }
    } catch (error) {
      console.warn("Error al comentar:", error);
      Alert.alert(
        "No se pudo enviar tu comentario",
        "Inténtalo de nuevo en unos minutos."
      );
    } finally {
      setEnviandoComentario(false);
    }
  };

  const handleBorrarComentario = (comentario) => {
    Alert.alert("Eliminar comentario", "¿Quieres eliminar este comentario?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await eliminarComentario(experiencia.id, comentario.id);
          } catch (error) {
            console.warn("Error al eliminar comentario:", error);
            Alert.alert("No se pudo eliminar", "Inténtalo de nuevo.");
          }
        },
      },
    ]);
  };

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
          style={[styles.pastilla, esAutor && { opacity: 0.6 }]}
          onPress={handleLike}
          disabled={esAutor}
          activeOpacity={0.7}
          accessibilityLabel={
            esAutor ? "Me gusta (no puedes darte me gusta a ti mismo)" : "Me gusta"
          }
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

        <TouchableOpacity
          style={styles.pastilla}
          onPress={() => setComentariosVisible(true)}
          activeOpacity={0.7}
          accessibilityLabel="Ver comentarios"
        >
          <Ionicons name="chatbubble-outline" size={17} color="#1F1F1F" />
          <Text style={styles.pastillaTexto}>{comentarios.length}</Text>
        </TouchableOpacity>
      </View>

      {/* Comentarios */}
      <Modal
        visible={comentariosVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setComentariosVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.comentariosFondo}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.comentariosHoja}>
            <View style={styles.comentariosCabecera}>
              <Text style={styles.comentariosTitulo}>
                Comentarios ({comentarios.length})
              </Text>
              <TouchableOpacity
                onPress={() => setComentariosVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel="Cerrar comentarios"
              >
                <Ionicons name="close" size={24} color="#555555" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={comentarios}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.comentariosLista}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={styles.comentariosVacio}>
                  Aún no hay comentarios.
                  {puedeComentar ? " ¡Sé el primero en comentar!" : ""}
                </Text>
              }
              renderItem={({ item }) => {
                const puedeBorrar =
                  !!user?.uid && (item.autorId === user.uid || esAutor);
                return (
                  <View style={styles.comentarioFila}>
                    <View style={styles.comentarioAvatar}>
                      <Text style={styles.comentarioAvatarTexto}>
                        {iniciales(item.autorNombre)}
                      </Text>
                    </View>
                    <View style={styles.comentarioCuerpo}>
                      <View style={styles.comentarioEncabezado}>
                        <Text style={styles.comentarioAutor} numberOfLines={1}>
                          {item.autorNombre || "Usuario"}
                        </Text>
                        <Text style={styles.comentarioTiempo}>
                          {formatearTiempoRelativo(item.createdAt)}
                        </Text>
                        {puedeBorrar && (
                          <TouchableOpacity
                            style={styles.comentarioBorrar}
                            onPress={() => handleBorrarComentario(item)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            accessibilityLabel="Eliminar comentario"
                          >
                            <Ionicons
                              name="trash-outline"
                              size={16}
                              color="#8A8A8A"
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      <View style={styles.comentarioEstrellas}>
                        <Estrellas valor={Number(item.calificacion) || 0} />
                      </View>
                      <Text style={styles.comentarioTexto}>{item.texto}</Text>
                      {(item.imagenes || []).slice(0, 1).map((uri) => (
                        <Image
                          key={`${item.id}-foto`}
                          source={{ uri }}
                          style={styles.comentarioFoto}
                        />
                      ))}
                      {!!item.respuesta && (
                        <View style={styles.comentarioRespuesta}>
                          <Text style={styles.comentarioRespuestaTitulo}>
                            Respuesta del autor
                          </Text>
                          <Text style={styles.comentarioRespuestaTexto}>
                            {item.respuesta}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              }}
            />

            {puedeComentar ? (
              <View
                style={[
                  styles.comentarioComposer,
                  { paddingBottom: insets.bottom + 10 },
                ]}
              >
                <View style={styles.comentarioSelectorEstrellas}>
                  <Text style={styles.comentarioSelectorTexto}>
                    {miComentario ? "Tu calificación:" : "Califica:"}
                  </Text>
                  <Estrellas
                    valor={calificacion}
                    size={26}
                    onChange={setCalificacion}
                  />
                </View>

                {fotosComentario.length > 0 && (
                  <View style={styles.comentarioMiniaturas}>
                    {fotosComentario.map((uri, indice) => (
                      <View
                        key={`miniatura-${indice}`}
                        style={styles.comentarioMiniaturaContenedor}
                      >
                        <Image
                          source={{ uri }}
                          style={styles.comentarioMiniatura}
                        />
                        <TouchableOpacity
                          style={styles.comentarioMiniaturaQuitar}
                          onPress={() =>
                            setFotosComentario((prev) =>
                              prev.filter((_, i) => i !== indice)
                            )
                          }
                          accessibilityLabel="Quitar foto"
                        >
                          <Ionicons name="close" size={12} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.comentarioEntradaFila}>
                  <TouchableOpacity
                    style={styles.comentarioBotonFoto}
                    onPress={agregarFotos}
                    disabled={procesandoFoto}
                    accessibilityLabel="Agregar foto"
                  >
                    {procesandoFoto ? (
                      <ActivityIndicator color={VERDE} />
                    ) : (
                      <Ionicons name="image-outline" size={20} color={VERDE} />
                    )}
                  </TouchableOpacity>
                  <TextInput
                    style={styles.comentarioInput}
                    placeholder="Escribe tu comentario o sugerencia…"
                    placeholderTextColor="#9A9A9A"
                    value={textoComentario}
                    onChangeText={setTextoComentario}
                    maxLength={MAX_COMENTARIO}
                    multiline
                  />
                  <TouchableOpacity
                    style={[
                      styles.comentarioEnviar,
                      (!textoComentario.trim() ||
                        calificacion < 1 ||
                        enviandoComentario ||
                        procesandoFoto) &&
                        styles.comentarioEnviarDeshabilitado,
                    ]}
                    onPress={handleEnviarComentario}
                    disabled={
                      !textoComentario.trim() ||
                      calificacion < 1 ||
                      enviandoComentario ||
                      procesandoFoto
                    }
                    accessibilityLabel={
                      miComentario ? "Guardar comentario" : "Enviar comentario"
                    }
                  >
                    {enviandoComentario ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Ionicons
                        name={miComentario ? "checkmark" : "send"}
                        size={18}
                        color="#FFFFFF"
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text
                style={[styles.comentarioAviso, { paddingBottom: insets.bottom + 12 }]}
              >
                {esAutor
                  ? "No puedes comentar tu propia publicación."
                  : "Inicia sesión para comentar."}
              </Text>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
