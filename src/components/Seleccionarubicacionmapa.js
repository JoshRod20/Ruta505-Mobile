import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Map, Camera } from "@maplibre/maplibre-react-native";
import { seleccionarUbicacionStyle as s } from "../styles/mapanicaragua/Seleccionarubicacionstyle.js";

const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
export default function SeleccionarUbicacionMapa({
  centroInicial,
  onConfirmar,
  onCancelar,
}) {
  const mapRef = useRef(null);
  const [coordenadasCentro, setCoordenadasCentro] = useState({
    lat: centroInicial?.lat ?? 12.8654,
    lon: centroInicial?.lon ?? -85.2072,
  });

  async function handleRegionDidChange() {
    if (!mapRef.current) return;
    try {
      const centro = await mapRef.current.getCenter(); // [lon, lat]
      setCoordenadasCentro({ lat: centro[1], lon: centro[0] });
    } catch (error) {
      console.warn("No se pudo leer el centro del mapa:", error);
    }
  }

  return (
    <View style={s.container}>
      <Map
        ref={mapRef}
        style={{ flex: 1 }}
        mapStyle={MAP_STYLE_URL}
        logo={false}
        onRegionDidChange={handleRegionDidChange}
      >
        <Camera
          zoom={15}
          center={[coordenadasCentro.lon, coordenadasCentro.lat]}
        />
      </Map>
      <View style={s.pinFijo} pointerEvents="none">
        <Text style={s.pinTexto}>📍</Text>
      </View>

      <View style={s.banner}>
        <Text style={s.bannerTexto}>
          Mueve el mapa para ubicar el pin en el lugar exacto
        </Text>
      </View>

      <View style={s.panelInferior}>
        <Text style={s.coordenadasTexto}>
          {coordenadasCentro.lat.toFixed(5)}, {coordenadasCentro.lon.toFixed(5)}
        </Text>
        <View style={s.filaBotones}>
          <TouchableOpacity style={s.botonCancelar} onPress={onCancelar}>
            <Text style={s.botonCancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.botonConfirmar}
            onPress={() => onConfirmar(coordenadasCentro)}
          >
            <Text style={s.botonConfirmarTexto}>Confirmar esta ubicación</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
