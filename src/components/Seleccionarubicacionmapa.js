import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Map, Camera } from "@maplibre/maplibre-react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { seleccionarUbicacionStyle as s } from "../styles/mapanicaragua/Seleccionarubicacionstyle.js";

const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

export default function SeleccionarUbicacionMapa({
  centroInicial,
  onConfirmar,
  onCancelar,
}) {
  const insets = useSafeAreaInsets();
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

      {/* Pin fijo en el centro de la pantalla */}
      <View style={s.pinFijo} pointerEvents="none">
        <Ionicons name="location-sharp" size={44} color="#123B63" />
        <View style={s.pinSombra} />
      </View>

      <View style={[s.banner, { top: insets.top + 35 }]}>
        <Ionicons name="hand-left-outline" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={s.bannerTexto}>
          Mueve el mapa para ubicar el pin
        </Text>
      </View>

      <View style={[s.panelInferior, { bottom: Math.max(insets.bottom, 16) + 16 }]}>
        <View style={s.coordsFila}>
          <Ionicons name="navigate-outline" size={14} color="#4E6780" style={{ marginRight: 6 }} />
          <Text style={s.coordenadasTexto}>
            {coordenadasCentro.lat.toFixed(5)}, {coordenadasCentro.lon.toFixed(5)}
          </Text>
        </View>

        <View style={s.filaBotones}>
          <TouchableOpacity style={s.botonCancelar} onPress={onCancelar} activeOpacity={0.8}>
            <Text style={s.botonCancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.botonConfirmar}
            onPress={() => onConfirmar(coordenadasCentro)}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={s.botonConfirmarTexto}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}