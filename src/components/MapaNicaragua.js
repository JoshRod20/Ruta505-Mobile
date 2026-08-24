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

import FloatingNavButton from "./common/FloatingNavButton.js";
import { mapaNicaraguaStyle } from "../styles/mapanicaragua/mapaNicaraguaStyle.js";
import { obtenerRuta } from "../services/osrmservice.js";
import {
  crearExperiencia,
  escucharExperiencias,
  actualizarExperiencia,
} from "../services/Experienciasservice.js";
import { iconoDeCategoria } from "../services/Categoriasexperiencias.js";
import NavegacionRuta from "../components/NavegacionRuta.js";
import FormularioExperiencia from "../components/Formularioexperiencia.js";
import SeleccionarUbicacionMapa from "../components/Seleccionarubicacionmapa.js";
import { useAuth } from "../context/AuthContext";
import { usePermisos } from "../hooks/usePermisos";
import { PERMISOS } from "../constants/permissions";

const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

// Configuración requerida por @react-native-community/geolocation en
// Android
if (Platform.OS === "android") {
  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: "whenInUse",
    enableBackgroundLocationUpdates: false,
    locationProvider: "auto", // usa Play Services si está disponible, si no cae al proveedor nativo de Android
  });
}

/**
 * Pide permiso de ubicación en Android (en iOS no hace falta este paso
 */
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

  const puedePublicar = puede(PERMISOS.PUBLICAR_EXPERIENCIA) && !sancionVigente;

  const [puntos, setPuntos] = useState([]);
  const [formularioVisible, setFormularioVisible] = useState(false);

  const [ubicacionParaGuardar, setUbicacionParaGuardar] = useState(null);
  const [selectorMapaVisible, setSelectorMapaVisible] = useState(false);

  const [experienciaEnEdicion, setExperienciaEnEdicion] = useState(null);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);

  const [epocaMarcadores, setEpocaMarcadores] = useState(0);

  const cerrarTarjeta = useCallback(() => {
    setPuntoSeleccionado(null);
    setEpocaMarcadores((e) => e + 1);
  }, []);
  const [ruta, setRuta] = useState(null);
  const [cargandoRuta, setCargandoRuta] = useState(false);
  const [navegando, setNavegando] = useState(false);
  const [ubicacionOrigen, setUbicacionOrigen] = useState(null);
  const [permisoConcedido, setPermisoConcedido] = useState(false);

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

  useEffect(() => {
    const cancelarSuscripcion = escucharExperiencias(
      (experiencias) => {
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
            `${descartados} experiencia(s) sin lat/lng válidos — no se dibujan en el mapa.`,
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
      setUbicacionParaGuardar(null); // vuelve a defaultear al GPS la próxima vez
      setExperienciaEnEdicion(null);
      cerrarTarjeta(); // limpia selección Y fuerza remount del marcador (evita el bug de "no puedo volver a tocarlo")
    } catch (error) {
      Alert.alert("No se pudo guardar", error.message);
    }
  }

  function abrirFormularioParaCrear() {
    setExperienciaEnEdicion(null);
    setFormularioVisible(true);
  }

  function abrirFormularioParaEditar(punto) {
    setExperienciaEnEdicion(punto);

    setUbicacionParaGuardar({ lat: punto.lat, lon: punto.lng });
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
    setFormularioVisible(true); // vuelve al formulario sin cambiar la ubicación
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
            console.warn("También falló con precisión de red:", errorRed);
            Alert.alert(
              "No se pudo obtener tu ubicación",
              `Código ${errorRed.code}: ${errorRed.message}\n\nIntenta salir a un lugar con más señal o cerca de una ventana, y vuelve a intentarlo.`,
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
          "Espera un momento a que se detecte tu posición (o revisa el permiso de ubicación) antes de trazar una ruta.",
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

        // Ajusta la cámara para mostrar toda la ruta.
        if (cameraRef.current && resultado.coordenadas.length > 0) {
          const lats = resultado.coordenadas.map((c) => c[0]);
          const lons = resultado.coordenadas.map((c) => c[1]);
          cameraRef.current.fitBounds(
            [Math.max(...lons), Math.max(...lats)],
            [Math.min(...lons), Math.min(...lats)],
            80, // padding
            1000, // duración animación ms
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

  // Convierte la ruta a formato GeoJSON para dibujarla como línea en el mapa.
  const rutaGeoJSON = ruta
    ? {
        type: "Feature",
        geometry: {
          type: "LineString",
          // MapLibre espera [lon, lat]
          coordinates: ruta.coordenadas.map(([lat, lon]) => [lon, lat]),
        },
      }
    : null;

  if (navegando && ruta) {
    return (
      <NavegacionRuta
        ruta={ruta}
        onFinalizar={() => {
          setNavegando(false);
          setRuta(null);
        }}
      />
    );
  }

  if (selectorMapaVisible) {
    return (
      <SeleccionarUbicacionMapa
        centroInicial={ubicacionParaGuardar ?? ubicacionOrigen}
        onConfirmar={handleConfirmarUbicacionElegida}
        onCancelar={handleCancelarSelectorMapa}
      />
    );
  }

  return (
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
          center={[-85.2072, 12.8654]} // centro aprox. de Nicaragua
          easing="fly"
        />

        {/* Línea de la ruta calculada */}
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

        {ubicacionOrigen && (
          <ViewAnnotation
            id="origen"
            lngLat={[ubicacionOrigen.lon, ubicacionOrigen.lat]}
          >
            <View style={mapaNicaraguaStyle.marcadorOrigen} />
          </ViewAnnotation>
        )}

        {puntos.map((punto) => (
          <ViewAnnotation
            key={`${punto.id}-${epocaMarcadores}`}
            id={punto.id}
            lngLat={[punto.lng, punto.lat]}
            onSelect={() => setPuntoSeleccionado(punto)}
          >
            <View style={mapaNicaraguaStyle.marcadorContenedor}>
              <View style={mapaNicaraguaStyle.marcadorPunto}>
                <Text style={mapaNicaraguaStyle.marcadorIcono}>
                  {iconoDeCategoria(punto.categoria)}
                </Text>
              </View>
            </View>
          </ViewAnnotation>
        ))}

        <GeoJSONSource
          id="etiquetasSource"
          data={{
            type: "FeatureCollection",
            features: puntos.map((punto) => ({
              type: "Feature",
              id: punto.id,
              geometry: { type: "Point", coordinates: [punto.lng, punto.lat] },
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

      {puedePublicar && (
        <TouchableOpacity
          style={mapaNicaraguaStyle.botonAgregar}
          onPress={abrirFormularioParaCrear}
        >
          <Text style={mapaNicaraguaStyle.botonAgregarTexto}>+</Text>
        </TouchableOpacity>
      )}

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
      />

      {puntoSeleccionado && (
        <TouchableWithoutFeedback onPress={cerrarTarjeta}>
          <View style={mapaNicaraguaStyle.overlayCierre} />
        </TouchableWithoutFeedback>
      )}
      {puntoSeleccionado && (
        <View style={mapaNicaraguaStyle.tarjeta}>
          <Text style={mapaNicaraguaStyle.tarjetaTitulo}>
            {iconoDeCategoria(puntoSeleccionado.categoria)}{" "}
            {puntoSeleccionado.titulo}
          </Text>
          <Text style={mapaNicaraguaStyle.tarjetaDescripcion}>
            {puntoSeleccionado.descripcion}
          </Text>
          {!!puntoSeleccionado.ubicacionExacta && (
            <Text style={mapaNicaraguaStyle.tarjetaUbicacionExacta}>
              📍 {puntoSeleccionado.ubicacionExacta}
            </Text>
          )}

          {/* Fotos guardadas en base64 — se muestran directo desde el
              string "data:image/jpeg;base64,...." sin descargar nada. */}
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

          {/* Solo el dueño de la experiencia puede editarla — coincide
              con lo que permiten (o no) tus reglas de Firestore. */}
          {user?.uid && puntoSeleccionado.creadoPor === user.uid && (
            <TouchableOpacity
              style={mapaNicaraguaStyle.botonEditar}
              onPress={() => abrirFormularioParaEditar(puntoSeleccionado)}
            >
              <Text style={mapaNicaraguaStyle.botonEditarTexto}>
                ✏️ Editar esta experiencia
              </Text>
            </TouchableOpacity>
          )}

          {ruta && ruta.destino.id === puntoSeleccionado.id ? (
            <>
              <Text style={mapaNicaraguaStyle.tarjetaEta}>
                🕒 {ruta.duracionMin} min · {ruta.distanciaKm} km
              </Text>
              <TouchableOpacity
                style={mapaNicaraguaStyle.botonPrimario}
                onPress={() => setNavegando(true)}
              >
                <Text style={mapaNicaraguaStyle.botonPrimarioTexto}>
                  Iniciar navegación
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={mapaNicaraguaStyle.botonPrimario}
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

          <TouchableOpacity onPress={cerrarTarjeta}>
            <Text style={mapaNicaraguaStyle.tarjetaCerrar}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
