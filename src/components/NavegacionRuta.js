import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from "react-native";
import Geolocation from "@react-native-community/geolocation";
// Si usas Expo, cambia el import de arriba por:
// import * as Location from "expo-location";

import {
  Map,
  Camera,
  GeoJSONSource,
  Layer,
  ViewAnnotation,
} from "@maplibre/maplibre-react-native";
import { describirManiobra } from "../services/osrmservice.js";
import { iconoDeCategoria } from "../services/Categoriasexperiencias.js";
import { navegacionStyle } from "../styles/mapanicaragua/Navegacionstyle.js";

const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

export default function NavegacionRuta({ ruta, onFinalizar }) {
  const [pasoActualIndex, setPasoActualIndex] = useState(0);
  const [tiempoRestanteMin, setTiempoRestanteMin] = useState(ruta.duracionMin);
  const cameraRef = useRef(null);
  const watchId = useRef(null);

  const pasoActual = ruta.pasos[pasoActualIndex];
  const siguientePaso = ruta.pasos[pasoActualIndex + 1];

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
        if (resultado !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn(
            "Permiso de ubicación no concedido, la navegación no podrá seguir el GPS.",
          );
          return;
        }
      }

      watchId.current = Geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          actualizarPasoMasCercano(latitude, longitude);

          if (cameraRef.current) {
            cameraRef.current.setStop({
              center: [longitude, latitude],
              zoom: 17,
              duration: 500,
            });
          }
        },
        (error) => console.warn("Error de geolocalización:", error),
        { enableHighAccuracy: true, distanceFilter: 5 },
      );
    })();

    return () => {
      if (watchId.current != null) {
        Geolocation.clearWatch(watchId.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function actualizarPasoMasCercano(lat, lon) {
    let indexMasCercano = pasoActualIndex;
    let distanciaMin = Infinity;

    ruta.pasos.forEach((paso, index) => {
      const d = distanciaAproximadaMetros(
        lat,
        lon,
        paso.ubicacion.lat,
        paso.ubicacion.lon,
      );
      if (d < distanciaMin) {
        distanciaMin = d;
        indexMasCercano = index;
      }
    });

    setPasoActualIndex(indexMasCercano);

    // Recalcula tiempo restante sumando la duración de los pasos que faltan.
    const segundosRestantes = ruta.pasos
      .slice(indexMasCercano)
      .reduce((acc, p) => acc + p.duracionSeg, 0);
    setTiempoRestanteMin(Math.max(1, Math.round(segundosRestantes / 60)));
  }

  return (
    <View style={navegacionStyle.container}>
      <Map style={{ flex: 1 }} mapStyle={MAP_STYLE_URL} logo={false}>
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
            paint={{ "line-color": "#1D7A46", "line-width": 5 }}
          />
        </GeoJSONSource>
        {ruta.destino && (
          <ViewAnnotation
            id="destino-nav"
            lngLat={[ruta.destino.lng, ruta.destino.lat]}
          >
            <View style={navegacionStyle.marcadorDestino}>
              <Text style={navegacionStyle.marcadorDestinoIcono}>
                {iconoDeCategoria(ruta.destino.categoria)}
              </Text>
            </View>
          </ViewAnnotation>
        )}
      </Map>

      {/* Panel superior estilo Google Maps: instrucción actual */}
      <View style={navegacionStyle.panelInstruccion}>
        <Text style={navegacionStyle.instruccionTexto}>
          {describirManiobra(pasoActual.tipoManiobra, pasoActual.modificador)}
        </Text>
        {pasoActual.calle !== "Sin nombre" && (
          <Text style={navegacionStyle.instruccionCalle}>
            {pasoActual.calle}
          </Text>
        )}
        {siguientePaso && (
          <Text style={navegacionStyle.siguienteTexto}>
            Luego:{" "}
            {describirManiobra(
              siguientePaso.tipoManiobra,
              siguientePaso.modificador,
            )}
          </Text>
        )}
      </View>

      {/* Panel inferior estilo Google Maps: ETA + botón de salir */}
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

// Distancia aproximada en metros entre dos coordenadas (fórmula equirectangular,
// suficiente para comparar distancias cortas sin librerías extra).
function distanciaAproximadaMetros(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const rad = Math.PI / 180;
  const x = (lon2 - lon1) * rad * Math.cos(((lat1 + lat2) / 2) * rad);
  const y = (lat2 - lat1) * rad;
  return Math.sqrt(x * x + y * y) * R;
}
