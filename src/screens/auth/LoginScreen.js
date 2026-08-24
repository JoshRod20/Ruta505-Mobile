// screens/auth/LoginScreen.js

import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ImageBackground,
  Dimensions,
} from "react-native";

import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../../services/firebase";
import { mapFirebaseError } from "../../utils/firebaseErrors";
import LoginScreenStyle from "../../styles/auth/LoginScreenStyle";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Altura de la banda donde vive la curva SVG.
const CURVE_HEIGHT = 130;

const LoginScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleVolver = () => {
    navigation.goBack();
  };

  const handleIrARegistro = () => {
    navigation.navigate("SeleccionarTipo");
  };

  const resetFeedback = () => {
    setError("");
    setFeedback("");
  };

  const handleLogin = async () => {
    resetFeedback();

    if (!email || !password) {
      setError("Completa tu correo y contraseña.");
      return;
    }

    setCargando(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
    } catch (err) {
      setError(mapFirebaseError(err.code));
    } finally {
      setCargando(false);
    }
  };

  const handleForgotPassword = async () => {
    resetFeedback();

    if (!email) {
      setError("Escribe tu correo para enviarte el enlace.");
      return;
    }

    try {
      await sendPasswordResetEmail(
        auth,
        email.trim()
      );
    } catch (err) {

      if (
        err.code !== "auth/invalid-email" &&
        err.code !== "auth/network-request-failed"
      ) {
        setFeedback(
          "Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña."
        );

        return;
      }

      setError(mapFirebaseError(err.code));

      return;
    }

    setFeedback(
      "Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña."
    );
  };

  return (
    <View style={LoginScreenStyle.contenedor}>

      {/* ==================================================
          HEADER CON PATRÓN CULTURAL + CURVA
          ================================================== */}

      <View style={LoginScreenStyle.header}>

        <ImageBackground
          source={require("../../assets/images/PatronRuta505.png")}
          style={LoginScreenStyle.headerPatron}
          resizeMode="cover"
        >

          <TouchableOpacity
            style={[
              LoginScreenStyle.botonVolver,
              { top: insets.top + 10 },
            ]}
            onPress={handleVolver}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color="#2b2b2b"
            />
          </TouchableOpacity>

        </ImageBackground>

        {/* Curva blanca — UNA sola transición suave:
            el patrón domina hasta ~55% del ancho, y solo
            en el último tramo sube de golpe hacia blanco. */}

        <Svg
  style={LoginScreenStyle.curva}
  width={SCREEN_WIDTH}
  height={CURVE_HEIGHT}
  viewBox={`0 0 ${SCREEN_WIDTH} ${CURVE_HEIGHT}`}
>
  <Path
    fill="#ffffff"
    d={`
      M0,${CURVE_HEIGHT * 0.99}
      C${SCREEN_WIDTH * 0.20},${CURVE_HEIGHT * 0.98} ${SCREEN_WIDTH * 0.38},${CURVE_HEIGHT * 0.85} ${SCREEN_WIDTH * 0.50},${CURVE_HEIGHT * 0.62}
      C${SCREEN_WIDTH * 0.62},${CURVE_HEIGHT * 0.40} ${SCREEN_WIDTH * 0.72},${CURVE_HEIGHT * 0.15} ${SCREEN_WIDTH * 0.85},${CURVE_HEIGHT * 0.06}
      C${SCREEN_WIDTH * 0.90},${CURVE_HEIGHT * 0.02} ${SCREEN_WIDTH * 0.95},0 ${SCREEN_WIDTH},0
      L${SCREEN_WIDTH},${CURVE_HEIGHT}
      L0,${CURVE_HEIGHT}
      Z
    `}
  />
</Svg>

      </View>

      {/* ==================================================
          FORMULARIO
          ================================================== */}

      <KeyboardAvoidingView
        style={LoginScreenStyle.scroll}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >

        <ScrollView
          contentContainerStyle={
            LoginScreenStyle.card
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          <Text style={LoginScreenStyle.titulo}>
            Iniciar Sesión
          </Text>

          <Text style={LoginScreenStyle.subtitulo}>
            Inicia sesión con tu cuenta de{" "}
            <Text style={LoginScreenStyle.subtituloNegrita}>
              Ruta 505
            </Text>
          </Text>

          <TextInput
            style={LoginScreenStyle.input}
            placeholder="Nombre de usuario o correo"
            placeholderTextColor="#a8a8a8"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <View
            style={LoginScreenStyle.inputWrap}
          >

            <TextInput
              style={[
                LoginScreenStyle.input,
                LoginScreenStyle.inputPassword,
              ]}
              placeholder="Contraseña"
              placeholderTextColor="#a8a8a8"
              secureTextEntry={!mostrarPassword}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={LoginScreenStyle.iconoOjo}
              onPress={() =>
                setMostrarPassword((v) => !v)
              }
              activeOpacity={0.7}
            >

              <Ionicons
                name={
                  mostrarPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={22}
                color="#086338"
              />

            </TouchableOpacity>

          </View>

          <TouchableOpacity
            style={LoginScreenStyle.enlaceWrap}
            onPress={handleForgotPassword}
          >

            <Text style={LoginScreenStyle.enlace}>
              ¿Olvidaste tu contraseña?
            </Text>

          </TouchableOpacity>

          {error ? (
            <Text style={LoginScreenStyle.error}>
              {error}
            </Text>
          ) : null}

          {feedback ? (
            <Text style={LoginScreenStyle.exito}>
              {feedback}
            </Text>
          ) : null}

          <TouchableOpacity
            style={[
              LoginScreenStyle.boton,
              cargando &&
                LoginScreenStyle.botonDeshabilitado,
            ]}
            onPress={handleLogin}
            disabled={cargando}
          >

            {cargando ? (
              <ActivityIndicator
                color="#ffffff"
              />
            ) : (
              <Text
                style={LoginScreenStyle.botonTexto}
              >
                Iniciar Sesión
              </Text>
            )}

          </TouchableOpacity>

          <TouchableOpacity
            style={
              LoginScreenStyle.registrarseWrap
            }
            onPress={handleIrARegistro}
          >

            <Text
              style={
                LoginScreenStyle.registrarseTexto
              }
            >
              ¿No tienes cuenta?{" "}

              <Text
                style={
                  LoginScreenStyle.registrarseEnlace
                }
              >
                Regístrate
              </Text>

            </Text>

          </TouchableOpacity>

        </ScrollView>

      </KeyboardAvoidingView>

    </View>
  );
};

export default LoginScreen;