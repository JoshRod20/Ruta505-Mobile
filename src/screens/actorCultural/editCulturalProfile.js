/**
 * EditCulturalProfile: componente/pantalla de la aplicación Ruta505.
 */

import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

import SelectorModal from "../../components/common/SelectorModal";
import { db } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import { usePermisos } from "../../hooks/usePermisos";
import { PERMISOS } from "../../constants/permissions";
import { ACTORES_CULTURALES_CONFIG } from "../../constants/actoresCulturales";
import { DEPARTAMENTOS, getMunicipios } from "../../constants/ubicacionesNicaragua";
import { IDIOMAS } from "../../constants/idiomas";
import { TELEFONO_REGEX } from "../../utils/validators";
import { mapFirebaseError } from "../../utils/firebaseErrors";
import S from "../../styles/auth/RegistroActorFormStyle";
import { editCulturalProfileStyle as s } from "../../styles/actorCultural/editCulturalProfileStyle";

const VERDE = "#086338";

const MensajeError = ({ texto }) =>
  texto ? <Text style={S.errorCampo}>{texto}</Text> : null;

const CampoSelector = ({ texto, placeholder, invalido, onPress }) => (
  <TouchableOpacity
    style={[S.dropdownInput, invalido && S.inputInvalido]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text
      style={[S.dropdownTexto, !texto && S.dropdownPlaceholder]}
      numberOfLines={1}
    >
      {texto || placeholder}
    </Text>
    <Ionicons name="chevron-down-outline" size={20} color={VERDE} />
  </TouchableOpacity>
);

// Pantalla independiente (sin barra de tabs): se abre desde
// "Editar perfil cultural" en el perfil del actor cultural.
/**
 * EditCulturalProfile.
 */
export default function EditCulturalProfile() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { profile, user } = useAuth();
  const { puede } = usePermisos();

  const [form, setForm] = useState({
    nombreCompleto: profile?.nombreCompleto ?? "",
    descripcion: profile?.descripcion ?? "",
    direccion: profile?.direccion ?? "",
    departamento: profile?.departamento ?? "",
    municipio: profile?.municipio ?? "",
    telefono: profile?.telefono ?? "",
    tipoTurismo: profile?.tipoTurismo ?? "",
    idiomaPreferido: profile?.idiomaPreferido ?? "",
  });
  const [intentado, setIntentado] = useState(false);
  const [modalActivo, setModalActivo] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  // ---- Teclado: el campo enfocado no debe quedar tapado ----
  const scrollRef = useRef(null);
  const scrollYRef = useRef(0);
  const modalActivoRef = useRef(null);
  modalActivoRef.current = modalActivo;
  const [tecladoAlto, setTecladoAlto] = useState(0);

  useEffect(() => {
    const esIOS = Platform.OS === "ios";
    const mostrar = Keyboard.addListener(
      esIOS ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        if (modalActivoRef.current) return; // el teclado es del buscador del modal
        setTecladoAlto(e.endCoordinates.height);
        const tecladoTop = e.endCoordinates.screenY;
        setTimeout(() => {
          const input = TextInput.State.currentlyFocusedInput?.();
          input?.measureInWindow((_x, y, _w, h) => {
            const exceso = y + h + 16 - tecladoTop;
            if (exceso > 0) {
              scrollRef.current?.scrollTo({
                y: scrollYRef.current + exceso,
                animated: true,
              });
            }
          });
        }, 60);
      }
    );
    const ocultar = Keyboard.addListener(
      esIOS ? "keyboardWillHide" : "keyboardDidHide",
      () => setTecladoAlto(0)
    );
    return () => {
      mostrar.remove();
      ocultar.remove();
    };
  }, []);

  const config = ACTORES_CULTURALES_CONFIG[profile?.tipoActor];
  const tiposTurismo = config?.tiposTurismo ?? [];
  const municipios = getMunicipios(form.departamento);

  const handleChange = (campo, valor) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  const volver = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("MainDrawer", { screen: "Perfil cultural" });
    }
  };

  if (!puede(PERMISOS.VER_PERFIL_CULTURAL)) {
    return (
      <View style={[s.container, { paddingTop: insets.top + 24, paddingHorizontal: 24 }]}>
        <Text style={{ fontSize: 14, color: "#4A4A4A" }}>
          Esta sección es solo para actores culturales.
        </Text>
      </View>
    );
  }

  const errores = {
    nombreCompleto: !form.nombreCompleto.trim()
      ? "El nombre completo/negocio es obligatorio."
      : "",
    descripcion: !form.descripcion.trim()
      ? "La descripción del negocio es obligatoria."
      : "",
    direccion: !form.direccion.trim()
      ? "La dirección del negocio es obligatoria."
      : "",
    departamento: !form.departamento ? "Selecciona tu departamento." : "",
    municipio: !form.municipio ? "Selecciona tu municipio." : "",
    telefono: !form.telefono.trim()
      ? "El teléfono es obligatorio."
      : !TELEFONO_REGEX.test(form.telefono.trim())
      ? "Escribe un número de teléfono válido."
      : "",
    tipoTurismo: !form.tipoTurismo ? "Selecciona tu tipo de turismo." : "",
    idiomaPreferido: !form.idiomaPreferido ? "Selecciona tu idioma." : "",
  };
  const err = (campo) => (intentado ? errores[campo] : "");

  const seleccionar = (campo, valor) => {
    handleChange(campo, valor);
    setModalActivo(null);
  };

  const seleccionarDepartamento = (departamento) => {
    if (departamento !== form.departamento) handleChange("municipio", "");
    seleccionar("departamento", departamento);
  };

  const abrirMunicipios = () => {
    if (!form.departamento) {
      setIntentado(true);
      return;
    }
    setModalActivo("municipio");
  };

  const handleGuardar = async () => {
    setIntentado(true);
    setError("");

    if (Object.values(errores).some(Boolean)) return;
    if (!user?.uid) return;

    try {
      setGuardando(true);
      await updateDoc(doc(db, "users", user.uid), {
        nombreCompleto: form.nombreCompleto.trim(),
        descripcion: form.descripcion.trim(),
        direccion: form.direccion.trim(),
        departamento: form.departamento,
        municipio: form.municipio,
        telefono: form.telefono.trim(),
        tipoTurismo: form.tipoTurismo,
        idiomaPreferido: form.idiomaPreferido,
        updatedAt: serverTimestamp(),
      });
      Alert.alert("Listo", "Tu perfil se actualizó correctamente.");
      volver();
    } catch (e) {
      console.error("Error al guardar el perfil cultural:", e);
      setError(mapFirebaseError(e.code));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <View style={[s.container, { paddingTop: insets.top + 8 }]}>
      <View style={s.encabezado}>
        <TouchableOpacity
          style={s.botonAtras}
          onPress={volver}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Volver al perfil"
        >
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </TouchableOpacity>
        <Text style={s.titulo}>Edición de Perfil Cultural</Text>
        <View style={s.botonAtras} />
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[s.contenido, { paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => {
          scrollYRef.current = e.nativeEvent.contentOffset.y;
        }}
      >
        <Text style={s.etiqueta}>Nombre completo/negocio</Text>
        <TextInput
          style={[S.input, !!err("nombreCompleto") && S.inputInvalido]}
          value={form.nombreCompleto}
          onChangeText={(t) => handleChange("nombreCompleto", t)}
        />
        <MensajeError texto={err("nombreCompleto")} />

        <Text style={s.etiqueta}>Descripción del negocio</Text>
        <TextInput
          style={[
            S.input,
            S.inputDescripcion,
            !!err("descripcion") && S.inputInvalido,
          ]}
          value={form.descripcion}
          onChangeText={(t) => handleChange("descripcion", t)}
          multiline
        />
        <MensajeError texto={err("descripcion")} />

        <Text style={s.etiqueta}>Dirección del negocio</Text>
        <TextInput
          style={[
            S.input,
            S.inputDescripcion,
            !!err("direccion") && S.inputInvalido,
          ]}
          value={form.direccion}
          onChangeText={(t) => handleChange("direccion", t)}
          multiline
        />
        <MensajeError texto={err("direccion")} />

        <Text style={s.etiqueta}>Departamento</Text>
        <CampoSelector
          texto={form.departamento}
          placeholder="Departamento"
          invalido={!!err("departamento")}
          onPress={() => setModalActivo("departamento")}
        />
        <MensajeError texto={err("departamento")} />

        <Text style={s.etiqueta}>Municipio</Text>
        <CampoSelector
          texto={form.municipio}
          placeholder="Municipio"
          invalido={!!err("municipio")}
          onPress={abrirMunicipios}
        />
        <MensajeError texto={err("municipio")} />

        {/* El correo es el de inicio de sesión: no se cambia desde aquí */}
        <Text style={s.etiqueta}>Correo electrónico</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            Alert.alert(
              "Correo de la cuenta",
              "El correo con el que inicias sesión no se puede cambiar desde aquí."
            )
          }
        >
          <TextInput
            style={[S.input, s.soloLectura]}
            value={profile?.email ?? user?.email ?? ""}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>

        <Text style={s.etiqueta}>Teléfono</Text>
        <TextInput
          style={[S.input, !!err("telefono") && S.inputInvalido]}
          value={form.telefono}
          onChangeText={(t) => handleChange("telefono", t)}
          keyboardType="phone-pad"
        />
        <MensajeError texto={err("telefono")} />

        <Text style={s.etiqueta}>Tipo de turismo que ofrece</Text>
        <CampoSelector
          texto={form.tipoTurismo}
          placeholder="Tipo de turismo que ofrece"
          invalido={!!err("tipoTurismo")}
          onPress={() => setModalActivo("turismo")}
        />
        <MensajeError texto={err("tipoTurismo")} />

        <TouchableOpacity
          style={S.botonIdioma}
          onPress={() => setModalActivo("idioma")}
          activeOpacity={0.8}
        >
          <Text style={S.botonIdiomaTexto} numberOfLines={1}>
            {form.idiomaPreferido || "Idioma"}
          </Text>
        </TouchableOpacity>
        {err("idiomaPreferido") ? (
          <Text style={[S.errorCampo, { textAlign: "center" }]}>
            {err("idiomaPreferido")}
          </Text>
        ) : null}

        {error ? <Text style={S.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[S.boton, guardando && S.botonDeshabilitado]}
          onPress={handleGuardar}
          disabled={guardando}
          activeOpacity={0.85}
        >
          {guardando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={S.botonTexto}>Guardar cambios</Text>
          )}
        </TouchableOpacity>

        {/* Espacio para poder desplazar los últimos campos sobre el teclado */}
        <View style={{ height: tecladoAlto }} />
      </ScrollView>

      <SelectorModal
        visible={modalActivo === "departamento"}
        titulo="Selecciona el departamento"
        placeholderBusqueda="Buscar departamento..."
        opciones={DEPARTAMENTOS}
        valor={form.departamento}
        onSelect={seleccionarDepartamento}
        onClose={() => setModalActivo(null)}
        textoVacio="No se encontraron departamentos."
      />
      <SelectorModal
        visible={modalActivo === "municipio"}
        titulo="Selecciona el municipio"
        placeholderBusqueda="Buscar municipio..."
        opciones={municipios}
        valor={form.municipio}
        onSelect={(m) => seleccionar("municipio", m)}
        onClose={() => setModalActivo(null)}
        textoVacio="No se encontraron municipios."
      />
      <SelectorModal
        visible={modalActivo === "turismo"}
        titulo="Selecciona tu tipo de turismo"
        placeholderBusqueda="Buscar tipo de turismo..."
        opciones={tiposTurismo}
        valor={form.tipoTurismo}
        onSelect={(t) => seleccionar("tipoTurismo", t)}
        onClose={() => setModalActivo(null)}
        textoVacio="No se encontraron tipos de turismo."
      />
      <SelectorModal
        visible={modalActivo === "idioma"}
        titulo="Selecciona tu idioma"
        placeholderBusqueda="Buscar idioma..."
        opciones={IDIOMAS}
        valor={form.idiomaPreferido}
        onSelect={(i) => seleccionar("idiomaPreferido", i)}
        onClose={() => setModalActivo(null)}
        textoVacio="No se encontraron idiomas."
        enfocarBusqueda={false}
      />
    </View>
  );
}
