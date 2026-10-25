/**
 * Home: componente/pantalla de la aplicación Ruta505.
 */

import React, { useEffect,useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import PublicacionCard from "../components/comunidad/PublicacionCard";
import PinolitoAvatar from "../components/PinolitoAvatar";
import { useAuth } from "../context/AuthContext";
import { usePermisos } from "../hooks/usePermisos";
import { PERMISOS } from "../constants/permissions";
import { ROLES, ESTADOS_VERIFICACION } from "../constants/roles";
import { escucharExperiencias } from "../services/Experienciasservice";
import {
  CATEGORIAS_EXPERIENCIA,
  idCategoria,
} from "../services/Categoriasexperiencias";
import { escucharInvitaciones, ESTADO_PARADA } from "../services/rutasService";
import { homeStyle, VERDE } from "../styles/home/homeStyle";

// Categorías de búsqueda (solo vista del turista): las mismas del catálogo
// único de la app, para que coincidan con lo que guardan los formularios.
const CATEGORIAS = CATEGORIAS_EXPERIENCIA;

export default function Home() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, role, estadoVerificacion } = useAuth();
  const { puede } = usePermisos();

  const [experiencias, setExperiencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  // Invitaciones a rutas creativas sin responder (número en la campana).
  const [invitacionesPendientes, setInvitacionesPendientes] = useState(0);
  // Categoría seleccionada (solo turista).
  const [categoriaActiva, setCategoriaActiva] = useState(null);

  const esActor = role === ROLES.ACTOR_CULTURAL;
  const esTurista = role === ROLES.TURISTA;

  // Actor cultural que entró por "Explorar" desde PendienteAprobacionScreen:
  // puede ver Home, pero no publicar hasta que se apruebe su perfil.
  const revisionPendiente =
    role === ROLES.ACTOR_CULTURAL &&
    estadoVerificacion === ESTADOS_VERIFICACION.PENDIENTE;

  const puedePublicar =
    puede(PERMISOS.PUBLICAR_EXPERIENCIA) && !revisionPendiente;
  const puedeUsarPinolito = puede(PERMISOS.USAR_PINOLITO);

  useEffect(() => {
    if (!esActor || !user?.uid) return undefined;
    return escucharInvitaciones(user.uid, (lista) =>
      setInvitacionesPendientes(
        lista.filter((i) => i.estado === ESTADO_PARADA.INVITADO).length,
      ),
    );
  }, [esActor, user?.uid]);

  useEffect(() => {
    const unsubscribe = escucharExperiencias(
      (datos) => {
        setExperiencias(datos);
        setCargando(false);
        setError(false);
      },
      () => {
        setCargando(false);
        setError(true);
      },
    );

    return unsubscribe;
  }, []);

  // Filtro por categoría: solo aplica al turista.
  const experienciasFiltradas = useMemo(() => {
    if (!esTurista || !categoriaActiva) return experiencias;
    return experiencias.filter(
      (e) => idCategoria(e.categoria) === categoriaActiva,
    );
  }, [experiencias, categoriaActiva, esTurista]);

  const toggleCategoria = (id) =>
    setCategoriaActiva((actual) => (actual === id ? null : id));

  // ───────────── Encabezado NUEVO: solo turista ─────────────
  const encabezadoTurista = (
    <View>
      <View style={homeStyle.encabezado}>
        <View style={homeStyle.encabezadoIzquierda}>
          <Image
            source={require("../assets/images/Logo Horizontal.png")}
            style={homeStyle.logo}
            resizeMode="contain"
          />
        </View>

        {puedeUsarPinolito && (
          <TouchableOpacity
            style={homeStyle.botonPinolito}
            activeOpacity={0.8}
            accessibilityLabel="Abrir Pinolito"
            onPress={() => navigation.navigate("PinolitoDrawer")}
          >
            {/* Pinolito con el atuendo que el usuario guardó */}
            {/* Zoom: en la foto de perfil se ve la cabeza de Pinolito, no el cuerpo
                completo. Ajusta acercar (más grande = más cerca) y
                ajusteVertical (negativo sube, positivo baja) si lo quieres
                encuadrar distinto. */}
            <PinolitoAvatar
              style={homeStyle.pinolitoImagen}
              acercar={1.2}
              ajusteVertical={5}
            />
          </TouchableOpacity>
        )}
      </View>

      <Text style={homeStyle.tituloDescubrir}>¿Qué deseas descubrir hoy?</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={homeStyle.categoriasLista}
      >
        {CATEGORIAS.map((cat) => {
          const activa = categoriaActiva === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.8}
              onPress={() => toggleCategoria(cat.id)}
              style={[homeStyle.chip, activa && homeStyle.chipActivo]}
              accessibilityRole="button"
              accessibilityState={{ selected: activa }}
            >
              {/* ICONO_CATEGORIA: ícono personalizado o de respaldo */}
              {typeof cat.icono === "string" ? (
                <Ionicons
                  name={cat.icono}
                  size={18}
                  color={activa ? "#FFFFFF" : VERDE}
                />
              ) : (
                <Image
                  source={cat.icono}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: activa ? "#FFFFFF" : VERDE, // Pinta el PNG si tiene fondo transparente
                  }}
                  resizeMode="contain"
                />
              )}
              <Text
                style={[
                  homeStyle.chipTexto,
                  activa && homeStyle.chipTextoActivo,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={homeStyle.tituloComunidades}>
        Explora nuestras comunidades
      </Text>
    </View>
  );

  // ───────────── Encabezado ORIGINAL: actor, institución y demás ─────────────
  const encabezadoOriginal = (
    <View>
      <View style={homeStyle.encabezado}>
        <View style={homeStyle.encabezadoIzquierda}>
          <Image
            source={require("../assets/images/Logo Horizontal.png")}
            style={homeStyle.logo}
            resizeMode="contain"
          />
        </View>

        {/* La campana abre las invitaciones a rutas creativas (solo actores). */}
        <TouchableOpacity
          style={homeStyle.botonCampana}
          activeOpacity={0.7}
          accessibilityLabel="Notificaciones"
          onPress={() =>
            esActor ? navigation.navigate("InvitacionesRutaDrawer") : undefined
          }
        >
        <Image source={require("../assets/icons/campana.png")} style={homeStyle.campana} />
          {invitacionesPendientes > 0 && (
            <View
              style={{  
                position: "absolute",
                top: 1,
                right: -2,
                minWidth: 18,
                height: 18,
                borderRadius: 9,
                paddingHorizontal: 4,
                backgroundColor: "#C1443C",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 11,
                  fontFamily: "Inter-SemiBold",
                }}
              >
                {invitacionesPendientes}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Text style={homeStyle.intro}>
        {esActor
          ? "Visualiza aquí todas tus publicaciones y conoce a los demás actores culturales que forman parte de "
          : "Descubre aquí las experiencias y comunidades que forman parte de "}
        <Text style={homeStyle.introResaltado}>Ruta 505</Text>.
      </Text>

      {revisionPendiente && (
        <View style={homeStyle.avisoTarjeta}>
          <Text style={homeStyle.avisoTexto}>
            Tu perfil sigue en revisión — puedes explorar Ruta 505, pero todavía
            no puedes publicar contenido.
          </Text>
        </View>
      )}

      {puedePublicar && (
        <TouchableOpacity
          style={homeStyle.botonNueva}
          onPress={() => navigation.navigate("PublicarExperienciaDrawer")}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
          <Text style={homeStyle.botonNuevaTexto}>Nueva publicación</Text>
        </TouchableOpacity>
      )}

      <Text style={homeStyle.etiquetaNuevos}>Nuevos</Text>
    </View>
  );

  const vacio = (
    <View style={homeStyle.feedEstadoContenedor}>
      {cargando ? (
        <ActivityIndicator size="large" color={VERDE} />
      ) : (
        <Text style={homeStyle.feedEstadoTexto}>
          {error
            ? "No se pudieron cargar las publicaciones. Intenta de nuevo más tarde."
            : esTurista && categoriaActiva
              ? "No hay experiencias en esta categoría todavía."
              : "Aún no hay experiencias publicadas. ¡Sé el primero en compartir una!"}
        </Text>
      )}
    </View>
  );

  return (
    <View style={[homeStyle.container, { paddingTop: insets.top + 8 }]}>
      <FlatList
        data={cargando || error ? [] : experienciasFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PublicacionCard experiencia={item} />}
        ListHeaderComponent={esTurista ? encabezadoTurista : encabezadoOriginal}
        ListEmptyComponent={vacio}
        // 68 = altura de CustomTabBar (BAR_HEIGHT en CustomTabBar.js), que está
        // en position:"absolute" y por eso no empuja el contenido.
        contentContainerStyle={{ paddingBottom: 68 + insets.bottom + 7 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}