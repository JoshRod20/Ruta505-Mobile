import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRegistroForm } from "../../hooks/useRegistroForm";
import { ROLES, ACTOR_TYPES, ESTADOS_VERIFICACION } from "../../constants/roles";
import RegistroFormStyle from "../../styles/auth/RegistroFormStyle";

const RegistroArtesanoScreen = ({ navigation }) => {
  const {
    form,
    handleChange,
    mostrarPassword,
    setMostrarPassword,
    mostrarConfirmPassword,
    setMostrarConfirmPassword,
    error,
    cargando,
    registrar,
  } = useRegistroForm({
    initialValues: {
      nombreArtesano: "",
      especialidad: "",
      historiaBreve: "",
      ubicacionTaller: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = () => {
    registrar({
      role: ROLES.ACTOR_CULTURAL,
      actorType: ACTOR_TYPES.ARTESANO,
      estadoVerificacion: ESTADOS_VERIFICACION.PENDIENTE,
      nombreArtesano: form.nombreArtesano,
      especialidad: form.especialidad,
      historiaBreve: form.historiaBreve,
      ubicacionTaller: form.ubicacionTaller,
    });
  };

  return (
    <ScrollView contentContainerStyle={RegistroFormStyle.contenedor}>
      <TouchableOpacity style={RegistroFormStyle.volver} onPress={() => navigation.goBack()}>
        <Text style={RegistroFormStyle.volverTexto}>← Volver</Text>
      </TouchableOpacity>

      <Text style={RegistroFormStyle.titulo}>Regístrate como Artesano</Text>
      <Text style={RegistroFormStyle.subtitulo}>
        Muestra tu oficio y tu catálogo a los turistas
      </Text>

      <TextInput
        style={RegistroFormStyle.input}
        placeholder="Nombre del artesano u oficio"
        placeholderTextColor="rgba(255,255,255,0.85)"
        value={form.nombreArtesano}
        onChangeText={(texto) => handleChange("nombreArtesano", texto)}
      />
      <TextInput
        style={RegistroFormStyle.input}
        placeholder="Especialidad (cerámica, textiles, madera...)"
        placeholderTextColor="rgba(255,255,255,0.85)"
        value={form.especialidad}
        onChangeText={(texto) => handleChange("especialidad", texto)}
      />
      <TextInput
        style={RegistroFormStyle.textarea}
        placeholder="Historia breve de tu oficio"
        placeholderTextColor="rgba(255,255,255,0.85)"
        multiline
        value={form.historiaBreve}
        onChangeText={(texto) => handleChange("historiaBreve", texto)}
      />
      <TextInput
        style={RegistroFormStyle.input}
        placeholder="Ubicación del taller o punto de venta"
        placeholderTextColor="rgba(255,255,255,0.85)"
        value={form.ubicacionTaller}
        onChangeText={(texto) => handleChange("ubicacionTaller", texto)}
      />
      <TextInput
        style={RegistroFormStyle.input}
        placeholder="Email"
        placeholderTextColor="rgba(255,255,255,0.85)"
        autoCapitalize="none"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(texto) => handleChange("email", texto)}
      />

      <View style={RegistroFormStyle.inputWrap}>
        <TextInput
          style={[RegistroFormStyle.input, RegistroFormStyle.inputPassword]}
          placeholder="Contraseña"
          placeholderTextColor="rgba(255,255,255,0.85)"
          secureTextEntry={!mostrarPassword}
          value={form.password}
          onChangeText={(texto) => handleChange("password", texto)}
        />
        <TouchableOpacity
          style={RegistroFormStyle.iconoOjo}
          onPress={() => setMostrarPassword((v) => !v)}
        >
          <Text style={RegistroFormStyle.iconoOjoTexto}>{mostrarPassword ? "🙈" : "👁"}</Text>
        </TouchableOpacity>
      </View>

      <View style={RegistroFormStyle.inputWrap}>
        <TextInput
          style={[RegistroFormStyle.input, RegistroFormStyle.inputPassword]}
          placeholder="Confirmar contraseña"
          placeholderTextColor="rgba(255,255,255,0.85)"
          secureTextEntry={!mostrarConfirmPassword}
          value={form.confirmPassword}
          onChangeText={(texto) => handleChange("confirmPassword", texto)}
        />
        <TouchableOpacity
          style={RegistroFormStyle.iconoOjo}
          onPress={() => setMostrarConfirmPassword((v) => !v)}
        >
          <Text style={RegistroFormStyle.iconoOjoTexto}>
            {mostrarConfirmPassword ? "🙈" : "👁"}
          </Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={RegistroFormStyle.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[RegistroFormStyle.boton, cargando && RegistroFormStyle.botonDeshabilitado]}
        onPress={handleSubmit}
        disabled={cargando}
      >
        {cargando ? (
          <ActivityIndicator color="#2b2b2b" />
        ) : (
          <Text style={RegistroFormStyle.botonTexto}>Registrarse</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegistroArtesanoScreen;