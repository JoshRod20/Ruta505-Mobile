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

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

import { auth } from "../../services/firebase";
import {
  totpYaActivado,
  iniciarEnrolamientoTotp,
  confirmarEnrolamientoTotp,
  desactivarTotp,
} from "../../services/mfa";
import { enviarCorreoVerificacion } from "../../services/emailVerification";
import { mapFirebaseError } from "../../utils/firebaseErrors";

import FloatingNavButton from "../../components/common/FloatingNavButton";
import ActivarDobleFactorStyle from "../../styles/perfilusuario/ActivarDobleFactorStyle";

const ActivarDobleFactorScreen = ({ navigation }) => {
  const [activado, setActivado] = useState(() =>
    totpYaActivado(auth.currentUser)
  );

  // inicio | correo_no_verificado | reautenticar | qr
  const [paso, setPaso] = useState("inicio");

  const [secretInfo, setSecretInfo] = useState(null);
  const [codigo, setCodigo] = useState("");
  const [passwordReauth, setPasswordReauth] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [correoReenviado, setCorreoReenviado] = useState(false);

  const handleChangeCodigo = (texto) => {
    setCodigo(texto.replace(/[^0-9]/g, "").slice(0, 6));
    if (error) setError("");
  };

  const reiniciarFlujo = () => {
    setPaso("inicio");
    setSecretInfo(null);
    setCodigo("");
    setPasswordReauth("");
    setError("");
  };

  // ==================================================
  // INTENTAR ENROLAR (usado por "Activar" y por los
  // reintentos tras verificar correo / reautenticar)
  // ==================================================

  const intentarEnrolar = async () => {
    setError("");
    setCargando(true);

    try {
      const info = await iniciarEnrolamientoTotp();
      setSecretInfo(info);
      setCorreoReenviado(false);
      setPaso("qr");
    } catch (err) {
      if (err.code === "auth/unverified-email") {
        setPaso("correo_no_verificado");
      } else if (err.code === "auth/requires-recent-login") {
        setPaso("reautenticar");
      } else {
        setError(mapFirebaseError(err.code));
      }
    } finally {
      setCargando(false);
    }
  };

  // ==================================================
  // CORREO NO VERIFICADO
  // ==================================================

  const handleReenviarCorreo = async () => {
    setError("");
    setCargando(true);

    try {
      await enviarCorreoVerificacion();
      setCorreoReenviado(true);
    } catch (err) {
      setError(mapFirebaseError(err.code));
    } finally {
      setCargando(false);
    }
  };

  // ==================================================
  // REAUTENTICAR (login reciente, sin cerrar sesión)
  // ==================================================

  const handleConfirmarReautenticacion = async () => {
    setError("");

    if (!passwordReauth) {
      setError("Ingresa tu contraseña.");
      return;
    }

    setCargando(true);

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        passwordReauth
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      setPasswordReauth("");
      await intentarEnrolar();
    } catch (err) {
      setError(mapFirebaseError(err.code));
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
    <ScrollView contentContainerStyle={ActivarDobleFactorStyle.contenedor}>
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
            onPress={intentarEnrolar}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={ActivarDobleFactorStyle.botonTexto}>Activar</Text>
            )}
          </TouchableOpacity>
        </>
      ) : paso === "correo_no_verificado" ? (
        <>
          <Text style={ActivarDobleFactorStyle.subtitulo}>
            Antes de activar esto necesitas verificar tu correo. Te
            enviamos (o puedes reenviar) un link de confirmación a tu
            bandeja de entrada.
          </Text>

          {correoReenviado ? (
            <Text style={ActivarDobleFactorStyle.subtitulo}>
              Listo, te reenviamos el correo. Revisa tu bandeja (y spam).
            </Text>
          ) : null}

          {error ? (
            <Text style={ActivarDobleFactorStyle.error}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={ActivarDobleFactorStyle.boton}
            onPress={handleReenviarCorreo}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={ActivarDobleFactorStyle.botonTexto}>
                Reenviar correo de verificación
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={ActivarDobleFactorStyle.boton}
            onPress={intentarEnrolar}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={ActivarDobleFactorStyle.botonTexto}>
                Ya verifiqué mi correo
              </Text>
            )}
          </TouchableOpacity>
        </>
      ) : paso === "reautenticar" ? (
        <>
          <Text style={ActivarDobleFactorStyle.subtitulo}>
            Por seguridad, confirma tu contraseña para continuar (esto no
            cierra tu sesión, solo confirma que sigues siendo tú).
          </Text>

          <TextInput
            style={ActivarDobleFactorStyle.input}
            placeholder="Contraseña"
            placeholderTextColor="#a8a8a8"
            secureTextEntry
            value={passwordReauth}
            onChangeText={(texto) => {
              setPasswordReauth(texto);
              if (error) setError("");
            }}
          />

          {error ? (
            <Text style={ActivarDobleFactorStyle.error}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={ActivarDobleFactorStyle.boton}
            onPress={handleConfirmarReautenticacion}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={ActivarDobleFactorStyle.botonTexto}>
                Confirmar contraseña
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
