/**
 * InvitacionesRuta: componente/pantalla de la aplicación Ruta505.
 *
 * Flujo (se abre desde la campana):
 *   1. Notificaciones: tarjetas de invitación con "Declinar" y "Ver invitación".
 *   2. Invitación a una ruta: participantes (creador, aceptaron, en espera) y
 *      botones Aceptar / Declinar.
 *   3. Aceptar -> formulario con el servicio que ofrece el negocio.
 *   4. "¡Listo!": confirmación (también es lo que se ve al abrir una
 *      invitación que ya aceptaste).
 */

import React, { useEffect, useMemo, useState } from "react";
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
import CampoHorario from "../../components/common/CampoHorario";
import {
  escucharInvitaciones,
  escucharParadasDeRuta,
  ESTADO_PARADA,
  responderInvitacion,
  DIAS_RUTA,
  HORAS,
  separarHorario,
} from "../../services/rutasService";
import {
  buscarCategoria,
  iconoDeCategoria,
} from "../../services/Categoriasexperiencias";
import { elegirFotosBase64 } from "../../utils/imagenes";
import {
  crearRutaStyle as s,
  VERDE,
  LIMA,
} from "../../styles/rutas/crearRutaStyle";
import {
  invitacionesRutaStyle as i,
  VERDE_OSCURO,
  AZUL_ACEPTO,
} from "../../styles/rutas/invitacionesRutaStyle";

// Imagen de la pantalla "¡Listo!" (la mascota). Para ponerla, importa el
// archivo aquí, por ejemplo:
//   const IMAGEN_LISTO = require("../../assets/images/pinolito-listo.png");
// Mientras sea null, la pantalla deja el espacio libre.
const IMAGEN_LISTO = require("../../assets/pinolito/Pinolito-Pose-Sorprendido.png");;

const MAX_FOTOS = 2;

// Chip de estado de cada participante en "Invitación a una ruta".
function chipDe(parada, esMia) {
  if (esMia) return { texto: "Tú", fondo: LIMA, color: "#1A1A1A" };
  switch (parada.estado) {
    case ESTADO_PARADA.CREADOR:
      return { texto: "Creador", fondo: VERDE_OSCURO, color: "#FFFFFF" };
    case ESTADO_PARADA.ACEPTADA:
      return { texto: "Acepto", fondo: AZUL_ACEPTO, color: "#FFFFFF" };
    default:
      return { texto: "En espera", fondo: "#D6D6D6", color: "#7A7A7A" };
  }
}

// Invitaciones a rutas creativas que recibió el actor (se abre desde la campana).
/**
 * InvitacionesRuta.
 */
export default function InvitacionesRuta() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, profile } = useAuth();

  const [invitaciones, setInvitaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [seleccionadaId, setSeleccionadaId] = useState(null);
  const [aceptando, setAceptando] = useState(false); // muestra el formulario
  const [guardando, setGuardando] = useState(false);
  const [confirmada, setConfirmada] = useState(false); // evita un parpadeo al aceptar
  const [procesandoId, setProcesandoId] = useState(null); // declinando desde la tarjeta
  const [error, setError] = useState("");
  const [paradas, setParadas] = useState([]); // participantes de la ruta abierta
  const [paradasError, setParadasError] = useState(false);
  const [form, setForm] = useState({
    servicio: "",
    precio: "",
    direccion: "",
    dia: "",
    horaInicio: "",
    horaFin: "",
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

  const seleccionada = invitaciones.find((inv) => inv.id === seleccionadaId) ?? null;
  const rutaId = seleccionada?.rutaId;
  const creadorId = seleccionada?.creadorId;

  // Participantes de la ruta abierta (creador, quienes aceptaron y en espera).
  useEffect(() => {
    if (!rutaId || !creadorId) {
      setParadas([]);
      setParadasError(false);
      return undefined;
    }
    setParadasError(false);
    return escucharParadasDeRuta(rutaId, creadorId, setParadas, () => {
      setParadas([]);
      setParadasError(true);
    });
  }, [rutaId, creadorId]);

  // Si no se pudo leer toda la ruta, al menos se muestran el creador y el propio negocio.
  const participantes = useMemo(() => {
    if (!seleccionada) return [];
    const lista = paradas.filter((p) => p.estado !== ESTADO_PARADA.RECHAZADA);
    if (!lista.some((p) => p.actorId === user?.uid)) lista.push(seleccionada);
    if (!lista.some((p) => p.estado === ESTADO_PARADA.CREADOR)) {
      lista.unshift({
        id: `creador-${seleccionada.creadorId}`,
        estado: ESTADO_PARADA.CREADOR,
        titulo: seleccionada.creadorNombre,
        creadorNombre: seleccionada.creadorNombre,
        categoria: "",
        lugar: "",
      });
    }
    return lista;
  }, [paradas, seleccionada, user?.uid]);

  // Invitaciones ya aceptadas se muestran con la pantalla "¡Listo!".
  const mostrarListo =
    !!seleccionada &&
    (confirmada || seleccionada.estado === ESTADO_PARADA.ACEPTADA);

  // Las declinadas dejan de aparecer en Notificaciones.
  const visibles = invitaciones.filter((inv) => inv.estado !== ESTADO_PARADA.RECHAZADA);

  const volverALista = () => {
    setSeleccionadaId(null);
    setAceptando(false);
    setConfirmada(false);
    setError("");
  };

  const volver = () => {
    if (aceptando) {
      setAceptando(false);
      setError("");
    } else if (seleccionadaId) {
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
      dia: "",
    horaInicio: "",
    horaFin: "",
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

  // Declina desde la tarjeta de Notificaciones o desde el detalle.
  const declinar = (invitacion, volverDespues = false) => {
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
              setProcesandoId(invitacion.id);
              await responderInvitacion(invitacion.id, false);
              if (volverDespues) volverALista();
            } catch (err) {
              console.warn("Error al declinar:", err);
              Alert.alert("No se pudo declinar", "Inténtalo de nuevo.");
            } finally {
              setProcesandoId(null);
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
      !form.dia ||
      !form.horaInicio ||
      !form.horaFin
    ) {
      setError("Completa todos los campos.");
      return;
    }
    if (HORAS.indexOf(form.horaFin) <= HORAS.indexOf(form.horaInicio)) {
      setError("La hora de fin debe ser posterior a la hora de inicio.");
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
        dia: Number(form.dia),
      horario: `${form.horaInicio} - ${form.horaFin}`,
        imagenes: form.imagenes,
        telefono: profile?.telefono,
      });
      setAceptando(false);
      setConfirmada(true);
    } catch (err) {
      console.error("Error al aceptar la invitación:", err);
      Alert.alert("No se pudo guardar", "Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  // ---------------- Pantallas ----------------

  // 1) Notificaciones
  const renderNotificaciones = () => {
    if (cargando) {
      return <ActivityIndicator size="large" color={VERDE} style={{ marginTop: 40 }} />;
    }
    if (visibles.length === 0) {
      return (
        <Text style={[s.aviso, { marginTop: 40 }]}>
          No tienes invitaciones a rutas creativas por ahora.
        </Text>
      );
    }
    return visibles.map((inv) => {
      const pendiente = inv.estado === ESTADO_PARADA.INVITADO;
      return (
        <View key={inv.id} style={i.notificacion}>
          {/* TODO: foto del creador cuando exista en la invitación. */}
          <View style={i.notificacionAvatar}>
            <Ionicons name="map-outline" size={30} color={VERDE} />
          </View>
          <View style={i.notificacionCuerpo}>
            <Text style={i.notificacionTitulo}>Nueva invitación</Text>
            <Text style={i.notificacionTexto}>
              {pendiente
                ? `${inv.creadorNombre} te invitó a formar parte de una ruta creativa.`
                : `Aceptaste la invitación de ${inv.creadorNombre} a una ruta creativa.`}
            </Text>
            <View style={i.notificacionBotones}>
              {pendiente && (
                <TouchableOpacity
                  style={[i.botonChico, i.botonChicoGris]}
                  onPress={() => declinar(inv)}
                  disabled={procesandoId === inv.id}
                  activeOpacity={0.85}
                >
                  <Text style={i.botonChicoTexto}>Declinar</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[i.botonChico, i.botonChicoLima]}
                onPress={() => abrir(inv)}
                activeOpacity={0.85}
              >
                <Text style={i.botonChicoTexto}>Ver invitación</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    });
  };

  const renderFormulario = () => (
    <>
      <Text style={s.invitacionTexto}>
        Cuéntanos qué ofrecerás en esta ruta con tu negocio.
      </Text>

      <Text style={s.etiqueta}>Servicios que ofrece</Text>
      <TextInput
        style={s.input}
        placeholder="Escribir"
        placeholderTextColor="#9A9A9A"
        value={form.servicio}
        onChangeText={(t) => actualizarForm("servicio", t)}
        maxLength={80}
      />

      <Text style={s.etiqueta}>Precio</Text>
      <TextInput
        style={s.input}
        placeholder="Escribir"
        placeholderTextColor="#9A9A9A"
        keyboardType="numeric"
        value={form.precio}
        onChangeText={(t) => actualizarForm("precio", t)}
        maxLength={9}
      />

      <Text style={s.etiqueta}>Descripción breve</Text>
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
      <CampoHorario
        estiloCampo={s.input}
        valor={{ dia: form.dia, horaInicio: form.horaInicio, horaFin: form.horaFin }}
        onChange={(h) => {
          setForm((prev) => ({ ...prev, ...h }));
          if (error) setError("");
        }}
      />

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
        style={[s.botonVerde, guardando && s.botonDeshabilitado]}
        onPress={aceptar}
        disabled={guardando}
        activeOpacity={0.85}
      >
        {guardando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={s.botonVerdeTexto}>Guardar y aceptar</Text>
        )}
      </TouchableOpacity>
    </>
  );

  // 2) Invitación a una ruta: participantes y botones
  const renderParticipante = (p) => {
    const esMia = p.actorId === user?.uid;
    const chip = chipDe(p, esMia);
    const tipo = buscarCategoria(p.categoria)?.label;
    const propietario =
      p.estado === ESTADO_PARADA.CREADOR ? p.creadorNombre : p.propietarioNombre;
    const calificacion = Number(p.calificacion);
    return (
      <View key={p.id} style={i.participante}>
        <View style={i.participanteIcono}>
          <Ionicons name={iconoDeCategoria(p.categoria)} size={34} color={LIMA} />
        </View>
        <View style={i.participanteCuerpo}>
          <Text style={i.participanteNombre} numberOfLines={2}>
            {p.titulo || "Negocio"}
          </Text>
          {!!tipo && <Text style={i.participanteTipo}>{tipo}</Text>}
          {!!p.lugar && (
            <View style={i.participanteFila}>
              <Ionicons name="location" size={11} color="#0B9BE3" />
              <Text style={i.participanteFilaTexto} numberOfLines={1}>
                {p.lugar}
              </Text>
            </View>
          )}
          {Number.isFinite(calificacion) && calificacion > 0 && (
            <View style={i.participanteFila}>
              <Ionicons name="star" size={11} color="#F29100" />
              <Text style={i.participanteFilaTexto}>{calificacion.toFixed(1)}</Text>
            </View>
          )}
          {!!propietario && (
            <Text style={i.participantePropietario}>
              Propietario:{" "}
              <Text style={i.participantePropietarioNombre}>{propietario}</Text>
            </Text>
          )}
        </View>
        <View style={[i.estadoChip, { backgroundColor: chip.fondo }]}>
          <Text style={[i.estadoChipTexto, { color: chip.color }]}>{chip.texto}</Text>
        </View>
      </View>
    );
  };

  const renderDetalle = () => {
    const pendiente = seleccionada.estado === ESTADO_PARADA.INVITADO;
    return (
      <>
        <Text style={i.subtituloRuta}>
          Ruta creativa {seleccionada.rutaNombre}
        </Text>

        {participantes.map(renderParticipante)}

        {paradasError && (
          <Text style={i.avisoParticipantes}>
            No se pudo cargar la lista completa de participantes.
          </Text>
        )}

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
              onPress={() => declinar(seleccionada, true)}
              disabled={procesandoId === seleccionada.id}
              activeOpacity={0.85}
            >
              <Text style={s.botonContornoTexto}>Declinar</Text>
            </TouchableOpacity>
          </View>
        )}

        {pendiente && aceptando && renderFormulario()}
      </>
    );
  };

  // 3) "¡Listo!": confirmación con espacio para la imagen
  const renderListo = () => (
    <View style={[i.listoContenedor, { paddingBottom: insets.bottom + 28 }]}>
      <View style={i.listoCentro}>
        <View style={i.listoImagenEspacio}>
          {IMAGEN_LISTO ? (
            <Image source={IMAGEN_LISTO} style={i.listoImagen} resizeMode="contain" />
          ) : null}
        </View>
        <Text style={i.listoTitulo}>¡Listo!</Text>
        <Text style={i.listoTexto}>
          Aceptaste participar en la ruta{" "}
          <Text style={i.listoTextoNegrita}>{seleccionada?.rutaNombre}</Text>.
          Cuando el creador la publique, aparecerá con tu servicio y precio.
        </Text>
      </View>
      <TouchableOpacity
        style={s.botonVerde}
        onPress={volverALista}
        activeOpacity={0.85}
      >
        <Text style={s.botonVerdeTexto}>Volver a mis invitaciones</Text>
      </TouchableOpacity>
    </View>
  );

  const titulo = mostrarListo
    ? ""
    : seleccionada
      ? "Invitación a una ruta"
      : "Notificaciones";

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
        <Text style={s.tituloPantalla}>{titulo}</Text>
        <View style={s.botonAtras} />
      </View>

      {mostrarListo ? (
        renderListo()
      ) : (
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
            {!seleccionada && renderNotificaciones()}
            {seleccionada && renderDetalle()}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}
