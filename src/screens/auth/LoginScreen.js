import { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Animated,
  Easing,
} from "react-native";

import { FontAwesome, Ionicons } from "@expo/vector-icons";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../../services/firebase";
import { mapFirebaseError } from "../../utils/firebaseErrors";
import LoginScreenStyle from "../../styles/auth/LoginScreenStyle";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [cargando, setCargando] = useState(false);

  // ==================================================
  // ANIMACIÓN DEL SWITCHER
  // ==================================================

  const switcherAnimation = useRef(
    new Animated.Value(1)
  ).current;

  const switcherWidth = 246;

  const switcherButtonWidth = switcherWidth / 2;

  const animarSwitcher = (valor) => {
    Animated.timing(switcherAnimation, {
      toValue: valor,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const handleIrARegistro = () => {
    animarSwitcher(0);

    setTimeout(() => {
      navigation.navigate("SeleccionarTipo");
    }, 280);
  };

  // ==================================================
  // LIMPIAR MENSAJES
  // ==================================================

  const resetFeedback = () => {
    setError("");
    setFeedback("");
  };

  // ==================================================
  // LOGIN
  // ==================================================

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

      // Firebase actualiza AuthContext.
      // RootNavigator se encarga de cambiar de pantalla.

    } catch (err) {
      setError(mapFirebaseError(err.code));
    } finally {
      setCargando(false);
    }
  };

  // ==================================================
  // RECUPERAR CONTRASEÑA
  // ==================================================

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
          FONDO VERDE
          ================================================== */}

      <View style={LoginScreenStyle.header} />

      {/* ==================================================
          TARJETA BLANCA
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

          {/* ================================================
              SWITCHER ANIMADO
              ================================================ */}

          <View
            style={[
              LoginScreenStyle.switcherWrap,
              {
                width: switcherWidth,
              },
            ]}
          >

            {/* Pastilla verde animada */}

            <Animated.View
              style={[
                LoginScreenStyle.switcherIndicator,
                {
                  width: switcherButtonWidth,

                  transform: [
                    {
                      translateX:
                        switcherAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, switcherButtonWidth],
                        }),
                    },
                  ],
                },
              ]}
            />

            {/* Registrarse */}

            <TouchableOpacity
              style={LoginScreenStyle.switcherBtn}
              onPress={handleIrARegistro}
              activeOpacity={0.8}
            >
              <Text
                style={LoginScreenStyle.switcherTexto}
              >
                Registrarse
              </Text>
            </TouchableOpacity>

            {/* Iniciar sesión */}

            <TouchableOpacity
              style={LoginScreenStyle.switcherBtn}
              activeOpacity={0.8}
              onPress={() => animarSwitcher(1)}
            >
              <Text
                style={LoginScreenStyle.switcherTexto}
              >
                Iniciar sesión
              </Text>
            </TouchableOpacity>

          </View>

          {/* ================================================
              EMAIL
              ================================================ */}

          <TextInput
            style={LoginScreenStyle.input}
            placeholder="Email"
            placeholderTextColor="#c4c4c4"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          {/* ================================================
              CONTRASEÑA
              ================================================ */}

          <View
            style={LoginScreenStyle.inputWrap}
          >

            <TextInput
              style={[
                LoginScreenStyle.input,
                LoginScreenStyle.inputPassword,
              ]}
              placeholder="Contraseña"
              placeholderTextColor="#c4c4c4"
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
                size={20}
                color="#777777"
              />

            </TouchableOpacity>

          </View>

          {/* ================================================
              OLVIDÉ MI CONTRASEÑA
              ================================================ */}

          <TouchableOpacity
            style={LoginScreenStyle.enlaceWrap}
            onPress={handleForgotPassword}
          >

            <Text style={LoginScreenStyle.enlace}>
              ¿Olvidé mi contraseña?
            </Text>

          </TouchableOpacity>

          {/* ================================================
              ERROR
              ================================================ */}

          {error ? (
            <Text style={LoginScreenStyle.error}>
              {error}
            </Text>
          ) : null}

          {/* ================================================
              FEEDBACK
              ================================================ */}

          {feedback ? (
            <Text style={LoginScreenStyle.exito}>
              {feedback}
            </Text>
          ) : null}

          {/* ================================================
              BOTÓN LOGIN
              ================================================ */}

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
                Iniciar sesión
              </Text>
            )}

          </TouchableOpacity>

          {/* ================================================
              DIVISOR
              ================================================ */}

          <View
            style={LoginScreenStyle.dividerWrap}
          >

            <View
              style={LoginScreenStyle.dividerLinea}
            />

            <Text
              style={LoginScreenStyle.dividerTexto}
            >
              O inicia sesión con
            </Text>

            <View
              style={LoginScreenStyle.dividerLinea}
            />

          </View>

          {/* ================================================
              REDES SOCIALES
              ================================================ */}

          <View
            style={LoginScreenStyle.socialRow}
          >

            <View
              style={[
                LoginScreenStyle.socialCircle,
                {
                  backgroundColor: "#1877f2",
                  borderWidth: 0,
                },
              ]}
            >

              <FontAwesome
                name="facebook"
                size={20}
                color="#ffffff"
              />

            </View>

            <View
              style={LoginScreenStyle.socialCircle}
            >

              <FontAwesome
                name="google"
                size={18}
                color="#db4437"
              />

            </View>

            <View
              style={[
                LoginScreenStyle.socialCircle,
                {
                  backgroundColor: "#000000",
                  borderWidth: 0,
                },
              ]}
            >

              <FontAwesome
                name="apple"
                size={20}
                color="#ffffff"
              />

            </View>

          </View>

          {/* ================================================
              REGISTRO INFERIOR
              ================================================ */}

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