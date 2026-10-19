/**
 * SelectorMultipleModal: hoja inferior para elegir varias opciones de una lista.
 * Mismo estilo que SelectorModal, pero cada opción se marca o desmarca y el
 * botón "Listo" cierra la hoja.
 */

import React from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { selectorModalStyle as styles } from "../../styles/common/SelectorModalStyle";
import { boton } from "../../styles/common/botonStyle";

/**
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {string} props.titulo
 * @param {string[]} props.opciones - Lista completa de opciones.
 * @param {string[]} props.valores - Opciones marcadas.
 * @param {function} props.onToggle - Recibe la opción que se marcó o desmarcó.
 * @param {function} props.onClose - Cierra la hoja.
 */
export default function SelectorMultipleModal({
  visible,
  titulo,
  opciones,
  valores,
  onToggle,
  onClose,
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      hardwareAccelerated
    >
      <View style={styles.modalFondo}>
        <TouchableOpacity
          style={styles.modalFondoTouch}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={[styles.modalCaja, { paddingBottom: 16 + insets.bottom }]}>
          <Text style={styles.modalTitulo}>{titulo}</Text>

          <FlatList
            data={opciones}
            keyExtractor={(item) => item}
            style={{ maxHeight: 360 }}
            renderItem={({ item }) => {
              const activo = valores.includes(item);
              return (
                <TouchableOpacity
                  style={[
                    styles.modalOpcion,
                    activo && styles.modalOpcionActiva,
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    },
                  ]}
                  onPress={() => onToggle(item)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.modalOpcionTexto,
                      activo && styles.modalOpcionTextoActivo,
                      { flex: 1 },
                    ]}
                  >
                    {item}
                  </Text>
                  {activo && (
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              );
            }}
          />

          <TouchableOpacity
            style={[boton.primario, { marginTop: 12 }]}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={boton.primarioTexto}>Listo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
