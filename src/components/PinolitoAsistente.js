import React from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ROLES } from "../constants/roles";

import { useAuth } from "../context/AuthContext";
import { usePinolito } from "../hooks/usePinolito";
import { usePinolitoRecomendaciones } from "../hooks/usePinolitoRecomendaciones";
import { ITEMS } from "../constants/pinolitoCatalogo";
import { VERDE } from "../styles/home/homeStyle";

const porId = (id) => ITEMS.find((i) => i.id === id);

// Césped estático: va pegado abajo a la derecha, detrás de Pinolito. Pinolito
// (con la skin que el usuario eligió) cambia; el césped no.
const CESPED = require("../assets/pinolito/cesped.png");
const ANCHO_CESPED = 0.62; // ancho del césped, como fracción del ancho de pantalla
const SUBIDA_PINOLITO = 0.45; // qué tanto sube Pinolito sobre el césped (0 = al ras del borde)

export default function PinolitoAsistente() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { isLoggedIn, profile, role } = useAuth();
  const { equipadoGuardado, cargando } = usePinolito();

  // Espera a cargar el atuendo para que Pinolito aparezca ya vestido.
  // Los intereses salen del perfil del usuario conectado; si no tiene,
  // el hook recomienda los lugares más cercanos.
  const { recomendacion, cerrar } = usePinolitoRecomendaciones({
    habilitado: isLoggedIn && !cargando && role === ROLES.TURISTA,
    nombre: profile?.nombreCompleto ?? profile?.nombre ?? profile?.displayName,
    rol: role,
    intereses: profile?.intereses, // users/{uid}.intereses (arreglo de textos)
  });

  // Mismas capas que la pantalla de Pinolito: cuerpo -> accesorio -> sombrero
  const cuerpo = porId(equipadoGuardado.cuerpo) ?? porId("cuerpo_1");
  const sombrero = equipadoGuardado.sombrero
    ? porId(equipadoGuardado.sombrero)
    : null;
  const accesorio = equipadoGuardado.accesorio
    ? porId(equipadoGuardado.accesorio)
    : null;

  const tam = width * 0.5;

  // Césped: se calcula su alto con la proporción real de la imagen.
  const { width: cW, height: cH } = Image.resolveAssetSource(CESPED);
  const cespedAncho = width * ANCHO_CESPED;
  const cespedAlto = cespedAncho * (cH / cW);
  // Pinolito se centra sobre el césped y sus pies quedan sobre él.
  const centrado = Math.max((cespedAncho - tam) / 2 - 16, 0);

  const onVerMapa = () => {
    const lugar = recomendacion?.lugar;
    cerrar();
    navigation.navigate("MainDrawer", {
      screen: "Mapa",
      params: lugar
        ? { lugarRecomendado: lugar.lugarMapa, ts: Date.now() }
        : undefined,
    });
  };

  return (
    <Modal
      visible={!!recomendacion}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {}} // bloquea el botón "atrás" de Android
    >
      <View style={styles.overlay}>
        {/* Césped estático (detrás de todo, pegado abajo a la derecha) */}
        <Image
          source={CESPED}
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: cespedAncho,
            height: cespedAlto,
          }}
          resizeMode="contain"
        />

        {/* Nube de pensamiento */}
        <View style={styles.nube}>
          <Text style={styles.texto}>{recomendacion?.mensaje}</Text>
          <View style={styles.botones}>
            <TouchableOpacity style={styles.btnSecundario} onPress={cerrar}>
              <Text style={styles.btnSecundarioTxt}>Quizás luego</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimario} onPress={onVerMapa}>
              <Text style={styles.btnPrimarioTxt}>Ver mapa</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Burbujas de pensamiento */}
        <View
          style={[
            styles.burbuja,
            { width: 22, height: 22, marginRight: tam * 0.55 + centrado },
          ]}
        />
        <View
          style={[
            styles.burbuja,
            { width: 14, height: 14, marginRight: tam * 0.5 + centrado },
          ]}
        />

        {/* Pinolito con su atuendo guardado */}
        <View
          style={{
            width: tam,
            height: tam,
            marginRight: centrado,
            marginBottom: cespedAlto * SUBIDA_PINOLITO,
          }}
        >
          <Image source={cuerpo.capa} style={styles.capa} resizeMode="contain" />
          {accesorio && (
            <Image source={accesorio.capa} style={styles.capa} resizeMode="contain" />
          )}
          {sombrero && (
            <Image source={sombrero.capa} style={styles.capa} resizeMode="contain" />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingHorizontal: 16,
  },
  nube: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 40,
    paddingVertical: 24,
    paddingHorizontal: 22,
    marginBottom: 8,
    alignItems: "center",
  },
  texto: {
    fontSize: 14,
    color: "#222",
    textAlign: "center",
    marginBottom: 14,
  },
  botones: { flexDirection: "row", gap: 10 },
  btnSecundario: {
    backgroundColor: "#F1F1F1",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  btnSecundarioTxt: { color: "#222", fontWeight: "600" },
  btnPrimario: {
    backgroundColor: VERDE,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  btnPrimarioTxt: { color: "#fff", fontWeight: "700" },
  burbuja: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginVertical: 3,
    alignSelf: "flex-end",
  },
  capa: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
});