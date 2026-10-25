/**
 * PublicacionCard: componente/pantalla de la aplicación Ruta505.
 */

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
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Ionicons } from "@expo/vector-icons";

import {
  publicacionCardStyle as styles,
  ANCHO_IMAGEN,
} from "../../styles/home/publicacionCardStyle";
import { formatearTiempoRelativo } from "../../utils/tiempoRelativo";
import {
  alternarGuardado,
  alternarLike,
  actualizarExperiencia,
  eliminarComentario,
  eliminarExperiencia,
  escucharComentarios,
  escucharLikes,
  guardarComentario,
} from "../../services/Experienciasservice";
import { useAuth } from "../../context/AuthContext";
import { PERMISOS, tienePermiso } from "../../constants/permissions";

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

/**
 * PublicacionCard.
 */
export default function PublicacionCard({ experiencia }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, profile, role } = useAuth();
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
  // Quien tiene el permiso de favoritos (turista) guarda de verdad en su perfil;
  // para los demás roles el marcador sigue siendo solo visual.
  const puedeGuardar = tienePermiso(
    role ?? profile?.role,
    PERMISOS.GUARDAR_FAVORITOS
  );
  const [guardadoLocal, setGuardadoLocal] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [editando, setEditando] = useState(false);
  const [tituloEditado, setTituloEditado] = useState("");
  const [descripcionEditada, setDescripcionEditada] = useState("");
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);

  const imagenes = experiencia.imagenUrls?.length
    ? experiencia.imagenUrls
    : experiencia.imagenes || [];

  const totalLikes = likes.length;
  const likeActivo = !!user?.uid && likes.includes(user.uid);
  const guardadoActivo = puedeGuardar
    ? (profile?.guardados ?? []).includes(experiencia.id)
    : guardadoLocal;

  const alternarGuardar = async () => {
    if (!puedeGuardar) {
      setGuardadoLocal((v) => !v);
      return;
    }
    if (!user?.uid) return;
    try {
      await alternarGuardado(user.uid, experiencia.id, !guardadoActivo);
    } catch (error) {
      console.warn("Error al guardar la publicación:", error);
      Alert.alert(
        "No se pudo guardar",
        "Revisa tu conexión e inténtalo de nuevo."
      );
    }
  };
  // El autor ve el contador, pero no puede darse "me gusta" a sí mismo.
  const esAutor = !!user?.uid && experiencia.creadoPor === user.uid;
  const titulo =
    experiencia.titulo ||
    (experiencia.actorType && experiencia.actorType !== "guia"
      ? ETIQUETAS_ACTOR[experiencia.actorType]
      : "Ruta505");
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
        autorFoto: profile?.fotoPerfil ?? "",
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

  const abrirEdicion = () => {
    setTituloEditado(experiencia.titulo || titulo || "");
    setDescripcionEditada(experiencia.descripcion || "");
    setEditando(true);
    setMenuVisible(false);
  };

  const guardarEdicion = async () => {
    const tituloFinal = tituloEditado.trim();
    const descripcionFinal = descripcionEditada.trim();

    if (!tituloFinal) {
      Alert.alert("Falta el título", "Escribe un título para la publicación.");
      return;
    }

    try {
      setGuardandoEdicion(true);
      await actualizarExperiencia(experiencia.id, {
        titulo: tituloFinal,
        descripcion: descripcionFinal,
      });
      setEditando(false);
      Alert.alert("Publicación actualizada", "Los cambios se guardaron correctamente.");
    } catch (error) {
      console.warn("Error al actualizar la experiencia:", error);
      Alert.alert("No se pudo guardar", "Inténtalo de nuevo en unos minutos.");
    } finally {
      setGuardandoEdicion(false);
    }
  };

  const eliminarPublicacion = () => {
    Alert.alert("Eliminar publicación", "¿Seguro que quieres eliminar esta publicación?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await eliminarExperiencia(experiencia.id);
            setMenuVisible(false);
          } catch (error) {
            console.warn("Error al eliminar la experiencia:", error);
            Alert.alert("No se pudo eliminar", "Inténtalo de nuevo en unos minutos.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.card}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerContent}
          activeOpacity={0.7}
          disabled={!experiencia.creadoPor}
          onPress={() =>
            navigation.navigate("PerfilPublicoDrawer", {
              actorId: experiencia.creadoPor,
            })
          }
        >
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person-outline" size={20} color="#8C7B66" />
          </View>
          <View style={styles.headerTextos}>
            <View style={styles.filaTitulo}>
              <Text style={styles.titulo} numberOfLines={1}>
                {titulo}
              </Text>
              {experiencia.verificado === true && (
                <Image
                  source={require("../../assets/icons/Verificado.png")} // Ajusta el nombre según tu archivo
                  style={styles.iconoVerificado}
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
        </TouchableOpacity>

        {/* Botón de tres puntos (menú Editar / Eliminar / Reportar) quitado.
            Para volver a mostrarlo, restaura aquí el TouchableOpacity con
            style={styles.menuBoton} y onPress={() => setMenuVisible(true)}. */}
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View
            style={esAutor ? styles.menuSheetAutor : styles.menuSheetVisitante}
          >
            {esAutor ? (
              <>
                <TouchableOpacity
                  style={styles.menuOpcion}
                  onPress={abrirEdicion}
                >
                  <Ionicons name="create-outline" size={18} color="#1F1F1F" />
                  <Text style={styles.menuOpcionTexto}>Editar publicación</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuOpcion}
                  onPress={eliminarPublicacion}
                >
                  <Ionicons name="trash-outline" size={18} color="#C1443C" />
                  <Text style={[styles.menuOpcionTexto, { color: "#C1443C" }]}>
                    Eliminar publicación
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.menuOpcion}
                  onPress={() => {
                    setMenuVisible(false);
                    Alert.alert(
                      "Publicación",
                      "La opción de reportar está lista para ser conectada con tu flujo real de moderación.",
                    );
                  }}
                >
                  <Ionicons name="flag-outline" size={18} color="#1F1F1F" />
                  <Text style={styles.menuOpcionTexto}>Reportar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={editando}
        transparent
        animationType="fade"
        onRequestClose={() => setEditando(false)}
      >
        <View style={styles.modalEditarFondo}>
          <View style={styles.modalEditarCard}>
            <View style={styles.modalEditarHeader}>
              <Text style={styles.modalEditarTitulo}>Editar publicación</Text>
              <TouchableOpacity
                onPress={() => setEditando(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="#555555" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalEditarLabel}>Título</Text>
            <TextInput
              style={styles.modalEditarInput}
              value={tituloEditado}
              onChangeText={setTituloEditado}
              placeholder="Título de la experiencia"
              placeholderTextColor="#9A9A9A"
              maxLength={120}
            />

            <Text style={styles.modalEditarLabel}>Descripción</Text>
            <TextInput
              style={[
                styles.modalEditarInput,
                styles.modalEditarInputMultilinea,
              ]}
              value={descripcionEditada}
              onChangeText={setDescripcionEditada}
              placeholder="Describe tu experiencia"
              placeholderTextColor="#9A9A9A"
              multiline
              maxLength={500}
            />

            <TouchableOpacity
              style={[
                styles.modalEditarGuardar,
                guardandoEdicion && styles.modalEditarGuardarDisabled,
              ]}
              onPress={guardarEdicion}
              disabled={guardandoEdicion}
            >
              <Text style={styles.modalEditarGuardarTexto}>
                {guardandoEdicion ? "Guardando..." : "Guardar cambios"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

      {/* Me gusta / comentarios / guardar */}
      <View style={styles.accionesFila}>
        <View style={styles.accionesIzquierda}>
          <TouchableOpacity
            style={[styles.accionBoton, esAutor && { opacity: 0.6 }]}
            onPress={handleLike}
            disabled={esAutor}
            activeOpacity={0.7}
            accessibilityLabel={
              esAutor
                ? "Me gusta (no puedes darte me gusta a ti mismo)"
                : "Me gusta"
            }
          >
            <Image
              source={
                likeActivo
                  ? require("../../assets/icons/corazon.png") // Ícono relleno (naranja)
                  : require("../../assets/icons/corazon-vacio.png") // Ícono vacío
              }
              style={[likeActivo ? styles.corazonLleno : styles.corazonVacio]}
            />
            <Text style={styles.accionTexto}>{totalLikes}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.accionBoton}
            onPress={() => setComentariosVisible(true)}
            activeOpacity={0.7}
            accessibilityLabel="Ver comentarios"
          >
            <Image
              source={require("../../assets/icons/puntos-de-comentario.png")}
              style={styles.comentario}
            />
            <Text style={styles.accionTexto}>{comentarios.length}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={alternarGuardar}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={
            guardadoActivo ? "Quitar de guardados" : "Guardar"
          }
        >
          <Image
            source={
              guardadoActivo
                ? require("../../assets/icons/favorito.png") // Tu ícono guardado (lleno)
                : require("../../assets/icons/Guardar.png") // Tu ícono sin guardar (vacío)
            }
            style={guardadoActivo ? styles.iconoLleno : styles.iconoVacio}
          />
        </TouchableOpacity>
      </View>

      {/* Título en negrita + descripción, y hora */}
      <Text style={styles.descripcion}>
        <Text style={styles.descripcionTitulo}>{titulo}</Text>
        {experiencia.descripcion ? `  ${experiencia.descripcion}` : ""}
      </Text>
      <Text style={styles.tiempoTexto}>
        {formatearTiempoRelativo(experiencia.createdAt)}
      </Text>

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
                // Foto de perfil del autor del comentario. Si es mi comentario
                // uso mi foto actual; si no, la que se guardó al comentar.
                const fotoAutor =
                  item.autorId === user?.uid
                    ? profile?.fotoPerfil || item.autorFoto
                    : item.autorFoto;
                return (
                  <View style={styles.comentarioFila}>
                    <View style={styles.comentarioAvatar}>
                      {fotoAutor ? (
                        <Image
                          source={{ uri: fotoAutor }}
                          style={styles.comentarioAvatarFoto}
                        />
                      ) : (
                        <Text style={styles.comentarioAvatarTexto}>
                          {iniciales(item.autorNombre)}
                        </Text>
                      )}
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
                              prev.filter((_, i) => i !== indice),
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
                style={[
                  styles.comentarioAviso,
                  { paddingBottom: insets.bottom + 12 },
                ]}
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
