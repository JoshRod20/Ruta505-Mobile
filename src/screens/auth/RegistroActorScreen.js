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
import { ROLES, ESTADOS_VERIFICACION } from "../../constants/roles";
// ⚠️ Asumí esta ruta para ACTORES_CULTURALES_CONFIG (misma carpeta que roles.js).
// Ajusta el import si el archivo vive en otro lugar.
import { ACTORES_CULTURALES_CONFIG } from "../../constants/actoresCulturales";

import RegistroActorFormStyle from "../../styles/auth/RegistroActorFormStyle";

// ==================================================
// DIMENSIONES DE LA CURVA
// ==================================================

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CURVE_HEIGHT = 130;

// ==================================================
// CURVA
// IDÉNTICA A RegistroTuristaScreen
// ==================================================

const curvaPath = (w) => `
  M0,${CURVE_HEIGHT * 0.99}
  C${w * 0.2},${CURVE_HEIGHT * 0.98}
   ${w * 0.38},${CURVE_HEIGHT * 0.85}
   ${w * 0.5},${CURVE_HEIGHT * 0.62}

  C${w * 0.62},${CURVE_HEIGHT * 0.4}
   ${w * 0.72},${CURVE_HEIGHT * 0.15}
   ${w * 0.85},${CURVE_HEIGHT * 0.06}

  C${w * 0.9},${CURVE_HEIGHT * 0.02}
   ${w * 0.95},0
   ${w},0

  L${w},${CURVE_HEIGHT}
  L0,${CURVE_HEIGHT}

  Z
`;

// ==================================================
// RegistroActorScreen
// ==================================================

const RegistroActorScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();

  // ==================================================
  // TIPO DE ACTOR (viene de SeleccionarActorScreen)
  // ==================================================

  const { tipoActor } = route.params || {};

  const config = ACTORES_CULTURALES_CONFIG[tipoActor];

  const tiposTurismoDisponibles = config?.tiposTurismo ?? [];

  const tituloEncabezado = config?.tituloEncabezado || "Datos Generales";

  // ==================================================
  // FORMULARIO
  // ==================================================

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
      cedula: "",
      telefono: "",
      password: "",
      confirmPassword: "",
      tipoTurismo: "",
    },
  });

  // ==================================================
  // MODAL TIPO DE TURISMO
  // ==================================================

  const [modalTurismoVisible, setModalTurismoVisible] = useState(false);

  const [busquedaTurismo, setBusquedaTurismo] = useState("");

  const tiposTurismoFiltrados = useMemo(() => {
    if (!busquedaTurismo.trim()) {
      return tiposTurismoDisponibles;
    }

    return tiposTurismoDisponibles.filter((tipo) =>
      tipo.toLowerCase().includes(busquedaTurismo.trim().toLowerCase()),
    );
  }, [busquedaTurismo, tiposTurismoDisponibles]);

  // ==================================================
  // VOLVER
  // ==================================================

  const handleVolver = () => {
    navigation.goBack();
  };

  // ==================================================
  // CERRAR MODAL
  // ==================================================

  const handleCerrarModalTurismo = () => {
    setModalTurismoVisible(false);
    setBusquedaTurismo("");
  };

  // ==================================================
  // SELECCIONAR TIPO DE TURISMO
  // ==================================================

  const handleSeleccionarTipoTurismo = (tipo) => {
    handleChange("tipoTurismo", tipo);

    handleCerrarModalTurismo();
  };

  // ==================================================
  // ENVIAR FORMULARIO
  // ==================================================
  //
  // No crea la cuenta todavía: valida credenciales y navega
  // a SolicitarUbicacion, arrastrando los datos del perfil
  // (role, tipoActor, estadoVerificacion incluidos) para
  // armar el registro completo al final del flujo.
  //
  const handleSubmit = () => {
    if (!validarCredenciales()) return;

    navigation.navigate("SolicitarUbicacion", {
      datosRegistro: {
        role: ROLES.ACTOR_CULTURAL,
        tipoActor,
        estadoVerificacion: ESTADOS_VERIFICACION.PENDIENTE,
        nombreCompleto: form.nombreCompleto,
        email: form.email.trim(),
        password: form.password,
        cedula: form.cedula,
        telefono: form.telefono,
        tipoTurismo: form.tipoTurismo,
      },
    });
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <View style={RegistroActorFormStyle.contenedor}>
      {/* ==================================================
          HEADER CON PATRÓN + CURVA
          IDÉNTICO A RegistroTuristaScreen
          ================================================== */}

      <View style={RegistroActorFormStyle.header}>
        <ImageBackground
          source={require("../../assets/images/Patron-2.png")}
          style={RegistroActorFormStyle.headerPatron}
          resizeMode="cover"
        >
          {/* ================================================
              BOTÓN VOLVER
              ================================================ */}

          <TouchableOpacity
            style={[
              RegistroActorFormStyle.botonVolver,
              {
                top: insets.top + 10,
              },
            ]}
            onPress={handleVolver}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#2b2b2b" />
          </TouchableOpacity>
        </ImageBackground>

        {/* ================================================
            CURVA SVG
            EXACTAMENTE LA MISMA DE REGISTROTURISTASCREEN
            ================================================ */}

        <Svg
          style={RegistroActorFormStyle.curva}
          width={SCREEN_WIDTH}
          height={CURVE_HEIGHT}
          viewBox={`0 0 ${SCREEN_WIDTH} ${CURVE_HEIGHT}`}
        >
          <Path fill="#ffffff" d={curvaPath(SCREEN_WIDTH)} />
        </Svg>
      </View>

      {/* ==================================================
          TÍTULO DE SECCIÓN
          ================================================== */}

      <Text style={RegistroActorFormStyle.titulo}>{tituloEncabezado}</Text>

      {/* ==================================================
          FORMULARIO
          ================================================== */}

      <KeyboardAvoidingView
        style={RegistroActorFormStyle.scroll}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={RegistroActorFormStyle.card}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ==================================================
              NOMBRE COMPLETO
              ================================================== */}

          <TextInput
            style={RegistroActorFormStyle.input}
            placeholder="Nombre completo/Negocio"
            placeholderTextColor="#a8a8a8"
            value={form.nombreCompleto}
            onChangeText={(texto) => handleChange("nombreCompleto", texto)}
          />

          {/* ==================================================
              CORREO
              ================================================== */}

          <TextInput
            style={RegistroActorFormStyle.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#a8a8a8"
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(texto) => handleChange("email", texto)}
          />

          {/* ==================================================
              CÉDULA DE IDENTIDAD
              ================================================== */}

          <TextInput
            style={RegistroActorFormStyle.input}
            placeholder="Cédula de identidad"
            placeholderTextColor="#a8a8a8"
            autoCapitalize="characters"
            keyboardType="default"
            maxLength={16}
            value={form.cedula}
            onChangeText={(texto) => handleChange("cedula", texto)}
          />

          {/* ==================================================
              TELÉFONO
              ================================================== */}

          <TextInput
            style={RegistroActorFormStyle.input}
            placeholder="Teléfono"
            placeholderTextColor="#a8a8a8"
            keyboardType="phone-pad"
            value={form.telefono}
            onChangeText={(texto) => handleChange("telefono", texto)}
          />

          {/* ==================================================
              CONTRASEÑA
              ================================================== */}

          <View style={RegistroActorFormStyle.inputWrap}>
            <TextInput
              style={[
                RegistroActorFormStyle.input,
                RegistroActorFormStyle.inputPassword,
              ]}
              placeholder="Contraseña"
              placeholderTextColor="#a8a8a8"
              secureTextEntry={!mostrarPassword}
              value={form.password}
              onChangeText={(texto) => handleChange("password", texto)}
            />

            <TouchableOpacity
              style={RegistroActorFormStyle.iconoOjo}
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

          {/* ==================================================
              CONFIRMAR CONTRASEÑA
              ================================================== */}

          <View style={RegistroActorFormStyle.inputWrap}>
            <TextInput
              style={[
                RegistroActorFormStyle.input,
                RegistroActorFormStyle.inputPassword,
              ]}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#a8a8a8"
              secureTextEntry={!mostrarConfirmPassword}
              value={form.confirmPassword}
              onChangeText={(texto) => handleChange("confirmPassword", texto)}
            />

            <TouchableOpacity
              style={RegistroActorFormStyle.iconoOjo}
              onPress={() => setMostrarConfirmPassword((v) => !v)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  mostrarConfirmPassword ? "eye-off-outline" : "eye-outline"
                }
                size={22}
                color="#086338"
              />
            </TouchableOpacity>
          </View>

          {/* ==================================================
              TIPO DE TURISMO
              ================================================== */}

          <TouchableOpacity
            style={RegistroActorFormStyle.dropdownInput}
            onPress={() => setModalTurismoVisible(true)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                RegistroActorFormStyle.dropdownTexto,
                !form.tipoTurismo && RegistroActorFormStyle.dropdownPlaceholder,
              ]}
              numberOfLines={1}
            >
              {form.tipoTurismo || "Tipo de turismo"}
            </Text>

            <Ionicons name="chevron-down-outline" size={20} color="#086338" />
          </TouchableOpacity>

          {/* ==================================================
              ERROR
              ================================================== */}

          {error ? (
            <Text style={RegistroActorFormStyle.error}>{error}</Text>
          ) : null}

          {/* ==================================================
              BOTÓN REGISTRARSE
              ================================================== */}

          <TouchableOpacity
            style={RegistroActorFormStyle.boton}
            onPress={handleSubmit}
          >
            <Text style={RegistroActorFormStyle.botonTexto}>Registrarse</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ==================================================
          MODAL — TIPO DE TURISMO
          ================================================== */}

      <Modal
        visible={modalTurismoVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCerrarModalTurismo}
      >
        <KeyboardAvoidingView
          style={RegistroActorFormStyle.modalFondo}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* ================================================
              FONDO PARA CERRAR MODAL
              ================================================ */}

          <TouchableOpacity
            style={RegistroActorFormStyle.modalFondoTouch}
            activeOpacity={1}
            onPress={handleCerrarModalTurismo}
          />

          {/* ================================================
              CAJA DEL MODAL
              ================================================ */}

          <View style={RegistroActorFormStyle.modalCaja}>
            <Text style={RegistroActorFormStyle.modalTitulo}>
              Selecciona tu tipo de turismo
            </Text>

            {/* ================================================
                BUSCADOR
                ================================================ */}

            <View style={RegistroActorFormStyle.modalBusquedaWrap}>
              <Ionicons
                name="search-outline"
                size={18}
                color="#8a8a8a"
                style={RegistroActorFormStyle.modalBusquedaIcono}
              />

              <TextInput
                style={RegistroActorFormStyle.modalBusquedaInput}
                placeholder="Buscar tipo de turismo..."
                placeholderTextColor="#a8a8a8"
                value={busquedaTurismo}
                onChangeText={setBusquedaTurismo}
                autoFocus
              />
            </View>

            {/* ================================================
                LISTA
                ================================================ */}

            <FlatList
              data={tiposTurismoFiltrados}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              style={RegistroActorFormStyle.modalLista}
              ListEmptyComponent={
                <Text style={RegistroActorFormStyle.modalVacioTexto}>
                  No se encontraron tipos de turismo.
                </Text>
              }
              renderItem={({ item }) => {
                const activo = form.tipoTurismo === item;

                return (
                  <TouchableOpacity
                    style={[
                      RegistroActorFormStyle.modalOpcion,

                      activo && RegistroActorFormStyle.modalOpcionActiva,
                    ]}
                    onPress={() => handleSeleccionarTipoTurismo(item)}
                  >
                    <Text
                      style={[
                        RegistroActorFormStyle.modalOpcionTexto,

                        activo && RegistroActorFormStyle.modalOpcionTextoActivo,
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

export default RegistroActorScreen;
