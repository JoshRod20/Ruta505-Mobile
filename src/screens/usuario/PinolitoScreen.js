import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { usePinolito } from "../../hooks/usePinolito";
import { guardarEquipado } from "../../services/pinolitoService";
import {
  CATEGORIAS,
  ESCENARIO,
  ITEMS,
  LOGROS,
} from "../../constants/pinolitoCatalogo";
import { VERDE } from "../../styles/home/homeStyle";
import { pinolitoStyle as s } from "../../styles/usuario/pinolitoStyle";

// Reemplaza estos íconos por tus siluetas si quieres.
const TABS = [
  { id: CATEGORIAS.CUERPO, icono: "bird" },
  { id: CATEGORIAS.SOMBRERO, icono: "hat-fedora" },
  { id: CATEGORIAS.ACCESORIO, icono: "vase" },
];

const SLOTS_MINIMOS = 9;

const porId = (id) => ITEMS.find((i) => i.id === id);

const iguales = (a, b) =>
  a.cuerpo === b.cuerpo &&
  a.sombrero === b.sombrero &&
  a.accesorio === b.accesorio;

// Completa la cuadrícula con casillas bloqueadas "próximamente".
const conRelleno = (lista) => {
  const total = Math.max(SLOTS_MINIMOS, Math.ceil(lista.length / 3) * 3);
  const relleno = Array.from({ length: total - lista.length }, (_, i) => ({
    id: `vacio_${i}`,
    vacio: true,
  }));
  return [...lista, ...relleno];
};

export default function PinolitoScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { uid, logros, equipadoGuardado, cargando } = usePinolito();

  const [tab, setTab] = useState(CATEGORIAS.CUERPO);
  const [equipado, setEquipado] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // Copia local editable; se inicializa una sola vez cuando carga el perfil.
  useEffect(() => {
    if (!cargando && equipado === null) setEquipado(equipadoGuardado);
  }, [cargando, equipadoGuardado, equipado]);

  const hayCambios = equipado && !iguales(equipado, equipadoGuardado);

  const estaDesbloqueado = (item) => !item.logro || logros.includes(item.logro);

  const onPressItem = (item) => {
    if (item.vacio) {
      Alert.alert("Próximamente", "Pronto habrá más atuendos para Pinolito.");
      return;
    }
    if (!estaDesbloqueado(item)) {
      const logro = LOGROS[item.logro];
      Alert.alert(
        logro?.titulo ?? "Bloqueado",
        logro?.descripcion ?? "Sigue explorando para desbloquearlo."
      );
      return;
    }
    setEquipado((prev) => {
      const yaPuesto = prev[item.categoria] === item.id;
      // El cuerpo siempre debe tener una pose; sombrero y accesorio se pueden quitar.
      const nuevo =
        yaPuesto && item.categoria !== CATEGORIAS.CUERPO ? null : item.id;
      return { ...prev, [item.categoria]: nuevo };
    });
  };

  const onGuardar = async () => {
    if (!uid || !hayCambios || guardando) return;
    try {
      setGuardando(true);
      await guardarEquipado(uid, equipado);
      Alert.alert("¡Listo!", "Pinolito guardó su nuevo atuendo.");
    } catch (e) {
      console.error("Error guardando Pinolito:", e);
      Alert.alert("Error", "No se pudo guardar. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  const onAtras = () => {
    if (!hayCambios) {
      navigation.goBack();
      return;
    }
    Alert.alert("Cambios sin guardar", "¿Quieres salir sin guardar el atuendo?", [
      { text: "Seguir editando", style: "cancel" },
      { text: "Salir", style: "destructive", onPress: () => navigation.goBack() },
    ]);
  };

  if (cargando || !equipado) {
    return (
      <View style={s.cargando}>
        <ActivityIndicator size="large" color={VERDE} />
      </View>
    );
  }

  const cuerpo = porId(equipado.cuerpo) ?? porId("cuerpo_1");
  const sombrero = equipado.sombrero ? porId(equipado.sombrero) : null;
  const accesorio = equipado.accesorio ? porId(equipado.accesorio) : null;

  const alturaEscena = width * 0.82;
  const tamPinolito = width * 0.62;

  const itemsTab = conRelleno(ITEMS.filter((i) => i.categoria === tab));

  const renderItem = ({ item }) => {
    const bloqueado = item.vacio || !estaDesbloqueado(item);
    const puesto = !item.vacio && equipado[item.categoria] === item.id;
    const imagen = item.icono ?? item.capa;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPressItem(item)}
        style={[s.celda, bloqueado && s.celdaBloqueada, puesto && s.celdaPuesta]}
        accessibilityLabel={bloqueado ? "Atuendo bloqueado" : item.nombre}
      >
        {bloqueado ? (
          <View style={s.candadoCirculo}>
            <Ionicons name="lock-closed" size={22} color="#B8B8B8" />
          </View>
        ) : (
          <Image source={imagen} style={s.celdaImagen} resizeMode="contain" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={s.container}>
      {/* ── Escena ── */}
      <ImageBackground
        source={ESCENARIO}
        style={[s.escena, { height: alturaEscena + insets.top }]}
        resizeMode="cover"
      >
        <View style={s.suelo} />

        <View style={[s.pinolito, { width: tamPinolito, height: tamPinolito }]}>
          {/* Orden de capas: cuerpo -> accesorio -> sombrero */}
          <Image source={cuerpo.capa} style={s.capa} resizeMode="contain" />
          {accesorio && (
            <Image source={accesorio.capa} style={s.capa} resizeMode="contain" />
          )}
          {sombrero && (
            <Image source={sombrero.capa} style={s.capa} resizeMode="contain" />
          )}
        </View>

        <TouchableOpacity
          style={[s.botonAtras, { top: insets.top + 12 }]}
          onPress={onAtras}
          accessibilityLabel="Volver"
        >
          <Ionicons name="arrow-back" size={20} color="#000000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            s.botonGuardar,
            { top: insets.top + 12 },
            !hayCambios && s.botonGuardarInactivo,
          ]}
          onPress={onGuardar}
          disabled={!hayCambios || guardando}
          accessibilityLabel="Guardar atuendo"
        >
          {guardando ? (
            <ActivityIndicator size="small" color={VERDE} />
          ) : (
            <Text style={s.botonGuardarTexto}>Guardar</Text>
          )}
        </TouchableOpacity>
      </ImageBackground>

      {/* ── Pestañas ── */}
      <View style={s.tabs}>
        {TABS.map((t) => {
          const activa = tab === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              style={s.tab}
              onPress={() => setTab(t.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: activa }}
            >
              <MaterialCommunityIcons
                name={t.icono}
                size={38}
                color={activa ? VERDE : "#9A9A9A"}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Cuadrícula ── */}
      <FlatList
        data={itemsTab}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={3}
        columnWrapperStyle={s.fila}
        contentContainerStyle={[s.grilla, { paddingBottom: insets.bottom + 16 }]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}