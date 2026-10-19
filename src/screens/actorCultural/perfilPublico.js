/**
 * PerfilPublico: perfil de un actor cultural visto por otros usuarios
 * (turista). Muestra la información del negocio, sus publicaciones, su
 * ubicación y las reseñas/comentarios que recibieron sus publicaciones.
 * Dos pestañas: "Información del perfil" y "Reseñas". Desde la pestaña de
 * reseñas, el botón "+" permite escribir una reseña (buena o mala).
 *
 * Parámetros de navegación: actorId (uid del actor = id de su negocio).
 */

import React, { useEffect, useMemo, useState } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../context/AuthContext";
import { escucharNegocio } from "../../services/Negociosservice";
import {
  escucharActividadDeActor,
  esResenaBuena,
  guardarComentario,
  resumirResenas,
} from "../../services/Experienciasservice";
import { elegirFotosBase64 } from "../../utils/imagenes";
import { formatearTiempoRelativo } from "../../utils/tiempoRelativo";
import { Estrellas, iniciales, nombreCorto } from "../comunidad/resenas";
import { resenasStyle as r } from "../../styles/comunidad/resenasStyle";
import { perfilPublicoStyle as s } from "../../styles/actorCultural/perfilPublicoStyle";

const VERDE = "#0E5A34";
const NARANJA = "#F29100";
const MAX_FOTOS = 2;
const MAX_TEXTO = 500;
const PESTANAS = [
  { id: "info", texto: "Información del perfil" },
  { id: "resenas", texto: "Reseñas" },
];
// Buena = 5 estrellas, Mala = 1 (la reseña de este flujo no pide estrellas).
const ESTRELLAS_POR_TIPO = { buena: 5, mala: 1 };

/**
 * PerfilPublico.
 */
export default function PerfilPublico() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { params } = useRoute();
  const actorId = params?.actorId ?? null;
  const { user, profile } = useAuth();

  const [negocio, setNegocio] = useState(null);
  const [cargandoNegocio, setCargandoNegocio] = useState(true);
  const [publicaciones, setPublicaciones] = useState([]);
  const [resenas, setResenas] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [infoCompleta, setInfoCompleta] = useState(false);
  const [pestana, setPestana] = useState("info");

  // Flujo "escribir reseña": null | "tipo" | "buena" | "mala"
  const [paso, setPaso] = useState(null);
  const [texto, setTexto] = useState("");
  const [fotos, setFotos] = useState([]);
  const [errorForm, setErrorForm] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!actorId) {
      setCargandoNegocio(false);
      return undefined;
    }
    const quitarNegocio = escucharNegocio(
      actorId,
      (n) => {
        setNegocio(n);
        setCargandoNegocio(false);
      },
      () => setCargandoNegocio(false)
    );
    const quitarActividad = escucharActividadDeActor(
      actorId,
      ({ publicaciones: pubs, comentarios }) => {
        setPublicaciones(pubs);
        setResenas(comentarios);
      },
      () => {}
    );
    return () => {
      quitarNegocio();
      quitarActividad();
    };
  }, [actorId]);

  const resumen = useMemo(() => resumirResenas(resenas), [resenas]);
  const visibles = useMemo(() => {
    if (filtro === "buenas") return resenas.filter(esResenaBuena);
    if (filtro === "malas") return resenas.filter((x) => !esResenaBuena(x));
    return resenas;
  }, [resenas, filtro]);

  const portada = negocio?.imagenes?.[0] ?? negocio?.imagenUrls?.[0];
  const fotosPublicaciones = publicaciones
    .map((p) => (p.imagenUrls?.length ? p.imagenUrls[0] : p.imagenes?.[0]))
    .filter(Boolean);
  const esMiPerfil = !!user?.uid && user.uid === actorId;
  // La reseña se guarda como comentario de la publicación más reciente.
  const publicacionDestino = publicaciones[0] ?? null;
  const puedeEscribir = !!user?.uid && !esMiPerfil;
  const descripcion = negocio?.descripcion ?? "";
  const descripcionLarga = descripcion.length > 160;

  const volver = () =>
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.navigate("MainDrawer", { screen: "Inicio" });

  const verEnElMapa = () =>
    navigation.navigate("MainDrawer", {
      screen: "Mapa",
      params: { puntoId: actorId },
    });

  const empezarResena = () => {
    if (!publicacionDestino) {
      Alert.alert(
        "Aún no se puede reseñar",
        "Este espacio todavía no tiene publicaciones para reseñar."
      );
      return;
    }
    setTexto("");
    setFotos([]);
    setErrorForm("");
    setPaso("tipo");
  };

  const cerrarFlujo = () => {
    if (!enviando) setPaso(null);
  };

  const agregarFotos = async () => {
    const nuevas = await elegirFotosBase64(MAX_FOTOS - fotos.length);
    if (nuevas.length > 0) setFotos((prev) => [...prev, ...nuevas]);
  };

  const publicarResena = async () => {
    if (!texto.trim()) {
      setErrorForm("Escribe tu reseña.");
      return;
    }
    try {
      setEnviando(true);
      await guardarComentario(publicacionDestino.id, {
        autorId: user.uid,
        autorNombre: profile?.nombreCompleto ?? "Usuario",
        calificacion: ESTRELLAS_POR_TIPO[paso],
        texto: texto.trim(),
        imagenes: fotos,
      });
      setPaso(null);
    } catch (err) {
      console.warn("Error al publicar la reseña:", err);
      Alert.alert(
        "No se pudo publicar",
        "Inténtalo de nuevo en unos minutos."
      );
    } finally {
      setEnviando(false);
    }
  };

  if (cargandoNegocio) {
    return (
      <View style={[s.container, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={VERDE} />
      </View>
    );
  }

  const chips = [
    { id: "todas", texto: `Todas (${resumen.total})`, icono: null },
    { id: "buenas", texto: `Buenas (${resumen.buenas})`, icono: "thumbs-up-outline" },
    { id: "malas", texto: `Malas (${resumen.malas})`, icono: "thumbs-down-outline" },
  ];

  const renderResena = (item) => {
    const buena = esResenaBuena(item);
    const fotosResena = item.imagenes || [];
    return (
      <View key={`${item.experienciaId}-${item.id}`} style={r.tarjeta}>
        <View style={r.tarjetaCabecera}>
          <View style={r.avatar}>
            <Text style={r.avatarTexto}>{iniciales(item.autorNombre)}</Text>
          </View>
          <View style={r.autorBloque}>
            <Text style={r.autorNombre} numberOfLines={1}>
              {nombreCorto(item.autorNombre)}
            </Text>
            <Text style={r.autorTiempo}>
              {formatearTiempoRelativo(item.createdAt)}
            </Text>
          </View>
          <View style={[r.insignia, buena ? r.insigniaBuena : r.insigniaMala]}>
            <Text
              style={[
                r.insigniaTexto,
                buena ? r.insigniaTextoBuena : r.insigniaTextoMala,
              ]}
            >
              {buena ? "Buena" : "Mala"}
            </Text>
          </View>
        </View>
        <View style={[r.estrellasFila, { alignItems: "center" }]}>
          <Text style={s.puntajeResena}>
            {(Number(item.calificacion) || 0).toFixed(1)}
          </Text>
          <Estrellas valor={Number(item.calificacion) || 0} size={16} />
        </View>
        {!!item.texto && <Text style={r.comentario}>“{item.texto}”</Text>}
        {fotosResena.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={r.fotosFila}>
            {fotosResena.map((uri, i) => (
              <Image key={`${item.id}-${i}`} source={{ uri }} style={r.foto} />
            ))}
          </ScrollView>
        )}
        {!!item.respuesta && (
          <View style={r.respuestaBloque}>
            <Text style={r.respuestaTitulo}>Respuesta del espacio cultural</Text>
            <Text style={r.respuestaTexto}>{item.respuesta}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={s.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        <View>
          <Image
            source={
              portada
                ? { uri: portada }
                : require("../../assets/images/Patron-2.png")
            }
            style={s.portada}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={[s.botonAtras, { top: insets.top + 8 }]}
            onPress={volver}
            accessibilityLabel="Volver"
          >
            <Ionicons name="arrow-back" size={22} color="#111111" />
          </TouchableOpacity>
        </View>

        <View style={s.hoja}>
          <Text style={s.titulo}>{negocio?.titulo ?? "Espacio cultural"}</Text>

          {resumen.promedio != null && (
            <View style={s.filaCalificacion}>
              <Text style={s.promedio}>{resumen.promedio.toFixed(1)}</Text>
              <Estrellas valor={Math.round(resumen.promedio)} size={16} />
              <Text style={s.totalResenas}>({resumen.total})</Text>
            </View>
          )}

          {!!negocio?.lugar && (
            <View style={s.filaLugar}>
              <Ionicons name="location-sharp" size={15} color={VERDE} />
              <Text style={s.lugarTexto} numberOfLines={1}>
                {negocio.lugar}
              </Text>
            </View>
          )}

          <View style={s.pestanasFila}>
            {PESTANAS.map((p) => {
              const activa = pestana === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[s.pestana, activa && s.pestanaActiva]}
                  onPress={() => setPestana(p.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.pestanaTexto, activa && s.pestanaTextoActivo]}>
                    {p.texto}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {pestana === "info" ? (
            <>
              {descripcion ? (
                <>
                  <Text style={s.descripcion} numberOfLines={infoCompleta ? undefined : 4}>
                    {descripcion}
                  </Text>
                  {descripcionLarga && (
                    <TouchableOpacity onPress={() => setInfoCompleta((v) => !v)}>
                      <Text style={s.mostrarMas}>
                        {infoCompleta ? "Resumir" : "Mostrar más"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <Text style={s.vacioTexto}>Este espacio aún no tiene descripción.</Text>
              )}

              <Text style={s.seccion}>Publicaciones</Text>
              {fotosPublicaciones.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {fotosPublicaciones.map((uri, i) => (
                    <Image key={i} source={{ uri }} style={s.fotoPublicacion} />
                  ))}
                </ScrollView>
              ) : (
                <Text style={s.vacioTexto}>Aún no hay publicaciones.</Text>
              )}

              {typeof negocio?.lat === "number" && (
                <>
                  <Text style={s.seccion}>Ubicación en el mapa</Text>
                  <View style={s.cajaMapa}>
                    <Ionicons name="location" size={26} color={VERDE} />
                    <View style={s.cajaMapaTextos}>
                      <Text style={s.cajaMapaTitulo} numberOfLines={1}>
                        {negocio.lugar || negocio.titulo}
                      </Text>
                      {!!negocio.ubicacionExacta && (
                        <Text style={s.cajaMapaDetalle} numberOfLines={2}>
                          {negocio.ubicacionExacta}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity style={s.botonMapa} onPress={verEnElMapa} activeOpacity={0.85}>
                      <Text style={s.botonMapaTexto}>Ver en el mapa</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

            </>
          ) : (
            <>
              {puedeEscribir && (
                <View style={s.filaAgregar}>
                  <TouchableOpacity
                    style={s.botonMas}
                    onPress={empezarResena}
                    activeOpacity={0.85}
                    accessibilityLabel="Escribir una reseña"
                  >
                    <Ionicons name="add" size={22} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}

              <View style={[r.filtrosFila, { marginTop: 12, marginBottom: 12 }]}>
                {chips.map((chip) => {
                  const activo = filtro === chip.id;
                  return (
                    <TouchableOpacity
                      key={chip.id}
                      style={[r.chip, activo && r.chipActivo]}
                      onPress={() => setFiltro(chip.id)}
                      activeOpacity={0.8}
                    >
                      {!!chip.icono && (
                        <Ionicons
                          name={chip.icono}
                          size={17}
                          color={activo ? "#FFFFFF" : "#1A1A1A"}
                        />
                      )}
                      <Text style={[r.chipTexto, activo && r.chipTextoActivo]}>
                        {chip.texto}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {visibles.length === 0 ? (
                <Text style={s.vacioTexto}>
                  {resenas.length === 0
                    ? "Aún no hay reseñas."
                    : "No hay reseñas en esta categoría."}
                </Text>
              ) : (
                visibles.map(renderResena)
              )}

            </>
          )}
        </View>
      </ScrollView>

      {/* ¿Qué tipo de reseña quiere publicar? */}
      <Modal visible={paso === "tipo"} transparent animationType="fade" onRequestClose={cerrarFlujo}>
        <View style={s.centroFondo}>
          <View style={s.cajaCentro}>
            <TouchableOpacity
              style={s.modalAtras}
              onPress={cerrarFlujo}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Volver"
            >
              <Ionicons name="arrow-back" size={20} color="#111111" />
            </TouchableOpacity>
            <Text style={s.cajaTitulo}>¿Qué tipo de reseña quieres publicar?</Text>
            <View style={s.tipoFila}>
              <TouchableOpacity
                style={[s.botonTipo, { backgroundColor: VERDE, marginRight: 8 }]}
                onPress={() => setPaso("buena")}
                activeOpacity={0.85}
              >
                <Ionicons name="thumbs-up" size={18} color="#FFFFFF" />
                <Text style={s.botonTipoTexto}>Buena</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.botonTipo, { backgroundColor: NARANJA }]}
                onPress={() => setPaso("mala")}
                activeOpacity={0.85}
              >
                <Ionicons name="thumbs-down" size={18} color="#FFFFFF" />
                <Text style={s.botonTipoTexto}>Mala</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Nueva reseña */}
      <Modal
        visible={paso === "buena" || paso === "mala"}
        transparent
        animationType="fade"
        onRequestClose={cerrarFlujo}
      >
        <KeyboardAvoidingView
          style={s.centroFondo}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={s.cajaCentro}>
            <TouchableOpacity
              style={s.modalAtras}
              onPress={cerrarFlujo}
              disabled={enviando}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Volver"
            >
              <Ionicons name="arrow-back" size={20} color="#111111" />
            </TouchableOpacity>
            <Text style={s.tituloNuevaResena}>Nueva reseña</Text>

            <Text style={s.etiquetaCampo}>Descripción</Text>
            <TextInput
              style={r.input}
              multiline
              placeholder="Escribe aquí…"
              placeholderTextColor="#8A8A8A"
              value={texto}
              onChangeText={(t) => {
                setTexto(t);
                if (errorForm) setErrorForm("");
              }}
              maxLength={MAX_TEXTO}
            />

            {/* Solo fotos por ahora; los videos cortos se agregan después. */}
            <Text style={s.etiquetaCampo}>Fotos (si requiere)</Text>
            {fotos.length === 0 ? (
              <TouchableOpacity
                style={s.cajaMultimedia}
                onPress={agregarFotos}
                activeOpacity={0.75}
              >
                <Text style={s.textoMultimedia}>+ Agregar multimedia</Text>
              </TouchableOpacity>
            ) : (
              <View style={[s.cajaMultimedia, { alignItems: "flex-start" }]}>
                <View style={r.miniaturasFila}>
                  {fotos.map((uri, i) => (
                    <View key={i} style={r.miniaturaContenedor}>
                      <Image source={{ uri }} style={r.miniatura} />
                      <TouchableOpacity
                        style={r.miniaturaQuitar}
                        onPress={() => setFotos((prev) => prev.filter((_, j) => j !== i))}
                        accessibilityLabel="Quitar foto"
                      >
                        <Ionicons name="close" size={12} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  {fotos.length < MAX_FOTOS && (
                    <TouchableOpacity style={s.agregarMasTile} onPress={agregarFotos}>
                      <Ionicons name="add" size={22} color="#065F33" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {!!errorForm && <Text style={r.error}>{errorForm}</Text>}

            <View style={s.botonesFilaCentro}>
              <TouchableOpacity
                style={s.botonCancelarPeque}
                onPress={cerrarFlujo}
                disabled={enviando}
                activeOpacity={0.8}
              >
                <Text style={s.botonCancelarPequeTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.botonPublicarPeque, enviando && r.botonDeshabilitado]}
                onPress={publicarResena}
                disabled={enviando}
                activeOpacity={0.85}
              >
                {enviando ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={s.botonPublicarPequeTexto}>Publicar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
