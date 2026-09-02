import { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import QRCode from "react-native-qrcode-svg";

import { auth } from "../../services/firebase";
import {
  totpYaActivado,
  iniciarEnrolamientoTotp,
  confirmarEnrolamientoTotp,
  desactivarTotp,
} from "../../services/mfa";
import { mapFirebaseError } from "../../utils/firebaseErrors";

import FloatingNavButton from "../../components/common/FloatingNavButton";
import ActivarDobleFactorStyle from "../../styles/perfilusuario/ActivarDobleFactorStyle";

const ActivarDobleFactorScreen = ({ navigation }) => {
  const [activado, setActivado] = useState(() =>
    totpYaActivado(auth.currentUser)
  );

  // inicio | qr
  const [paso, setPaso] = useState("inicio");

  const [secretInfo, setSecretInfo] = useState(null);
  const [codigo, setCodigo] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleChangeCodigo = (texto) => {
    setCodigo(texto.replace(/[^0-9]/g, "").slice(0, 6));
    if (error) setError("");
  };

  const reiniciarFlujo = () => {
    setPaso("inicio");
    setSecretInfo(null);
    setCodigo("");
    setError("");
  };

  // ==================================================
  // INICIAR ENROLAMIENTO
  // ==================================================

  const handleIniciar = async () => {
    setError("");
    setCargando(true);

    try {
      const info = await iniciarEnrolamientoTotp();
      setSecretInfo(info);
      setPaso("qr");
    } catch (err) {
      // TEMPORAL: mostrar el código real para diagnosticar. Quitar
      // esta línea (dejar solo el mensaje de mapFirebaseError) una
      // vez resuelto el problema.
      console.log("Error al iniciar enrolamiento TOTP:", err.code, err.message);

      setError(
        err.code === "auth/requires-recent-login"
          ? "Por seguridad, vuelve a iniciar sesión antes de activar esto."
          : `${mapFirebaseError(err.code)} (${err.code || err.message || "sin código"})`
      );
    } finally {
      setCargando(false);
    }
  };

  // ==================================================
  // CONFIRMAR ENROLAMIENTO
  // ==================================================

  const handleConfirmar = async () => {
    setError("");

    if (codigo.length !== 6) {
      setError("Ingresa el código de 6 dígitos de tu app autenticadora.");
      return;
    }

    setCargando(true);

    try {
      await confirmarEnrolamientoTotp(secretInfo.secret, codigo);
      setActivado(true);
      reiniciarFlujo();
      Alert.alert("Listo", "La verificación en dos pasos quedó activada.");
    } catch (err) {
      setError(
        err.code === "auth/invalid-verification-code"
          ? "El código es incorrecto o ya expiró."
          : mapFirebaseError(err.code)
      );
    } finally {
      setCargando(false);
    }
  };

  // ==================================================
  // DESACTIVAR
  // ==================================================

  const handleDesactivar = () => {
    Alert.alert(
      "Desactivar verificación en dos pasos",
      "¿Seguro que quieres desactivarla? Tu cuenta quedará protegida solo con tu contraseña.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Desactivar",
          style: "destructive",
          onPress: async () => {
            setCargando(true);
            setError("");
            try {
              await desactivarTotp();
              setActivado(false);
            } catch (err) {
              setError(mapFirebaseError(err.code));
            } finally {
              setCargando(false);
            }
          },
        },
      ]
    );
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <ScrollView
      contentContainerStyle={ActivarDobleFactorStyle.contenedor}
    >
      <FloatingNavButton
        icon="arrow-back-outline"
        onPress={() => navigation.goBack()}
        accessibilityLabel="Volver"
      />

      <Text style={ActivarDobleFactorStyle.titulo}>
        Verificación en dos pasos
      </Text>

      {activado ? (
        <>
          <Text style={ActivarDobleFactorStyle.subtitulo}>
            Ya está activada en tu cuenta con una app autenticadora. Al
            iniciar sesión te pediremos también el código de 6 dígitos.
          </Text>

          {error ? (
            <Text style={ActivarDobleFactorStyle.error}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={[
              ActivarDobleFactorStyle.boton,
              ActivarDobleFactorStyle.botonPeligro,
            ]}
            onPress={handleDesactivar}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={ActivarDobleFactorStyle.botonTexto}>
                Desactivar
              </Text>
            )}
          </TouchableOpacity>
        </>
      ) : paso === "inicio" ? (
        <>
          <Text style={ActivarDobleFactorStyle.subtitulo}>
            Agrega una capa extra de seguridad: además de tu contraseña, te
            pediremos un código de 6 dígitos generado por una app
            autenticadora (Google Authenticator, Authy, Microsoft
            Authenticator, etc.).
          </Text>

          {error ? (
            <Text style={ActivarDobleFactorStyle.error}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={ActivarDobleFactorStyle.boton}
            onPress={handleIniciar}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={ActivarDobleFactorStyle.botonTexto}>Activar</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={ActivarDobleFactorStyle.subtitulo}>
            1. Escanea este código con tu app autenticadora.
          </Text>

          <View style={ActivarDobleFactorStyle.qrWrap}>
            <QRCode value={secretInfo.qrCodeUrl} size={200} />
          </View>

          <Text style={ActivarDobleFactorStyle.claveManual}>
            ¿No puedes escanear? Ingresa esta clave manualmente:{"\n"}
            <Text style={ActivarDobleFactorStyle.claveManualTexto}>
              {secretInfo.secretKey}
            </Text>
          </Text>

          <Text style={ActivarDobleFactorStyle.subtitulo}>
            2. Escribe el código de 6 dígitos que te muestra la app.
          </Text>

          <TextInput
            style={ActivarDobleFactorStyle.input}
            placeholder="000000"
            placeholderTextColor="#a8a8a8"
            keyboardType="number-pad"
            maxLength={6}
            value={codigo}
            onChangeText={handleChangeCodigo}
          />

          {error ? (
            <Text style={ActivarDobleFactorStyle.error}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={ActivarDobleFactorStyle.boton}
            onPress={handleConfirmar}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={ActivarDobleFactorStyle.botonTexto}>
                Confirmar
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={ActivarDobleFactorStyle.enlaceWrap}
            onPress={reiniciarFlujo}
            disabled={cargando}
          >
            <Text style={ActivarDobleFactorStyle.enlace}>Cancelar</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default ActivarDobleFactorScreen;
