import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

import { db } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import { PERMISOS, tienePermiso } from "../../constants/permissions";
import {
  generateQrStyle as s,
  QR_TAMANO,
} from "../../styles/actorCultural/generateQrStyle";

// ==================================================
// Contenido del QR del Pasaporte Cultural
// Es un texto fijo con el id del actor, así el código impreso nunca caduca.
// El escáner del turista (pasaporte) usará leerCodigoSello() para obtener
// el id del actor y registrar el sello.
// ==================================================
export const PREFIJO_SELLO = "ruta505://sello/";

export const construirCodigoSello = (actorId) => `${PREFIJO_SELLO}${actorId}`;

export function leerCodigoSello(texto) {
  if (typeof texto !== "string" || !texto.startsWith(PREFIJO_SELLO)) {
    return null;
  }
  const actorId = texto.slice(PREFIJO_SELLO.length).trim();
  return actorId || null;
}

// Alto de la barra de tabs (68) más un margen: la barra flota sobre la pantalla.
const ALTO_BARRA_TABS = 68;

export default function GenerateQr() {
  const insets = useSafeAreaInsets();
  const { user, profile, role } = useAuth();
  const tarjetaRef = useRef(null);

  const nombre = profile?.nombreCompleto || "tu espacio cultural";
  // Si ya generaste el código antes, se abre directo en el QR.
  const [mostrarQr, setMostrarQr] = useState(!!profile?.pasaporteQrGeneradoAt);
  const [compartiendo, setCompartiendo] = useState(false);

  useEffect(() => {
    if (profile?.pasaporteQrGeneradoAt) setMostrarQr(true);
  }, [profile?.pasaporteQrGeneradoAt]);

  const padding = {
    paddingTop: insets.top + 16,
    paddingBottom: ALTO_BARRA_TABS + insets.bottom + 24,
  };

  if (!tienePermiso(role, PERMISOS.GENERAR_QR_EXPERIENCIA) || !user?.uid) {
    return (
      <View style={[s.avisoContenedor, padding]}>
        <Text style={s.aviso}>
          El código QR del Pasaporte Cultural lo generan los actores
          culturales.
        </Text>
      </View>
    );
  }

  const handleGenerar = async () => {
    setMostrarQr(true);
    // Se recuerda que ya lo generaste para abrir directo en el QR la próxima vez.
    try {
      await updateDoc(doc(db, "users", user.uid), {
        pasaporteQrGeneradoAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn("No se pudo guardar que el QR fue generado:", error);
    }
  };

  // Captura la tarjeta del QR como imagen PNG y abre el menú de compartir del
  // celular (guardar, imprimir, enviar por WhatsApp, etc.).
  const handleDescargar = async () => {
    try {
      setCompartiendo(true);
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert(
          "No disponible",
          "Este dispositivo no permite compartir archivos."
        );
        return;
      }
      const uri = await captureRef(tarjetaRef, {
        format: "png",
        quality: 1,
        result: "tmpfile",
      });
      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: "Código QR del Pasaporte Cultural",
        UTI: "public.png",
      });
    } catch (error) {
      console.warn("Error al descargar el QR:", error);
      Alert.alert(
        "No se pudo descargar",
        "Inténtalo de nuevo en unos minutos."
      );
    } finally {
      setCompartiendo(false);
    }
  };

  return (
    <View style={s.container}>
      <ScrollView
        contentContainerStyle={[s.contenido, padding]}
        showsVerticalScrollIndicator={false}
      >
        {!mostrarQr ? (
          <>
            <Text style={s.bienvenidaTexto}>
              ¡Bienvenido! Crea aquí el código QR de{" "}
              <Text style={s.bienvenidaNegrita}>{nombre}</Text> para que cada
              visitante pueda coleccionar el sello de tu comunidad en el
              Pasaporte Cultural.
            </Text>

            <TouchableOpacity
              style={s.boton}
              onPress={handleGenerar}
              activeOpacity={0.85}
            >
              <Text style={s.botonTexto}>Generar código QR</Text>
            </TouchableOpacity>

            {/* La mascota del diseño se agregará aquí cuando esté el PNG:
                <Image source={require("../../../assets/mascota.png")} ... /> */}
          </>
        ) : (
          <>
            <View ref={tarjetaRef} collapsable={false} style={s.tarjetaQr}>
              <Text style={s.tituloQr}>QR del Pasaporte Cultural</Text>
              <Text style={s.vinculado}>Vinculado a: {nombre}</Text>

              <View style={s.marco}>
                <View style={s.esquinaSuperiorIzquierda} />
                <View style={s.esquinaSuperiorDerecha} />
                <View style={s.esquinaInferiorIzquierda} />
                <View style={s.esquinaInferiorDerecha} />
                <QRCode
                  value={construirCodigoSello(user.uid)}
                  size={QR_TAMANO}
                  backgroundColor="#FFFFFF"
                  color="#000000"
                  quietZone={4}
                />
              </View>
            </View>

            <Text style={s.instrucciones}>
              Imprime este código y colócalo a la entrada. Cada turista lo
              escaneará con su app para registrar la visita.
            </Text>

            <TouchableOpacity
              style={[s.boton, compartiendo && s.botonDeshabilitado]}
              onPress={handleDescargar}
              disabled={compartiendo}
              activeOpacity={0.85}
            >
              {compartiendo ? (
                <ActivityIndicator color="#1A1A1A" />
              ) : (
                <Text style={s.botonTexto}>Descargar</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}
