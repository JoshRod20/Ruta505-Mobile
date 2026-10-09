/**
 * RegistroActorScreen: componente/pantalla de la aplicación Ruta505.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Keyboard,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useRegistroForm } from "../../hooks/useRegistroForm";
import { ESTADOS_VERIFICACION, ROLES } from "../../constants/roles";
import { ACTORES_CULTURALES_CONFIG } from "../../constants/actoresCulturales";
import { IDIOMAS } from "../../constants/idiomas";
import {
  DEPARTAMENTOS,
  getMunicipios,
} from "../../constants/ubicacionesNicaragua";
import {
  CEDULA_REGEX,
  EMAIL_REGEX,
  TELEFONO_REGEX,
} from "../../utils/validators";
import SelectorModal from "../../components/common/SelectorModal";
import S from "../../styles/auth/RegistroActorFormStyle";

// ==================================================
// CONSTANTES
// ==================================================

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CURVE_HEIGHT = 130;

const curvaPath = (w) => `
  M0,${CURVE_HEIGHT * 0.99}
  C${w * 0.2},${CURVE_HEIGHT * 0.98} ${w * 0.38},${CURVE_HEIGHT * 0.85} ${w * 0.5},${CURVE_HEIGHT * 0.62}
  C${w * 0.62},${CURVE_HEIGHT * 0.4} ${w * 0.72},${CURVE_HEIGHT * 0.15} ${w * 0.85},${CURVE_HEIGHT * 0.06}
  C${w * 0.9},${CURVE_HEIGHT * 0.02} ${w * 0.95},0 ${w},0
  L${w},${CURVE_HEIGHT}
  L0,${CURVE_HEIGHT}
  Z
`;

// ==================================================
// VALIDACIÓN (función pura: no depende de "tocado")
// ==================================================

const vacio = (v) => !String(v ?? "").trim();

const calcularErrores = (f) => {
  // El municipio solo es válido si pertenece al departamento elegido
  const municipioValido = getMunicipios(f.departamento).includes(f.municipio);

  return {
    nombreCompleto: vacio(f.nombreCompleto)
      ? "El nombre completo/negocio es obligatorio."
      : "",
    descripcion: vacio(f.descripcion)
      ? "La descripción del negocio es obligatoria."
      : "",
    direccion: vacio(f.direccion)
      ? "La dirección del negocio es obligatoria."
      : "",
    departamento: !f.departamento ? "Selecciona un departamento." : "",
    municipio: !municipioValido
      ? f.departamento
        ? "Selecciona un municipio."
        : "Primero selecciona un departamento."
      : "",
    email: vacio(f.email)
      ? "El correo es obligatorio."
      : !EMAIL_REGEX.test(f.email.trim())
      ? "Escribe un correo electrónico válido."
      : "",
    cedula: vacio(f.cedula)
      ? "La cédula es obligatoria."
      : !CEDULA_REGEX.test(f.cedula.trim())
      ? "La cédula debe tener el formato 000-000000-0000X."
      : "",
    telefono: vacio(f.telefono)
      ? "El teléfono es obligatorio."
      : !TELEFONO_REGEX.test(f.telefono.trim())
      ? "Escribe un número de teléfono válido."
      : "",
    password:
      f.password.length === 0
        ? "La contraseña es obligatoria."
        : f.password.length < 6
        ? "La contraseña debe tener al menos 6 caracteres."
        : "",
    confirmPassword:
      f.confirmPassword.length === 0
        ? "Confirma tu contraseña."
        : f.password !== f.confirmPassword
        ? "Las contraseñas no coinciden."
        : "",
    tipoTurismo: !f.tipoTurismo ? "Selecciona un tipo de turismo." : "",
    idiomaPreferido: !f.idiomaPreferido
      ? "Selecciona tu idioma preferido."
      : "",
  };
};

// ==================================================
// PIEZAS PEQUEÑAS
// ==================================================

const MensajeError = ({ texto, centrado }) =>
  texto ? (
    <Text
      style={[S.errorCampo, centrado && { textAlign: "center", marginLeft: 0 }]}
    >
      {texto}
    </Text>
  ) : null;

const CampoSelector = ({
  texto,
  placeholder,
  invalido,
  deshabilitado,
  onPress,
}) => (
  <TouchableOpacity
    style={[
      S.dropdownInput,
      invalido && S.inputInvalido,
      deshabilitado && S.dropdownDeshabilitado,
    ]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text
      style={[S.dropdownTexto, !texto && S.dropdownPlaceholder]}
      numberOfLines={1}
    >
      {texto || placeholder}
    </Text>
    <Ionicons name="chevron-down-outline" size={20} color="#086338" />
  </TouchableOpacity>
);

// ==================================================
// PANTALLA
// ==================================================

const RegistroActorScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();

  const { tipoActor } = route.params || {};
  const config = ACTORES_CULTURALES_CONFIG[tipoActor];
  const tiposTurismoDisponibles = config?.tiposTurismo ?? [];
  const tituloEncabezado = config?.tituloEncabezado || "Datos Generales";

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
      descripcion: "",
      direccion: "",
      departamento: "",
      municipio: "",
      email: "",
      cedula: "",
      telefono: "",
      password: "",
      confirmPassword: "",
      tipoTurismo: "",
      idiomaPreferido: "",
    },
  });

  // Campos tocados + errores visibles
  const [tocado, setTocado] = useState({});
  const marcarTocado = (campo) =>
    setTocado((prev) => ({ ...prev, [campo]: true }));

  const erroresTodos = calcularErrores(form);
  const err = (campo) => (tocado[campo] ? erroresTodos[campo] : "");

  // Modales: solo uno abierto a la vez
  // null | "turismo" | "idioma" | "departamento" | "municipio"
  const [modalActivo, setModalActivo] = useState(null);
  const cerrarModal = () => setModalActivo(null);

  // ==================================================
  // TECLADO: el campo enfocado nunca debe quedar tapado
  // ==================================================
  // No usamos KeyboardAvoidingView: en Android con edge-to-edge no mueve nada
  // y en iOS no desplaza el ScrollView hasta el campo enfocado.
  const scrollRef = useRef(null);
  const scrollYRef = useRef(0);
  const tecladoTopRef = useRef(null); // Y (pantalla) donde empieza el teclado
  const modalActivoRef = useRef(null);
  modalActivoRef.current = modalActivo;
  const [tecladoAlto, setTecladoAlto] = useState(0);

  const asegurarCampoVisible = () => {
    const input = TextInput.State.currentlyFocusedInput?.();
    const tecladoTop = tecladoTopRef.current;
    if (!input || tecladoTop == null) return;

    input.measureInWindow((_x, y, _w, h) => {
      const margen = 24;
      const exceso = y + h + margen - tecladoTop;
      if (exceso > 0) {
        scrollRef.current?.scrollTo({
          y: scrollYRef.current + exceso,
          animated: true,
        });
      }
    });
  };

  // Al pasar de un campo a otro con el teclado ya abierto no hay evento de
  // teclado, así que también reaccionamos al foco.
  const alEnfocar = () => {
    if (tecladoTopRef.current != null) setTimeout(asegurarCampoVisible, 100);
  };

  useEffect(() => {
    const esIOS = Platform.OS === "ios";

    const subShow = Keyboard.addListener(
      esIOS ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        if (modalActivoRef.current) return; // el teclado es del buscador del modal
        tecladoTopRef.current = e.endCoordinates.screenY;
        setTecladoAlto(e.endCoordinates.height);
        setTimeout(asegurarCampoVisible, 60); // deja que se pinte el espacio extra
      }
    );
    const subHide = Keyboard.addListener(
      esIOS ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        tecladoTopRef.current = null;
        setTecladoAlto(0);
      }
    );

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

  // Cierra el teclado (y quita el foco del TextInput) ANTES de abrir el modal.
  // Esperamos a "keyboardDidHide" para no superponer la animación del teclado
  // con la apertura del modal, que es lo que provocaba el congelamiento.
  const abrirModal = (nombre) => {
    if (!Keyboard.isVisible()) {
      setModalActivo(nombre);
      return;
    }

    let abierto = false;
    let sub;
    let timer;

    const abrir = () => {
      if (abierto) return;
      abierto = true;
      sub?.remove();
      clearTimeout(timer);
      setModalActivo(nombre);
    };

    sub = Keyboard.addListener("keyboardDidHide", abrir);
    timer = setTimeout(abrir, 400); // respaldo por si el evento no llega
    Keyboard.dismiss();
  };

  // Municipios del departamento elegido y municipio efectivo
  const municipios = useMemo(
    () => getMunicipios(form.departamento),
    [form.departamento]
  );
  const municipioActual = municipios.includes(form.municipio)
    ? form.municipio
    : "";

  const seleccionar = (campo, valor) => {
    handleChange(campo, valor);
    marcarTocado(campo);
    cerrarModal();
  };

  const seleccionarDepartamento = (departamento) => {
    if (departamento !== form.departamento) {
      handleChange("municipio", "");
    }
    seleccionar("departamento", departamento);
  };

  const abrirMunicipios = () => {
    if (!form.departamento) {
      marcarTocado("departamento");
      marcarTocado("municipio");
      return;
    }
    abrirModal("municipio");
  };

  const handleVolver = () => navigation.goBack();

  const handleSubmit = () => {
    Keyboard.dismiss();

    setTocado(
      Object.keys(erroresTodos).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    );

    if (Object.values(erroresTodos).some(Boolean)) {
      return;
    }

    if (
      !validarCredenciales([
        "nombreCompleto",
        "descripcion",
        "direccion",
        "departamento",
        "municipio",
        "telefono",
        "cedula",
        "tipoTurismo",
        "idiomaPreferido",
      ])
    ) {
      return;
    }

    navigation.navigate("SolicitarUbicacion", {
      datosRegistro: {
        role: ROLES.ACTOR_CULTURAL,
        tipoActor,
        estadoVerificacion: ESTADOS_VERIFICACION.PENDIENTE,
        nombreCompleto: form.nombreCompleto,
        descripcion: form.descripcion.trim(),
        direccion: form.direccion.trim(),
        departamento: form.departamento,
        municipio: municipioActual,
        email: form.email.trim(),
        password: form.password,
        cedula: form.cedula,
        telefono: form.telefono,
        tipoTurismo: form.tipoTurismo,
        idiomaPreferido: form.idiomaPreferido,
      },
    });
  };

  // ==================================================
  // GUARD
  // ==================================================

  if (!config) {
    return (
      <View style={S.contenedor}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <Text style={S.error}>
            No se pudo determinar el tipo de actor cultural. Vuelve a la
            pantalla anterior e inténtalo de nuevo.
          </Text>
          <TouchableOpacity
            style={[S.boton, { marginTop: 16 }]}
            onPress={handleVolver}
          >
            <Text style={S.botonTexto}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <View style={S.contenedor}>
      {/* HEADER (fuera del KeyboardAvoidingView) */}
      <View style={S.header}>
        <ImageBackground
          source={require("../../assets/images/Patron-2.png")}
          style={S.headerPatron}
          resizeMode="cover"
        >
          <TouchableOpacity
            style={[S.botonVolver, { top: insets.top + 10 }]}
            onPress={handleVolver}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#2b2b2b" />
          </TouchableOpacity>
        </ImageBackground>

        <Svg
          pointerEvents="none"
          style={S.curva}
          width={SCREEN_WIDTH}
          height={CURVE_HEIGHT}
          viewBox={`0 0 ${SCREEN_WIDTH} ${CURVE_HEIGHT}`}
        >
          <Path fill="#ffffff" d={curvaPath(SCREEN_WIDTH)} />
        </Svg>
      </View>

      <Text style={S.titulo}>{tituloEncabezado}</Text>

      <View style={[S.scroll, { flex: 1 }]}>
        <ScrollView
          ref={scrollRef}
          onScroll={(e) => {
            scrollYRef.current = e.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
          contentContainerStyle={S.card}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {/* NOMBRE */}
          <TextInput
            style={[S.input, !!err("nombreCompleto") && S.inputInvalido]}
            placeholder="Nombre completo/Negocio"
            placeholderTextColor="#a8a8a8"
            value={form.nombreCompleto}
            onChangeText={(t) => handleChange("nombreCompleto", t)}
            onFocus={alEnfocar}
            onBlur={() => marcarTocado("nombreCompleto")}
          />
          <MensajeError texto={err("nombreCompleto")} />

          {/* DESCRIPCIÓN (crece sola con el contenido) */}
          <TextInput
            style={[
              S.input,
              S.inputDescripcion,
              !!err("descripcion") && S.inputInvalido,
            ]}
            placeholder="Descripción del negocio"
            placeholderTextColor="#a8a8a8"
            multiline
            scrollEnabled={false}
            maxLength={500}
            value={form.descripcion}
            onChangeText={(t) => handleChange("descripcion", t)}
            onFocus={alEnfocar}
            onBlur={() => marcarTocado("descripcion")}
          />
          <MensajeError texto={err("descripcion")} />

          {/* DIRECCIÓN */}
          <TextInput
            style={[S.input, !!err("direccion") && S.inputInvalido]}
            placeholder="Dirección del negocio"
            placeholderTextColor="#a8a8a8"
            value={form.direccion}
            onChangeText={(t) => handleChange("direccion", t)}
            onFocus={alEnfocar}
            onBlur={() => marcarTocado("direccion")}
          />
          <MensajeError texto={err("direccion")} />

          {/* DEPARTAMENTO */}
          <CampoSelector
            texto={form.departamento}
            placeholder="Departamento"
            invalido={!!err("departamento")}
            onPress={() => abrirModal("departamento")}
          />
          <MensajeError texto={err("departamento")} />

          {/* MUNICIPIO (depende del departamento) */}
          <CampoSelector
            texto={municipioActual}
            placeholder="Municipio"
            invalido={!!err("municipio")}
            deshabilitado={!form.departamento}
            onPress={abrirMunicipios}
          />
          <MensajeError texto={err("municipio")} />

          {/* EMAIL */}
          <TextInput
            style={[S.input, !!err("email") && S.inputInvalido]}
            placeholder="Correo electrónico"
            placeholderTextColor="#a8a8a8"
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(t) => handleChange("email", t)}
            onFocus={alEnfocar}
            onBlur={() => marcarTocado("email")}
          />
          <MensajeError texto={err("email")} />

          {/* CÉDULA */}
          <TextInput
            style={[S.input, !!err("cedula") && S.inputInvalido]}
            placeholder="Cédula de identidad"
            placeholderTextColor="#a8a8a8"
            autoCapitalize="characters"
            keyboardType="default"
            maxLength={16}
            value={form.cedula}
            onChangeText={(t) => handleChange("cedula", t)}
            onFocus={alEnfocar}
            onBlur={() => marcarTocado("cedula")}
          />
          <MensajeError texto={err("cedula")} />

          {/* TELÉFONO */}
          <TextInput
            style={[S.input, !!err("telefono") && S.inputInvalido]}
            placeholder="Teléfono"
            placeholderTextColor="#a8a8a8"
            keyboardType="phone-pad"
            value={form.telefono}
            onChangeText={(t) => handleChange("telefono", t)}
            onFocus={alEnfocar}
            onBlur={() => marcarTocado("telefono")}
          />
          <MensajeError texto={err("telefono")} />

          {/* CONTRASEÑA */}
          <View style={S.inputWrap}>
            <TextInput
              style={[
                S.input,
                S.inputPassword,
                !!err("password") && S.inputInvalido,
              ]}
              placeholder="Contraseña"
              placeholderTextColor="#a8a8a8"
              secureTextEntry={!mostrarPassword}
              value={form.password}
              onChangeText={(t) => handleChange("password", t)}
              onFocus={alEnfocar}
            onBlur={() => marcarTocado("password")}
            />
            <TouchableOpacity
              style={S.iconoOjo}
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
          <MensajeError texto={err("password")} />

          {/* CONFIRMAR CONTRASEÑA */}
          <View style={S.inputWrap}>
            <TextInput
              style={[
                S.input,
                S.inputPassword,
                !!err("confirmPassword") && S.inputInvalido,
              ]}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#a8a8a8"
              secureTextEntry={!mostrarConfirmPassword}
              value={form.confirmPassword}
              onChangeText={(t) => handleChange("confirmPassword", t)}
              onFocus={alEnfocar}
            onBlur={() => marcarTocado("confirmPassword")}
            />
            <TouchableOpacity
              style={S.iconoOjo}
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
          <MensajeError texto={err("confirmPassword")} />

          {/* TIPO DE TURISMO */}
          <CampoSelector
            texto={form.tipoTurismo}
            placeholder="Tipo de turismo que ofrece"
            invalido={!!err("tipoTurismo")}
            onPress={() => abrirModal("turismo")}
          />
          <MensajeError texto={err("tipoTurismo")} />

          {/* IDIOMA (debajo de todos los campos) */}
          <TouchableOpacity
            style={S.botonIdioma}
            onPress={() => abrirModal("idioma")}
            activeOpacity={0.8}
          >
            <Text style={S.botonIdiomaTexto} numberOfLines={1}>
              {form.idiomaPreferido || "Idioma"}
            </Text>
          </TouchableOpacity>
          <MensajeError texto={err("idiomaPreferido")} centrado />

          {/* ERROR GENERAL */}
          {error ? <Text style={S.error}>{error}</Text> : null}

          {/* BOTÓN */}
          <TouchableOpacity style={S.boton} onPress={handleSubmit}>
            <Text style={S.botonTexto}>Registrarse</Text>
          </TouchableOpacity>

          {/* Espacio para poder desplazar los últimos campos sobre el teclado */}
          <View style={{ height: tecladoAlto }} />
        </ScrollView>
      </View>

      {/* MODALES */}
      <SelectorModal
        visible={modalActivo === "departamento"}
        titulo="Selecciona el departamento"
        placeholderBusqueda="Buscar departamento..."
        opciones={DEPARTAMENTOS}
        valor={form.departamento}
        onSelect={seleccionarDepartamento}
        onClose={cerrarModal}
        textoVacio="No se encontraron departamentos."
      />

      <SelectorModal
        visible={modalActivo === "municipio"}
        titulo="Selecciona el municipio"
        placeholderBusqueda="Buscar municipio..."
        opciones={municipios}
        valor={municipioActual}
        onSelect={(m) => seleccionar("municipio", m)}
        onClose={cerrarModal}
        textoVacio="No se encontraron municipios."
      />

      <SelectorModal
        visible={modalActivo === "turismo"}
        titulo="Selecciona tu tipo de turismo"
        placeholderBusqueda="Buscar tipo de turismo..."
        opciones={tiposTurismoDisponibles}
        valor={form.tipoTurismo}
        onSelect={(t) => seleccionar("tipoTurismo", t)}
        onClose={cerrarModal}
        textoVacio="No se encontraron tipos de turismo."
      />

      <SelectorModal
        visible={modalActivo === "idioma"}
        titulo="Selecciona tu idioma"
        placeholderBusqueda="Buscar idioma..."
        opciones={IDIOMAS}
        valor={form.idiomaPreferido}
        onSelect={(i) => seleccionar("idiomaPreferido", i)}
        onClose={cerrarModal}
        textoVacio="No se encontraron idiomas."
        enfocarBusqueda={false}
      />
    </View>
  );
};

export default RegistroActorScreen;