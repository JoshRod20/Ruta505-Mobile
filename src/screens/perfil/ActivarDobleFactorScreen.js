import { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

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

import ActivarDobleFactorStyle from "../../styles/perfilusuario/ActivarDobleFactorStyle";

const ActivarDobleFactorScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
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

  const volver = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("MainDrawer");
    }
  };

  const Cargando = () => <ActivityIndicator color="#ffffff" />;

  return (
    <View style={[ActivarDobleFactorStyle.raiz, { paddingTop: insets.top + 8 }]}>
      <View style={ActivarDobleFactorStyle.header}>
        <TouchableOpacity
          style={ActivarDobleFactorStyle.botonAtras}
          onPress={volver}
          accessibilityLabel="Volver"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </TouchableOpacity>
        <Text style={ActivarDobleFactorStyle.tituloPantalla}>
          Verificación en dos pasos
        </Text>
        <View style={ActivarDobleFactorStyle.botonAtras} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            ActivarDobleFactorStyle.contenedor,
            { paddingBottom: insets.bottom + 32 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={ActivarDobleFactorStyle.iconoCirculo}>
            <Ionicons
              name={activado ? "shield-checkmark" : "shield-outline"}
              size={44}
              color="#065F33"
            />
          </View>
          <View
            style={[
              ActivarDobleFactorStyle.estadoChip,
              activado
                ? ActivarDobleFactorStyle.estadoChipActivo
                : ActivarDobleFactorStyle.estadoChipInactivo,
            ]}
          >
            <Text
              style={[
                ActivarDobleFactorStyle.estadoChipTexto,
                { color: activado ? "#ffffff" : "#444444" },
              ]}
            >
              {activado ? "Activada" : "Desactivada"}
            </Text>
          </View>

          <View style={ActivarDobleFactorStyle.tarjeta}>
            {activado ? (
              <>
                <Text style={ActivarDobleFactorStyle.titulo}>
                  Tu cuenta está protegida
                </Text>
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
                    <Cargando />
                  ) : (
                    <Text style={ActivarDobleFactorStyle.botonTexto}>
                      Desactivar
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            ) : paso === "inicio" ? (
              <>
                <Text style={ActivarDobleFactorStyle.titulo}>
                  Una capa extra de seguridad
                </Text>
                <Text style={ActivarDobleFactorStyle.subtitulo}>
                  Además de tu contraseña, te pediremos un código de 6 dígitos
                  generado por una app autenticadora (Google Authenticator,
                  Authy, Microsoft Authenticator, etc.).
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
                    <Cargando />
                  ) : (
                    <Text style={ActivarDobleFactorStyle.botonTexto}>
                      Activar
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            ) : paso === "correo_no_verificado" ? (
              <>
                <Text style={ActivarDobleFactorStyle.titulo}>
                  Verifica tu correo
                </Text>
                <Text style={ActivarDobleFactorStyle.subtitulo}>
                  Antes de activar esto necesitas verificar tu correo. Te
                  enviamos (o puedes reenviar) un link de confirmación a tu
                  bandeja de entrada.
                </Text>

                {correoReenviado ? (
                  <Text style={ActivarDobleFactorStyle.aviso}>
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
                    <Cargando />
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
                    <Cargando />
                  ) : (
                    <Text style={ActivarDobleFactorStyle.botonTexto}>
                      Ya verifiqué mi correo
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            ) : paso === "reautenticar" ? (
              <>
                <Text style={ActivarDobleFactorStyle.titulo}>
                  Confirma tu contraseña
                </Text>
                <Text style={ActivarDobleFactorStyle.subtitulo}>
                  Por seguridad, confirma tu contraseña para continuar (esto no
                  cierra tu sesión, solo confirma que sigues siendo tú).
                </Text>

                <TextInput
                  style={[
                    ActivarDobleFactorStyle.input,
                    { fontSize: 16, letterSpacing: 0 },
                  ]}
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
                    <Cargando />
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
                <Text style={ActivarDobleFactorStyle.paso}>Paso 1</Text>
                <Text style={ActivarDobleFactorStyle.subtitulo}>
                  Escanea este código con tu app autenticadora.
                </Text>

                <View style={ActivarDobleFactorStyle.qrWrap}>
                  <QRCode value={secretInfo.qrCodeUrl} size={180} />
                </View>

                <Text style={ActivarDobleFactorStyle.claveManual}>
                  ¿No puedes escanear? Ingresa esta clave manualmente:{"\n"}
                  <Text style={ActivarDobleFactorStyle.claveManualTexto}>
                    {secretInfo.secretKey}
                  </Text>
                </Text>

                <Text
                  style={[ActivarDobleFactorStyle.paso, { marginTop: 20 }]}
                >
                  Paso 2
                </Text>
                <Text style={ActivarDobleFactorStyle.subtitulo}>
                  Escribe el código de 6 dígitos que te muestra la app.
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
                    <Cargando />
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ActivarDobleFactorScreen;
