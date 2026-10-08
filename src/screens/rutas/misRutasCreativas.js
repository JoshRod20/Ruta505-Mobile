import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../context/AuthContext";
import {
  ESTADO_PARADA,
  ESTADO_RUTA,
  MINIMO_ALIADOS,
  aliadosAceptados,
  calcularTotal,
  cancelarRuta,
  escucharMisRutas,
  escucharParadasDeCreador,
  formatearPrecio,
} from "../../services/rutasService";
import { iconoDeCategoria } from "../../services/Categoriasexperiencias";
import { misRutasStyle as s } from "../../styles/rutas/misRutasCreativasStyle";
import { VERDE } from "../../styles/rutas/crearRutaStyle";

const ETIQUETA_ESTADO = {
  [ESTADO_RUTA.PUBLICADA]: { texto: "Publicada", estilo: "estadoPublicada" },
  [ESTADO_RUTA.EN_ESPERA]: { texto: "En espera", estilo: "estadoEnEspera" },
  [ESTADO_RUTA.BORRADOR]: { texto: "Borrador", estilo: "estadoBorrador" },
};

// Rutas creativas del actor: siguen activas hasta que las cancela.
export default function MisRutasCreativas() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user } = useAuth();

  const [rutas, setRutas] = useState(null); // null = cargando
  const [paradas, setParadas] = useState([]);
  const [cancelando, setCancelando] = useState(null);

  useEffect(() => {
    if (!user?.uid) return undefined;
    const quitarRutas = escucharMisRutas(user.uid, setRutas, () => setRutas([]));
    const quitarParadas = escucharParadasDeCreador(user.uid, setParadas);
    return () => {
      quitarRutas();
      quitarParadas();
    };
  }, [user?.uid]);

  const vigentes = useMemo(
    () => (rutas ?? []).filter((r) => r.estado !== ESTADO_RUTA.CANCELADA),
    [rutas]
  );

  const paradasDe = (rutaId) => paradas.filter((p) => p.rutaId === rutaId);

  const salir = () =>
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.navigate("MainDrawer");

  const verEnElMapa = (ruta, paradasRuta) => {
    const incluidas = paradasRuta.filter(
      (p) =>
        p.estado === ESTADO_PARADA.CREADOR ||
        p.estado === ESTADO_PARADA.ACEPTADA
    );
    navigation.navigate("MainDrawer", {
      screen: "Mapa",
      params: {
        rutaCreativa: {
          id: ruta.id,
          nombre: ruta.nombre,
          total: calcularTotal(paradasRuta),
          paradas: incluidas.map((p) => ({
            id: p.id,
            ubicacionId: p.ubicacionId,
            titulo: p.titulo,
            categoria: p.categoria,
            precio: p.precio,
          })),
        },
      },
    });
  };

  // "Ver más": abre el resumen de la ruta publicada (paso 6 del asistente).
  const verMas = (ruta) =>
    navigation.navigate("CrearRutaDrawer", {
      rutaId: ruta.id,
      paso: 6,
      clave: Date.now(),
    });

  // Continuar una ruta que aún espera invitaciones.
  const continuar = (ruta) =>
    navigation.navigate("CrearRutaDrawer", {
      rutaId: ruta.id,
      paso: ruta.estado === ESTADO_RUTA.BORRADOR ? 3 : 4,
      clave: Date.now(),
    });

  const confirmarCancelacion = (ruta, paradasRuta) => {
    const publicada = ruta.estado === ESTADO_RUTA.PUBLICADA;
    Alert.alert(
      "Cancelar ruta",
      publicada
        ? `"${ruta.nombre}" dejará de estar publicada y los aliados ya no la verán. Esta acción no se puede deshacer.`
        : `Se cancelará "${ruta.nombre}" y se retirarán las invitaciones enviadas. Esta acción no se puede deshacer.`,
      [
        { text: "Volver", style: "cancel" },
        {
          text: "Cancelar ruta",
          style: "destructive",
          onPress: async () => {
            try {
              setCancelando(ruta.id);
              await cancelarRuta({ rutaId: ruta.id, paradas: paradasRuta });
            } catch (error) {
              console.warn("Error al cancelar la ruta:", error);
              const codigo = error?.code ?? error?.message ?? "desconocido";
              Alert.alert(
                error?.paso === "paradas"
                  ? "Ruta cancelada con un aviso"
                  : "No se pudo cancelar",
                error?.paso === "paradas"
                  ? `La ruta se canceló, pero no se pudieron retirar sus paradas (${codigo}).`
                  : `No se pudo cancelar la ruta (${codigo}). Si es un error de permisos, revisa que las reglas de Firestore más recientes estén publicadas.`
              );
            } finally {
              setCancelando(null);
            }
          },
        },
      ]
    );
  };

  const renderParada = (p) => {
    const imagen = p.imagenes?.[0] ?? p.imagenUrls?.[0];
    const pendiente = p.estado === ESTADO_PARADA.INVITADO;
    const rechazada = p.estado === ESTADO_PARADA.RECHAZADA;
    return (
      <View key={p.id} style={s.parada}>
        <View style={s.paradaImagen}>
          {imagen ? (
            <Image
              source={{ uri: imagen }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <Ionicons
              name={iconoDeCategoria(p.categoria)}
              size={30}
              color={VERDE}
            />
          )}
        </View>
        <View style={s.paradaCuerpo}>
          <Text style={s.paradaNombre} numberOfLines={1}>
            {p.titulo}
          </Text>
          {!!p.horario && (
            <View style={s.paradaFilaHorario}>
              <Ionicons name="time-outline" size={12} color="#4A4A4A" />
              <Text style={s.paradaHorario} numberOfLines={1}>
                {p.horario}
              </Text>
            </View>
          )}
          {pendiente && <Text style={s.paradaPendiente}>Invitación en espera</Text>}
          {rechazada && <Text style={s.paradaPendiente}>Rechazó la invitación</Text>}
        </View>
      </View>
    );
  };

  const renderRuta = (ruta) => {
    const paradasRuta = paradasDe(ruta.id);
    const incluidas = paradasRuta.filter(
      (p) =>
        p.estado === ESTADO_PARADA.CREADOR ||
        p.estado === ESTADO_PARADA.ACEPTADA
    );
    const publicada = ruta.estado === ESTADO_RUTA.PUBLICADA;
    const visibles = publicada
      ? incluidas
      : paradasRuta.filter((p) => p.estado !== ESTADO_PARADA.RECHAZADA);
    const etiqueta = ETIQUETA_ESTADO[ruta.estado] ?? ETIQUETA_ESTADO.borrador;
    const enCancelacion = cancelando === ruta.id;

    return (
      <View key={ruta.id} style={s.tarjeta}>
        <View style={s.filaSuperior}>
          <View style={s.pastillaLugares}>
            <Text style={s.pastillaLugaresTexto}>
              {incluidas.length} lugares incluidos
            </Text>
          </View>
          <View style={[s.pastillaLugares, s[etiqueta.estilo]]}>
            <Text style={s.estadoTexto}>{etiqueta.texto}</Text>
          </View>
        </View>

        <Text style={s.nombre}>{ruta.nombre}</Text>
        <Text style={s.etiquetaItinerario}>ITINERARIO GUIADO</Text>

        {visibles.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={s.carrusel}
            contentContainerStyle={s.carruselContenido}
            nestedScrollEnabled
          >
            {visibles.map(renderParada)}
          </ScrollView>
        )}

        {publicada ? (
          <>
            {incluidas.length >= 2 && (
              <TouchableOpacity
                style={s.enlaceMapa}
                onPress={() => verEnElMapa(ruta, paradasRuta)}
                activeOpacity={0.7}
              >
                <Ionicons name="location" size={18} color={VERDE} />
                <Text style={s.enlaceMapaTexto}>Ver paradas en el mapa</Text>
              </TouchableOpacity>
            )}
            <View style={s.cajaTotal}>
              <View>
                <Text style={s.totalEtiqueta}>Total por persona</Text>
                <Text style={s.totalValor}>
                  {formatearPrecio(calcularTotal(paradasRuta))}
                </Text>
              </View>
              <TouchableOpacity
                style={s.botonLima}
                onPress={() => verMas(ruta)}
                activeOpacity={0.85}
              >
                <Text style={s.botonLimaTexto}>Ver más</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={s.cajaTotal}>
            <Text style={s.avance}>
              Han aceptado {aliadosAceptados(paradasRuta).length} de{" "}
              {MINIMO_ALIADOS} aliados necesarios.
            </Text>
            <TouchableOpacity
              style={s.botonLima}
              onPress={() => continuar(ruta)}
              activeOpacity={0.85}
            >
              <Text style={s.botonLimaTexto}>Continuar</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={s.botonCancelar}
          onPress={() => confirmarCancelacion(ruta, paradasRuta)}
          disabled={enCancelacion}
          activeOpacity={0.7}
        >
          {enCancelacion ? (
            <ActivityIndicator color="#C0392B" />
          ) : (
            <Text style={s.botonCancelarTexto}>Cancelar ruta</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[s.container, { paddingTop: insets.top + 8 }]}>
      <View style={s.encabezado}>
        <TouchableOpacity
          style={s.botonAtras}
          onPress={salir}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Volver"
        >
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </TouchableOpacity>
        <Text style={s.titulo}>Mis Rutas Creativas</Text>
        <View style={s.botonAtras} />
      </View>

      <ScrollView
        contentContainerStyle={[s.lista, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.subtitulo}>
          Experiencias culturales inmersivas y talleres guiados por actores
          culturales.
        </Text>

        {rutas === null ? (
          <ActivityIndicator style={{ marginTop: 30 }} color={VERDE} />
        ) : vigentes.length === 0 ? (
          <View style={s.vacio}>
            <Text style={s.vacioTexto}>
              No tienes rutas activas. Crea una nueva para empezar.
            </Text>
            <TouchableOpacity
              style={s.botonNaranja}
              onPress={() =>
                navigation.navigate("CrearRutaDrawer", {
                  paso: 2,
                  clave: Date.now(),
                })
              }
              activeOpacity={0.85}
            >
              <Text style={s.botonNaranjaTexto}>+ Nueva ruta creativa</Text>
            </TouchableOpacity>
          </View>
        ) : (
          vigentes.map(renderRuta)
        )}
      </ScrollView>
    </View>
  );
}
