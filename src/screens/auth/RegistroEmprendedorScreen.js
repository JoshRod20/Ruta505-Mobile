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

const TIPOS_OFERTA = [
  { valor: "evento", etiqueta: "Evento cultural" },
  { valor: "temporal", etiqueta: "Experiencia temporal" },
  { valor: "permanente", etiqueta: "Experiencia permanente" },
];

const RegistroEmprendedorScreen = ({ navigation }) => {
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
      nombreEmprendimiento: "",
      tipoOferta: "evento",
      descripcion: "",
      ubicacion: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = () => {
    registrar({
      role: ROLES.ACTOR_CULTURAL,
      actorType: ACTOR_TYPES.EMPRENDEDOR,
      estadoVerificacion: ESTADOS_VERIFICACION.PENDIENTE,
      nombreEmprendimiento: form.nombreEmprendimiento,
      tipoOferta: form.tipoOferta,
      descripcion: form.descripcion,
      ubicacion: form.ubicacion,
    });
  };

  return (
    <ScrollView contentContainerStyle={RegistroFormStyle.contenedor}>
      <TouchableOpacity style={RegistroFormStyle.volver} onPress={() => navigation.goBack()}>
        <Text style={RegistroFormStyle.volverTexto}>← Volver</Text>
      </TouchableOpacity>

      <Text style={RegistroFormStyle.titulo}>Regístrate como Emprendedor Cultural</Text>
      <Text style={RegistroFormStyle.subtitulo}>
        Publica tus eventos y experiencias culturales
      </Text>

      <TextInput
        style={RegistroFormStyle.input}
        placeholder="Nombre del emprendimiento"
        placeholderTextColor="rgba(255,255,255,0.85)"
        value={form.nombreEmprendimiento}
        onChangeText={(texto) => handleChange("nombreEmprendimiento", texto)}
      />

      <View style={RegistroFormStyle.opcionesFila}>
        {TIPOS_OFERTA.map((tipo) => (
          <TouchableOpacity
            key={tipo.valor}
            style={[
              RegistroFormStyle.opcionBoton,
              form.tipoOferta === tipo.valor && RegistroFormStyle.opcionBotonActiva,
            ]}
            onPress={() => handleChange("tipoOferta", tipo.valor)}
          >
            <Text
              style={[
                RegistroFormStyle.opcionTexto,
                form.tipoOferta === tipo.valor && RegistroFormStyle.opcionTextoActivo,
              ]}
            >
              {tipo.etiqueta}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={RegistroFormStyle.textarea}
        placeholder="Descripción de tu propuesta"
        placeholderTextColor="rgba(255,255,255,0.85)"
        multiline
        value={form.descripcion}
        onChangeText={(texto) => handleChange("descripcion", texto)}
      />
      <TextInput
        style={RegistroFormStyle.input}
        placeholder="Ubicación"
        placeholderTextColor="rgba(255,255,255,0.85)"
        value={form.ubicacion}
        onChangeText={(texto) => handleChange("ubicacion", texto)}
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

export default RegistroEmprendedorScreen;