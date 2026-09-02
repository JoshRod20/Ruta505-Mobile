import { useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { construirAssertionParaLogin } from "../../services/mfa";
import { mapFirebaseError } from "../../utils/firebaseErrors";

import VerificarCodigoScreenStyle from "../../styles/auth/VerificarCodigoScreenStyle";

const VerificarCodigoScreen = ({ route, navigation }) => {
  // Resolver proveniente de getMultiFactorResolver en LoginScreen.
  const { resolver } = route.params;

  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChangeCodigo = (texto) => {
    setCodigo(texto.replace(/[^0-9]/g, "").slice(0, 6));
    if (error) setError("");
  };

  const handleVerificar = async () => {
    setError("");

    if (codigo.length !== 6) {
      setError("Ingresa el código de 6 dígitos de tu app autenticadora.");
      return;
    }

    setCargando(true);

    try {
      const assertion = construirAssertionParaLogin(resolver, codigo);
      await resolver.resolveSignIn(assertion);
      // Al resolverse, onAuthStateChanged maneja la navegación automáticamente.
    } catch (err) {
      setError(
        err.code === "auth/invalid-verification-code"
          ? "El código es incorrecto o ya expiró."
          : mapFirebaseError(err.code)
      );
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={VerificarCodigoScreenStyle.contenedor}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={VerificarCodigoScreenStyle.card}>
        <Text style={VerificarCodigoScreenStyle.titulo}>
          Verificación en dos pasos
        </Text>

        <Text style={VerificarCodigoScreenStyle.subtitulo}>
          Abre tu app autenticadora e ingresa el código de 6 dígitos para
          esta cuenta.
        </Text>

        <TextInput
          style={VerificarCodigoScreenStyle.input}
          placeholder="000000"
          placeholderTextColor="#a8a8a8"
          keyboardType="number-pad"
          maxLength={6}
          value={codigo}
          onChangeText={handleChangeCodigo}
          autoFocus
        />

        {error ? (
          <Text style={VerificarCodigoScreenStyle.error}>{error}</Text>
        ) : null}

        <TouchableOpacity
          style={[
            VerificarCodigoScreenStyle.boton,
            cargando && VerificarCodigoScreenStyle.botonDeshabilitado,
          ]}
          onPress={handleVerificar}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={VerificarCodigoScreenStyle.botonTexto}>
              Verificar
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={VerificarCodigoScreenStyle.enlaceWrap}
          onPress={() => navigation.goBack()}
          disabled={cargando}
        >
          <Text style={VerificarCodigoScreenStyle.enlace}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default VerificarCodigoScreen;