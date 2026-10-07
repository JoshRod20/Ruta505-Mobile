import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
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
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../context/AuthContext";
import { escucharNegocios } from "../../services/Negociosservice";
import {
  aliadosAceptados,
  aliadosInvitados,
  actualizarPasoDatos,
  calcularTotal,
  cambiarEstadoRuta,
  crearRuta,
  ESTADO_PARADA,
  ESTADO_RUTA,
  escucharMisRutas,
  escucharParadasDeRuta,
  formatearPrecio,
  invitarActor,
  MINIMO_ALIADOS,
  publicarRuta,
} from "../../services/rutasService";
import {
  CATEGORIAS_EXPERIENCIA,
  iconoDeCategoria,
} from "../../services/Categoriasexperiencias";
import { elegirFotosBase64 } from "../../utils/imagenes";
import {
  crearRutaStyle as s,
  VERDE,
  LIMA,
  NARANJA,
  AZUL,
} from "../../styles/rutas/crearRutaStyle";

const MAX_FOTOS = 2;

const TITULOS = {
  2: { pantalla: "Servicios que ofreces", seccion: "Completar datos" },
  3: { pantalla: "Nueva Ruta Creativa", seccion: "Buscar aliados" },
  4: { pantalla: "Ruta Creativa En Espera", seccion: "Invitaciones enviadas" },
  5: { pantalla: "Ruta Creativa", seccion: "Publicación de ruta" },
  6: { pantalla: "Ruta Creativa", seccion: "Ruta publicada" },
};

const nombreDeCategoria = (id) =>
  CATEGORIAS_EXPERIENCIA.find((c) => c.id === id)?.label ?? "";

const normalizar = (texto) =>
  (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function distanciaKm(a, b) {
  const R = 6371;
  const rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function insigniaDe(parada) {
  switch (parada.estado) {
    case ESTADO_PARADA.CREADOR:
      return { texto: "Tú", fondo: LIMA, color: "#1A1A1A" };
    case ESTADO_PARADA.ACEPTADA:
      return { texto: "Aceptó", fondo: AZUL, color: "#FFFFFF" };
    case ESTADO_PARADA.RECHAZADA:
      return { texto: "Rechazó", fondo: NARANJA, color: "#1A1A1A" };
    default:
      return { texto: "En espera", fondo: "#B5B5B5", color: "#1A1A1A" };
  }
}

// Tarjeta de una parada (pasos 4, 5 y 6).
function TarjetaParada({ parada, mostrarPrecio = false }) {
  const insignia = insigniaDe(parada);
  return (
    <View style={s.tarjeta}>
      <View style={s.tarjetaMiniatura}>
        <Ionicons
          name={iconoDeCategoria(parada.categoria)}
          size={32}
          color={VERDE}
        />
      </View>
      <View style={s.tarjetaCuerpo}>
        <Text style={s.tarjetaTitulo} numberOfLines={2}>
          {parada.titulo}
        </Text>
        <Text style={s.tarjetaDetalle}>{nombreDeCategoria(parada.categoria)}</Text>
        {!!parada.lugar && (
          <View style={s.tarjetaLugarFila}>
            <Ionicons name="location" size={13} color="#1E9BD7" />
            <Text style={[s.tarjetaDetalle, { marginLeft: 4 }]}>
              {parada.lugar}
            </Text>
          </View>
        )}
        {mostrarPrecio && (
          <Text style={s.tarjetaPrecio}>{formatearPrecio(parada.precio)}</Text>
        )}
      </View>
      {(!mostrarPrecio || parada.estado === ESTADO_PARADA.CREADOR) && (
        <View style={[s.insignia, { backgroundColor: insignia.fondo }]}>
          <Text style={[s.insigniaTexto, { color: insignia.color }]}>
            {insignia.texto}
          </Text>
        </View>
      )}
    </View>
  );
}

// Asistente de la Ruta Creativa: pasos 2 a 6 (el paso 1 es la pestaña "+").
export default function CrearRutaCreativa() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { params } = useRoute();
  const { user, profile } = useAuth();

  const [paso, setPaso] = useState(params?.paso ?? 2);
  const [rutaId, setRutaId] = useState(params?.rutaId ?? null);
  const [rutas, setRutas] = useState([]);
  const [paradas, setParadas] = useState([]);
  const [negocios, setNegocios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    servicio: "",
    precio: "",
    direccion: "",
    horario: "",
    imagenes: [],
  });
  const [formCargado, setFormCargado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [invitando, setInvitando] = useState(null);
  const [error, setError] = useState("");

  const uid = user?.uid;
  const nombreCreador = profile?.nombreCompleto ?? "";

  useEffect(() => {
    if (!uid) return undefined;
    return escucharMisRutas(uid, setRutas);
  }, [uid]);

  useEffect(() => {
    if (!uid || !rutaId) return undefined;
    return escucharParadasDeRuta(rutaId, uid, setParadas);
  }, [uid, rutaId]);

  useEffect(() => escucharNegocios(setNegocios), []);

  const ruta = rutas.find((r) => r.id === rutaId) ?? null;
  const miParada = paradas.find((p) => p.estado === ESTADO_PARADA.CREADOR);
  // El id del documento del negocio es el uid del actor.
  const negocio = useMemo(
    () => negocios.find((p) => p.id === uid) ?? null,
    [negocios, uid]
  );

  // Al retomar una ruta, se rellena el formulario con lo que ya se guardó.
  useEffect(() => {
    if (formCargado || !ruta || !miParada) return;
    setForm({
      nombre: ruta.nombre ?? "",
      servicio: miParada.servicio ?? "",
      precio: miParada.precio != null ? String(miParada.precio) : "",
      direccion: miParada.direccion ?? "",
      horario: miParada.horario ?? "",
      imagenes: miParada.imagenes ?? [],
    });
    setFormCargado(true);
  }, [ruta, miParada, formCargado]);

  const candidatos = useMemo(() => {
    const yaParticipan = new Set(paradas.map((p) => p.actorId));
    const texto = normalizar(busqueda);
    return negocios
      .filter(
        (p) =>
          p.id !== uid &&
          typeof p.lat === "number" &&
          typeof p.lng === "number"
      )
      .filter((p) =>
        texto
          ? normalizar(
              `${p.titulo} ${nombreDeCategoria(p.categoria)} ${p.lugar ?? ""}`
            ).includes(texto)
          : true
      )
      .map((p) => ({
        ...p,
        yaInvitado: yaParticipan.has(p.id),
        distancia: negocio ? distanciaKm(negocio, p) : 0,
      }))
      .sort((a, b) => a.distancia - b.distancia);
  }, [negocios, paradas, busqueda, negocio, uid]);

  const numInvitados = aliadosInvitados(paradas).length;
  const numAceptados = aliadosAceptados(paradas).length;

  const actualizarForm = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (error) setError("");
  };

  const volver = () => {
    if (paso === 2) {
      navigation.canGoBack()
        ? navigation.goBack()
        : navigation.navigate("MainDrawer");
    } else if (paso === 6) {
      navigation.navigate("MainDrawer", { screen: "Inicio" });
    } else {
      setPaso(paso - 1);
    }
  };

  const agregarFotos = async () => {
    const nuevas = await elegirFotosBase64(MAX_FOTOS - form.imagenes.length);
    if (nuevas.length > 0) {
      setForm((prev) => ({ ...prev, imagenes: [...prev.imagenes, ...nuevas] }));
    }
  };

  // ---------- Paso 2: completar datos ----------
  const guardarPaso2 = async () => {
    const precio = Number(String(form.precio).replace(",", "."));
    if (
      !form.nombre.trim() ||
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
    if (!negocio) {
      setError("Primero registra tu negocio en el mapa.");
      return;
    }

    const datos = {
      servicio: form.servicio.trim(),
      precio,
      direccion: form.direccion.trim(),
      horario: form.horario.trim(),
      imagenes: form.imagenes,
    };

    try {
      setGuardando(true);
      if (!rutaId) {
        const id = await crearRuta({
          creador: { uid, nombre: nombreCreador },
          nombre: form.nombre.trim(),
          negocio: {
            id: negocio.id,
            titulo: negocio.titulo,
            categoria: negocio.categoria,
            lugar: negocio.lugar,
          },
          datos,
        });
        setRutaId(id);
        setFormCargado(true);
      } else {
        await actualizarPasoDatos({
          rutaId,
          creadorId: uid,
          nombre: form.nombre.trim(),
          datos,
          idsParadas: paradas.map((p) => p.id),
        });
      }
      setPaso(3);
    } catch (err) {
      console.error("Error al guardar la ruta:", err);
      Alert.alert(
        "No se pudo guardar",
        "Revisa tu conexión e inténtalo de nuevo."
      );
    } finally {
      setGuardando(false);
    }
  };

  // ---------- Paso 3: invitar aliados ----------
  const invitar = async (candidato) => {
    if (!rutaId) return;
    try {
      setInvitando(candidato.id);
      await invitarActor({
        ruta: { id: rutaId, nombre: ruta?.nombre ?? form.nombre.trim() },
        creador: { uid, nombre: nombreCreador },
        destino: {
          actorId: candidato.id,
          ubicacionId: candidato.id,
          titulo: candidato.titulo,
          categoria: candidato.categoria,
          lugar: candidato.lugar,
        },
      });
    } catch (err) {
      console.warn("Error al invitar:", err);
      Alert.alert(
        "No se pudo invitar",
        "Es posible que este actor aún no tenga su perfil aprobado."
      );
    } finally {
      setInvitando(null);
    }
  };

  const irAPaso4 = async () => {
    try {
      setGuardando(true);
      if (ruta?.estado === ESTADO_RUTA.BORRADOR) {
        await cambiarEstadoRuta(rutaId, ESTADO_RUTA.EN_ESPERA);
      }
      setPaso(4);
    } catch (err) {
      console.warn("Error al enviar invitaciones:", err);
      Alert.alert("No se pudo continuar", "Inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  // ---------- Paso 5: publicar ----------
  const publicar = async () => {
    if (numAceptados < MINIMO_ALIADOS) return;
    try {
      setGuardando(true);
      await publicarRuta({ rutaId, paradas });
      setPaso(6);
    } catch (err) {
      console.error("Error al publicar la ruta:", err);
      Alert.alert("No se pudo publicar", "Inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  const titulos = TITULOS[paso];

  // ================= Render de cada paso =================
  const renderPaso2 = () => (
    <>
      <Text style={s.etiqueta}>Nombre de la ruta</Text>
      <TextInput
        style={s.input}
        placeholder="Escribir"
        placeholderTextColor="#9A9A9A"
        value={form.nombre}
        onChangeText={(t) => actualizarForm("nombre", t)}
        maxLength={80}
      />

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
      <TouchableOpacity
        style={s.multimedia}
        onPress={agregarFotos}
        activeOpacity={0.7}
      >
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
        onPress={guardarPaso2}
        disabled={guardando}
        activeOpacity={0.85}
      >
        {guardando ? (
          <ActivityIndicator color="#1A1A1A" />
        ) : (
          <Text style={s.botonLimaTexto}>Siguiente</Text>
        )}
      </TouchableOpacity>
    </>
  );

  const renderPaso3 = () => (
    <>
      <Text style={s.indicacion}>
        Debe invitar al menos a {MINIMO_ALIADOS} actores culturales para crear
        una ruta creativa.
      </Text>

      <View style={s.buscador}>
        <View style={s.buscadorIcono}>
          <Ionicons name="search" size={22} color="#FFFFFF" />
        </View>
        <TextInput
          style={s.buscadorInput}
          placeholder="Buscar"
          placeholderTextColor="#9A9A9A"
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {negocio && (
        <View style={s.miNegocio}>
          <View style={s.tarjetaMiniatura}>
            <Ionicons
              name={iconoDeCategoria(negocio.categoria)}
              size={32}
              color={VERDE}
            />
          </View>
          <View style={s.tarjetaCuerpo}>
            <Text style={s.miNegocioCategoria}>
              {nombreDeCategoria(negocio.categoria)}
            </Text>
            <Text style={s.tarjetaDetalle}>{negocio.titulo}</Text>
          </View>
          <View style={[s.insignia, { backgroundColor: LIMA }]}>
            <Text style={[s.insigniaTexto, { color: "#1A1A1A" }]}>Tú</Text>
          </View>
        </View>
      )}

      <Text style={s.seccionTitulo}>Lugares cerca de tí</Text>
      {candidatos.length === 0 ? (
        <Text style={s.aviso}>
          {busqueda
            ? "No encontramos lugares con esa búsqueda."
            : "Aún no hay otros negocios registrados para invitar."}
        </Text>
      ) : (
        <FlatList
          data={candidatos}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.carrusel}
          renderItem={({ item }) => {
            const foto = item.imagenes?.[0] ?? item.imagenUrls?.[0];
            return (
              <View style={s.tarjetaAliado}>
                <View style={s.aliadoImagenCaja}>
                  {foto ? (
                    <Image source={{ uri: foto }} style={s.aliadoImagen} />
                  ) : (
                    <Ionicons
                      name={iconoDeCategoria(item.categoria)}
                      size={44}
                      color={VERDE}
                    />
                  )}
                </View>
                <Text style={s.aliadoTitulo} numberOfLines={2}>
                  {item.titulo}
                </Text>
                <View style={s.aliadoLugarFila}>
                  <Ionicons name="location" size={18} color={VERDE} />
                  <Text style={s.aliadoLugar} numberOfLines={1}>
                    {item.lugar || nombreDeCategoria(item.categoria)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    s.botonInvitar,
                    item.yaInvitado && s.botonInvitarInvitado,
                  ]}
                  onPress={() => invitar(item)}
                  disabled={item.yaInvitado || invitando === item.id}
                  activeOpacity={0.85}
                >
                  {invitando === item.id ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={s.botonInvitarTexto}>
                      {item.yaInvitado ? "Invitado" : "Invitar"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      <Text style={s.contadorInvitados}>
        Invitaciones enviadas: {numInvitados} (mínimo {MINIMO_ALIADOS})
      </Text>

      <TouchableOpacity
        style={[
          s.botonLima,
          (numInvitados < MINIMO_ALIADOS || guardando) && s.botonDeshabilitado,
        ]}
        onPress={irAPaso4}
        disabled={numInvitados < MINIMO_ALIADOS || guardando}
        activeOpacity={0.85}
      >
        {guardando ? (
          <ActivityIndicator color="#1A1A1A" />
        ) : (
          <Text style={s.botonLimaTexto}>Siguiente</Text>
        )}
      </TouchableOpacity>
    </>
  );

  const renderPaso4o5 = () => (
    <>
      {paradas.map((p) => (
        <TarjetaParada key={p.id} parada={p} />
      ))}

      {paso === 4 ? (
        <>
          <Text style={s.contadorInvitados}>
            Han aceptado {numAceptados} de {MINIMO_ALIADOS} aliados necesarios.
          </Text>
          {numAceptados >= MINIMO_ALIADOS ? (
            <TouchableOpacity
              style={s.botonVerde}
              onPress={() => setPaso(5)}
              activeOpacity={0.85}
            >
              <Text style={s.botonVerdeTexto}>Continuar</Text>
            </TouchableOpacity>
          ) : (
            <View style={[s.botonContorno, s.botonDeshabilitado]}>
              <Text style={s.botonContornoTexto}>
                Publicar (espera aceptación)
              </Text>
            </View>
          )}
          <TouchableOpacity onPress={() => setPaso(3)}>
            <Text style={[s.enlace, s.enlaceSubrayado]}>
              Invitar a más actores
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={[
            s.botonVerde,
            (numAceptados < MINIMO_ALIADOS || guardando) &&
              s.botonDeshabilitado,
          ]}
          onPress={publicar}
          disabled={numAceptados < MINIMO_ALIADOS || guardando}
          activeOpacity={0.85}
        >
          {guardando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={s.botonVerdeTexto}>Publicar</Text>
          )}
        </TouchableOpacity>
      )}
    </>
  );

  const renderPaso6 = () => (
    <>
      <Text style={s.nombreRutaPublicada}>{ruta?.nombre ?? form.nombre}</Text>
      {paradas.map((p) => (
        <TarjetaParada key={p.id} parada={p} mostrarPrecio />
      ))}
      <View style={s.totalFila}>
        <Text style={s.totalEtiqueta}>Total de la ruta creativa:</Text>
        <Text style={s.totalValor}>{formatearPrecio(calcularTotal(paradas))}</Text>
      </View>
      <TouchableOpacity
        style={s.botonVerde}
        onPress={() => navigation.navigate("MainDrawer", { screen: "Inicio" })}
        activeOpacity={0.85}
      >
        <Text style={s.botonVerdeTexto}>Listo</Text>
      </TouchableOpacity>
    </>
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
        <Text style={s.tituloPantalla}>{titulos.pantalla}</Text>
        <View style={s.botonAtras} />
      </View>

      <View style={s.subHeader}>
        <Text style={s.subHeaderTexto}>{titulos.seccion}</Text>
        <View style={s.contadorPaso}>
          <Text style={s.contadorPasoTexto}>{Math.min(paso, 5)} / 5</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            s.contenido,
            { paddingBottom: insets.bottom + 32 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {paso === 2 && renderPaso2()}
          {paso === 3 && renderPaso3()}
          {(paso === 4 || paso === 5) && renderPaso4o5()}
          {paso === 6 && renderPaso6()}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
