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

const RegistroGuiaScreen = ({ navigation }) => {
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
      nombreGuia: "",
      especialidadTematica: "",
      zonaCobertura: "",
      idiomasQueDomina: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = () => {
    registrar({
      role: ROLES.ACTOR_CULTURAL,
      actorType: ACTOR_TYPES.GUIA,
      estadoVerificacion: ESTADOS_VERIFICACION.PENDIENTE,
      nombreGuia: form.nombreGuia,
      especialidadTematica: form.especialidadTematica,
      zonaCobertura: form.zonaCobertura,
      idiomasQueDomina: form.idiomasQueDomina
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
    });
  };

  return (
    <ScrollView contentContainerStyle={RegistroFormStyle.contenedor}>
      <TouchableOpacity style={RegistroFormStyle.volver} onPress={() => navigation.goBack()}>
        <Text style={RegistroFormStyle.volverTexto}>← Volver</Text>
      </TouchableOpacity>

      <Text style={RegistroFormStyle.titulo}>Regístrate como Guía</Text>
      <Text style={RegistroFormStyle.subtitulo}>
        Comparte tus recorridos con los visitantes
      </Text>

      <TextInput
        style={RegistroFormStyle.input}
        placeholder="Nombre completo"
        placeholderTextColor="rgba(255,255,255,0.85)"
        value={form.nombreGuia}
        onChangeText={(texto) => handleChange("nombreGuia", texto)}
      />
      <TextInput
        style={RegistroFormStyle.input}
        placeholder="Especialidad temática (historia, naturaleza...)"
        placeholderTextColor="rgba(255,255,255,0.85)"
        value={form.especialidadTematica}
        onChangeText={(texto) => handleChange("especialidadTematica", texto)}
      />
      <TextInput
        style={RegistroFormStyle.input}
        placeholder="Zona de cobertura"
        placeholderTextColor="rgba(255,255,255,0.85)"
        value={form.zonaCobertura}
        onChangeText={(texto) => handleChange("zonaCobertura", texto)}
      />
      <TextInput
        style={RegistroFormStyle.input}
        placeholder="Idiomas que dominas (separados por coma)"
        placeholderTextColor="rgba(255,255,255,0.85)"
        value={form.idiomasQueDomina}
        onChangeText={(texto) => handleChange("idiomasQueDomina", texto)}
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

export default RegistroGuiaScreen;