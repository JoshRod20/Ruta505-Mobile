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

const RegistroComunidadScreen = ({ navigation }) => {
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
      nombreComunidad: "",
      descripcion: "",
      ubicacion: "",
      telefonoContacto: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = () => {
    registrar({
      role: ROLES.ACTOR_CULTURAL,
      actorType: ACTOR_TYPES.COMUNIDAD,
      estadoVerificacion: ESTADOS_VERIFICACION.PENDIENTE,
      nombreComunidad: form.nombreComunidad,
      descripcion: form.descripcion,
      ubicacion: form.ubicacion,
      telefonoContacto: form.telefonoContacto,
    });
  };

  return (
    <ScrollView contentContainerStyle={RegistroFormStyle.contenedor}>
      <TouchableOpacity style={RegistroFormStyle.volver} onPress={() => navigation.goBack()}>
        <Text style={RegistroFormStyle.volverTexto}>← Volver</Text>
      </TouchableOpacity>

      <Text style={RegistroFormStyle.titulo}>Registra tu Comunidad</Text>
      <Text style={RegistroFormStyle.subtitulo}>
        Comparte tus experiencias culturales con los turistas
      </Text>

      <TextInput
        style={RegistroFormStyle.input}
        placeholder="Nombre de la comunidad"
        placeholderTextColor="rgba(255,255,255,0.85)"
        value={form.nombreComunidad}
        onChangeText={(texto) => handleChange("nombreComunidad", texto)}
      />
      <TextInput
        style={RegistroFormStyle.textarea}
        placeholder="Descripción de la comunidad"
        placeholderTextColor="rgba(255,255,255,0.85)"
        multiline
        value={form.descripcion}
        onChangeText={(texto) => handleChange("descripcion", texto)}
      />
      <TextInput
        style={RegistroFormStyle.input}
        placeholder="Ubicación (departamento/municipio)"
        placeholderTextColor="rgba(255,255,255,0.85)"
        value={form.ubicacion}
        onChangeText={(texto) => handleChange("ubicacion", texto)}
      />
      <TextInput
        style={RegistroFormStyle.input}
        placeholder="Teléfono de contacto"
        placeholderTextColor="rgba(255,255,255,0.85)"
        keyboardType="phone-pad"
        value={form.telefonoContacto}
        onChangeText={(texto) => handleChange("telefonoContacto", texto)}
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

export default RegistroComunidadScreen;