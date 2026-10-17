/**
 * EditUserProfile: edición del perfil del turista.
 *
 * Carga los datos que el turista escribió al registrarse (nombre, teléfono,
 * edad, país, idioma e intereses) para que pueda modificarlos. El correo es el
 * de inicio de sesión y no se cambia desde aquí.
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
import { IDIOMAS } from "../../constants/idiomas";
import { PAISES } from "../../constants/paises";
import { INTERESES_TURISTA } from "../../constants/intereses";
import { TELEFONO_REGEX } from "../../utils/validators";
import { mapFirebaseError } from "../../utils/firebaseErrors";
import S from "../../styles/auth/RegistroActorFormStyle";
import { editUserProfileStyle as s } from "../../styles/usuario/editUserProfileStyle";

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
// "Editar perfil" en el perfil del turista.
/**
 * EditUserProfile.
 */
export default function EditUserProfile() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { profile, user } = useAuth();
  const { puede } = usePermisos();

  const [form, setForm] = useState({
    nombreCompleto: profile?.nombreCompleto ?? "",
    telefono: profile?.telefono ?? "",
    edad: profile?.edad != null ? String(profile.edad) : "",
    paisOrigen: profile?.paisOrigen ?? "",
    idiomaPreferido: profile?.idiomaPreferido ?? "",
    intereses: Array.isArray(profile?.intereses) ? profile.intereses : [],
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

  const handleChange = (campo, valor) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  const alternarInteres = (interes) =>
    setForm((prev) => ({
      ...prev,
      intereses: prev.intereses.includes(interes)
        ? prev.intereses.filter((i) => i !== interes)
        : [...prev.intereses, interes],
    }));

  const volver = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("MainDrawer", { initialTab: "Perfil" });
    }
  };

  if (!puede(PERMISOS.VER_PERFIL_USUARIO)) {
    return (
      <View style={[s.container, { paddingTop: insets.top + 24, paddingHorizontal: 24 }]}>
        <Text style={s.avisoSinPermiso}>
          Esta sección es solo para turistas.
        </Text>
      </View>
    );
  }

  const edadNum = Number(form.edad);
  const errores = {
    nombreCompleto: !form.nombreCompleto.trim()
      ? "El nombre completo es obligatorio."
      : "",
    telefono: !form.telefono.trim()
      ? "El teléfono es obligatorio."
      : !TELEFONO_REGEX.test(form.telefono.trim())
      ? "Escribe un número de teléfono válido."
      : "",
    edad:
      !String(form.edad).trim() ||
      !Number.isFinite(edadNum) ||
      edadNum <= 0 ||
      edadNum > 120
        ? "Escribe una edad válida."
        : "",
    paisOrigen: !form.paisOrigen ? "Selecciona tu país de origen." : "",
    idiomaPreferido: !form.idiomaPreferido ? "Selecciona tu idioma." : "",
    intereses:
      form.intereses.length === 0
        ? "Selecciona al menos un tipo de turismo."
        : "",
  };
  const err = (campo) => (intentado ? errores[campo] : "");

  const seleccionar = (campo, valor) => {
    handleChange(campo, valor);
    setModalActivo(null);
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
        telefono: form.telefono.trim(),
        edad: String(form.edad).trim(),
        paisOrigen: form.paisOrigen,
        // Igual que en el registro: se deduce del país de origen.
        tipoTurista: form.paisOrigen === "Nicaragua" ? "nacional" : "extranjero",
        idiomaPreferido: form.idiomaPreferido,
        intereses: form.intereses,
        updatedAt: serverTimestamp(),
      });
      Alert.alert("Listo", "Tu perfil se actualizó correctamente.");
      volver();
    } catch (e) {
      console.error("Error al guardar el perfil:", e);
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
        <Text style={s.titulo}>Editar perfil</Text>
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
        <Text style={s.etiqueta}>Nombre completo</Text>
        <TextInput
          style={[S.input, !!err("nombreCompleto") && S.inputInvalido]}
          value={form.nombreCompleto}
          onChangeText={(t) => handleChange("nombreCompleto", t)}
        />
        <MensajeError texto={err("nombreCompleto")} />

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

        <Text style={s.etiqueta}>Edad</Text>
        <TextInput
          style={[S.input, !!err("edad") && S.inputInvalido]}
          value={form.edad}
          onChangeText={(t) => handleChange("edad", t.replace(/[^0-9]/g, ""))}
          keyboardType="number-pad"
          maxLength={3}
        />
        <MensajeError texto={err("edad")} />

        <Text style={s.etiqueta}>País de origen</Text>
        <CampoSelector
          texto={form.paisOrigen}
          placeholder="País de origen"
          invalido={!!err("paisOrigen")}
          onPress={() => setModalActivo("pais")}
        />
        <MensajeError texto={err("paisOrigen")} />

        <Text style={s.etiqueta}>Idioma preferido</Text>
        <CampoSelector
          texto={form.idiomaPreferido}
          placeholder="Idioma preferido"
          invalido={!!err("idiomaPreferido")}
          onPress={() => setModalActivo("idioma")}
        />
        <MensajeError texto={err("idiomaPreferido")} />

        <Text style={s.etiqueta}>Tipo de turismo que realizas</Text>
        {INTERESES_TURISTA.map((interes) => {
          const activo = form.intereses.includes(interes);
          return (
            <TouchableOpacity
              key={interes}
              style={s.interesFila}
              onPress={() => alternarInteres(interes)}
              activeOpacity={0.7}
            >
              <View style={[s.interesCheck, activo && s.interesCheckActivo]}>
                {activo && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </View>
              <Text style={s.interesTexto}>{interes}</Text>
            </TouchableOpacity>
          );
        })}
        <MensajeError texto={err("intereses")} />

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
        visible={modalActivo === "pais"}
        titulo="Selecciona tu país de origen"
        placeholderBusqueda="Buscar país..."
        opciones={PAISES}
        valor={form.paisOrigen}
        onSelect={(p) => seleccionar("paisOrigen", p)}
        onClose={() => setModalActivo(null)}
        textoVacio="No se encontraron países."
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
