import { useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import InteresesUbicacionStyle from "../../styles/auth/InteresesUbicacionStyle";
import { registrarUsuario } from "../../services/registro";
import { mapFirebaseError } from "../../utils/firebaseErrors";

const SolicitarUbicacionScreen = ({ route }) => {
  const insets = useSafeAreaInsets();
  const { datosRegistro, intereses } = route.params;

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const finalizarRegistro = async (ubicacion) => {
    const { email, password, ...perfil } = datosRegistro;

    try {
      setCargando(true);
      await registrarUsuario(email, password, {
        ...perfil, // ya incluye role: ROLES.TURISTA
        intereses,
        ubicacion,
      });
      // Al crearse la cuenta, Firebase autentica al usuario,
      // AuthContext lo detecta y RootNavigator lo lleva a Home solo.
    } catch (err) {
      setError(mapFirebaseError(err.code));
      setCargando(false);
    }
  };

  const handleActivarUbicacion = async () => {
    setError("");

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        // El turista puede continuar sin compartir ubicación.
        await finalizarRegistro(null);
        return;
      }

      const posicion = await Location.getCurrentPositionAsync({});

      await finalizarRegistro({
        latitud: posicion.coords.latitude,
        longitud: posicion.coords.longitude,
      });
    } catch (err) {
      console.error("Error solicitando ubicación:", err);
      await finalizarRegistro(null);
    }
  };

  return (
    <View
      style={[
        InteresesUbicacionStyle.contenedor,
        { paddingTop: insets.top + 16 },
      ]}
    >

      <View style={InteresesUbicacionStyle.barraProgreso}>
        <View
          style={[
            InteresesUbicacionStyle.segmentoProgreso,
            InteresesUbicacionStyle.segmentoActivo,
          ]}
        />
        <View
          style={[
            InteresesUbicacionStyle.segmentoProgreso,
            InteresesUbicacionStyle.segmentoActivo,
          ]}
        />
      </View>

      <View style={InteresesUbicacionStyle.centroContenido}>
        <Image
          source={require("../../assets/images/mapa-ubicacion.png")}
          style={InteresesUbicacionStyle.imagenMapa}
          resizeMode="cover"
        />

        <Text style={InteresesUbicacionStyle.tituloUbicacion}>
          Encuentra lugares cerca
        </Text>

        <Text style={InteresesUbicacionStyle.subtituloUbicacion}>
          Activa tu ubicación para descubrir los mejores lugares a tu
          alrededor
        </Text>

        {error ? (
          <Text style={InteresesUbicacionStyle.error}>{error}</Text>
        ) : null}

        <TouchableOpacity
          style={[
            InteresesUbicacionStyle.botonNaranja,
            cargando && InteresesUbicacionStyle.botonDeshabilitado,
          ]}
          onPress={handleActivarUbicacion}
          disabled={cargando}
          activeOpacity={0.85}
        >
          {cargando ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={InteresesUbicacionStyle.botonNaranjaTexto}>
              Activar ubicación
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SolicitarUbicacionScreen;