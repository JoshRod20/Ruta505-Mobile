/**botonvolver
 * LoginScreen: componente/pantalla de la aplicación Ruta505.
 */

// screens/auth/LoginScreen.js

import { useState } from "react";

import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import { padLateralTablet } from "../../utils/layout";

import {
  getMultiFactorResolver,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../../services/firebase";

import { mapFirebaseError } from "../../utils/firebaseErrors";

import { EMAIL_REGEX } from "../../utils/validators";

import LoginScreenStyle from "../../styles/auth/LoginScreenStyle";

// ==================================================
// DIMENSIONES
// ==================================================


const CURVE_HEIGHT = 130;

// ==================================================
// COMPONENTE
// ==================================================

const LoginScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  // ==================================================
  // ESTADOS
  // ==================================================

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [error, setError] = useState("");

  const [feedback, setFeedback] = useState("");

  const [cargando, setCargando] = useState(false);

  const [enviandoRecuperacion, setEnviandoRecuperacion] = useState(false);

  const [tocado, setTocado] = useState({});

  // ==================================================
  // VALIDACIÓN
  // ==================================================

  const marcarTocado = (campo) => {
    setTocado((prev) => ({
      ...prev,
      [campo]: true,
    }));
  };

  const emailVacio = tocado.email && email.trim().length === 0;

  const emailFormatoInvalido =
    tocado.email && email.trim().length > 0 && !EMAIL_REGEX.test(email.trim());

  const emailInvalido = emailVacio || emailFormatoInvalido;

  const passwordInvalida = tocado.password && password.length === 0;

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
    navigation.navigate("SeleccionarTipo");
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

  const handleChangeEmail = (texto) => {
    setEmail(texto);

    if (error) {
      setError("");
    }
  };

  // ==================================================
  // PASSWORD
  // ==================================================

  const handleChangePassword = (texto) => {
    setPassword(texto);

    if (error) {
      setError("");
    }
  };

  // ==================================================
  // LOGIN
  // ==================================================

  const handleLogin = async () => {
    resetFeedback();

    const emailLimpio = email.trim();

    setTocado({
      email: true,
      password: true,
    });

    if (!emailLimpio || !password) {
      setError("Completa tu correo y contraseña.");

      return;
    }

    if (!EMAIL_REGEX.test(emailLimpio)) {
      setError("Escribe un correo electrónico válido.");

      return;
    }

    setCargando(true);

    try {
      auth.languageCode = "es";
      await signInWithEmailAndPassword(auth, emailLimpio, password);
    } catch (err) {
      // La contraseña ya fue validada; falta el código de la
      // app autenticadora (2FA) para completar el login.
      if (err.code === "auth/multi-factor-auth-required") {
        const resolver = getMultiFactorResolver(auth, err);

        navigation.navigate("VerificarCodigo", { resolver });

        return;
      }

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

    const emailLimpio = email.trim();

    setTocado((prev) => ({
      ...prev,
      email: true,
    }));

    if (!emailLimpio) {
      setError("Escribe tu correo para enviarte el enlace.");

      return;
    }

    if (!EMAIL_REGEX.test(emailLimpio)) {
      setError("Escribe un correo electrónico válido.");

      return;
    }

    if (enviandoRecuperacion) {
      return;
    }

    setEnviandoRecuperacion(true);

    auth.languageCode = "es";

    try {
      await sendPasswordResetEmail(auth, emailLimpio);
    } catch (err) {
      if (
        err.code !== "auth/invalid-email" &&
        err.code !== "auth/network-request-failed"
      ) {
        setFeedback(
          "Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña. Revisa también tu carpeta de spam.",
        );

        setEnviandoRecuperacion(false);

        return;
      }

      setError(mapFirebaseError(err.code));

      setEnviandoRecuperacion(false);

      return;
    }

    setFeedback(
      "Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña. Revisa también tu carpeta de spam.",
    );

    setEnviandoRecuperacion(false);
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <View style={LoginScreenStyle.contenedor}>
      {/* ==================================================
          HEADER FIJO
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

              {
                top: insets.top + 10,
              },
            ]}
            onPress={handleVolver}
            activeOpacity={0.7}
          >
            <Image
              source={require("../../assets/icons/volver.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </ImageBackground>

        <Svg
          pointerEvents="none"
          style={LoginScreenStyle.curva}
          width={SCREEN_WIDTH}
          height={CURVE_HEIGHT}
          viewBox={`0 0 ${SCREEN_WIDTH} ${CURVE_HEIGHT}`}
        >
          <Path
            fill="#ffffff"
            d={`
              M0,${CURVE_HEIGHT * 0.99}

              C${SCREEN_WIDTH * 0.2},${CURVE_HEIGHT * 0.98}
               ${SCREEN_WIDTH * 0.38},${CURVE_HEIGHT * 0.85}
               ${SCREEN_WIDTH * 0.5},${CURVE_HEIGHT * 0.62}

              C${SCREEN_WIDTH * 0.62},${CURVE_HEIGHT * 0.4}
               ${SCREEN_WIDTH * 0.72},${CURVE_HEIGHT * 0.15}
               ${SCREEN_WIDTH * 0.85},${CURVE_HEIGHT * 0.06}

              C${SCREEN_WIDTH * 0.9},${CURVE_HEIGHT * 0.02}
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
        enabled
      >
        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={[
            LoginScreenStyle.card,
            { paddingBottom: 34 + insets.bottom },
            padLateralTablet(SCREEN_WIDTH),
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === "ios" ? "interactive" : "on-drag"
          }
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {/* ==================================================
              TÍTULO
              ================================================== */}

          <Text style={LoginScreenStyle.titulo}>Iniciar Sesión</Text>

          <Text style={LoginScreenStyle.subtitulo}>
            Inicia sesión con tu cuenta de{" "}
            <Text style={LoginScreenStyle.subtituloNegrita}>Ruta 505</Text>
          </Text>

          {/* ==================================================
              EMAIL
              ================================================== */}

          <TextInput
            style={[
              LoginScreenStyle.input,

              emailInvalido && LoginScreenStyle.inputInvalido,
            ]}
            placeholder="Nombre de usuario o correo"
            placeholderTextColor="#000000"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={handleChangeEmail}
            onBlur={() => marcarTocado("email")}
          />

          {emailVacio ? (
            <Text style={LoginScreenStyle.errorCampo}>
              El correo es obligatorio.
            </Text>
          ) : emailFormatoInvalido ? (
            <Text style={LoginScreenStyle.errorCampo}>
              Escribe un correo electrónico válido.
            </Text>
          ) : null}

          {/* ==================================================
              PASSWORD
              ================================================== */}

          <View style={LoginScreenStyle.inputWrap}>
            <TextInput
              style={[
                LoginScreenStyle.input,

                LoginScreenStyle.inputPassword,

                passwordInvalida && LoginScreenStyle.inputInvalido,
              ]}
              placeholder="Contraseña"
              placeholderTextColor="#000000"
              secureTextEntry={!mostrarPassword}
              value={password}
              onChangeText={handleChangePassword}
              onBlur={() => marcarTocado("password")}
            />

            <TouchableOpacity
              style={LoginScreenStyle.iconoOjo}
              onPress={() => setMostrarPassword((value) => !value)}
              activeOpacity={0.7}
            >
              <Image
                source={
                  mostrarPassword
                    ? require("../../assets/icons/ojo.png")
                    : require("../../assets/icons/ojo.png")
                }
                style={{ width: 22, height: 22 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {passwordInvalida ? (
            <Text style={LoginScreenStyle.errorCampo}>
              La contraseña es obligatoria.
            </Text>
          ) : null}

          {/* ==================================================
              RECUPERACIÓN
              ================================================== */}

          <TouchableOpacity
            style={LoginScreenStyle.enlaceWrap}
            onPress={handleForgotPassword}
            disabled={enviandoRecuperacion}
          >
            {enviandoRecuperacion ? (
              <ActivityIndicator color="#086338" size="small" />
            ) : (
              <Text style={LoginScreenStyle.enlace}>
                ¿Olvidaste tu contraseña?
              </Text>
            )}
          </TouchableOpacity>

          {/* ==================================================
              ERROR
              ================================================== */}

          {error ? <Text style={LoginScreenStyle.error}>{error}</Text> : null}

          {/* ==================================================
              FEEDBACK
              ================================================== */}

          {feedback ? (
            <Text style={LoginScreenStyle.exito}>{feedback}</Text>
          ) : null}

          {/* ==================================================
              LOGIN
              ================================================== */}

          <TouchableOpacity
            style={[
              LoginScreenStyle.boton,

              cargando && LoginScreenStyle.botonDeshabilitado,
            ]}
            onPress={handleLogin}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={LoginScreenStyle.botonTexto}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          {/* ==================================================
              REGISTRO
              ================================================== */}

          <TouchableOpacity
            style={LoginScreenStyle.registrarseWrap}
            onPress={handleIrARegistro}
          >
            <Text style={LoginScreenStyle.registrarseTexto}>
              ¿No tienes cuenta?{" "}
              <Text style={LoginScreenStyle.registrarseEnlace}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
