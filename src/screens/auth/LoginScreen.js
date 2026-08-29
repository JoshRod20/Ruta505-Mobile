import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
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
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // No hace falta navegar manualmente: en cuanto Firebase confirma
      // la sesión, AuthContext actualiza isLoggedIn y RootNavigator
      // cambia solo de pantalla (a Home o a Pendiente de aprobación).
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
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err) {
      if (err.code !== "auth/invalid-email" && err.code !== "auth/network-request-failed") {
        setFeedback("Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña.");
        return;
      }
      setError(mapFirebaseError(err.code));
      return;
    }
    setFeedback("Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña.");
  };

  return (
    <KeyboardAvoidingView
      style={LoginScreenStyle.contenedor}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={LoginScreenStyle.titulo}>Bienvenid@ de vuelta</Text>
      <Text style={LoginScreenStyle.subtitulo}>
        Inicia sesión para continuar tu ruta cultural.
      </Text>

      <TextInput
        style={LoginScreenStyle.input}
        placeholder="Email"
        placeholderTextColor="rgba(255,255,255,0.85)"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <View style={LoginScreenStyle.inputWrap}>
        <TextInput
          style={[LoginScreenStyle.input, LoginScreenStyle.inputPassword]}
          placeholder="Contraseña"
          placeholderTextColor="rgba(255,255,255,0.85)"
          secureTextEntry={!mostrarPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={LoginScreenStyle.iconoOjo}
          onPress={() => setMostrarPassword((v) => !v)}
        >
          <Text style={LoginScreenStyle.iconoOjoTexto}>
            {mostrarPassword ? "🙈" : "👁"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={LoginScreenStyle.enlace}>Olvidé la contraseña</Text>
      </TouchableOpacity>

      {error ? <Text style={LoginScreenStyle.error}>{error}</Text> : null}
      {feedback ? <Text style={LoginScreenStyle.exito}>{feedback}</Text> : null}

      <TouchableOpacity
        style={[LoginScreenStyle.boton, cargando && LoginScreenStyle.botonDeshabilitado]}
        onPress={handleLogin}
        disabled={cargando}
      >
        {cargando ? (
          <ActivityIndicator color="#2b2b2b" />
        ) : (
          <Text style={LoginScreenStyle.botonTexto}>Iniciar sesión</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={LoginScreenStyle.registrarseWrap}
        onPress={() => navigation.navigate("SeleccionarTipo")}
      >
        <Text style={LoginScreenStyle.registrarseTexto}>
          ¿No tienes cuenta?{" "}
          <Text style={LoginScreenStyle.registrarseEnlace}>Regístrate</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;