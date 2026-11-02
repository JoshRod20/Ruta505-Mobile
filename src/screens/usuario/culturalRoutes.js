/**
 * CulturalRoutes: "Rutas Creativas" del turista. Lista las rutas que los
 * actores culturales ya publicaron, con buscador, paradas, días y total.
 */

import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useTabBarHeight from "../../hooks/useTabBarHeight";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import {
  ESTADO_PARADA,
  calcularDias,
  calcularTotal,
  escucharParadasPublicadas,
  escucharRutasPublicadas,
  formatearPrecio,
  ordenarParadas,
  abrirChatWhatsApp,
} from "../../services/rutasService";
import { escucharNegocios } from "../../services/Negociosservice";
import { misRutasStyle as s } from "../../styles/rutas/misRutasCreativasStyle";
import { culturalRoutesStyle as c } from "../../styles/usuario/culturalRoutesStyle";
import { VERDE } from "../../styles/rutas/crearRutaStyle";
import IconoCategoria from "../../components/common/IconoCategoria";

const normalizar = (texto) =>
  (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/**
 * CulturalRoutes.
 */
export default function CulturalRoutes() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useTabBarHeight();
  const navigation = useNavigation();

  const [rutas, setRutas] = useState(null); // null = cargando
  const [paradas, setParadas] = useState([]);
  const [negocios, setNegocios] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // Fotos de los negocios: respaldo cuando la parada no trae fotos propias.
  useEffect(() => escucharNegocios(setNegocios), []);

  useEffect(() => {
    const quitarRutas = escucharRutasPublicadas(setRutas, () => setRutas([]));
    const quitarParadas = escucharParadasPublicadas(setParadas);
    return () => {
      quitarRutas();
      quitarParadas();
    };
  }, []);

  // Cada ruta con sus paradas (las que forman parte de la ruta publicada).
  const lista = useMemo(() => {
    const texto = normalizar(busqueda);
    return (rutas ?? [])
      .map((ruta) => {
        const propias = paradas.filter(
          (p) =>
            p.rutaId === ruta.id &&
            (p.estado === ESTADO_PARADA.CREADOR ||
              p.estado === ESTADO_PARADA.ACEPTADA)
        );
        return { ruta, paradas: ordenarParadas(propias) };
      })
      .filter((r) => r.paradas.length > 0)
      .filter((r) =>
        texto
          ? normalizar(
              `${r.ruta.nombre} ${r.paradas.map((p) => p.titulo).join(" ")}`
            ).includes(texto)
          : true
      );
  }, [rutas, paradas, busqueda]);

  const verEnElMapa = ({ ruta, paradas: paradasRuta }) =>
    navigation.navigate("MainDrawer", {
      screen: "Mapa",
      params: {
        rutaCreativa: {
          id: ruta.id,
          nombre: ruta.nombre,
          total: calcularTotal(paradasRuta),
          paradas: paradasRuta.map((p) => ({
            id: p.id,
            ubicacionId: p.ubicacionId,
            titulo: p.titulo,
            categoria: p.categoria,
            precio: p.precio,
          })),
        },
      },
    });

  const abrirWhatsApp = (telefono) =>
    abrirChatWhatsApp(telefono).catch(() =>
      Alert.alert("WhatsApp", "No se pudo abrir WhatsApp.")
    );

  // Al tocar el lugar se abre su perfil público (igual que desde una publicación).
  const verPerfil = (p) => {
    const actorId = p.actorId ?? p.ubicacionId;
    if (actorId) navigation.navigate("PerfilPublicoDrawer", { actorId });
  };

  const renderParada = (p) => {
    const negocioParada = negocios.find((n) => n.id === p.ubicacionId);
    const imagen =
      p.imagenes?.[0] ??
      p.imagenUrls?.[0] ??
      negocioParada?.imagenes?.[0] ??
      negocioParada?.imagenUrls?.[0];
    return (
      <TouchableOpacity
        key={p.id}
        style={s.parada}
        onPress={() => verPerfil(p)}
        activeOpacity={0.85}
        accessibilityLabel={`Ver perfil de ${p.titulo}`}
      >
        <View style={s.paradaImagen}>
          {imagen ? (
            <Image
              source={{ uri: imagen }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <IconoCategoria categoria={p.categoria} size={30} color={VERDE} />
          )}
        </View>
        <View style={s.paradaCuerpo}>
          <Text style={s.paradaNombre} numberOfLines={1}>
            {p.titulo}
          </Text>
          {!!p.horario && (
            <View style={s.paradaFilaHorario}>
              <Image
                source={require("../../assets/icons/reloj-tres.png")}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />
              <Text style={s.paradaHorario} numberOfLines={1}>
                {p.horario}
              </Text>
            </View>
          )}
          {!!p.telefono && (
            <TouchableOpacity
              style={s.botonWhatsApp}
              onPress={() => abrirWhatsApp(p.telefono)}
              activeOpacity={0.85}
            >
              <View style={s.whatsappCirculo}>
                <Ionicons name="logo-whatsapp" size={14} color={VERDE} />
              </View>
              <Text style={s.botonWhatsAppTexto}>WhatsApp</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderRuta = (item) => {
    const { ruta, paradas: paradasRuta } = item;
    const dias = calcularDias(paradasRuta);
    return (
      <View key={ruta.id} style={s.tarjeta}>
        <View style={s.filaSuperior}>
          <View style={s.pastillaLugares}>
            <Text style={s.pastillaLugaresTexto}>
              {paradasRuta.length}{" "}
              {paradasRuta.length === 1 ? "lugar incluido" : "lugares incluidos"}
            </Text>
          </View>
        </View>

        <Text style={s.nombre}>{ruta.nombre}</Text>
        <Text style={s.etiquetaItinerario}>Lugares por conocer</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.carrusel}
          contentContainerStyle={s.carruselContenido}
          nestedScrollEnabled
        >
          {paradasRuta.map((p) => renderParada(p))}
        </ScrollView>

        <View style={s.filaMapaDias}>
          {paradasRuta.length >= 2 ? (
            <TouchableOpacity
              style={s.enlaceMapa}
              onPress={() => verEnElMapa(item)}
              activeOpacity={0.7}
            >
              <Image
                source={require("../../assets/icons/Icono-Verde.png")}
                style={{ width: 18, height: 18 }}
                resizeMode="contain"
              />
              <Text style={s.enlaceMapaTexto}>Ver paradas en el mapa</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          {dias > 0 && (
            <View style={s.pastillaDias}>
              <Text style={s.pastillaDiasTexto}>
                {dias} {dias === 1 ? "día" : "días"}
              </Text>
            </View>
          )}
        </View>

        <View style={s.cajaTotal}>
          <Text style={s.totalEtiqueta}>Total por persona</Text>
          <Text style={s.totalValor}>
            {formatearPrecio(calcularTotal(paradasRuta))}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[c.container, { paddingTop: insets.top + 8 }]}>
      <Text style={c.titulo}>Rutas Creativas</Text>

      <View style={c.buscador}>
        <Image source={require("../../assets/icons/busqueda.png")} style={c.iconoLupa} />
        <TextInput
          style={c.buscadorInput}
          placeholder="Buscar"
          placeholderTextColor="#9A9A9A"
          value={busqueda}
          onChangeText={setBusqueda}
          returnKeyType="search"
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          c.lista,
          { paddingBottom: tabBarHeight + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={c.seccion}>Rutas sugeridas</Text>
        {rutas === null ? (
          <ActivityIndicator style={{ marginTop: 30 }} color={VERDE} />
        ) : lista.length === 0 ? (
          <Text style={c.vacio}>
            {busqueda
              ? "No encontramos rutas con esa búsqueda."
              : "Aún no hay rutas creativas publicadas."}
          </Text>
        ) : (
          lista.map(renderRuta)
        )}
      </ScrollView>
    </View>
  );
}
