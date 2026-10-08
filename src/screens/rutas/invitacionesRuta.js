/**
 * InvitacionesRuta: componente/pantalla de la aplicación Ruta505.
 */

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
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

import { useAuth } from "../../context/AuthContext";
import {
  escucharInvitaciones,
  ESTADO_PARADA,
  formatearPrecio,
  responderInvitacion,
} from "../../services/rutasService";
import { iconoDeCategoria } from "../../services/Categoriasexperiencias";
import { elegirFotosBase64 } from "../../utils/imagenes";
import {
  crearRutaStyle as s,
  VERDE,
  LIMA,
  AZUL,
} from "../../styles/rutas/crearRutaStyle";

const MAX_FOTOS = 2;

function insigniaDe(estado) {
  switch (estado) {
    case ESTADO_PARADA.ACEPTADA:
      return { texto: "Aceptaste", fondo: LIMA, color: "#1A1A1A" };
    case ESTADO_PARADA.RECHAZADA:
      return { texto: "Declinaste", fondo: "#B5B5B5", color: "#1A1A1A" };
    default:
      return { texto: "Responder", fondo: AZUL, color: "#FFFFFF" };
  }
}

// Invitaciones a rutas creativas que recibió el actor (se abre desde la campana).
/**
 * InvitacionesRuta.
 */
export default function InvitacionesRuta() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user } = useAuth();

  const [invitaciones, setInvitaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [seleccionadaId, setSeleccionadaId] = useState(null);
  const [aceptando, setAceptando] = useState(false); // muestra el formulario
  const [confirmada, setConfirmada] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    servicio: "",
    precio: "",
    direccion: "",
    horario: "",
    imagenes: [],
  });

  useEffect(() => {
    if (!user?.uid) {
      setCargando(false);
      return undefined;
    }
    return escucharInvitaciones(
      user.uid,
      (lista) => {
        setInvitaciones(lista);
        setCargando(false);
      },
      () => setCargando(false)
    );
  }, [user?.uid]);

  const seleccionada = invitaciones.find((i) => i.id === seleccionadaId) ?? null;

  const volverALista = () => {
    setSeleccionadaId(null);
    setAceptando(false);
    setConfirmada(false);
    setError("");
  };

  const volver = () => {
    if (seleccionadaId) {
      volverALista();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("MainDrawer", { screen: "Inicio" });
    }
  };

  const abrir = (invitacion) => {
    setSeleccionadaId(invitacion.id);
    setAceptando(false);
    setConfirmada(false);
    setError("");
    setForm({
      servicio: "",
      precio: "",
      direccion: "",
      horario: "",
      imagenes: [],
    });
  };

  const actualizarForm = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (error) setError("");
  };

  const agregarFotos = async () => {
    const nuevas = await elegirFotosBase64(MAX_FOTOS - form.imagenes.length);
    if (nuevas.length > 0) {
      setForm((prev) => ({ ...prev, imagenes: [...prev.imagenes, ...nuevas] }));
    }
  };

  const declinar = () => {
    Alert.alert(
      "Declinar invitación",
      "¿Seguro que no quieres participar en esta ruta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Declinar",
          style: "destructive",
          onPress: async () => {
            try {
              setGuardando(true);
              await responderInvitacion(seleccionada.id, false);
              volverALista();
            } catch (err) {
              console.warn("Error al declinar:", err);
              Alert.alert("No se pudo declinar", "Inténtalo de nuevo.");
            } finally {
              setGuardando(false);
            }
          },
        },
      ]
    );
  };

  const aceptar = async () => {
    const precio = Number(String(form.precio).replace(",", "."));
    if (
      !form.servicio.trim() ||
      !form.direccion.trim() ||
      !form.horario.trim()
    ) {
      setError("Completa todos los campos.");
      return;
    }
    if (!Number.isFinite(precio) || precio <= 0) {
      setError("Escribe un precio válido (solo números).");
      return;
    }
    try {
      setGuardando(true);
      await responderInvitacion(seleccionada.id, true, {
        servicio: form.servicio.trim(),
        precio,
        direccion: form.direccion.trim(),
        horario: form.horario.trim(),
        imagenes: form.imagenes,
      });
      setConfirmada(true);
    } catch (err) {
      console.error("Error al aceptar la invitación:", err);
      Alert.alert("No se pudo guardar", "Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  // ---------------- Pantallas ----------------
  const renderLista = () => {
    if (cargando) {
      return <ActivityIndicator size="large" color={VERDE} style={{ marginTop: 40 }} />;
    }
    if (invitaciones.length === 0) {
      return (
        <Text style={[s.aviso, { marginTop: 40 }]}>
          No tienes invitaciones a rutas creativas por ahora.
        </Text>
      );
    }
    return invitaciones.map((inv) => {
      const insignia = insigniaDe(inv.estado);
      return (
        <TouchableOpacity
          key={inv.id}
          style={s.tarjeta}
          onPress={() => abrir(inv)}
          activeOpacity={0.7}
        >
          <View style={s.tarjetaMiniatura}>
            <Ionicons name="map-outline" size={30} color={VERDE} />
          </View>
          <View style={s.tarjetaCuerpo}>
            <Text style={s.tarjetaTitulo} numberOfLines={2}>
              {inv.rutaNombre}
            </Text>
            <Text style={s.tarjetaDetalle}>Te invitó {inv.creadorNombre}</Text>
          </View>
          <View style={[s.insignia, { backgroundColor: insignia.fondo }]}>
            <Text style={[s.insigniaTexto, { color: insignia.color }]}>
              {insignia.texto}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  const renderFormulario = () => (
    <>
      <Text style={s.invitacionTexto}>
        Cuéntanos qué ofrecerás en esta ruta con tu negocio.
      </Text>

      <Text style={s.etiqueta}>Servicio que ofrece</Text>
      <TextInput
        style={s.input}
        placeholder="Escribir"
        placeholderTextColor="#9A9A9A"
        value={form.servicio}
        onChangeText={(t) => actualizarForm("servicio", t)}
        maxLength={80}
      />

      <Text style={s.etiqueta}>Precio (C$)</Text>
      <TextInput
        style={s.input}
        placeholder="Escribir"
        placeholderTextColor="#9A9A9A"
        keyboardType="numeric"
        value={form.precio}
        onChangeText={(t) => actualizarForm("precio", t)}
        maxLength={9}
      />

      <Text style={s.etiqueta}>Dirección breve</Text>
      <TextInput
        style={[s.input, s.inputMultilinea]}
        placeholder="Escribir"
        placeholderTextColor="#9A9A9A"
        multiline
        value={form.direccion}
        onChangeText={(t) => actualizarForm("direccion", t)}
        maxLength={200}
      />

      <Text style={s.etiqueta}>Horario disponible</Text>
      <View style={[s.input, s.inputConIcono]}>
        <TextInput
          style={s.inputConIconoTexto}
          placeholder="Sab y Domin, 8:00 am - 9:00 pm"
          placeholderTextColor="#9A9A9A"
          value={form.horario}
          onChangeText={(t) => actualizarForm("horario", t)}
          maxLength={80}
        />
        <Ionicons name="time-outline" size={22} color="#111111" />
      </View>

      <Text style={s.etiqueta}>Fotos</Text>
      <TouchableOpacity style={s.multimedia} onPress={agregarFotos} activeOpacity={0.7}>
        <Text style={s.multimediaTexto}>+ Agregar multimedia</Text>
      </TouchableOpacity>
      {form.imagenes.length > 0 && (
        <View style={s.miniaturasFila}>
          {form.imagenes.map((uri, indice) => (
            <View key={`foto-${indice}`} style={s.miniaturaContenedor}>
              <Image source={{ uri }} style={s.miniatura} />
              <TouchableOpacity
                style={s.miniaturaQuitar}
                onPress={() =>
                  setForm((prev) => ({
                    ...prev,
                    imagenes: prev.imagenes.filter((_, i) => i !== indice),
                  }))
                }
                accessibilityLabel="Quitar foto"
              >
                <Ionicons name="close" size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {!!error && <Text style={s.error}>{error}</Text>}

      <TouchableOpacity
        style={[s.botonLima, guardando && s.botonDeshabilitado]}
        onPress={aceptar}
        disabled={guardando}
        activeOpacity={0.85}
      >
        {guardando ? (
          <ActivityIndicator color="#1A1A1A" />
        ) : (
          <Text style={s.botonLimaTexto}>Guardar y aceptar</Text>
        )}
      </TouchableOpacity>
    </>
  );

  const renderDetalle = () => {
    const pendiente = seleccionada.estado === ESTADO_PARADA.INVITADO;
    return (
      <>
        <Text style={s.invitacionTitulo}>Invitación a una ruta</Text>
        <View style={[s.tarjeta, { marginTop: 8 }]}>
          <View style={s.tarjetaMiniatura}>
            <Ionicons
              name={iconoDeCategoria(seleccionada.categoria)}
              size={32}
              color={VERDE}
            />
          </View>
          <View style={s.tarjetaCuerpo}>
            <Text style={s.tarjetaTitulo}>{seleccionada.rutaNombre}</Text>
            <Text style={s.tarjetaDetalle}>
              Creada por {seleccionada.creadorNombre}
            </Text>
          </View>
        </View>

        <Text style={s.invitacionTexto}>
          <Text style={s.invitacionNegrita}>{seleccionada.creadorNombre}</Text>{" "}
          te invitó a formar parte de esta ruta creativa con tu negocio{" "}
          <Text style={s.invitacionNegrita}>{seleccionada.titulo}</Text>.
        </Text>

        {pendiente && !aceptando && (
          <View style={s.botonesFila}>
            <TouchableOpacity
              style={[s.botonVerde, s.botonFilaMitad, { marginRight: 8 }]}
              onPress={() => setAceptando(true)}
              activeOpacity={0.85}
            >
              <Text style={s.botonVerdeTexto}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.botonContorno, s.botonFilaMitad, { marginLeft: 8 }]}
              onPress={declinar}
              disabled={guardando}
              activeOpacity={0.85}
            >
              <Text style={s.botonContornoTexto}>Declinar</Text>
            </TouchableOpacity>
          </View>
        )}

        {pendiente && aceptando && renderFormulario()}

        {seleccionada.estado === ESTADO_PARADA.ACEPTADA && (
          <View style={{ marginTop: 8 }}>
            <Text style={s.invitacionTexto}>
              Servicio:{" "}
              <Text style={s.invitacionNegrita}>{seleccionada.servicio}</Text>
            </Text>
            <Text style={s.invitacionTexto}>
              Precio:{" "}
              <Text style={s.invitacionNegrita}>
                {formatearPrecio(seleccionada.precio)}
              </Text>
            </Text>
            <Text style={s.invitacionTexto}>Horario: {seleccionada.horario}</Text>
            <Text style={s.invitacionTexto}>Dirección: {seleccionada.direccion}</Text>
          </View>
        )}
        {seleccionada.estado === ESTADO_PARADA.RECHAZADA && (
          <Text style={s.aviso}>Declinaste esta invitación.</Text>
        )}
      </>
    );
  };

  const renderConfirmacion = () => (
    <View style={[s.confirmacionContenedor, { paddingTop: 48 }]}>
      <Ionicons name="checkmark-circle" size={72} color={LIMA} />
      <Text style={[s.confirmacionTitulo, { marginTop: 12 }]}>¡Listo!</Text>
      <Text style={s.aviso}>
        Aceptaste participar en la ruta {seleccionada?.rutaNombre}. Cuando el
        creador la publique, aparecerá con tu servicio y tu precio.
      </Text>
      <TouchableOpacity
        style={[s.botonVerde, { alignSelf: "stretch" }]}
        onPress={volverALista}
        activeOpacity={0.85}
      >
        <Text style={s.botonVerdeTexto}>Volver a mis invitaciones</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[s.container, { paddingTop: insets.top + 8 }]}>
      <View style={s.header}>
        <TouchableOpacity
          style={s.botonAtras}
          onPress={volver}
          accessibilityLabel="Volver"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </TouchableOpacity>
        <Text style={s.tituloPantalla}>Invitaciones</Text>
        <View style={s.botonAtras} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            s.contenido,
            { paddingTop: 12, paddingBottom: insets.bottom + 32 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {!seleccionada && renderLista()}
          {seleccionada && !confirmada && renderDetalle()}
          {seleccionada && confirmada && renderConfirmacion()}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
