/**
 * MapaNicaragua: componente/pantalla de la aplicación Ruta505.
 *
 * Los cambios para la recomendación de Pinolito están marcados con [PINOLITO].
 */

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
  Image,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Map,
  Camera,
  GeoJSONSource,
  Layer,
  ViewAnnotation,
} from "@maplibre/maplibre-react-native";
import Geolocation from "@react-native-community/geolocation";
import { Ionicons } from "@expo/vector-icons";

import { mapaNicaraguaStyle } from "../styles/mapanicaragua/mapaNicaraguaStyle.js";
import { obtenerRuta, obtenerRutaConParadas } from "../services/osrmservice.js";
import {
  crearNegocio,
  actualizarNegocio,
  escucharNegocios,
} from "../services/Negociosservice.js";
import { obtenerNombreLugar } from "../services/geocodingservice.js";
import {
  iconoDeCategoria,
  colorDeCategoria,
} from "../services/Categoriasexperiencias.js";
import NavegacionRuta from "../components/NavegacionRuta.js";
import FormularioExperiencia from "../components/Formularioexperiencia.js";
import SeleccionarUbicacionMapa from "../components/Seleccionarubicacionmapa.js";
import BarraBusquedaMapa from "../components/BarraBusquedaMapa.js";
import TarjetaUbicacion from "../components/TarjetaUbicacion.js";
import CarruselLugares from "../components/CarruselLugares.js";
import {
  buscarLugaresDeInteres,
  distanciaKm,
} from "../services/lugaresRecomendadosService.js";
import { ROLES } from "../constants/roles";
import { useAuth } from "../context/AuthContext";
import { usePermisos } from "../hooks/usePermisos";
import useTabBarHeight from "../hooks/useTabBarHeight";
import { PERMISOS } from "../constants/permissions";
import { formatearPrecio } from "../services/rutasService.js";

// Estilo libre de OpenFreeMap (sin API key)
const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

// Si no hay GPS se recomiendan lugares alrededor de Masaya/Granada.
const CENTRO_RECOMENDACIONES = { lat: 11.9744, lon: -86.0942 };
// Cuánto esperar al GPS antes de usar el centro por defecto.
const ESPERA_GPS_MS = 10000;
// Radio (km) alrededor del usuario dentro del cual un lugar cuenta como "cercano".
const RADIO_CERCANO_KM = 25;

// [PINOLITO] Normaliza texto para comparar nombres sin tildes ni mayúsculas.
const normalizarTexto = (t) =>
  String(t ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

// Configuración inicial de Geolocation para Android
if (Platform.OS === "android") {
  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: "whenInUse",
    enableBackgroundLocationUpdates: false,
    locationProvider: "auto",
  });
}

// Solicita permisos de ubicación en Android
async function pedirPermisoUbicacion() {
  if (Platform.OS !== "android") return true;

  try {
    const resultado = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Permiso de ubicación",
        message:
          "Ruta505 necesita tu ubicación para mostrarte rutas y navegación desde donde estás.",
        buttonPositive: "Permitir",
        buttonNegative: "Ahora no",
      },
    );
    return resultado === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.warn("Error pidiendo permiso de ubicación:", error);
    return false;
  }
}

/**
 * MapaNicaragua.
 */
export default function MapaNicaragua() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useTabBarHeight();
  const mapRef = useRef(null);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { user, profile, role, sancionVigente } = useAuth();
  const { puede } = usePermisos();

  // Permiso para publicar si el rol lo permite y no hay sanción
  const puedePublicar = puede(PERMISOS.PUBLICAR_EXPERIENCIA) && !sancionVigente;

  const [puntos, setPuntos] = useState([]);
  // Lugares de interés de OpenStreetMap que aún no están registrados en la app
  const [lugaresExternos, setLugaresExternos] = useState([]);
  const esTurista = role === ROLES.TURISTA;

  // [PINOLITO] Lugar que Pinolito recomendó: se guarda aparte para que siempre tenga marcador
  const [lugarRecomendadoExtra, setLugarRecomendadoExtra] = useState(null);
  const [recomendadoPendiente, setRecomendadoPendiente] = useState(null);
  const [negociosCargados, setNegociosCargados] = useState(false);
  const seleccionRecomendadaRef = useRef(false);

  const [formularioVisible, setFormularioVisible] = useState(false);
  const [ubicacionParaGuardar, setUbicacionParaGuardar] = useState(null);
  const [selectorMapaVisible, setSelectorMapaVisible] = useState(false);
  const [negocioEnEdicion, setNegocioEnEdicion] = useState(null);
  const [formularioSesionId, setFormularioSesionId] = useState(0); // Forzar reset del formulario
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [epocaMarcadores, setEpocaMarcadores] = useState(0); // Forzar remount de ViewAnnotation
  const [lugarBuscado, setLugarBuscado] = useState(null); // { nombre, lat, lon } elegido en la barra de búsqueda
  // Punto de partida elegido por el usuario (null = su ubicación GPS)
  const [origenRuta, setOrigenRuta] = useState(null); // { lat, lon, nombre }
  const [eligiendoOrigen, setEligiendoOrigen] = useState(false); // esperando que busque o toque un lugar
  const [selectorParaOrigen, setSelectorParaOrigen] = useState(false); // el selector de mapa es para el origen
  const [destinoPendiente, setDestinoPendiente] = useState(null); // destino que se recuerda mientras se elige el origen

  const cerrarTarjeta = useCallback(() => {
    setPuntoSeleccionado(null);
    setEpocaMarcadores((e) => e + 1);
  }, []);

  // Ruta creativa que se está mostrando en el mapa (viene del paso 6 de crear ruta)
  const [rutaCreativaPendiente, setRutaCreativaPendiente] = useState(null);
  const [rutaCreativaMapa, setRutaCreativaMapa] = useState(null);
  const rutaCreativaActivaRef = useRef(false);

  const [ruta, setRuta] = useState(null);
  const [cargandoRuta, setCargandoRuta] = useState(false);
  const [navegando, setNavegando] = useState(false);
  // Si se navega una ruta creativa: índice de la parada a la que vamos (null = navegación normal)
  const [tramoActual, setTramoActual] = useState(null);
  const [ubicacionOrigen, setUbicacionOrigen] = useState(null);
  const [permisoConcedido, setPermisoConcedido] = useState(false);

  // Pide permisos y obtiene la ubicación al cargar el componente
  useEffect(() => {
    (async () => {
      const concedido = await pedirPermisoUbicacion();
      setPermisoConcedido(concedido);

      if (!concedido) {
        Alert.alert(
          "Sin permiso de ubicación",
          "No vamos a poder mostrar tu posición ni trazar rutas hasta que actives el permiso desde Ajustes del sistema.",
        );
        return;
      }

      obtenerUbicacionConReintento();
    })();
  }, []);

  // Escucha los negocios en tiempo real desde Firestore
  useEffect(() => {
    const cancelarSuscripcion = escucharNegocios(
      (negocios) => {
        // Descarta los que no tengan coordenadas válidas para evitar crashes
        const conCoordenadasValidas = negocios.filter(
          (n) =>
            typeof n.lat === "number" &&
            typeof n.lng === "number" &&
            !Number.isNaN(n.lat) &&
            !Number.isNaN(n.lng),
        );

        const descartados = negocios.length - conCoordenadasValidas.length;
        if (descartados > 0) {
          console.warn(
            `${descartados} negocio(s) sin lat/lng válidos — omitidos.`,
          );
        }

        setPuntos(conCoordenadasValidas);
        setNegociosCargados(true); // [PINOLITO]
      },
      (error) => {
        setNegociosCargados(true); // [PINOLITO] un fallo no debe dejar la selección esperando
        Alert.alert("No se pudieron cargar los negocios", error.message);
      },
    );

    return () => cancelarSuscripcion();
  }, []);

  // Recomendaciones externas (solo turista): se buscan cerca del usuario; si el
  // GPS tarda o no hay permiso, se usa el centro por defecto.
  const origenLat = ubicacionOrigen?.lat;
  const origenLon = ubicacionOrigen?.lon;
  useEffect(() => {
    if (!esTurista) return;
    let vigente = true;

    const cargar = (centro) =>
      buscarLugaresDeInteres(centro).then((lugares) => {
        if (vigente) setLugaresExternos(lugares);
      });

    if (origenLat != null && origenLon != null) {
      cargar({ lat: origenLat, lon: origenLon });
      return () => {
        vigente = false;
      };
    }

    const temporizador = setTimeout(
      () => cargar(CENTRO_RECOMENDACIONES),
      ESPERA_GPS_MS,
    );
    return () => {
      vigente = false;
      clearTimeout(temporizador);
    };
  }, [esTurista, origenLat, origenLon]);

  // Lista del carrusel: primero los negocios registrados (con fotos y datos
  // reales), luego los externos que no se repiten con ninguno registrado.
  // [PINOLITO] Incluye el lugar recomendado por Pinolito aunque la consulta
  // del mapa no lo haya traído.
  const recomendados = useMemo(() => {
    if (!esTurista) return [];
    const nombres = new Set(puntos.map((p) => normalizarTexto(p.titulo)));

    const externosBase =
      lugarRecomendadoExtra &&
      !lugaresExternos.some((l) => l.id === lugarRecomendadoExtra.id)
        ? [lugarRecomendadoExtra, ...lugaresExternos]
        : lugaresExternos;

    const externosNuevos = externosBase.filter(
      (l) =>
        !nombres.has(normalizarTexto(l.titulo)) &&
        !puntos.some(
          (p) =>
            distanciaKm(
              { lat: p.lat, lon: p.lng },
              { lat: l.lat, lon: l.lng },
            ) < 0.1,
        ),
    );

    const porCercania = (lista) =>
      ubicacionOrigen
        ? [...lista].sort(
            (a, b) =>
              distanciaKm(ubicacionOrigen, { lat: a.lat, lon: a.lng }) -
              distanciaKm(ubicacionOrigen, { lat: b.lat, lon: b.lng }),
          )
        : lista;

    // Solo lugares cercanos a la ubicación del usuario. Sin GPS no se puede
    // medir la distancia, así que en ese caso se muestra todo como antes.
    const soloCercanos = (lista) =>
      ubicacionOrigen
        ? lista.filter(
            (p) =>
              distanciaKm(ubicacionOrigen, { lat: p.lat, lon: p.lng }) <=
              RADIO_CERCANO_KM,
          )
        : lista;

    return [
      ...porCercania(soloCercanos(puntos)),
      ...porCercania(soloCercanos(externosNuevos)),
    ];
  }, [esTurista, puntos, lugaresExternos, ubicacionOrigen]);

  const externosVisibles = recomendados.filter((p) => p.externo);

  // ---------- Ruta creativa en el mapa ----------
  // 1) Recibe la ruta desde el paso 6 ("Ver ruta en el mapa") por parámetros.
  const rutaCreativaParam = route.params?.rutaCreativa;
  useEffect(() => {
    if (!rutaCreativaParam) return;
    setRutaCreativaPendiente(rutaCreativaParam);
    navigation.setParams({ rutaCreativa: undefined });
  }, [rutaCreativaParam, navigation]);

  // Desde el perfil público: "Ver en el mapa" abre la tarjeta de ese negocio.
  const puntoIdParam = route.params?.puntoId;
  useEffect(() => {
    if (!puntoIdParam || puntos.length === 0) return;
    const punto = puntos.find((p) => p.id === puntoIdParam);
    if (punto) handleSeleccionarPuntoBuscado(punto);
    navigation.setParams({ puntoId: undefined });
  }, [puntoIdParam, puntos]);

  // [PINOLITO] Desde Pinolito: "Ver mapa" con el lugar recomendado.
  const lugarRecomendadoParam = route.params?.lugarRecomendado;
  useEffect(() => {
    if (!lugarRecomendadoParam) return;
    setLugarRecomendadoExtra(lugarRecomendadoParam);
    setRecomendadoPendiente(lugarRecomendadoParam);
    navigation.setParams({ lugarRecomendado: undefined, ts: undefined });
  }, [lugarRecomendadoParam, navigation]);

  // [PINOLITO] Cuando ya cargaron los negocios: si el lugar coincide con uno
  // registrado se selecciona ese (con fotos y datos reales); si no, el externo
  // de OpenStreetMap.
  useEffect(() => {
    if (!recomendadoPendiente || !negociosCargados) return;

    const lugar = recomendadoPendiente;
    setRecomendadoPendiente(null);

    const registrado = puntos.find(
      (p) =>
        normalizarTexto(p.titulo) === normalizarTexto(lugar.titulo) ||
        distanciaKm(
          { lat: p.lat, lon: p.lng },
          { lat: lugar.lat, lon: lugar.lng },
        ) < 0.1,
    );

    seleccionRecomendadaRef.current = true; // evita que el GPS inicial pise la cámara
    handleSeleccionarPuntoBuscado(registrado ?? lugar);
  }, [recomendadoPendiente, negociosCargados, puntos]);

  // 2) Cuando ya están cargados los negocios, busca las coordenadas de cada
  //    parada, calcula la línea por carretera y encuadra la cámara.
  useEffect(() => {
    if (!rutaCreativaPendiente || puntos.length === 0) return;

    const pendiente = rutaCreativaPendiente;
    setRutaCreativaPendiente(null);

    const paradas = pendiente.paradas
      .map((parada, indice) => {
        const negocio = puntos.find((p) => p.id === parada.ubicacionId);
        return negocio
          ? { ...parada, lat: negocio.lat, lng: negocio.lng, orden: indice + 1 }
          : null;
      })
      .filter(Boolean)
      .map((parada, indice) => ({ ...parada, orden: indice + 1 }));

    if (paradas.length < 2) {
      Alert.alert(
        "No se pudo mostrar la ruta",
        "No se encontraron en el mapa las ubicaciones de las paradas.",
      );
      return;
    }

    (async () => {
      let coordenadas;
      let duracionMin = null;
      let distanciaKm = null;
      let aproximada = false;

      try {
        const resultado = await obtenerRutaConParadas(
          paradas.map((p) => ({ lat: p.lat, lon: p.lng })),
        );
        coordenadas = resultado.coordenadas;
        duracionMin = resultado.duracionMin;
        distanciaKm = resultado.distanciaKm;
      } catch (error) {
        // Sin servicio de rutas: se unen las paradas con líneas rectas
        console.warn("No se pudo calcular la ruta por carretera:", error);
        coordenadas = paradas.map((p) => [p.lat, p.lng]);
        aproximada = true;
      }

      rutaCreativaActivaRef.current = true;
      setPuntoSeleccionado(null);
      setRuta(null);
      setRutaCreativaMapa({
        id: pendiente.id,
        nombre: pendiente.nombre,
        total: pendiente.total,
        paradas,
        coordenadas,
        duracionMin,
        distanciaKm,
        aproximada,
      });

      // Encuadra todas las paradas (espera un momento a que el mapa esté listo)
      setTimeout(() => {
        const lats = coordenadas.map((c) => c[0]);
        const lons = coordenadas.map((c) => c[1]);
        cameraRef.current?.fitBounds(
          [Math.max(...lons), Math.max(...lats)],
          [Math.min(...lons), Math.min(...lats)],
          90,
          1200,
        );
      }, 500);
    })();
  }, [rutaCreativaPendiente, puntos]);

  const cerrarRutaCreativa = useCallback(() => {
    rutaCreativaActivaRef.current = false;
    setRutaCreativaMapa(null);
  }, []);

  // "Catarina, Masaya": primero el del perfil del actor; si falta, se calcula
  // con las coordenadas del negocio.
  async function calcularLugar(lat, lon) {
    const delPerfil = [profile?.municipio, profile?.departamento]
      .filter(Boolean)
      .join(", ");
    if (delPerfil) return delPerfil;
    return (await obtenerNombreLugar(lat, lon)) ?? "";
  }

  async function handleGuardarNegocio(datosFormulario) {
    const ubicacion = ubicacionParaGuardar ?? ubicacionOrigen;
    if (!user?.uid || !ubicacion) {
      Alert.alert(
        "No se pudo guardar",
        "No se detectó la ubicación de tu negocio. Elige el punto en el mapa e inténtalo de nuevo.",
      );
      return;
    }

    try {
      const lugar = await calcularLugar(ubicacion.lat, ubicacion.lon);
      const datos = {
        ...datosFormulario,
        lat: ubicacion.lat,
        lng: ubicacion.lon,
        lugar,
        // La referencia ya no se escribe en este formulario: se toma de la
        // dirección que el actor puso al registrarse (perfil del actor).
        ubicacionExacta: profile?.direccion ?? "",
      };

      // El negocio se guarda primero; sus fotos y videos van aparte. Si fallan
      // las fotos, el negocio ya existe: se avisa de eso y no de "no se pudo guardar".
      const resultado = negocioEnEdicion
        ? await actualizarNegocio(user.uid, datos)
        : await crearNegocio(user.uid, datos);

      if (resultado?.fallidos > 0) {
        Alert.alert(
          "Negocio guardado",
          `Tu negocio sí se guardó, pero no se pudieron subir ${resultado.fallidos} foto(s) o video(s).\n\nMotivo: ${resultado.motivo}\n\nAbre tu negocio con "Editar" para intentar agregarlos de nuevo.`,
        );
      } else if (negocioEnEdicion) {
        Alert.alert("Listo", "Tus cambios ya están guardados.");
      } else {
        Alert.alert(
          "Listo",
          "Tu negocio ya está visible en el mapa para todos.",
        );
      }
      setFormularioVisible(false);
      setUbicacionParaGuardar(null);
      setNegocioEnEdicion(null);
      cerrarTarjeta();
    } catch (error) {
      Alert.alert("No se pudo guardar", error.message);
    }
  }

  function abrirFormularioParaCrear() {
    // Cada cuenta registra un solo negocio: si ya tiene uno, solo se edita.
    // (el id del documento del negocio es el uid del actor)
    const yaTieneNegocio = puntos.some(
      (p) => !!user?.uid && p.id === user.uid
    );
    if (yaTieneNegocio) {
      Alert.alert(
        "Ya registraste tu negocio",
        "Cada cuenta puede registrar un solo negocio. Toca tu ubicación en el mapa para editarla."
      );
      return;
    }
    setNegocioEnEdicion(null);
    setFormularioSesionId((n) => n + 1);
    setFormularioVisible(true);
  }

  function abrirFormularioParaEditar(punto) {
    setNegocioEnEdicion(punto);
    setUbicacionParaGuardar({ lat: punto.lat, lon: punto.lng });
    setFormularioSesionId((n) => n + 1);
    setFormularioVisible(true);
  }

  function abrirSelectorDeMapa() {
    setFormularioVisible(false);
    setSelectorMapaVisible(true);
  }

  function handleConfirmarUbicacionElegida(coordenadas) {
    if (selectorParaOrigen) {
      setSelectorParaOrigen(false);
      setSelectorMapaVisible(false);
      usarComoOrigen({
        lat: coordenadas.lat,
        lon: coordenadas.lon,
        nombre: "Punto elegido en el mapa",
      });
      return;
    }
    setUbicacionParaGuardar(coordenadas);
    setSelectorMapaVisible(false);
    setFormularioVisible(true);
  }

  function handleCancelarSelectorMapa() {
    if (selectorParaOrigen) {
      setSelectorParaOrigen(false);
      setSelectorMapaVisible(false);
      setPuntoSeleccionado(destinoPendiente);
      setDestinoPendiente(null);
      return;
    }
    setSelectorMapaVisible(false);
    setFormularioVisible(true);
  }

  // Búsqueda: vuela a una ubicación guardada y abre su tarjeta
  function handleSeleccionarPuntoBuscado(punto) {
    if (eligiendoOrigen) {
      usarComoOrigen({ lat: punto.lat, lon: punto.lng, nombre: punto.titulo });
      return;
    }
    setLugarBuscado(null);
    setPuntoSeleccionado(punto);
    cameraRef.current?.setStop({
      center: [punto.lng, punto.lat],
      zoom: 16,
      duration: 1200,
    });
  }

  // Búsqueda: vuela a un lugar/calle y deja un pin temporal
  function handleSeleccionarLugarBuscado(lugar) {
    if (eligiendoOrigen) {
      usarComoOrigen({ lat: lugar.lat, lon: lugar.lon, nombre: lugar.nombre });
      return;
    }
    cerrarTarjeta();
    setLugarBuscado(lugar);
    cameraRef.current?.setStop({
      center: [lugar.lon, lugar.lat],
      zoom: 16,
      duration: 1200,
    });
  }

  function moverCamaraA(lat, lon) {
    setUbicacionOrigen({ lat, lon });
    // [PINOLITO] Si hay una ruta creativa en pantalla o Pinolito recomendó un
    // lugar, la cámara se queda donde está.
    if (
      cameraRef.current &&
      !rutaCreativaActivaRef.current &&
      !seleccionRecomendadaRef.current
    ) {
      cameraRef.current.setStop({
        center: [lon, lat],
        zoom: 15,
        duration: 1200,
      });
    }
  }

  // Intenta obtener GPS de alta precisión; si falla/expira, usa precisión por red
  function obtenerUbicacionConReintento() {
    Geolocation.getCurrentPosition(
      (pos) => moverCamaraA(pos.coords.latitude, pos.coords.longitude),
      (errorAltaPrecision) => {
        console.warn(
          "Falló GPS de alta precisión, reintentando con red:",
          errorAltaPrecision,
        );
        Geolocation.getCurrentPosition(
          (pos) => moverCamaraA(pos.coords.latitude, pos.coords.longitude),
          (errorRed) => {
            console.warn("Falló con precisión de red:", errorRed);
            Alert.alert(
              "No se pudo obtener tu ubicación",
              `Código ${errorRed.code}: ${errorRed.message}\n\nIntenta salir a un lugar con más señal y vuelve a intentarlo.`,
            );
          },
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 },
        );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 },
    );
  }

  const handleTrazarRuta = useCallback(
    // origenElegido: undefined = el que haya guardado el usuario; null = su GPS.
    async (destino, origenElegido) => {
      const elegido = origenElegido !== undefined ? origenElegido : origenRuta;
      const origen = elegido ?? ubicacionOrigen;
      if (!origen) {
        Alert.alert(
          "Ubicación no disponible todavía",
          "Espera un momento a que se detecte tu posición antes de trazar una ruta.",
        );
        return;
      }

      setCargandoRuta(true);
      setRuta(null);
      try {
        const resultado = await obtenerRuta(
          { lat: origen.lat, lon: origen.lon },
          { lat: destino.lat, lon: destino.lng },
        );
        setRuta({ ...resultado, destino });

        // Encuadra la cámara en los límites de la ruta
        if (cameraRef.current && resultado.coordenadas.length > 0) {
          const lats = resultado.coordenadas.map((c) => c[0]);
          const lons = resultado.coordenadas.map((c) => c[1]);
          cameraRef.current.fitBounds(
            [Math.max(...lons), Math.max(...lats)],
            [Math.min(...lons), Math.min(...lats)],
            80,
            1000,
          );
        }
      } catch (error) {
        Alert.alert("No se pudo calcular la ruta", error.message);
      } finally {
        setCargandoRuta(false);
      }
    },
    [ubicacionOrigen, origenRuta],
  );

  // ---------- Punto de partida elegido (de A a B) ----------
  // Guarda el origen y vuelve a trazar la ruta hacia el destino recordado.
  function usarComoOrigen(origen) {
    const destino = destinoPendiente ?? puntoSeleccionado;
    setEligiendoOrigen(false);
    setLugarBuscado(null);
    setOrigenRuta(origen);
    if (destino) {
      setPuntoSeleccionado(destino);
      setDestinoPendiente(null);
      handleTrazarRuta(destino, origen);
    }
  }

  function usarMiUbicacionComoOrigen() {
    setOrigenRuta(null);
    if (puntoSeleccionado && ruta?.destino?.id === puntoSeleccionado.id) {
      handleTrazarRuta(puntoSeleccionado, null);
    }
  }

  function cancelarEleccionOrigen() {
    setEligiendoOrigen(false);
    setPuntoSeleccionado(destinoPendiente);
    setDestinoPendiente(null);
  }

  function pedirOrigen(destino) {
    Alert.alert(
      "Punto de partida",
      "¿Desde dónde quieres salir?",
      [
        {
          text: "Buscar un lugar",
          onPress: () => {
            setDestinoPendiente(destino);
            cerrarTarjeta();
            setEligiendoOrigen(true);
          },
        },
        {
          text: "Elegir en el mapa",
          onPress: () => {
            setDestinoPendiente(destino);
            setSelectorParaOrigen(true);
            setSelectorMapaVisible(true);
          },
        },
        { text: "Mi ubicación", onPress: usarMiUbicacionComoOrigen },
      ],
      { cancelable: true },
    );
  }

  // Tocar un marcador: abre su tarjeta, o lo usa de origen si se está eligiendo.
  function manejarToqueMarcador(punto) {
    if (eligiendoOrigen) {
      usarComoOrigen({ lat: punto.lat, lon: punto.lng, nombre: punto.titulo });
    } else {
      setPuntoSeleccionado(punto);
    }
  }

  // La navegación sigue el GPS: si el origen era otro punto, se parte de donde estás.
  async function iniciarDesdeMiUbicacion(destino) {
    if (!ubicacionOrigen) {
      Alert.alert(
        "Ubicación no disponible todavía",
        "Espera un momento a que se detecte tu posición antes de iniciar.",
      );
      return;
    }
    setCargandoRuta(true);
    try {
      const resultado = await obtenerRuta(ubicacionOrigen, {
        lat: destino.lat,
        lon: destino.lng,
      });
      setOrigenRuta(null);
      setRuta({ ...resultado, destino });
      setNavegando(true);
    } catch (error) {
      Alert.alert("No se pudo calcular la ruta", error.message);
    } finally {
      setCargandoRuta(false);
    }
  }

  // ---------- Iniciar la ruta creativa (navegación parada por parada) ----------
  async function iniciarTramo(indice, origen) {
    const parada = rutaCreativaMapa?.paradas[indice];
    if (!parada) return;

    setCargandoRuta(true);
    try {
      const resultado = await obtenerRuta(origen, {
        lat: parada.lat,
        lon: parada.lng,
      });
      setTramoActual(indice);
      setRuta({
        ...resultado,
        destino: {
          id: parada.ubicacionId,
          titulo: parada.titulo,
          categoria: parada.categoria,
          lat: parada.lat,
          lng: parada.lng,
        },
      });
      setNavegando(true);
    } catch (error) {
      Alert.alert("No se pudo calcular la ruta", error.message);
    } finally {
      setCargandoRuta(false);
    }
  }

  function iniciarRutaCreativa() {
    if (!ubicacionOrigen) {
      Alert.alert(
        "Ubicación no disponible todavía",
        "Espera un momento a que se detecte tu posición antes de iniciar la ruta.",
      );
      return;
    }
    iniciarTramo(0, ubicacionOrigen);
  }

  // Al llegar a una parada: sigue a la siguiente o termina la ruta.
  function manejarLlegadaTramo() {
    if (tramoActual == null || !rutaCreativaMapa) {
      setNavegando(false);
      setRuta(null);
      return;
    }

    const siguiente = tramoActual + 1;
    const paradaActual = rutaCreativaMapa.paradas[tramoActual];

    if (siguiente < rutaCreativaMapa.paradas.length) {
      iniciarTramo(siguiente, { lat: paradaActual.lat, lon: paradaActual.lng });
    } else {
      setNavegando(false);
      setRuta(null);
      setTramoActual(null);
      Alert.alert(
        "¡Ruta completada!",
        `Recorriste las ${rutaCreativaMapa.paradas.length} paradas de "${rutaCreativaMapa.nombre}".`,
      );
    }
  }

  function salirDeLaNavegacion() {
    setNavegando(false);
    setRuta(null);
    setTramoActual(null);
  }

  const hayMasParadas =
    tramoActual != null &&
    !!rutaCreativaMapa &&
    tramoActual + 1 < rutaCreativaMapa.paradas.length;

  // Prepara GeoJSON para dibujar la línea de ruta
  const rutaGeoJSON = ruta
    ? {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: ruta.coordenadas.map(([lat, lon]) => [lon, lat]),
        },
      }
    : null;

  const rutaCreativaGeoJSON = rutaCreativaMapa
    ? {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: rutaCreativaMapa.coordenadas.map(([lat, lon]) => [
            lon,
            lat,
          ]),
        },
      }
    : null;

  // Los negocios que son parada de la ruta se dibujan numerados, no como punto normal.
  const idsParadasRuta = new Set(
    rutaCreativaMapa ? rutaCreativaMapa.paradas.map((p) => p.ubicacionId) : [],
  );

  return (
    <>
      {navegando && ruta ? (
        <NavegacionRuta
          key={tramoActual != null ? `tramo-${tramoActual}` : "ruta-simple"}
          ruta={ruta}
          tituloLlegada={
            tramoActual != null
              ? `¡Llegaste a ${ruta.destino.titulo}!`
              : undefined
          }
          textoBotonLlegada={
            tramoActual != null
              ? hayMasParadas
                ? "Ir a la siguiente parada"
                : "Finalizar ruta"
              : undefined
          }
          onFinalizar={manejarLlegadaTramo}
          onSalir={salirDeLaNavegacion}
          paradas={tramoActual != null ? rutaCreativaMapa?.paradas : null}
          tramoActual={tramoActual}
          rutaCompleta={
            tramoActual != null ? rutaCreativaMapa?.coordenadas : null
          }
        />
      ) : selectorMapaVisible ? (
        <SeleccionarUbicacionMapa
          centroInicial={
            selectorParaOrigen
              ? (origenRuta ?? ubicacionOrigen)
              : (ubicacionParaGuardar ?? ubicacionOrigen)
          }
          onConfirmar={handleConfirmarUbicacionElegida}
          onCancelar={handleCancelarSelectorMapa}
        />
      ) : (
        <View style={[mapaNicaraguaStyle.container, { paddingTop: 0 }]}>
          <Map
            ref={mapRef}
            style={{ flex: 1 }}
            mapStyle={MAP_STYLE_URL}
            logo={false}
          >
            <Camera
              ref={cameraRef}
              zoom={7}
              center={[-85.2072, 12.8654]}
              easing="fly"
            />

            {/* Línea de ruta */}
            {rutaGeoJSON && (
              <GeoJSONSource id="rutaSource" data={rutaGeoJSON}>
                <Layer
                  id="rutaLayer"
                  type="line"
                  paint={{
                    "line-color": "#123B63",
                    "line-width": 4,
                    "line-opacity": 0.85,
                  }}
                />
              </GeoJSONSource>
            )}

            {/* Ruta creativa: línea naranja y paradas numeradas */}
            {rutaCreativaGeoJSON && (
              <GeoJSONSource id="rutaCreativaSource" data={rutaCreativaGeoJSON}>
                <Layer
                  id="rutaCreativaLayer"
                  type="line"
                  layout={{ "line-cap": "round", "line-join": "round" }}
                  paint={{
                    "line-color": "#F29100",
                    "line-width": 5,
                    "line-opacity": 0.95,
                  }}
                />
              </GeoJSONSource>
            )}

            {rutaCreativaMapa &&
              rutaCreativaMapa.paradas.map((parada) => (
                <ViewAnnotation
                  key={`parada-${parada.id}-${epocaMarcadores}`}
                  id={`parada-${parada.id}`}
                  lngLat={[parada.lng, parada.lat]}
                  onSelect={() => {
                    const negocio = puntos.find((p) => p.id === parada.ubicacionId);
                    if (negocio) setPuntoSeleccionado(negocio);
                  }}
                >
                  <View style={mapaNicaraguaStyle.paradaRutaContenedor}>
                    <View
                      style={[
                        mapaNicaraguaStyle.paradaRutaEtiqueta,
                        { height: 20, justifyContent: "center" },
                      ]}
                    >
                      <Text
                        style={mapaNicaraguaStyle.paradaRutaTexto}
                        numberOfLines={1}
                      >
                        {parada.titulo}
                      </Text>
                    </View>
                    <View style={mapaNicaraguaStyle.paradaRutaNumero}>
                      <Text style={mapaNicaraguaStyle.paradaRutaNumeroTexto}>
                        {parada.orden}
                      </Text>
                    </View>
                    {/* Espaciador (alto de la etiqueta + margen): el centro del
                        círculo queda exactamente sobre la coordenada. */}
                    <View style={{ height: 23 }} />
                  </View>
                </ViewAnnotation>
              ))}

            {/* Marcador de ubicación actual */}
            {ubicacionOrigen && (
              <ViewAnnotation
                id="origen"
                lngLat={[ubicacionOrigen.lon, ubicacionOrigen.lat]}
              >
                <View style={mapaNicaraguaStyle.marcadorOrigen} />
              </ViewAnnotation>
            )}

            {/* Punto de partida elegido (A) */}
            {origenRuta && (
              <ViewAnnotation
                id="origen-ruta"
                lngLat={[origenRuta.lon, origenRuta.lat]}
              >
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: "#1D7A46",
                    borderWidth: 3,
                    borderColor: "#FFFFFF",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "700" }}
                  >
                    A
                  </Text>
                </View>
              </ViewAnnotation>
            )}

            {/* Marcadores de puntos de interés */}
            {puntos
              .filter((punto) => !idsParadasRuta.has(punto.id))
              .map((punto) => (
              <ViewAnnotation
                key={`${punto.id}-${epocaMarcadores}`}
                id={punto.id}
                lngLat={[punto.lng, punto.lat]}
                onSelect={() => manejarToqueMarcador(punto)}
              >
                <View style={mapaNicaraguaStyle.marcadorContenedor}>
                  <View style={mapaNicaraguaStyle.marcadorPunto}>
                    <Ionicons
                      name={iconoDeCategoria(punto.categoria)}
                      size={18}
                      color={colorDeCategoria(punto.categoria)}
                    />
                  </View>
                </View>
              </ViewAnnotation>
            ))}

            {/* Lugares recomendados de OpenStreetMap (aún sin registrar) */}
            {externosVisibles
              .filter((punto) => !idsParadasRuta.has(punto.id))
              .map((punto) => (
                <ViewAnnotation
                  key={`${punto.id}-${epocaMarcadores}`}
                  id={punto.id}
                  lngLat={[punto.lng, punto.lat]}
                  onSelect={() => manejarToqueMarcador(punto)}
                >
                  <View style={mapaNicaraguaStyle.marcadorContenedor}>
                    <View
                      style={[
                        mapaNicaraguaStyle.marcadorPunto,
                        { borderColor: "#8A99A8", opacity: 0.9 },
                      ]}
                    >
                      <Ionicons
                        name={iconoDeCategoria(punto.categoria)}
                        size={16}
                        color={colorDeCategoria(punto.categoria)}
                      />
                    </View>
                  </View>
                </ViewAnnotation>
              ))}

            {/* Pin temporal del lugar elegido en la barra de búsqueda */}
            {lugarBuscado && (
              <ViewAnnotation
                key={`lugar-${lugarBuscado.lat}-${lugarBuscado.lon}`}
                id="lugarBuscado"
                lngLat={[lugarBuscado.lon, lugarBuscado.lat]}
              >
                <View style={mapaNicaraguaStyle.lugarBuscadoContenedor}>
                  <View style={mapaNicaraguaStyle.lugarBuscadoEtiqueta}>
                    <Text
                      style={mapaNicaraguaStyle.lugarBuscadoTexto}
                      numberOfLines={1}
                    >
                      {lugarBuscado.nombre}
                    </Text>
                  </View>
                  <Ionicons name="location-sharp" size={34} color="#0E5A34" />
                </View>
              </ViewAnnotation>
            )}

            {/* Capa nativa para los títulos de los puntos */}
            <GeoJSONSource
              id="etiquetasSource"
              data={{
                type: "FeatureCollection",
                features: puntos.map((punto) => ({
                  type: "Feature",
                  id: punto.id,
                  geometry: {
                    type: "Point",
                    coordinates: [punto.lng, punto.lat],
                  },
                  properties: { titulo: punto.titulo },
                })),
              }}
            >
              <Layer
                id="etiquetasLayer"
                type="symbol"
                minzoom={12}
                layout={{
                  "text-field": ["get", "titulo"],
                  "text-font": ["Noto Sans Regular"],
                  "text-size": 11,
                  "text-offset": [0, 1.8],
                  "text-anchor": "top",
                  "text-allow-overlap": false,
                }}
                paint={{
                  "text-color": "#123B63",
                  "text-halo-color": "#FFFFFF",
                  "text-halo-width": 1.2,
                }}
              />
            </GeoJSONSource>
          </Map>

          {rutaCreativaMapa && (
            <View
              style={[mapaNicaraguaStyle.bannerRuta, { top: insets.top + 100 }]}
            >
              <View style={mapaNicaraguaStyle.bannerRutaTextos}>
                <Text style={mapaNicaraguaStyle.bannerRutaTitulo} numberOfLines={1}>
                  {rutaCreativaMapa.nombre}
                </Text>
                <Text style={mapaNicaraguaStyle.bannerRutaDetalle} numberOfLines={1}>
                  {rutaCreativaMapa.paradas.length} paradas
                  {rutaCreativaMapa.duracionMin != null
                    ? ` · ${rutaCreativaMapa.distanciaKm} km · ${rutaCreativaMapa.duracionMin} min`
                    : ""}
                  {rutaCreativaMapa.total != null
                    ? ` · ${formatearPrecio(rutaCreativaMapa.total)}`
                    : ""}
                </Text>
                {rutaCreativaMapa.aproximada && (
                  <Text style={mapaNicaraguaStyle.bannerRutaAviso}>
                    Ruta aproximada: no se pudo calcular el camino por carretera.
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={mapaNicaraguaStyle.bannerRutaCerrar}
                onPress={cerrarRutaCreativa}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel="Cerrar ruta"
              >
                <Ionicons name="close" size={16} color="#4A4A4A" />
              </TouchableOpacity>
            </View>
          )}

          {rutaCreativaMapa && !puntoSeleccionado && (
            <TouchableOpacity
              style={[
                mapaNicaraguaStyle.botonIniciarRutaCreativa,
                { bottom: tabBarHeight + 72 + 16 },
              ]}
              onPress={iniciarRutaCreativa}
              disabled={cargandoRuta}
              activeOpacity={0.85}
            >
              {cargandoRuta ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="navigate" size={20} color="#FFFFFF" />
                  <Text style={mapaNicaraguaStyle.botonIniciarRutaCreativaTexto}>
                    Iniciar ruta
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {eligiendoOrigen && (
            <View
              style={[mapaNicaraguaStyle.bannerRuta, { top: insets.top + 100 }]}
            >
              <View style={mapaNicaraguaStyle.bannerRutaTextos}>
                <Text style={mapaNicaraguaStyle.bannerRutaTitulo} numberOfLines={1}>
                  Elige el punto de partida
                </Text>
                <Text style={mapaNicaraguaStyle.bannerRutaDetalle} numberOfLines={2}>
                  Busca un lugar arriba o toca un negocio del mapa.
                </Text>
              </View>
              <TouchableOpacity
                style={mapaNicaraguaStyle.bannerRutaCerrar}
                onPress={cancelarEleccionOrigen}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel="Cancelar"
              >
                <Ionicons name="close" size={16} color="#4A4A4A" />
              </TouchableOpacity>
            </View>
          )}

          <BarraBusquedaMapa
            puntos={puntos}
            onSeleccionarPunto={handleSeleccionarPuntoBuscado}
            onSeleccionarLugar={handleSeleccionarLugarBuscado}
            onLimpiar={() => setLugarBuscado(null)}
          />

          {/* Carrusel de lugares recomendados (turista) */}
          {esTurista &&
            !puntoSeleccionado &&
            !rutaCreativaMapa &&
            !ruta && (
              <CarruselLugares
                lugares={recomendados}
                origen={ubicacionOrigen}
                onSeleccionar={handleSeleccionarPuntoBuscado}
              />
            )}

          {/* Botón para agregar nueva experiencia */}
          {puedePublicar && (
            <TouchableOpacity
              style={[
                mapaNicaraguaStyle.botonAgregar,
                { bottom: tabBarHeight + 28 },
              ]}
              onPress={abrirFormularioParaCrear}
            >
              <Text style={mapaNicaraguaStyle.botonAgregarTexto}>+</Text>
            </TouchableOpacity>
          )}

          {/* Backdrop para cerrar la tarjeta al tocar fuera */}
          {puntoSeleccionado && (
            <TouchableWithoutFeedback onPress={cerrarTarjeta}>
              <View style={mapaNicaraguaStyle.overlayCierre} />
            </TouchableWithoutFeedback>
          )}

          {/* Hoja "Detalles de la ubicación" del punto seleccionado */}
          {puntoSeleccionado && (
            <TarjetaUbicacion
              punto={puntoSeleccionado}
              ruta={ruta}
              cargandoRuta={cargandoRuta}
              puedeEditar={
                !!user?.uid && puntoSeleccionado.id === user.uid
              }
              onCerrar={cerrarTarjeta}
              onEditar={() => abrirFormularioParaEditar(puntoSeleccionado)}
              onVerPerfil={
                puntoSeleccionado.externo
                  ? undefined
                  : () =>
                      navigation.navigate("PerfilPublicoDrawer", {
                        actorId: puntoSeleccionado.id,
                      })
              }
              onTrazarRuta={() => handleTrazarRuta(puntoSeleccionado)}
              origenRuta={origenRuta}
              onCambiarOrigen={() => pedirOrigen(puntoSeleccionado)}
              onIniciarNavegacion={
                origenRuta
                  ? () => iniciarDesdeMiUbicacion(puntoSeleccionado)
                  : () => setNavegando(true)
              }
            />
          )}
        </View>
      )}

      {/* Formulario persistente (se mantiene montado al usar el selector de mapa) */}
      <FormularioExperiencia
        visible={formularioVisible}
        ubicacionActual={ubicacionParaGuardar ?? ubicacionOrigen}
        onCancelar={() => {
          setFormularioVisible(false);
          setUbicacionParaGuardar(null);
          setNegocioEnEdicion(null);
        }}
        onGuardar={handleGuardarNegocio}
        onElegirEnMapa={abrirSelectorDeMapa}
        modoEdicion={!!negocioEnEdicion}
        valoresIniciales={negocioEnEdicion}
        sesionId={formularioSesionId}
      />
    </>
  );
}