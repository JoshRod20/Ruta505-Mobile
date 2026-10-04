import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { selectorModalStyle as styles } from "../../styles/common/SelectorModalStyle";

// Quita tildes y mayúsculas para que "leon" encuentre "León"
const normalizar = (texto) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export default function SelectorModal({
  visible,
  titulo,
  placeholderBusqueda = "Buscar...",
  opciones,
  valor,
  onSelect,
  onClose,
  textoVacio = "No se encontraron resultados.",
  // Si es true, enfoca el buscador DESPUÉS de que el modal terminó de mostrarse
  enfocarBusqueda = true,
}) {
  const insets = useSafeAreaInsets();
  const { height: alturaVentana } = useWindowDimensions();
  const [busqueda, setBusqueda] = useState("");
  const [tecladoAlto, setTecladoAlto] = useState(0);
  const inputRef = useRef(null);
  const focoTimer = useRef(null);

  // Altura del teclado: el modal se levanta manualmente.
  // (KeyboardAvoidingView no es fiable dentro de un Modal, y en Android con
  // statusBarTranslucent la ventana del Modal no se redimensiona sola.)
  useEffect(() => {
    if (!visible) {
      setTecladoAlto(0);
      return undefined;
    }

    const esIOS = Platform.OS === "ios";
    const subShow = Keyboard.addListener(
      esIOS ? "keyboardWillShow" : "keyboardDidShow",
      (e) => setTecladoAlto(e.endCoordinates?.height ?? 0)
    );
    const subHide = Keyboard.addListener(
      esIOS ? "keyboardWillHide" : "keyboardDidHide",
      () => setTecladoAlto(0)
    );

    // Por si el teclado ya estaba visible cuando se abrió el modal
    if (Keyboard.isVisible?.()) {
      setTecladoAlto(Keyboard.metrics?.()?.height ?? 0);
    }

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, [visible]);

  // Limpia la búsqueda y cualquier foco pendiente cuando el modal se oculta
  useEffect(() => {
    if (!visible) {
      setBusqueda("");
      clearTimeout(focoTimer.current);
    }
    return () => clearTimeout(focoTimer.current);
  }, [visible]);

  const filtradas = useMemo(() => {
    const q = normalizar(busqueda.trim());
    if (!q) return opciones;
    return opciones.filter((o) => normalizar(o).includes(q));
  }, [busqueda, opciones]);

  const cerrar = () => {
    setBusqueda("");
    onClose();
  };

  const seleccionar = (item) => {
    setBusqueda("");
    onSelect(item);
  };

  // Se dispara cuando el modal ya está en pantalla (evita pelear con la
  // animación y con el teclado que se está cerrando en la pantalla de atrás)
  const handleShow = () => {
    if (!enfocarBusqueda) return;
    clearTimeout(focoTimer.current);
    focoTimer.current = setTimeout(() => inputRef.current?.focus(), 120);
  };

  const tecladoVisible = tecladoAlto > 0;

  // Con teclado: la caja nunca debe ser más alta que el espacio libre
  const cajaAjustada = tecladoVisible
    ? {
        // el teclado ya cubre el área segura inferior: no se suma insets.bottom
        paddingBottom: 16,
        maxHeight: Math.max(240, alturaVentana - tecladoAlto - insets.top - 24),
      }
    : { paddingBottom: 16 + insets.bottom };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={cerrar}
      onShow={handleShow}
      statusBarTranslucent
      hardwareAccelerated
    >
      {/* El paddingBottom empuja la caja por encima del teclado */}
      <View style={[styles.modalFondo, { paddingBottom: tecladoAlto }]}>
        <TouchableOpacity
          style={styles.modalFondoTouch}
          activeOpacity={1}
          onPress={cerrar}
        />

        <View style={[styles.modalCaja, cajaAjustada]}>
          <Text style={styles.modalTitulo}>{titulo}</Text>

          <View style={styles.modalBusquedaWrap}>
            <Ionicons
              name="search-outline"
              size={18}
              color="#8a8a8a"
              style={styles.modalBusquedaIcono}
            />
            <TextInput
              ref={inputRef}
              style={styles.modalBusquedaInput}
              placeholder={placeholderBusqueda}
              placeholderTextColor="#a8a8a8"
              value={busqueda}
              onChangeText={setBusqueda}
              autoCorrect={false}
              returnKeyType="search"
            />
          </View>

          <FlatList
            data={filtradas}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
            style={styles.modalLista}
            ListEmptyComponent={
              <Text style={styles.modalVacioTexto}>{textoVacio}</Text>
            }
            renderItem={({ item }) => {
              const activo = valor === item;
              return (
                <TouchableOpacity
                  style={[styles.modalOpcion, activo && styles.modalOpcionActiva]}
                  onPress={() => seleccionar(item)}
                >
                  <Text
                    style={[
                      styles.modalOpcionTexto,
                      activo && styles.modalOpcionTextoActivo,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}