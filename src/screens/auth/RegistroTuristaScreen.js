import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRegistroForm } from "../../hooks/useRegistroForm";
import { ROLES } from "../../constants/roles";
import RegistroFormStyle from "../../styles/auth/RegistroFormStyle";

const PAISES = [
  { valor: "Nicaragua", etiqueta: "Nicaragua (nacional)" },
  { valor: "Otro", etiqueta: "Otro país (extranjero)" },
];

const IDIOMAS = ["Español", "English", "Otro"];

const RegistroTuristaScreen = ({ navigation }) => {
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
      nombreCompleto: "",
      email: "",
      password: "",
      confirmPassword: "",
      paisOrigen: "Nicaragua",
      idiomaPreferido: "Español",
    },
  });

  const handleSubmit = () => {
    registrar({
      role: ROLES.TURISTA,
      nombreCompleto: form.nombreCompleto,
      tipoTurista: form.paisOrigen === "Nicaragua" ? "nacional" : "extranjero",
      paisOrigen: form.paisOrigen,
      idiomaPreferido: form.idiomaPreferido,
    });
  };

  return (
    <ScrollView contentContainerStyle={RegistroFormStyle.contenedor}>
      <TouchableOpacity style={RegistroFormStyle.volver} onPress={() => navigation.goBack()}>
        <Text style={RegistroFormStyle.volverTexto}>← Volver</Text>
      </TouchableOpacity>

      <Text style={RegistroFormStyle.titulo}>Regístrate como Turista</Text>
      <Text style={RegistroFormStyle.subtitulo}>
        Descubre experiencias culturales junto a Pinolito
      </Text>

      <TextInput
        style={RegistroFormStyle.input}
        placeholder="Nombre completo"
        placeholderTextColor="rgba(255,255,255,0.85)"
        value={form.nombreCompleto}
        onChangeText={(texto) => handleChange("nombreCompleto", texto)}
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

      <View style={RegistroFormStyle.opcionesFila}>
        {PAISES.map((pais) => (
          <TouchableOpacity
            key={pais.valor}
            style={[
              RegistroFormStyle.opcionBoton,
              form.paisOrigen === pais.valor && RegistroFormStyle.opcionBotonActiva,
            ]}
            onPress={() => handleChange("paisOrigen", pais.valor)}
          >
            <Text
              style={[
                RegistroFormStyle.opcionTexto,
                form.paisOrigen === pais.valor && RegistroFormStyle.opcionTextoActivo,
              ]}
            >
              {pais.etiqueta}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={RegistroFormStyle.opcionesFila}>
        {IDIOMAS.map((idioma) => (
          <TouchableOpacity
            key={idioma}
            style={[
              RegistroFormStyle.opcionBoton,
              form.idiomaPreferido === idioma && RegistroFormStyle.opcionBotonActiva,
            ]}
            onPress={() => handleChange("idiomaPreferido", idioma)}
          >
            <Text
              style={[
                RegistroFormStyle.opcionTexto,
                form.idiomaPreferido === idioma && RegistroFormStyle.opcionTextoActivo,
              ]}
            >
              {idioma}
            </Text>
          </TouchableOpacity>
        ))}
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

export default RegistroTuristaScreen;