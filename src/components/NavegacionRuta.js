/**
 * NavegacionRuta: componente/pantalla de la aplicación Ruta505.
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from "react-native";
import Geolocation from "@react-native-community/geolocation";
// Si usas Expo: import * as Location from "expo-location";

import {
  Map,
  Camera,
  GeoJSONSource,
  Layer,
  ViewAnnotation,
} from "@maplibre/maplibre-react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useTabBarHeight from "../hooks/useTabBarHeight";
import { describirManiobra, obtenerRuta } from "../services/osrmservice.js";
import {
  iconoDeCategoria,
  colorDeCategoria,
} from "../services/Categoriasexperiencias.js";
import { navegacionStyle } from "../styles/mapanicaragua/Navegacionstyle.js";
import { mapaNicaraguaStyle } from "../styles/mapanicaragua/mapaNicaraguaStyle.js";
import IconoCategoria from "./common/IconoCategoria";

const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

const UMBRAL_REROUTE_METROS = 40;
const COOLDOWN_REROUTE_MS = 10000;
// Anti-ruido del GPS: sin esto, un GPS que "baila" estando quieto dispara
// recálculos y mueve la cámara sin parar.
const PRECISION_MAXIMA_METROS = 50; // lecturas peores que esto se ignoran
const LECTURAS_FUERA_PARA_REROUTE = 3; // lecturas seguidas fuera de ruta antes de recalcular
const MARGEN_FUERA_MAXIMO_METROS = 150; // tope del margen si empiezas lejos de la vía
const MOVIMIENTO_MINIMO_CAMARA_METROS = 4; // si no te has movido tanto, la cámara no se mueve
const MOVIMIENTO_MINIMO_BEARING_METROS = 8; // para girar el mapa por movimiento real, no por ruido
const UMBRAL_LLEGADA_METROS = 30;
const VELOCIDAD_MINIMA_PARA_HEADING = 1.2; // m/s
const SEGUNDOS_MINIMOS_PARA_ETA_REAL = 15;
const METROS_MINIMOS_PARA_ETA_REAL = 30;

// Componente de navegación GPS Turn-by-Turn basado en OSRM y MapLibre.
/**
 * NavegacionRuta.
 */
export default function NavegacionRuta({
  ruta: rutaInicial,
  onFinalizar, // al llegar al destino
  onSalir, // al tocar "Salir" a mitad del camino (por defecto igual a onFinalizar)
  tituloLlegada,
  textoBotonLlegada,
  paradas, // paradas de la ruta creativa (null en una navegación normal)
  tramoActual, // índice de la parada a la que vamos ahora
  rutaCompleta, // línea de toda la ruta creativa: [[lat, lon], ...] (opcional)
}) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useTabBarHeight();
  const [ruta, setRuta] = useState(rutaInicial);
  const [pasoActualIndex, setPasoActualIndex] = useState(0);
  const [tiempoRestanteMin, setTiempoRestanteMin] = useState(
    rutaInicial.duracionMin,
  );
  const [recalculando, setRecalculando] = useState(false);
  const [llegado, setLlegado] = useState(false);

  const cameraRef = useRef(null);
  const watchId = useRef(null);
  const ultimoRerouteRef = useRef(0);
  const velocidadInstantaneaRef = useRef(null);
  const bearingActualRef = useRef(0);
  const ultimaCamaraRef = useRef(null); // { lat, lon } donde se movió la cámara por última vez
  const recalculandoRef = useRef(false);
  const fueraDeRutaConteoRef = useRef(0);
  const margenFueraRef = useRef(0); // distancia inicial a la vía (p. ej. estás dentro de un campus)
  const calibrarMargenRef = useRef(true);
  // El watchPosition se registra una sola vez, así que su callback vería siempre
  // la ruta de la primera pantalla. Este ref le da siempre los valores actuales.
  const estadoRef = useRef({});
  const tripStartRef = useRef(Date.now());
  const progresoMaximoRef = useRef(0); // Avance monótono en metros (evita retrocesos por ruido GPS)
  const etaSuavizadoRef = useRef(null);

  // Calcula la distancia acumulada de coordenadas y pasos para medir el avance real
  const {
    distanciasAcumuladasCoord,
    distanciasAcumuladasPasos,
    distanciaTotalRutaM,
  } = useMemo(() => {
    const coords = ruta?.coordenadas || [];
    const acumCoord = [0];
    for (let i = 1; i < coords.length; i++) {
      const [latA, lonA] = coords[i - 1];
      const [latB, lonB] = coords[i];
      acumCoord.push(
        acumCoord[i - 1] + distanciaAproximadaMetros(latA, lonA, latB, lonB),
      );
    }

    const acumPasos = [0];
    (ruta?.pasos || []).forEach((paso) => {
      acumPasos.push(acumPasos[acumPasos.length - 1] + paso.distanciaM);
    });

    return {
      distanciasAcumuladasCoord: acumCoord,
      distanciasAcumuladasPasos: acumPasos,
      distanciaTotalRutaM: acumCoord[acumCoord.length - 1] || 0,
    };
  }, [ruta]);

  estadoRef.current = {
    ruta,
    llegado,
    distanciasAcumuladasCoord,
    distanciasAcumuladasPasos,
    distanciaTotalRutaM,
  };

  // Reinicia el progreso al cambiar o recalcular la ruta
  useEffect(() => {
    progresoMaximoRef.current = 0;
    fueraDeRutaConteoRef.current = 0;
    calibrarMargenRef.current = true;
    setPasoActualIndex(0);
  }, [ruta]);

  const pasoActual = ruta.pasos[pasoActualIndex];
  // Muestra la siguiente instrucción para anticipar maniobras
  const pasoAMostrar = ruta.pasos[pasoActualIndex + 1] ?? pasoActual;
  const pasoSiguienteAMostrar = ruta.pasos[pasoActualIndex + 2];

  useEffect(() => {
    (async () => {
      if (Platform.OS === "android") {
        const resultado = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Permiso de ubicación",
            message:
              "Necesitamos tu ubicación para guiarte durante la navegación.",
            buttonPositive: "Permitir",
            buttonNegative: "Ahora no",
          },
        );
        if (resultado !== PermissionsAndroid.RESULTS.GRANTED) return;
      }

      watchId.current = Geolocation.watchPosition(
        (pos) => manejarNuevaPosicion(pos),
        (error) => console.warn("Error de geolocalización:", error),
        {
          enableHighAccuracy: true,
          distanceFilter: 5,
          interval: 2000,
          fastestInterval: 1000,
        },
      );
    })();

    return () => {
      if (watchId.current != null) Geolocation.clearWatch(watchId.current);
    };
  }, []);

  async function manejarNuevaPosicion(pos) {
    const {
      ruta,
      llegado,
      distanciasAcumuladasCoord,
      distanciasAcumuladasPasos,
      distanciaTotalRutaM,
    } = estadoRef.current;
    if (llegado || recalculandoRef.current || !pos?.coords) return;

    const { latitude, longitude, speed, heading, accuracy } = pos.coords;

    // Una lectura imprecisa no sirve para decidir nada: se ignora.
    if (typeof accuracy === "number" && accuracy > PRECISION_MAXIMA_METROS) {
      return;
    }

    // 1. Detección de llegada al destino
    const distanciaAlDestino = distanciaAproximadaMetros(
      latitude,
      longitude,
      ruta.destino.lat,
      ruta.destino.lng,
    );
    if (distanciaAlDestino < UMBRAL_LLEGADA_METROS) {
      setLlegado(true);
      if (watchId.current != null) Geolocation.clearWatch(watchId.current);
      return;
    }

    // 2. Proyección sobre la línea de ruta
    const proyeccion = encontrarPuntoMasCercanoEnRuta(
      latitude,
      longitude,
      ruta.coordenadas,
    );
    if (!proyeccion) return;

    // 3. Recalculo por desvío de ruta
    // La ruta de OSRM empieza en la vía más cercana, no donde estás. Si arrancas
    // a 80 m de la calle (campus, estacionamiento), esos 80 m no son un desvío:
    // se miden la primera vez y se suman al umbral.
    if (calibrarMargenRef.current) {
      margenFueraRef.current = Math.min(
        proyeccion.distancia,
        MARGEN_FUERA_MAXIMO_METROS,
      );
      calibrarMargenRef.current = false;
    }
    const umbralDesvio = UMBRAL_REROUTE_METROS + margenFueraRef.current;

    // Solo cuenta como desvío si se repite en varias lecturas seguidas.
    fueraDeRutaConteoRef.current =
      proyeccion.distancia > umbralDesvio
        ? fueraDeRutaConteoRef.current + 1
        : 0;

    const ahora = Date.now();
    const puedeRecalcular =
      ahora - ultimoRerouteRef.current > COOLDOWN_REROUTE_MS;

    if (
      fueraDeRutaConteoRef.current >= LECTURAS_FUERA_PARA_REROUTE &&
      puedeRecalcular
    ) {
      ultimoRerouteRef.current = ahora;
      fueraDeRutaConteoRef.current = 0;
      recalculandoRef.current = true;
      setRecalculando(true);
      try {
        const nuevaRuta = await obtenerRuta(
          { lat: latitude, lon: longitude },
          { lat: ruta.destino.lat, lon: ruta.destino.lng },
        );
        setRuta({ ...nuevaRuta, destino: ruta.destino });
        tripStartRef.current = Date.now();
        etaSuavizadoRef.current = null;
      } catch (error) {
        console.warn("Error al recalcular ruta:", error);
      } finally {
        recalculandoRef.current = false;
        setRecalculando(false);
      }
      return;
    }

    // 4. Actualización de progreso y paso actual
    const progresoCrudo =
      distanciasAcumuladasCoord[proyeccion.indiceSegmento] +
      proyeccion.distanciaEnSegmento;
    const progresoActual = Math.max(progresoMaximoRef.current, progresoCrudo);
    progresoMaximoRef.current = progresoActual;

    let nuevoIndice = 0;
    for (let i = 0; i < distanciasAcumuladasPasos.length - 1; i++) {
      if (progresoActual >= distanciasAcumuladasPasos[i]) nuevoIndice = i;
    }
    setPasoActualIndex(nuevoIndice);

    // 5. Cálculo de ETA (Basado en velocidad promedio del viaje o estimación de OSRM)
    const distanciaRestanteM = Math.max(
      0,
      distanciaTotalRutaM - progresoActual,
    );

    if (typeof speed === "number" && speed > 0.3) {
      velocidadInstantaneaRef.current =
        velocidadInstantaneaRef.current == null
          ? speed
          : velocidadInstantaneaRef.current * 0.7 + speed * 0.3;
    }

    const tiempoTranscurridoSeg = (ahora - tripStartRef.current) / 1000;
    const hayDatosConfiables =
      tiempoTranscurridoSeg > SEGUNDOS_MINIMOS_PARA_ETA_REAL &&
      progresoActual > METROS_MINIMOS_PARA_ETA_REAL;

    let etaMinutosCrudo;
    if (hayDatosConfiables) {
      const velocidadPromedio = Math.max(
        progresoActual / tiempoTranscurridoSeg,
        1.5,
      );
      etaMinutosCrudo = distanciaRestanteM / velocidadPromedio / 60;
    } else {
      const segundosRestantes = ruta.pasos
        .slice(nuevoIndice)
        .reduce((acc, p) => acc + p.duracionSeg, 0);
      etaMinutosCrudo = segundosRestantes / 60;
    }

    etaSuavizadoRef.current =
      etaSuavizadoRef.current == null
        ? etaMinutosCrudo
        : etaSuavizadoRef.current * 0.75 + etaMinutosCrudo * 0.25;
    setTiempoRestanteMin(Math.max(1, Math.round(etaSuavizadoRef.current)));

    // 6. Seguimiento de cámara: solo si de verdad te has movido. Estando quieto
    // el GPS varía unos metros; sin este filtro la cámara se mueve y gira sola.
    const ultima = ultimaCamaraRef.current;
    const metrosDesdeUltimaCamara = ultima
      ? distanciaAproximadaMetros(ultima.lat, ultima.lon, latitude, longitude)
      : Infinity;
    if (metrosDesdeUltimaCamara < MOVIMIENTO_MINIMO_CAMARA_METROS) return;

    let bearingParaCamara = bearingActualRef.current;
    if (
      typeof heading === "number" &&
      heading >= 0 &&
      (speed ?? 0) > VELOCIDAD_MINIMA_PARA_HEADING
    ) {
      bearingParaCamara = heading;
    } else if (ultima && metrosDesdeUltimaCamara > MOVIMIENTO_MINIMO_BEARING_METROS) {
      bearingParaCamara = calcularBearing(
        ultima.lat,
        ultima.lon,
        latitude,
        longitude,
      );
    }
    bearingActualRef.current = bearingParaCamara;
    ultimaCamaraRef.current = { lat: latitude, lon: longitude };

    if (cameraRef.current) {
      // Sobre la ruta, la cámara va pegada a la línea; si estás lejos de ella,
      // sigue tu posición real.
      const centro =
        proyeccion.distancia < 25
          ? [proyeccion.lon, proyeccion.lat]
          : [longitude, latitude];
      cameraRef.current.setStop({
        center: centro,
        zoom: 17,
        bearing: bearingParaCamara,
        duration: 500,
      });
    }
  }

  if (llegado) {
    return (
      <View
        style={[
          navegacionStyle.llegadaContainer,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
        ]}
      >
        <Text style={navegacionStyle.llegadaIcono}>🎉</Text>
        <Text style={navegacionStyle.llegadaTitulo}>
          {tituloLlegada ?? "¡Has llegado a tu destino!"}
        </Text>
        <TouchableOpacity
          style={navegacionStyle.botonSalir}
          onPress={onFinalizar}
        >
          <Text style={navegacionStyle.botonSalirTexto}>
            {textoBotonLlegada ?? "Finalizar"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={navegacionStyle.container}>
      <Map style={{ flex: 1 }} mapStyle={MAP_STYLE_URL} logo={false}>
        <Camera ref={cameraRef} zoom={16} />

        {/* Ruta creativa: recorrido completo entre todas las paradas, en naranja
            claro. Queda debajo de la línea naranja fuerte del tramo actual. */}
        {rutaCompleta && rutaCompleta.length > 1 && (
          <GeoJSONSource
            id="rutaCompletaNavSource"
            data={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: rutaCompleta.map(([lat, lon]) => [lon, lat]),
              },
            }}
          >
            <Layer
              id="rutaCompletaNavLayer"
              type="line"
              layout={{ "line-cap": "round", "line-join": "round" }}
              paint={{
                "line-color": "#F7B96B",
                "line-width": 5,
                "line-opacity": 0.8,
              }}
            />
          </GeoJSONSource>
        )}

        <GeoJSONSource
          id="rutaNavSource"
          data={{
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: ruta.coordenadas.map(([lat, lon]) => [lon, lat]),
            },
          }}
        >
          {/* Tramo por el que navegas ahora: naranja en una ruta creativa (como en
              el diseño) y verde en una navegación normal. Con borde blanco para
              que se vea sobre cualquier fondo. */}
          <Layer
            id="rutaNavBordeLayer"
            type="line"
            layout={{ "line-cap": "round", "line-join": "round" }}
            paint={{ "line-color": "#FFFFFF", "line-width": 9 }}
          />
          <Layer
            id="rutaNavLayer"
            type="line"
            layout={{ "line-cap": "round", "line-join": "round" }}
            paint={{
              "line-color": paradas ? "#F29100" : "#1D7A46",
              "line-width": 5,
            }}
          />
        </GeoJSONSource>

        {/* Ruta creativa: todas las paradas numeradas. Verde = a donde vas ahora,
            gris = ya visitadas, naranja = las que siguen. */}
        {paradas &&
          paradas.map((parada, indice) => {
            const esActual = indice === tramoActual;
            const visitada = tramoActual != null && indice < tramoActual;
            return (
              <ViewAnnotation
                key={`parada-nav-${parada.id}-${tramoActual}`}
                id={`parada-nav-${parada.id}`}
                lngLat={[parada.lng, parada.lat]}
              >
                <View style={mapaNicaraguaStyle.paradaRutaContenedor}>
                  <View
                    style={[
                      mapaNicaraguaStyle.paradaRutaEtiqueta,
                      { height: 20, justifyContent: "center" },
                      visitada && { backgroundColor: "#D5D9DD" },
                    ]}
                  >
                    <Text
                      style={mapaNicaraguaStyle.paradaRutaTexto}
                      numberOfLines={1}
                    >
                      {parada.titulo}
                    </Text>
                  </View>
                  <View
                    style={[
                      mapaNicaraguaStyle.paradaRutaNumero,
                      esActual && {
                        backgroundColor: "#1D7A46",
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                      },
                      !esActual && !visitada && { backgroundColor: "#F29100" },
                      visitada && { backgroundColor: "#8A949E" },
                    ]}
                  >
                    {visitada ? (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    ) : (
                      <Text style={mapaNicaraguaStyle.paradaRutaNumeroTexto}>
                        {indice + 1}
                      </Text>
                    )}
                  </View>
                  {/* Espaciador (alto de la etiqueta + margen): así el centro del
                      círculo queda exactamente sobre la coordenada de la parada. */}
                  <View style={{ height: 23 }} />
                </View>
              </ViewAnnotation>
            );
          })}

        {/* Navegación normal: marcador del destino */}
        {!paradas && ruta.destino && (
          <ViewAnnotation
            id="destino-nav"
            lngLat={[ruta.destino.lng, ruta.destino.lat]}
          >
            <View style={navegacionStyle.marcadorDestino}>
              <IconoCategoria
                categoria={ruta.destino.categoria}
                size={20}
                color={colorDeCategoria(ruta.destino.categoria)}
              />
            </View>
          </ViewAnnotation>
        )}
      </Map>

      <View
        style={[navegacionStyle.panelInstruccion, { top: insets.top + 32 }]}
      >
        {recalculando ? (
          <Text style={navegacionStyle.instruccionTexto}>
            Recalculando ruta…
          </Text>
        ) : (
          <>
            <Text style={navegacionStyle.instruccionTexto}>
              {describirManiobra(
                pasoAMostrar?.tipoManiobra,
                pasoAMostrar?.modificador,
              )}
            </Text>
            {pasoAMostrar?.calle !== "Sin nombre" && pasoAMostrar?.calle && (
              <Text style={navegacionStyle.instruccionCalle}>
                {pasoAMostrar.calle}
              </Text>
            )}
            {pasoSiguienteAMostrar && (
              <Text style={navegacionStyle.siguienteTexto}>
                Luego:{" "}
                {describirManiobra(
                  pasoSiguienteAMostrar.tipoManiobra,
                  pasoSiguienteAMostrar.modificador,
                )}
              </Text>
            )}
          </>
        )}
      </View>

      <View
        style={[navegacionStyle.panelInferior, { bottom: tabBarHeight + 22 }]}
      >
        <View>
          <Text style={navegacionStyle.etaTiempo}>{tiempoRestanteMin} min</Text>
          <Text style={navegacionStyle.etaDistancia}>
            {ruta.distanciaKm} km · llegada estimada
          </Text>
          {paradas && tramoActual != null && (
            <Text style={navegacionStyle.etaDistancia} numberOfLines={1}>
              Parada {tramoActual + 1} de {paradas.length}
              {paradas[tramoActual + 1]
                ? ` · Luego: ${paradas[tramoActual + 1].titulo}`
                : " · Última parada"}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={navegacionStyle.botonSalir}
          onPress={onSalir ?? onFinalizar}
        >
          <Text style={navegacionStyle.botonSalirTexto}>Salir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Auxiliar: Distancia plana aproximada entre dos puntos geográficos (metros)
function distanciaAproximadaMetros(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const rad = Math.PI / 180;
  const x = (lon2 - lon1) * rad * Math.cos(((lat1 + lat2) / 2) * rad);
  const y = (lat2 - lat1) * rad;
  return Math.sqrt(x * x + y * y) * R;
}

// Auxiliar: Proyecta la posición GPS sobre un segmento de recta
function proyectarPuntoEnSegmento(lat, lon, aLat, aLon, bLat, bLon) {
  const rad = Math.PI / 180;
  const R = 6371000;
  const latRef = (aLat + bLat) / 2;
  const cosLat = Math.cos(latRef * rad);

  const toXY = (la, lo) => ({ x: lo * rad * cosLat * R, y: la * rad * R });
  const A = toXY(aLat, aLon);
  const B = toXY(bLat, bLon);
  const P = toXY(lat, lon);

  const ABx = B.x - A.x;
  const ABy = B.y - A.y;
  const lenSq = ABx * ABx + ABy * ABy;
  const largoSegmento = Math.sqrt(lenSq);

  let t = lenSq === 0 ? 0 : ((P.x - A.x) * ABx + (P.y - A.y) * ABy) / lenSq;
  t = Math.max(0, Math.min(1, t));

  const projX = A.x + ABx * t;
  const projY = A.y + ABy * t;

  return {
    lat: projY / (rad * R),
    lon: projX / (rad * cosLat * R),
    distancia: Math.sqrt((P.x - projX) ** 2 + (P.y - projY) ** 2),
    distanciaEnSegmento: largoSegmento * t,
  };
}

// Auxiliar: Busca el segmento de la ruta más cercano a la coordenada del usuario
function encontrarPuntoMasCercanoEnRuta(lat, lon, coordenadas) {
  if (!coordenadas || coordenadas.length < 2) return null;
  let mejor = null;
  for (let i = 0; i < coordenadas.length - 1; i++) {
    const [aLat, aLon] = coordenadas[i];
    const [bLat, bLon] = coordenadas[i + 1];
    const resultado = proyectarPuntoEnSegmento(
      lat,
      lon,
      aLat,
      aLon,
      bLat,
      bLon,
    );
    if (!mejor || resultado.distancia < mejor.distancia) {
      mejor = { ...resultado, indiceSegmento: i };
    }
  }
  return mejor;
}

// Auxiliar: Calcula el ángulo de dirección (bearing) entre dos coordenadas
function calcularBearing(lat1, lon1, lat2, lon2) {
  const rad = Math.PI / 180;
  const y = Math.sin((lon2 - lon1) * rad) * Math.cos(lat2 * rad);
  const x =
    Math.cos(lat1 * rad) * Math.sin(lat2 * rad) -
    Math.sin(lat1 * rad) * Math.cos(lat2 * rad) * Math.cos((lon2 - lon1) * rad);
  return (Math.atan2(y, x) / rad + 360) % 360;
}
