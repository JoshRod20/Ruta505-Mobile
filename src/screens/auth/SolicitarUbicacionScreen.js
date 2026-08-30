import { useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import InteresesUbicacionStyle from "../../styles/auth/InteresesUbicacionStyle";
import { registrarUsuario } from "../../services/registro";
import { mapFirebaseError } from "../../utils/firebaseErrors";
import { ROLES } from "../../constants/roles";

// ==================================================
// TEXTOS SEGÚN ROL
// ==================================================
//
// El turista pasa por Intereses -> Ubicación (2 pasos reales,
// por eso ambos segmentos de la barra se muestran activos).
// El actor cultural llega aquí directo desde su formulario
// de registro (1 solo paso), por eso solo el segundo segmento
// se muestra activo, igual que en el diseño de referencia.
//
const TEXTOS_POR_ROL = {
  [ROLES.TURISTA]: {
    titulo: "Encuentra lugares cerca",
    subtitulo:
      "Activa tu ubicación para descubrir los mejores lugares a tu alrededor",
    primerSegmentoActivo: true,
  },
  [ROLES.ACTOR_CULTURAL]: {
    titulo: "¡Listo para que te descubran!",
    subtitulo:
      "Activa tu ubicación para estar en los mejores lugares por descubrir",
    primerSegmentoActivo: false,
  },
};

const SolicitarUbicacionScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { datosRegistro, intereses } = route.params || {};

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const textos =
    TEXTOS_POR_ROL[datosRegistro?.role] ?? TEXTOS_POR_ROL[ROLES.TURISTA];

  const handleVolver = () => {
    navigation.goBack();
  };

  const finalizarRegistro = async (ubicacion) => {
    const { email, password, ...perfil } = datosRegistro;

    const datosPerfil = {
      ...perfil, // ya incluye role (y estadoVerificacion/tipoActor si es actor)
      ubicacion,
    };

    // El turista trae intereses; el actor cultural no pasa por
    // esa pantalla, así que no se agrega el campo si no existe.
    if (intereses) {
      datosPerfil.intereses = intereses;
    }

    try {
      setCargando(true);
      await registrarUsuario(email, password, datosPerfil);
      // Al crearse la cuenta, Firebase autentica al usuario,
      // AuthContext lo detecta y RootNavigator decide la
      // siguiente pantalla solo (Home, o Pendiente de
      // aprobación si es actor cultural).
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
        // El usuario puede continuar sin compartir ubicación.
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
      {/* ==================================================
          BOTÓN VOLVER
          ==================================================
          Si registrarUsuario falla (correo inválido,
          email-already-in-use, etc.), antes no había forma de
          regresar a corregir los datos sin reiniciar la app.
          Estilo en línea, igual que en SeleccionarIntereses.
          Deshabilitado mientras `cargando` está en vuelo para
          no interrumpir un registro que sí puede completarse.
          ================================================== */}

      <TouchableOpacity
        onPress={handleVolver}
        activeOpacity={0.7}
        disabled={cargando}
        style={{
          position: "absolute",
          top: insets.top + 10,
          left: 16,
          zIndex: 10,
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255,255,255,0.85)",
          opacity: cargando ? 0.4 : 1,
        }}
      >
        <Ionicons name="chevron-back" size={24} color="#2b2b2b" />
      </TouchableOpacity>

      <View style={InteresesUbicacionStyle.barraProgreso}>
        <View
          style={[
            InteresesUbicacionStyle.segmentoProgreso,
            textos.primerSegmentoActivo &&
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
          {textos.titulo}
        </Text>

        <Text style={InteresesUbicacionStyle.subtituloUbicacion}>
          {textos.subtitulo}
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