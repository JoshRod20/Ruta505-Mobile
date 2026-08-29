import { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ImageBackground,
  Dimensions,
  Modal,
  FlatList,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useRegistroForm } from "../../hooks/useRegistroForm";
import { ROLES } from "../../constants/roles";
import RegistroTuristaScreenStyle from "../../styles/auth/RegistroFormStyle";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CURVE_HEIGHT = 130;

const curvaPath = (w) => `
  M0,${CURVE_HEIGHT * 0.99}
  C${w * 0.20},${CURVE_HEIGHT * 0.98} ${w * 0.38},${CURVE_HEIGHT * 0.85} ${w * 0.50},${CURVE_HEIGHT * 0.62}
  C${w * 0.62},${CURVE_HEIGHT * 0.40} ${w * 0.72},${CURVE_HEIGHT * 0.15} ${w * 0.85},${CURVE_HEIGHT * 0.06}
  C${w * 0.90},${CURVE_HEIGHT * 0.02} ${w * 0.95},0 ${w},0
  L${w},${CURVE_HEIGHT}
  L0,${CURVE_HEIGHT}
  Z
`;

// ==================================================
// LISTA DE IDIOMAS
// ==================================================
const IDIOMAS = [
  "Español",
  "English",
  "Français",
  "Português",
  "Deutsch",
  "Italiano",
  "中文",
  "日本語",
  "한국어",
  "Русский",
  "العربية",
  "Otro",
];

// ==================================================
// LISTA DE PAÍSES
// ==================================================
const PAISES = [
  "Nicaragua",
  "Costa Rica",
  "Honduras",
  "El Salvador",
  "Guatemala",
  "Panamá",
  "Belice",
  "México",
  "Estados Unidos",
  "Canadá",
  "Colombia",
  "Venezuela",
  "Ecuador",
  "Perú",
  "Bolivia",
  "Chile",
  "Argentina",
  "Uruguay",
  "Paraguay",
  "Brasil",
  "España",
  "Francia",
  "Alemania",
  "Italia",
  "Portugal",
  "Reino Unido",
  "Países Bajos",
  "Suiza",
  "China",
  "Japón",
  "Corea del Sur",
  "India",
  "Australia",
  "Otro país",
];

const RegistroTuristaScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const {
    form,
    handleChange,
    mostrarPassword,
    setMostrarPassword,
    mostrarConfirmPassword,
    setMostrarConfirmPassword,
    error,
    validarCredenciales,
  } = useRegistroForm({
    initialValues: {
      nombreCompleto: "",
      email: "",
      telefono: "",
      password: "",
      confirmPassword: "",
      edad: "",
      paisOrigen: "",
      idiomaPreferido: "",
    },
  });

  const [modalIdiomaVisible, setModalIdiomaVisible] = useState(false);
  const [modalPaisVisible, setModalPaisVisible] = useState(false);

  const [busquedaIdioma, setBusquedaIdioma] = useState("");
  const [busquedaPais, setBusquedaPais] = useState("");

  const idiomasFiltrados = useMemo(() => {
    if (!busquedaIdioma.trim()) return IDIOMAS;

    return IDIOMAS.filter((idioma) =>
      idioma.toLowerCase().includes(busquedaIdioma.trim().toLowerCase())
    );
  }, [busquedaIdioma]);

  const paisesFiltrados = useMemo(() => {
    if (!busquedaPais.trim()) return PAISES;

    return PAISES.filter((pais) =>
      pais.toLowerCase().includes(busquedaPais.trim().toLowerCase())
    );
  }, [busquedaPais]);

  const handleVolver = () => {
    navigation.goBack();
  };

  const handleCerrarModalIdioma = () => {
    setModalIdiomaVisible(false);
    setBusquedaIdioma("");
  };

  const handleCerrarModalPais = () => {
    setModalPaisVisible(false);
    setBusquedaPais("");
  };

  const handleSeleccionarIdioma = (idioma) => {
    handleChange("idiomaPreferido", idioma);
    handleCerrarModalIdioma();
  };

  const handleSeleccionarPais = (pais) => {
    handleChange("paisOrigen", pais);
    handleCerrarModalPais();
  };

  // ==================================================
  // ENVIAR FORMULARIO
  // ==================================================
  //
  // No crea la cuenta todavía: valida credenciales y navega
  // a SeleccionarIntereses, arrastrando los datos del perfil
  // (incluyendo el role) para armar el registro completo al
  // final del flujo (Intereses -> Ubicación -> Firebase).
  //
  const handleSubmit = () => {
    if (!validarCredenciales()) return;

    navigation.navigate("SeleccionarIntereses", {
      datosRegistro: {
        role: ROLES.TURISTA,
        nombreCompleto: form.nombreCompleto,
        email: form.email.trim(),
        password: form.password,
        telefono: form.telefono,
        edad: form.edad,
        tipoTurista: form.paisOrigen === "Nicaragua" ? "nacional" : "extranjero",
        paisOrigen: form.paisOrigen,
        idiomaPreferido: form.idiomaPreferido,
      },
    });
  };

  return (
    <View style={RegistroTuristaScreenStyle.contenedor}>

      {/* ==================================================
          HEADER CON PATRÓN + CURVA
          ================================================== */}

      <View style={RegistroTuristaScreenStyle.header}>

        <ImageBackground
          source={require("../../assets/images/Patron-2.png")}
          style={RegistroTuristaScreenStyle.headerPatron}
          resizeMode="cover"
        >

          <TouchableOpacity
            style={[
              RegistroTuristaScreenStyle.botonVolver,
              { top: insets.top + 10 },
            ]}
            onPress={handleVolver}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#2b2b2b" />
          </TouchableOpacity>

        </ImageBackground>

        <Svg
          pointerEvents="none"
          style={RegistroTuristaScreenStyle.curva}
          width={SCREEN_WIDTH}
          height={CURVE_HEIGHT}
          viewBox={`0 0 ${SCREEN_WIDTH} ${CURVE_HEIGHT}`}
        >
          <Path fill="#ffffff" d={curvaPath(SCREEN_WIDTH)} />
        </Svg>

      </View>

      {/* ==================================================
          FORMULARIO
          ================================================== */}

      <KeyboardAvoidingView
        style={RegistroTuristaScreenStyle.scroll}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >

        <ScrollView
          contentContainerStyle={RegistroTuristaScreenStyle.card}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          <Text style={RegistroTuristaScreenStyle.titulo}>
            DATOS GENERALES
          </Text>

          <TextInput
            style={RegistroTuristaScreenStyle.input}
            placeholder="Nombre completo"
            placeholderTextColor="#a8a8a8"
            value={form.nombreCompleto}
            onChangeText={(texto) => handleChange("nombreCompleto", texto)}
          />

          <TextInput
            style={RegistroTuristaScreenStyle.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#a8a8a8"
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(texto) => handleChange("email", texto)}
          />

          <TextInput
            style={RegistroTuristaScreenStyle.input}
            placeholder="Teléfono"
            placeholderTextColor="#a8a8a8"
            keyboardType="phone-pad"
            value={form.telefono}
            onChangeText={(texto) => handleChange("telefono", texto)}
          />

          <View style={RegistroTuristaScreenStyle.inputWrap}>
            <TextInput
              style={[
                RegistroTuristaScreenStyle.input,
                RegistroTuristaScreenStyle.inputPassword,
              ]}
              placeholder="Contraseña"
              placeholderTextColor="#a8a8a8"
              secureTextEntry={!mostrarPassword}
              value={form.password}
              onChangeText={(texto) => handleChange("password", texto)}
            />
            <TouchableOpacity
              style={RegistroTuristaScreenStyle.iconoOjo}
              onPress={() => setMostrarPassword((v) => !v)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={mostrarPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#086338"
              />
            </TouchableOpacity>
          </View>

          <View style={RegistroTuristaScreenStyle.inputWrap}>
            <TextInput
              style={[
                RegistroTuristaScreenStyle.input,
                RegistroTuristaScreenStyle.inputPassword,
              ]}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#a8a8a8"
              secureTextEntry={!mostrarConfirmPassword}
              value={form.confirmPassword}
              onChangeText={(texto) => handleChange("confirmPassword", texto)}
            />
            <TouchableOpacity
              style={RegistroTuristaScreenStyle.iconoOjo}
              onPress={() => setMostrarConfirmPassword((v) => !v)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={mostrarConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#086338"
              />
            </TouchableOpacity>
          </View>

          <TextInput
            style={RegistroTuristaScreenStyle.input}
            placeholder="Edad"
            placeholderTextColor="#a8a8a8"
            keyboardType="number-pad"
            value={form.edad}
            onChangeText={(texto) => handleChange("edad", texto)}
          />

          {/* Selectores Idioma / País */}
          <View style={RegistroTuristaScreenStyle.selectoresFila}>

            <TouchableOpacity
              style={RegistroTuristaScreenStyle.selectorBoton}
              onPress={() => setModalIdiomaVisible(true)}
              activeOpacity={0.8}
            >
              <Text
                style={RegistroTuristaScreenStyle.selectorTexto}
                numberOfLines={1}
              >
                {form.idiomaPreferido || "Idioma"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={RegistroTuristaScreenStyle.selectorBoton}
              onPress={() => setModalPaisVisible(true)}
              activeOpacity={0.8}
            >
              <Text
                style={RegistroTuristaScreenStyle.selectorTexto}
                numberOfLines={1}
              >
                {form.paisOrigen || "País"}
              </Text>
            </TouchableOpacity>

          </View>

          {error ? (
            <Text style={RegistroTuristaScreenStyle.error}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={RegistroTuristaScreenStyle.boton}
            onPress={handleSubmit}
          >
            <Text style={RegistroTuristaScreenStyle.botonTexto}>
              Registrarse
            </Text>
          </TouchableOpacity>

        </ScrollView>

      </KeyboardAvoidingView>

      {/* ==================================================
          MODAL — SELECCIONAR IDIOMA
          ================================================== */}

      <Modal
        visible={modalIdiomaVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCerrarModalIdioma}
      >
        <KeyboardAvoidingView
          style={RegistroTuristaScreenStyle.modalFondo}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >

          <TouchableOpacity
            style={RegistroTuristaScreenStyle.modalFondoTouch}
            activeOpacity={1}
            onPress={handleCerrarModalIdioma}
          />

          <View style={RegistroTuristaScreenStyle.modalCaja}>

            <Text style={RegistroTuristaScreenStyle.modalTitulo}>
              Selecciona tu idioma
            </Text>

            <View style={RegistroTuristaScreenStyle.modalBusquedaWrap}>
              <Ionicons
                name="search-outline"
                size={18}
                color="#8a8a8a"
                style={RegistroTuristaScreenStyle.modalBusquedaIcono}
              />
              <TextInput
                style={RegistroTuristaScreenStyle.modalBusquedaInput}
                placeholder="Buscar idioma..."
                placeholderTextColor="#a8a8a8"
                value={busquedaIdioma}
                onChangeText={setBusquedaIdioma}
                autoFocus
              />
            </View>

            <FlatList
              data={idiomasFiltrados}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              style={RegistroTuristaScreenStyle.modalLista}
              ListEmptyComponent={
                <Text style={RegistroTuristaScreenStyle.modalVacioTexto}>
                  No se encontraron idiomas.
                </Text>
              }
              renderItem={({ item }) => {
                const activo = form.idiomaPreferido === item;
                return (
                  <TouchableOpacity
                    style={[
                      RegistroTuristaScreenStyle.modalOpcion,
                      activo && RegistroTuristaScreenStyle.modalOpcionActiva,
                    ]}
                    onPress={() => handleSeleccionarIdioma(item)}
                  >
                    <Text
                      style={[
                        RegistroTuristaScreenStyle.modalOpcionTexto,
                        activo &&
                          RegistroTuristaScreenStyle.modalOpcionTextoActivo,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />

          </View>

        </KeyboardAvoidingView>
      </Modal>

      {/* ==================================================
          MODAL — SELECCIONAR PAÍS
          ================================================== */}

      <Modal
        visible={modalPaisVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCerrarModalPais}
      >
        <KeyboardAvoidingView
          style={RegistroTuristaScreenStyle.modalFondo}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >

          <TouchableOpacity
            style={RegistroTuristaScreenStyle.modalFondoTouch}
            activeOpacity={1}
            onPress={handleCerrarModalPais}
          />

          <View style={RegistroTuristaScreenStyle.modalCaja}>

            <Text style={RegistroTuristaScreenStyle.modalTitulo}>
              Selecciona tu país
            </Text>

            <View style={RegistroTuristaScreenStyle.modalBusquedaWrap}>
              <Ionicons
                name="search-outline"
                size={18}
                color="#8a8a8a"
                style={RegistroTuristaScreenStyle.modalBusquedaIcono}
              />
              <TextInput
                style={RegistroTuristaScreenStyle.modalBusquedaInput}
                placeholder="Buscar país..."
                placeholderTextColor="#a8a8a8"
                value={busquedaPais}
                onChangeText={setBusquedaPais}
                autoFocus
              />
            </View>

            <FlatList
              data={paisesFiltrados}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              style={RegistroTuristaScreenStyle.modalLista}
              ListEmptyComponent={
                <Text style={RegistroTuristaScreenStyle.modalVacioTexto}>
                  No se encontraron países.
                </Text>
              }
              renderItem={({ item }) => {
                const activo = form.paisOrigen === item;
                return (
                  <TouchableOpacity
                    style={[
                      RegistroTuristaScreenStyle.modalOpcion,
                      activo && RegistroTuristaScreenStyle.modalOpcionActiva,
                    ]}
                    onPress={() => handleSeleccionarPais(item)}
                  >
                    <Text
                      style={[
                        RegistroTuristaScreenStyle.modalOpcionTexto,
                        activo &&
                          RegistroTuristaScreenStyle.modalOpcionTextoActivo,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />

          </View>

        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
};

export default RegistroTuristaScreen;