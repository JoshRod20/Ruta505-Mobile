import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
  Image,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Map,
  Camera,
  GeoJSONSource,
  Layer,
  ViewAnnotation,
} from "@maplibre/maplibre-react-native";
import Geolocation from "@react-native-community/geolocation";
import { Ionicons } from "@expo/vector-icons";

import FloatingNavButton from "./common/FloatingNavButton.js";
import { mapaNicaraguaStyle } from "../styles/mapanicaragua/mapaNicaraguaStyle.js";
import { obtenerRuta } from "../services/osrmservice.js";
import {
  crearExperiencia,
  escucharExperiencias,
  actualizarExperiencia,
} from "../services/Experienciasservice.js";
import {
  iconoDeCategoria,
  colorDeCategoria,
} from "../services/Categoriasexperiencias.js";
import NavegacionRuta from "../components/NavegacionRuta.js";
import FormularioExperiencia from "../components/Formularioexperiencia.js";
import SeleccionarUbicacionMapa from "../components/Seleccionarubicacionmapa.js";
import { useAuth } from "../context/AuthContext";
import { usePermisos } from "../hooks/usePermisos";
import { PERMISOS } from "../constants/permissions";

// Estilo libre de OpenFreeMap (sin API key)
const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

// Configuración inicial de Geolocation para Android
if (Platform.OS === "android") {
  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: "whenInUse",
    enableBackgroundLocationUpdates: false,
    locationProvider: "auto",
  });
}

// Solicita permisos de ubicación en Android
async function pedirPermisoUbicacion() {
  if (Platform.OS !== "android") return true;

  try {
    const resultado = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Permiso de ubicación",
        message:
          "Ruta505 necesita tu ubicación para mostrarte rutas y navegación desde donde estás.",
        buttonPositive: "Permitir",
        buttonNegative: "Ahora no",
      },
    );
    return resultado === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.warn("Error pidiendo permiso de ubicación:", error);
    return false;
  }
}

export default function MapaNicaragua() {
  const insets = useSafeAreaInsets();
  const topOffset = insets.top + 4 + 28 + 4;
  const mapRef = useRef(null);
  const cameraRef = useRef(null);
  const { user, role, sancionVigente } = useAuth();
  const { puede } = usePermisos();

  // Permiso para publicar si el rol lo permite y no hay sanción
  const puedePublicar = puede(PERMISOS.PUBLICAR_EXPERIENCIA) && !sancionVigente;

  const [puntos, setPuntos] = useState([]);
  const [formularioVisible, setFormularioVisible] = useState(false);
  const [ubicacionParaGuardar, setUbicacionParaGuardar] = useState(null);
  const [selectorMapaVisible, setSelectorMapaVisible] = useState(false);
  const [experienciaEnEdicion, setExperienciaEnEdicion] = useState(null);
  const [formularioSesionId, setFormularioSesionId] = useState(0); // Forzar reset del formulario
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [epocaMarcadores, setEpocaMarcadores] = useState(0); // Forzar remount de ViewAnnotation

  const cerrarTarjeta = useCallback(() => {
    setPuntoSeleccionado(null);
    setEpocaMarcadores((e) => e + 1);
  }, []);

  const [ruta, setRuta] = useState(null);
  const [cargandoRuta, setCargandoRuta] = useState(false);
  const [navegando, setNavegando] = useState(false);
  const [ubicacionOrigen, setUbicacionOrigen] = useState(null);
  const [permisoConcedido, setPermisoConcedido] = useState(false);

  // Pide permisos y obtiene la ubicación al cargar el componente
  useEffect(() => {
    (async () => {
      const concedido = await pedirPermisoUbicacion();
      setPermisoConcedido(concedido);

      if (!concedido) {
        Alert.alert(
          "Sin permiso de ubicación",
          "No vamos a poder mostrar tu posición ni trazar rutas hasta que actives el permiso desde Ajustes del sistema.",
        );
        return;
      }

      obtenerUbicacionConReintento();
    })();
  }, []);

  // Escucha cambios en tiempo real desde Firestore
  useEffect(() => {
    const cancelarSuscripcion = escucharExperiencias(
      (experiencias) => {
        // Filtra puntos sin coordenadas válidas para evitar crashes
        const conCoordenadasValidas = experiencias.filter(
          (e) =>
            typeof e.lat === "number" &&
            typeof e.lng === "number" &&
            !Number.isNaN(e.lat) &&
            !Number.isNaN(e.lng),
        );

        const descartados = experiencias.length - conCoordenadasValidas.length;
        if (descartados > 0) {
          console.warn(
            `${descartados} experiencia(s) sin lat/lng válidos — omitidas.`,
          );
        }

        setPuntos(conCoordenadasValidas);
      },
      (error) =>
        Alert.alert("No se pudieron cargar las experiencias", error.message),
    );

    return () => cancelarSuscripcion();
  }, []);

  async function handleGuardarExperiencia(datosFormulario) {
    const ubicacion = ubicacionParaGuardar ?? ubicacionOrigen;
    try {
      if (experienciaEnEdicion) {
        await actualizarExperiencia(experienciaEnEdicion.id, {
          ...datosFormulario,
          lat: ubicacion.lat,
          lng: ubicacion.lon,
        });
        Alert.alert("Listo", "Tus cambios ya están guardados.");
      } else {
        await crearExperiencia({
          ...datosFormulario,
          lat: ubicacion.lat,
          lng: ubicacion.lon,
          creadoPor: user?.uid ?? null,
        });
        Alert.alert(
          "Listo",
          "Tu experiencia ya está visible en el mapa para todos.",
        );
      }
      setFormularioVisible(false);
      setUbicacionParaGuardar(null);
      setExperienciaEnEdicion(null);
      cerrarTarjeta();
    } catch (error) {
      Alert.alert("No se pudo guardar", error.message);
    }
  }

  function abrirFormularioParaCrear() {
    setExperienciaEnEdicion(null);
    setFormularioSesionId((n) => n + 1);
    setFormularioVisible(true);
  }

  function abrirFormularioParaEditar(punto) {
    setExperienciaEnEdicion(punto);
    setUbicacionParaGuardar({ lat: punto.lat, lon: punto.lng });
    setFormularioSesionId((n) => n + 1);
    setFormularioVisible(true);
  }

  function abrirSelectorDeMapa() {
    setFormularioVisible(false);
    setSelectorMapaVisible(true);
  }

  function handleConfirmarUbicacionElegida(coordenadas) {
    setUbicacionParaGuardar(coordenadas);
    setSelectorMapaVisible(false);
    setFormularioVisible(true);
  }

  function handleCancelarSelectorMapa() {
    setSelectorMapaVisible(false);
    setFormularioVisible(true);
  }

  function moverCamaraA(lat, lon) {
    setUbicacionOrigen({ lat, lon });
    if (cameraRef.current) {
      cameraRef.current.setStop({
        center: [lon, lat],
        zoom: 15,
        duration: 1200,
      });
    }
  }

  // Intenta obtener GPS de alta precisión; si falla/expira, usa precisión por red
  function obtenerUbicacionConReintento() {
    Geolocation.getCurrentPosition(
      (pos) => moverCamaraA(pos.coords.latitude, pos.coords.longitude),
      (errorAltaPrecision) => {
        console.warn(
          "Falló GPS de alta precisión, reintentando con red:",
          errorAltaPrecision,
        );
        Geolocation.getCurrentPosition(
          (pos) => moverCamaraA(pos.coords.latitude, pos.coords.longitude),
          (errorRed) => {
            console.warn("Falló con precisión de red:", errorRed);
            Alert.alert(
              "No se pudo obtener tu ubicación",
              `Código ${errorRed.code}: ${errorRed.message}\n\nIntenta salir a un lugar con más señal y vuelve a intentarlo.`,
            );
          },
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 },
        );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 },
    );
  }

  const handleTrazarRuta = useCallback(
    async (destino) => {
      if (!ubicacionOrigen) {
        Alert.alert(
          "Ubicación no disponible todavía",
          "Espera un momento a que se detecte tu posición antes de trazar una ruta.",
        );
        return;
      }

      setCargandoRuta(true);
      setRuta(null);
      try {
        const resultado = await obtenerRuta(ubicacionOrigen, {
          lat: destino.lat,
          lon: destino.lng,
        });
        setRuta({ ...resultado, destino });

        // Encuadra la cámara en los límites de la ruta
        if (cameraRef.current && resultado.coordenadas.length > 0) {
          const lats = resultado.coordenadas.map((c) => c[0]);
          const lons = resultado.coordenadas.map((c) => c[1]);
          cameraRef.current.fitBounds(
            [Math.max(...lons), Math.max(...lats)],
            [Math.min(...lons), Math.min(...lats)],
            80,
            1000,
          );
        }
      } catch (error) {
        Alert.alert("No se pudo calcular la ruta", error.message);
      } finally {
        setCargandoRuta(false);
      }
    },
    [ubicacionOrigen],
  );

  // Prepara GeoJSON para dibujar la línea de ruta
  const rutaGeoJSON = ruta
    ? {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: ruta.coordenadas.map(([lat, lon]) => [lon, lat]),
        },
      }
    : null;

  return (
    <>
      {navegando && ruta ? (
        <NavegacionRuta
          ruta={ruta}
          onFinalizar={() => {
            setNavegando(false);
            setRuta(null);
          }}
        />
      ) : selectorMapaVisible ? (
        <SeleccionarUbicacionMapa
          centroInicial={ubicacionParaGuardar ?? ubicacionOrigen}
          onConfirmar={handleConfirmarUbicacionElegida}
          onCancelar={handleCancelarSelectorMapa}
        />
      ) : (
        <View style={[mapaNicaraguaStyle.container, { paddingTop: 0 }]}>
          <Map
            ref={mapRef}
            style={{ flex: 1 }}
            mapStyle={MAP_STYLE_URL}
            logo={false}
          >
            <Camera
              ref={cameraRef}
              zoom={7}
              center={[-85.2072, 12.8654]}
              easing="fly"
            />

            {/* Línea de ruta */}
            {rutaGeoJSON && (
              <GeoJSONSource id="rutaSource" data={rutaGeoJSON}>
                <Layer
                  id="rutaLayer"
                  type="line"
                  paint={{
                    "line-color": "#123B63",
                    "line-width": 4,
                    "line-opacity": 0.85,
                  }}
                />
              </GeoJSONSource>
            )}

            {/* Marcador de ubicación actual */}
            {ubicacionOrigen && (
              <ViewAnnotation
                id="origen"
                lngLat={[ubicacionOrigen.lon, ubicacionOrigen.lat]}
              >
                <View style={mapaNicaraguaStyle.marcadorOrigen} />
              </ViewAnnotation>
            )}

            {/* Marcadores de puntos de interés */}
            {puntos.map((punto) => (
              <ViewAnnotation
                key={`${punto.id}-${epocaMarcadores}`}
                id={punto.id}
                lngLat={[punto.lng, punto.lat]}
                onSelect={() => setPuntoSeleccionado(punto)}
              >
                <View style={mapaNicaraguaStyle.marcadorContenedor}>
                  <View style={mapaNicaraguaStyle.marcadorPunto}>
                    <Ionicons
                      name={iconoDeCategoria(punto.categoria)}
                      size={18}
                      color={colorDeCategoria(punto.categoria)}
                    />
                  </View>
                </View>
              </ViewAnnotation>
            ))}

            {/* Capa nativa para los títulos de los puntos */}
            <GeoJSONSource
              id="etiquetasSource"
              data={{
                type: "FeatureCollection",
                features: puntos.map((punto) => ({
                  type: "Feature",
                  id: punto.id,
                  geometry: {
                    type: "Point",
                    coordinates: [punto.lng, punto.lat],
                  },
                  properties: { titulo: punto.titulo },
                })),
              }}
            >
              <Layer
                id="etiquetasLayer"
                type="symbol"
                minzoom={12}
                layout={{
                  "text-field": ["get", "titulo"],
                  "text-font": ["Noto Sans Regular"],
                  "text-size": 11,
                  "text-offset": [0, 1.8],
                  "text-anchor": "top",
                  "text-allow-overlap": false,
                }}
                paint={{
                  "text-color": "#123B63",
                  "text-halo-color": "#FFFFFF",
                  "text-halo-width": 1.2,
                }}
              />
            </GeoJSONSource>
          </Map>

          <FloatingNavButton />
          <Text
            style={[
              mapaNicaraguaStyle.title,
              { position: "absolute", top: topOffset },
            ]}
          >
            Mapa de Nicaragua
          </Text>

          {/* Botón para agregar nueva experiencia */}
          {puedePublicar && (
            <TouchableOpacity
              style={mapaNicaraguaStyle.botonAgregar}
              onPress={abrirFormularioParaCrear}
            >
              <Text style={mapaNicaraguaStyle.botonAgregarTexto}>+</Text>
            </TouchableOpacity>
          )}

          {/* Backdrop para cerrar la tarjeta al tocar fuera */}
          {puntoSeleccionado && (
            <TouchableWithoutFeedback onPress={cerrarTarjeta}>
              <View style={mapaNicaraguaStyle.overlayCierre} />
            </TouchableWithoutFeedback>
          )}

          {/* Tarjeta de detalle del punto seleccionado */}
          {puntoSeleccionado && (
            <View style={mapaNicaraguaStyle.tarjeta}>
              <View style={mapaNicaraguaStyle.tarjetaAsa} />

              <View style={mapaNicaraguaStyle.tarjetaHeader}>
                <View
                  style={[
                    mapaNicaraguaStyle.tarjetaBadge,
                    {
                      backgroundColor: colorDeCategoria(
                        puntoSeleccionado.categoria,
                      ),
                    },
                  ]}
                >
                  <Ionicons
                    name={iconoDeCategoria(puntoSeleccionado.categoria)}
                    size={22}
                    color="#FFFFFF"
                  />
                </View>
                <View style={mapaNicaraguaStyle.tarjetaHeaderTexto}>
                  <Text
                    style={mapaNicaraguaStyle.tarjetaTitulo}
                    numberOfLines={2}
                  >
                    {puntoSeleccionado.titulo}
                  </Text>
                  {!!puntoSeleccionado.ubicacionExacta && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Ionicons
                        name="location-sharp"
                        size={14}
                        color="#123B63"
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={mapaNicaraguaStyle.tarjetaUbicacionExacta}
                        numberOfLines={1}
                      >
                        {puntoSeleccionado.ubicacionExacta}
                      </Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={mapaNicaraguaStyle.botonCerrarX}
                  onPress={cerrarTarjeta}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={mapaNicaraguaStyle.botonCerrarXTexto}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={mapaNicaraguaStyle.tarjetaDescripcion}>
                {puntoSeleccionado.descripcion}
              </Text>

              {/* Imágenes en base64 */}
              {Array.isArray(puntoSeleccionado.imagenes) &&
                puntoSeleccionado.imagenes.length > 0 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={mapaNicaraguaStyle.tarjetaFilaFotos}
                  >
                    {puntoSeleccionado.imagenes.map((uri, index) => (
                      <Image
                        key={index}
                        source={{ uri }}
                        style={mapaNicaraguaStyle.tarjetaFoto}
                      />
                    ))}
                  </ScrollView>
                )}

              {ruta && ruta.destino.id === puntoSeleccionado.id && (
                <View style={mapaNicaraguaStyle.tarjetaEtaPill}>
                  <Text style={mapaNicaraguaStyle.tarjetaEtaPillTexto}>
                    🕒 {ruta.duracionMin} min · {ruta.distanciaKm} km
                  </Text>
                </View>
              )}

              <View style={mapaNicaraguaStyle.tarjetaFilaAcciones}>
                {user?.uid && puntoSeleccionado.creadoPor === user.uid && (
                  <TouchableOpacity
                    style={mapaNicaraguaStyle.botonSecundario}
                    onPress={() => abrirFormularioParaEditar(puntoSeleccionado)}
                  >
                    <Text style={mapaNicaraguaStyle.botonSecundarioTexto}>
                      Editar
                    </Text>
                  </TouchableOpacity>
                )}

                {ruta && ruta.destino.id === puntoSeleccionado.id ? (
                  <TouchableOpacity
                    style={mapaNicaraguaStyle.botonPrimarioFlex}
                    onPress={() => setNavegando(true)}
                  >
                    <Text style={mapaNicaraguaStyle.botonPrimarioTexto}>
                      Iniciar navegación
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={mapaNicaraguaStyle.botonPrimarioFlex}
                    onPress={() => handleTrazarRuta(puntoSeleccionado)}
                    disabled={cargandoRuta}
                  >
                    {cargandoRuta ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={mapaNicaraguaStyle.botonPrimarioTexto}>
                        Trazar ruta hasta aquí
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Formulario persistente (se mantiene montado al usar el selector de mapa) */}
      <FormularioExperiencia
        visible={formularioVisible}
        ubicacionActual={ubicacionParaGuardar ?? ubicacionOrigen}
        onCancelar={() => {
          setFormularioVisible(false);
          setUbicacionParaGuardar(null);
          setExperienciaEnEdicion(null);
        }}
        onGuardar={handleGuardarExperiencia}
        onElegirEnMapa={abrirSelectorDeMapa}
        modoEdicion={!!experienciaEnEdicion}
        valoresIniciales={experienciaEnEdicion}
        sesionId={formularioSesionId}
      />
    </>
  );
}
