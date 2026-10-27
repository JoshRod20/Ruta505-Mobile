/**
 * CrearRutaInicio: componente/pantalla de la aplicación Ruta505.
 */

import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useTabBarHeight from "../../hooks/useTabBarHeight";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../context/AuthContext";
import { usePermisos } from "../../hooks/usePermisos";
import { PERMISOS } from "../../constants/permissions";
import { escucharNegocio } from "../../services/Negociosservice";
import {
  escucharMisRutas,
  ESTADO_RUTA,
} from "../../services/rutasService";
import {
  CATEGORIAS_EXPERIENCIA,
  iconoDeCategoria,
} from "../../services/Categoriasexperiencias";
import {
  crearRutaStyle as s,
  VERDE,
  LIMA,
} from "../../styles/rutas/crearRutaStyle";
import IconoCategoria from "../../components/common/IconoCategoria";

const nombreDeCategoria = (id) =>
  CATEGORIAS_EXPERIENCIA.find((c) => c.id === id)?.label ?? "";

// Pestaña "+": paso 1 de 5 de la Ruta Creativa ("Mis servicios").
/**
 * CrearRutaInicio.
 */
export default function CrearRutaInicio() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useTabBarHeight();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { puede } = usePermisos();

  const [negocio, setNegocio] = useState(null);
  const [rutas, setRutas] = useState([]);

  // Cada actor tiene un solo negocio (negocios/{uid}): su ubicación en el mapa.
  useEffect(() => {
    if (!user?.uid) return undefined;
    return escucharNegocio(user.uid, setNegocio);
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return undefined;
    return escucharMisRutas(user.uid, setRutas);
  }, [user?.uid]);

  const padding = {
    paddingTop: insets.top + 16,
    paddingBottom: tabBarHeight + 24,
  };

  if (!puede(PERMISOS.PUBLICAR_EXPERIENCIA)) {
    return (
      <View style={[s.avisoContenedor, padding]}>
        <Text style={s.aviso}>
          Las rutas creativas las crean los actores culturales.
        </Text>
      </View>
    );
  }

  // Una ruta sigue activa hasta que su creador la cancela.
  const rutasVigentes = rutas.filter((r) => r.estado !== ESTADO_RUTA.CANCELADA);

  // "clave" distinta en cada visita: reinicia el asistente (ver CrearRutaCreativa).
  const nuevaRuta = () =>
    navigation.navigate("CrearRutaDrawer", { paso: 2, clave: Date.now() });

  const verRutasActivas = () => {
    if (rutasVigentes.length === 0) {
      Alert.alert(
        "Sin rutas activas",
        "No tienes rutas activas. Crea una nueva para empezar."
      );
      return;
    }
    navigation.navigate("MisRutasCreativasDrawer");
  };

  const imagen = negocio?.imagenes?.[0] ?? negocio?.imagenUrls?.[0];

  return (
    <View style={s.container}>
      <ScrollView
        contentContainerStyle={padding}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.tituloGrande}>Creación de una ruta</Text>

        <View style={s.subHeader}>
          <Text style={s.subHeaderTexto}>Mis servicios</Text>
          <View style={s.contadorPaso}>
            <Text style={s.contadorPasoTexto}>1 / 5</Text>
          </View>
        </View>

        <View style={s.contenido}>
          {negocio ? (
            <View style={s.tarjeta}>
              <View style={s.tarjetaMiniatura}>
                {imagen ? (
                  <Image
                    source={{ uri: imagen }}
                    style={s.tarjetaMiniaturaImagen}
                  />
                ) : (
                  <IconoCategoria
                    categoria={negocio.categoria}
                    size={32}
                    color={VERDE}
                  />
                )}
              </View>
              <View style={s.tarjetaCuerpo}>
                <Text style={s.tarjetaTitulo} numberOfLines={2}>
                  {negocio.titulo}
                </Text>
                <Text style={s.tarjetaDetalle}>
                  {nombreDeCategoria(negocio.categoria)}
                </Text>
                {!!negocio.lugar && (
                  <View style={s.tarjetaLugarFila}>
                    <Ionicons name="location" size={13} color="#1E9BD7" />
                    <Text style={[s.tarjetaDetalle, { marginLeft: 4 }]}>
                      {negocio.lugar}
                    </Text>
                  </View>
                )}
                {typeof negocio.calificacion === "number" && (
                  <View style={s.estrellaFila}>
                    <Ionicons name="star" size={13} color="#F5A623" />
                    <Text style={s.estrellaTexto}>
                      {negocio.calificacion.toFixed(1)}
                    </Text>
                  </View>
                )}
              </View>
              <View style={[s.insignia, { backgroundColor: LIMA }]}>
                <Text style={[s.insigniaTexto, { color: "#1A1A1A" }]}>Tú</Text>
              </View>
            </View>
          ) : (
            <View style={{ marginTop: 8 }}>
              <Text style={s.aviso}>
                Aún no registraste tu negocio. Agrégalo desde el mapa para
                poder crear rutas creativas.
              </Text>
              <TouchableOpacity
                style={s.botonVerde}
                onPress={() => navigation.navigate("Mapa")}
                activeOpacity={0.85}
              >
                <Text style={s.botonVerdeTexto}>Ir al mapa</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[s.botonVerde, !negocio && s.botonDeshabilitado]}
            onPress={nuevaRuta}
            disabled={!negocio}
            activeOpacity={0.85}
          >
            <Text style={s.botonVerdeTexto}>+ Nueva ruta creativa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.botonLima}
            onPress={verRutasActivas}
            activeOpacity={0.85}
          >
            <Text style={s.botonLimaTexto}>Ver mis rutas activas</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
