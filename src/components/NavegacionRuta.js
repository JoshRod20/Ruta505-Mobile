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
import { describirManiobra, obtenerRuta } from "../services/osrmservice.js";
import {
  iconoDeCategoria,
  colorDeCategoria,
} from "../services/Categoriasexperiencias.js";
import { navegacionStyle } from "../styles/mapanicaragua/Navegacionstyle.js";

const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

const UMBRAL_REROUTE_METROS = 40;
const COOLDOWN_REROUTE_MS = 10000;
const UMBRAL_LLEGADA_METROS = 30;
const VELOCIDAD_MINIMA_PARA_HEADING = 1.2; // m/s
const SEGUNDOS_MINIMOS_PARA_ETA_REAL = 15;
const METROS_MINIMOS_PARA_ETA_REAL = 30;

// Componente de navegación GPS Turn-by-Turn basado en OSRM y MapLibre.
export default function NavegacionRuta({ ruta: rutaInicial, onFinalizar }) {
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
  const posicionAnteriorRef = useRef(null);
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

  // Reinicia el progreso al cambiar o recalcular la ruta
  useEffect(() => {
    progresoMaximoRef.current = 0;
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
    if (llegado || !pos?.coords) return;

    const { latitude, longitude, speed, heading } = pos.coords;

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
    const ahora = Date.now();
    const puedeRecalcular =
      ahora - ultimoRerouteRef.current > COOLDOWN_REROUTE_MS;

    if (
      proyeccion.distancia > UMBRAL_REROUTE_METROS &&
      puedeRecalcular &&
      !recalculando
    ) {
      ultimoRerouteRef.current = ahora;
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

    // 6. Orientación y seguimiento de cámara (Bearing)
    let bearingParaCamara = bearingActualRef.current;
    if (
      typeof heading === "number" &&
      heading >= 0 &&
      (speed ?? 0) > VELOCIDAD_MINIMA_PARA_HEADING
    ) {
      bearingParaCamara = heading;
    } else if (posicionAnteriorRef.current) {
      const dist = distanciaAproximadaMetros(
        posicionAnteriorRef.current.lat,
        posicionAnteriorRef.current.lon,
        latitude,
        longitude,
      );
      if (dist > 3) {
        bearingParaCamara = calcularBearing(
          posicionAnteriorRef.current.lat,
          posicionAnteriorRef.current.lon,
          latitude,
          longitude,
        );
      }
    }
    bearingActualRef.current = bearingParaCamara;
    posicionAnteriorRef.current = { lat: latitude, lon: longitude };

    if (cameraRef.current) {
      cameraRef.current.setStop({
        center: [proyeccion.lon, proyeccion.lat],
        zoom: 17,
        bearing: bearingParaCamara,
        duration: 500,
      });
    }
  }

  if (llegado) {
    return (
      <View style={navegacionStyle.llegadaContainer}>
        <Text style={navegacionStyle.llegadaIcono}>🎉</Text>
        <Text style={navegacionStyle.llegadaTitulo}>
          ¡Has llegado a tu destino!
        </Text>
        <TouchableOpacity
          style={navegacionStyle.botonSalir}
          onPress={onFinalizar}
        >
          <Text style={navegacionStyle.botonSalirTexto}>Finalizar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={navegacionStyle.container}>
      <Map style={{ flex: 1 }} mapStyle={MAP_STYLE_URL} logoEnabled={false}>
        <Camera ref={cameraRef} zoom={16} />
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
          <Layer
            id="rutaNavLayer"
            type="line"
            style={{ lineColor: "#1D7A46", lineWidth: 5 }}
          />
        </GeoJSONSource>

        {ruta.destino && (
          <ViewAnnotation
            id="destino-nav"
            coordinate={[ruta.destino.lng, ruta.destino.lat]}
          >
            <View style={navegacionStyle.marcadorDestino}>
              <Ionicons
                name={iconoDeCategoria(ruta.destino.categoria)}
                size={20}
                color={colorDeCategoria(ruta.destino.categoria)}
              />
            </View>
          </ViewAnnotation>
        )}
      </Map>

      <View style={navegacionStyle.panelInstruccion}>
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

      <View style={navegacionStyle.panelInferior}>
        <View>
          <Text style={navegacionStyle.etaTiempo}>{tiempoRestanteMin} min</Text>
          <Text style={navegacionStyle.etaDistancia}>
            {ruta.distanciaKm} km · llegada estimada
          </Text>
        </View>
        <TouchableOpacity
          style={navegacionStyle.botonSalir}
          onPress={onFinalizar}
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
