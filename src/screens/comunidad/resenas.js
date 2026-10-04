import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
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

import {
  escucharActividadDeActor,
  esResenaBuena,
  responderComentario,
  resumirResenas,
} from "../../services/Experienciasservice";
import { useAuth } from "../../context/AuthContext";
import { formatearTiempoRelativo } from "../../utils/tiempoRelativo";
import {
  resenasStyle as s,
  VERDE,
  NARANJA,
} from "../../styles/comunidad/resenasStyle";

const MAX_RESPUESTA = 600;
const ESTRELLA_APAGADA = "#BDBDBD";

function iniciales(nombre) {
  const partes = (nombre || "").trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0][0].toUpperCase();
  return (partes[0][0] + partes[1][0]).toUpperCase();
}

// Nombre corto como en el diseño: "Maria Fernanda G."
function nombreCorto(nombre) {
  const partes = (nombre || "").trim().split(/\s+/).filter(Boolean);
  if (partes.length <= 2) return partes.join(" ") || "Visitante";
  return `${partes[0]} ${partes[1]} ${partes[2][0].toUpperCase()}.`;
}

function Estrellas({ valor, size = 26, onChange }) {
  return (
    <>
      {[1, 2, 3, 4, 5].map((n) => {
        const icono = (
          <Ionicons
            name="star"
            size={size}
            color={n <= valor ? NARANJA : ESTRELLA_APAGADA}
            style={{ marginRight: 4 }}
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

// ==================================================
// Modal para que el actor responda una reseña
// ==================================================
function ModalRespuesta({ resena, guardando, onCancelar, onEnviar }) {
  const insets = useSafeAreaInsets();
  const [texto, setTexto] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (resena) {
      setTexto("");
      setError("");
    }
  }, [resena]);

  const enviar = () => {
    if (!texto.trim()) {
      setError("Escribe tu respuesta.");
      return;
    }
    setError("");
    onEnviar(texto.trim());
  };

  return (
    <Modal
      visible={!!resena}
      transparent
      animationType="slide"
      onRequestClose={guardando ? undefined : onCancelar}
    >
      <KeyboardAvoidingView
        style={s.modalFondo}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[s.modalHoja, { paddingBottom: insets.bottom + 20 }]}>
          <Text style={s.modalTitulo}>Responder reseña</Text>
          <Text style={s.modalSubtitulo}>
            Tu respuesta será visible para todos los visitantes.
          </Text>

          <Text style={s.etiqueta}>Tu respuesta</Text>
          <TextInput
            style={s.input}
            multiline
            placeholder="Agradece o aclara lo que comentó el visitante…"
            placeholderTextColor="#9A9A9A"
            value={texto}
            onChangeText={setTexto}
            maxLength={MAX_RESPUESTA}
          />
          <Text style={s.contadorCaracteres}>
            {texto.length}/{MAX_RESPUESTA}
          </Text>

          {!!error && <Text style={s.error}>{error}</Text>}

          <View style={s.modalBotones}>
            <TouchableOpacity
              style={s.botonCancelar}
              onPress={onCancelar}
              disabled={guardando}
            >
              <Text style={s.botonCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.botonConfirmar, guardando && s.botonDeshabilitado]}
              onPress={enviar}
              disabled={guardando}
            >
              {guardando ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={s.botonConfirmarTexto}>Responder</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ==================================================
// Pantalla "Reseñas" (Espacio Cultural)
// Muestra los comentarios con calificación que recibieron las publicaciones
// de un actor. Se abre desde Estadísticas ("Ver todas las reseñas").
//
// Parámetros de navegación: actorId (dueño del espacio) y titulo (opcional).
// ==================================================
export default function Resenas() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { params } = useRoute();
  const { actorId = null, titulo = "" } = params || {};
  const { user } = useAuth();

  const [resenas, setResenas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [filtro, setFiltro] = useState("todas");
  const [resenaPorResponder, setResenaPorResponder] = useState(null);
  const [respondiendo, setRespondiendo] = useState(false);

  useEffect(() => {
    if (!actorId) {
      setCargando(false);
      return undefined;
    }
    return escucharActividadDeActor(
      actorId,
      ({ comentarios }) => {
        setResenas(comentarios);
        setCargando(false);
        setError(false);
      },
      () => {
        setCargando(false);
        setError(true);
      }
    );
  }, [actorId]);

  const resumen = useMemo(() => resumirResenas(resenas), [resenas]);
  const visibles = useMemo(() => {
    if (filtro === "buenas") return resenas.filter(esResenaBuena);
    if (filtro === "malas") return resenas.filter((r) => !esResenaBuena(r));
    return resenas;
  }, [resenas, filtro]);

  const volver = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("MainDrawer", { screen: "Inicio" });
    }
  };

  const handleResponder = async (texto) => {
    if (!resenaPorResponder) return;
    try {
      setRespondiendo(true);
      await responderComentario(
        resenaPorResponder.experienciaId,
        resenaPorResponder.id,
        texto
      );
      setResenaPorResponder(null);
    } catch (err) {
      console.error("Error al responder la reseña:", err);
      Alert.alert(
        "No se pudo enviar tu respuesta",
        "Inténtalo de nuevo en unos minutos."
      );
    } finally {
      setRespondiendo(false);
    }
  };

  const textoTotal = `${resumen.total} ${
    resumen.total === 1 ? "opinión" : "opiniones"
  } en total de visitantes`;

  const encabezado = (
    <View style={s.resumenContenedor}>
      <Text style={s.nombreEspacio} numberOfLines={2}>
        {titulo || "Espacio Cultural"}
      </Text>
      <Text style={s.totalOpiniones}>{textoTotal}</Text>

      <View style={s.filtrosFila}>
        {[
          { id: "todas", texto: `Todas (${resumen.total})`, icono: null },
          {
            id: "buenas",
            texto: `Buenas (${resumen.buenas})`,
            icono: "thumbs-up-outline",
          },
          {
            id: "malas",
            texto: `Malas (${resumen.malas})`,
            icono: "thumbs-down-outline",
          },
        ].map((chip) => {
          const activo = filtro === chip.id;
          return (
            <TouchableOpacity
              key={chip.id}
              style={[s.chip, activo && s.chipActivo]}
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
              <Text style={[s.chipTexto, activo && s.chipTextoActivo]}>
                {chip.texto}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const vacio = (
    <View style={s.estadoContenedor}>
      {cargando ? (
        <ActivityIndicator size="large" color={VERDE} />
      ) : (
        <Text style={s.estadoTexto}>
          {error
            ? "No se pudieron cargar las reseñas. Intenta de nuevo más tarde."
            : resenas.length === 0
            ? "Aún no hay reseñas."
            : "No hay reseñas en esta categoría."}
        </Text>
      )}
    </View>
  );

  const renderItem = ({ item }) => {
    const buena = esResenaBuena(item);
    const fotos = item.imagenes || [];
    const puedeResponder =
      !!user?.uid && item.actorId === user.uid && !item.respuesta;

    return (
      <View style={s.tarjeta}>
        <View style={s.tarjetaCabecera}>
          <View style={s.avatar}>
            <Text style={s.avatarTexto}>{iniciales(item.autorNombre)}</Text>
          </View>
          <View style={s.autorBloque}>
            <Text style={s.autorNombre} numberOfLines={1}>
              {nombreCorto(item.autorNombre)}
            </Text>
            <Text style={s.autorTiempo}>
              {formatearTiempoRelativo(item.createdAt)}
            </Text>
          </View>
          <View style={[s.insignia, buena ? s.insigniaBuena : s.insigniaMala]}>
            <Text
              style={[
                s.insigniaTexto,
                buena ? s.insigniaTextoBuena : s.insigniaTextoMala,
              ]}
            >
              {buena ? "Buena" : "Mala"}
            </Text>
          </View>
        </View>

        <View style={s.estrellasFila}>
          <Estrellas valor={Number(item.calificacion) || 0} size={26} />
        </View>

        {!!item.texto && <Text style={s.comentario}>“{item.texto}”</Text>}

        {fotos.length === 1 && (
          <View style={s.fotosFila}>
            <Image source={{ uri: fotos[0] }} style={s.fotoUnica} />
          </View>
        )}
        {fotos.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={s.fotosFila}
          >
            {fotos.map((uri, index) => (
              <Image
                key={`${item.id}-${index}`}
                source={{ uri }}
                style={s.foto}
              />
            ))}
          </ScrollView>
        )}

        {!!item.respuesta && (
          <View style={s.respuestaBloque}>
            <Text style={s.respuestaTitulo}>Respuesta del espacio cultural</Text>
            <Text style={s.respuestaTexto}>{item.respuesta}</Text>
          </View>
        )}

        <View style={s.pieTarjeta}>
          {puedeResponder && (
            <TouchableOpacity
              style={s.botonResponder}
              onPress={() => setResenaPorResponder(item)}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-undo-outline" size={20} color="#555555" />
              <Text style={s.botonResponderTexto}>Responder</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[s.container, { paddingTop: insets.top + 8 }]}>
      <View style={s.header}>
        <TouchableOpacity
          style={s.botonAtras}
          onPress={volver}
          accessibilityLabel="Volver"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </TouchableOpacity>
        <Text style={s.tituloPantalla}>Reseñas</Text>
        <View style={s.botonAtras} />
      </View>

      <FlatList
        data={cargando || error ? [] : visibles}
        keyExtractor={(item) => `${item.experienciaId}-${item.id}`}
        renderItem={renderItem}
        ListHeaderComponent={encabezado}
        ListEmptyComponent={vacio}
        contentContainerStyle={[s.lista, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      />

      <ModalRespuesta
        resena={resenaPorResponder}
        guardando={respondiendo}
        onCancelar={() => setResenaPorResponder(null)}
        onEnviar={handleResponder}
      />
    </View>
  );
}
