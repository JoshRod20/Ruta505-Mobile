// screens/auth/LoginScreen.js

import {
  useState,
} from "react";

import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  auth,
} from "../../services/firebase";

import {
  mapFirebaseError,
} from "../../utils/firebaseErrors";

import {
  EMAIL_REGEX,
} from "../../utils/validators";

import LoginScreenStyle
  from "../../styles/auth/LoginScreenStyle";

// ==================================================
// DIMENSIONES
// ==================================================

const { width: SCREEN_WIDTH } =
  Dimensions.get("window");

const CURVE_HEIGHT = 130;

// ==================================================
// COMPONENTE
// ==================================================

const LoginScreen = ({
  navigation,
}) => {
  const insets =
    useSafeAreaInsets();

  // ==================================================
  // ESTADOS
  // ==================================================

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    mostrarPassword,
    setMostrarPassword,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    feedback,
    setFeedback,
  ] = useState("");

  const [
    cargando,
    setCargando,
  ] = useState(false);

  const [
    enviandoRecuperacion,
    setEnviandoRecuperacion,
  ] = useState(false);

  const [
    tocado,
    setTocado,
  ] = useState({});

  // ==================================================
  // VALIDACIÓN
  // ==================================================

  const marcarTocado = (
    campo
  ) => {
    setTocado((prev) => ({
      ...prev,
      [campo]: true,
    }));
  };

  const emailVacio =
    tocado.email &&
    email.trim().length === 0;

  const emailFormatoInvalido =
    tocado.email &&
    email.trim().length > 0 &&
    !EMAIL_REGEX.test(
      email.trim()
    );

  const emailInvalido =
    emailVacio ||
    emailFormatoInvalido;

  const passwordInvalida =
    tocado.password &&
    password.length === 0;

  // ==================================================
  // VOLVER
  // ==================================================

  const handleVolver = () => {
    navigation.goBack();
  };

  // ==================================================
  // REGISTRO
  // ==================================================

  const handleIrARegistro = () => {
    navigation.navigate(
      "SeleccionarTipo"
    );
  };

  // ==================================================
  // RESET
  // ==================================================

  const resetFeedback = () => {
    setError("");
    setFeedback("");
  };

  // ==================================================
  // EMAIL
  // ==================================================

  const handleChangeEmail = (
    texto
  ) => {
    setEmail(texto);

    if (error) {
      setError("");
    }
  };

  // ==================================================
  // PASSWORD
  // ==================================================

  const handleChangePassword = (
    texto
  ) => {
    setPassword(texto);

    if (error) {
      setError("");
    }
  };

  // ==================================================
  // LOGIN
  // ==================================================

  const handleLogin =
    async () => {
      resetFeedback();

      const emailLimpio =
        email.trim();

      setTocado({
        email: true,
        password: true,
      });

      if (
        !emailLimpio ||
        !password
      ) {
        setError(
          "Completa tu correo y contraseña."
        );

        return;
      }

      if (
        !EMAIL_REGEX.test(
          emailLimpio
        )
      ) {
        setError(
          "Escribe un correo electrónico válido."
        );

        return;
      }

      setCargando(true);

      try {
        await signInWithEmailAndPassword(
          auth,
          emailLimpio,
          password
        );
      } catch (err) {
        setError(
          mapFirebaseError(
            err.code
          )
        );
      } finally {
        setCargando(false);
      }
    };

  // ==================================================
  // RECUPERAR CONTRASEÑA
  // ==================================================

  const handleForgotPassword =
    async () => {
      resetFeedback();

      const emailLimpio =
        email.trim();

      setTocado((prev) => ({
        ...prev,
        email: true,
      }));

      if (!emailLimpio) {
        setError(
          "Escribe tu correo para enviarte el enlace."
        );

        return;
      }

      if (
        !EMAIL_REGEX.test(
          emailLimpio
        )
      ) {
        setError(
          "Escribe un correo electrónico válido."
        );

        return;
      }

      if (
        enviandoRecuperacion
      ) {
        return;
      }

      setEnviandoRecuperacion(
        true
      );

      try {
        await sendPasswordResetEmail(
          auth,
          emailLimpio
        );
      } catch (err) {
        if (
          err.code !==
            "auth/invalid-email" &&
          err.code !==
            "auth/network-request-failed"
        ) {
          setFeedback(
            "Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña."
          );

          setEnviandoRecuperacion(
            false
          );

          return;
        }

        setError(
          mapFirebaseError(
            err.code
          )
        );

        setEnviandoRecuperacion(
          false
        );

        return;
      }

      setFeedback(
        "Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña."
      );

      setEnviandoRecuperacion(
        false
      );
    };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <View
      style={
        LoginScreenStyle
          .contenedor
      }
    >
      {/* ==================================================
          HEADER FIJO
          ================================================== */}

      <View
        style={
          LoginScreenStyle.header
        }
      >
        <ImageBackground
          source={require(
            "../../assets/images/PatronRuta505.png"
          )}
          style={
            LoginScreenStyle
              .headerPatron
          }
          resizeMode="cover"
        >
          <TouchableOpacity
            style={[
              LoginScreenStyle
                .botonVolver,

              {
                top:
                  insets.top + 10,
              },
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

        <Svg
          pointerEvents="none"
          style={
            LoginScreenStyle.curva
          }
          width={SCREEN_WIDTH}
          height={CURVE_HEIGHT}
          viewBox={
            `0 0 ${SCREEN_WIDTH} ${CURVE_HEIGHT}`
          }
        >
          <Path
            fill="#ffffff"
            d={`
              M0,${CURVE_HEIGHT * 0.99}

              C${SCREEN_WIDTH * 0.20},${CURVE_HEIGHT * 0.98}
               ${SCREEN_WIDTH * 0.38},${CURVE_HEIGHT * 0.85}
               ${SCREEN_WIDTH * 0.50},${CURVE_HEIGHT * 0.62}

              C${SCREEN_WIDTH * 0.62},${CURVE_HEIGHT * 0.40}
               ${SCREEN_WIDTH * 0.72},${CURVE_HEIGHT * 0.15}
               ${SCREEN_WIDTH * 0.85},${CURVE_HEIGHT * 0.06}

              C${SCREEN_WIDTH * 0.90},${CURVE_HEIGHT * 0.02}
               ${SCREEN_WIDTH * 0.95},0
               ${SCREEN_WIDTH},0

              L${SCREEN_WIDTH},${CURVE_HEIGHT}
              L0,${CURVE_HEIGHT}

              Z
            `}
          />
        </Svg>
      </View>

      {/* ==================================================
          KEYBOARD AVOIDING VIEW
          ================================================== */}

      <KeyboardAvoidingView
        style={[
          LoginScreenStyle.scroll,

          {
            flex: 1,
          },
        ]}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
        keyboardVerticalOffset={0}
        enabled
      >
        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={
            LoginScreenStyle.card
          }
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === "ios"
              ? "interactive"
              : "on-drag"
          }
          showsVerticalScrollIndicator={
            false
          }
          nestedScrollEnabled
        >
          {/* ==================================================
              TÍTULO
              ================================================== */}

          <Text
            style={
              LoginScreenStyle
                .titulo
            }
          >
            Iniciar Sesión
          </Text>

          <Text
            style={
              LoginScreenStyle
                .subtitulo
            }
          >
            Inicia sesión con tu
            cuenta de{" "}

            <Text
              style={
                LoginScreenStyle
                  .subtituloNegrita
              }
            >
              Ruta 505
            </Text>
          </Text>

          {/* ==================================================
              EMAIL
              ================================================== */}

          <TextInput
            style={[
              LoginScreenStyle.input,

              emailInvalido &&
                LoginScreenStyle
                  .inputInvalido,
            ]}
            placeholder="Nombre de usuario o correo"
            placeholderTextColor="#a8a8a8"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={
              handleChangeEmail
            }
            onBlur={() =>
              marcarTocado(
                "email"
              )
            }
          />

          {emailVacio ? (
            <Text
              style={
                LoginScreenStyle
                  .errorCampo
              }
            >
              El correo es obligatorio.
            </Text>
          ) : emailFormatoInvalido ? (
            <Text
              style={
                LoginScreenStyle
                  .errorCampo
              }
            >
              Escribe un correo
              electrónico válido.
            </Text>
          ) : null}

          {/* ==================================================
              PASSWORD
              ================================================== */}

          <View
            style={
              LoginScreenStyle
                .inputWrap
            }
          >
            <TextInput
              style={[
                LoginScreenStyle
                  .input,

                LoginScreenStyle
                  .inputPassword,

                passwordInvalida &&
                  LoginScreenStyle
                    .inputInvalido,
              ]}
              placeholder="Contraseña"
              placeholderTextColor="#a8a8a8"
              secureTextEntry={
                !mostrarPassword
              }
              value={password}
              onChangeText={
                handleChangePassword
              }
              onBlur={() =>
                marcarTocado(
                  "password"
                )
              }
            />

            <TouchableOpacity
              style={
                LoginScreenStyle
                  .iconoOjo
              }
              onPress={() =>
                setMostrarPassword(
                  (value) =>
                    !value
                )
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

          {passwordInvalida ? (
            <Text
              style={
                LoginScreenStyle
                  .errorCampo
              }
            >
              La contraseña es
              obligatoria.
            </Text>
          ) : null}

          {/* ==================================================
              RECUPERACIÓN
              ================================================== */}

          <TouchableOpacity
            style={
              LoginScreenStyle
                .enlaceWrap
            }
            onPress={
              handleForgotPassword
            }
            disabled={
              enviandoRecuperacion
            }
          >
            {enviandoRecuperacion ? (
              <ActivityIndicator
                color="#086338"
                size="small"
              />
            ) : (
              <Text
                style={
                  LoginScreenStyle
                    .enlace
                }
              >
                ¿Olvidaste tu
                contraseña?
              </Text>
            )}
          </TouchableOpacity>

          {/* ==================================================
              ERROR
              ================================================== */}

          {error ? (
            <Text
              style={
                LoginScreenStyle.error
              }
            >
              {error}
            </Text>
          ) : null}

          {/* ==================================================
              FEEDBACK
              ================================================== */}

          {feedback ? (
            <Text
              style={
                LoginScreenStyle.exito
              }
            >
              {feedback}
            </Text>
          ) : null}

          {/* ==================================================
              LOGIN
              ================================================== */}

          <TouchableOpacity
            style={[
              LoginScreenStyle.boton,

              cargando &&
                LoginScreenStyle
                  .botonDeshabilitado,
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
                style={
                  LoginScreenStyle
                    .botonTexto
                }
              >
                Iniciar Sesión
              </Text>
            )}
          </TouchableOpacity>

          {/* ==================================================
              REGISTRO
              ================================================== */}

          <TouchableOpacity
            style={
              LoginScreenStyle
                .registrarseWrap
            }
            onPress={
              handleIrARegistro
            }
          >
            <Text
              style={
                LoginScreenStyle
                  .registrarseTexto
              }
            >
              ¿No tienes cuenta?{" "}

              <Text
                style={
                  LoginScreenStyle
                    .registrarseEnlace
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