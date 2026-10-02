import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import PublicacionCard from "../components/comunidad/PublicacionCard";
import { useAuth } from "../context/AuthContext";
import { usePermisos } from "../hooks/usePermisos";
import { PERMISOS } from "../constants/permissions";
import { ROLES, ESTADOS_VERIFICACION } from "../constants/roles";
import {
  escucharExperiencias,
  esUbicacionDeMapa,
} from "../services/Experienciasservice";
import { homeStyle, VERDE } from "../styles/home/homeStyle";

export default function Home() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { role, estadoVerificacion } = useAuth();
  const { puede } = usePermisos();

  const [experiencias, setExperiencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  // Actor cultural que entró por "Explorar" desde PendienteAprobacionScreen:
  // puede ver Home, pero no publicar hasta que se apruebe su perfil.
  const revisionPendiente =
    role === ROLES.ACTOR_CULTURAL &&
    estadoVerificacion === ESTADOS_VERIFICACION.PENDIENTE;

  const puedePublicar = puede(PERMISOS.PUBLICAR_EXPERIENCIA) && !revisionPendiente;
  const esActor = role === ROLES.ACTOR_CULTURAL;

  useEffect(() => {
    const unsubscribe = escucharExperiencias(
      (datos) => {
        // Las ubicaciones de negocios viven solo en el mapa interactivo.
        setExperiencias(datos.filter((pub) => !esUbicacionDeMapa(pub)));
        setCargando(false);
        setError(false);
      },
      () => {
        setCargando(false);
        setError(true);
      }
    );

    return unsubscribe;
  }, []);

  const encabezado = (
    <View>
      <View style={homeStyle.encabezado}>
        <View style={homeStyle.encabezadoIzquierda}>
          {/* Menú lateral (Mi cuenta, Acerca de, Cerrar sesión) */}
          <TouchableOpacity
            style={homeStyle.botonMenu}
            onPress={() => navigation.openDrawer?.()}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Abrir menú"
          >
            <Ionicons name="menu-outline" size={30} color={VERDE} />
          </TouchableOpacity>
          <Image
            source={require("../assets/images/LogoRuta505.png")}
            style={homeStyle.logo}
            resizeMode="contain"
          />
        </View>

        {/* TODO: conectar con la pantalla de notificaciones cuando exista */}
        <TouchableOpacity
          style={homeStyle.botonCampana}
          activeOpacity={0.7}
          accessibilityLabel="Notificaciones"
        >
          <Ionicons name="notifications-outline" size={26} color={VERDE} />
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
            Tu perfil sigue en revisión — puedes explorar Ruta 505, pero
            todavía no puedes publicar contenido.
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
            : "Aún no hay experiencias publicadas. ¡Sé el primero en compartir una!"}
        </Text>
      )}
    </View>
  );

  return (
    <View style={[homeStyle.container, { paddingTop: insets.top + 8 }]}>
      <FlatList
        data={cargando || error ? [] : experiencias}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PublicacionCard experiencia={item} />}
        ListHeaderComponent={encabezado}
        ListEmptyComponent={vacio}
        // 68 = altura de CustomTabBar (BAR_HEIGHT en CustomTabBar.js), que está
        // en position:"absolute" y por eso no empuja el contenido.
        contentContainerStyle={{ paddingBottom: 68 + insets.bottom + 7 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
