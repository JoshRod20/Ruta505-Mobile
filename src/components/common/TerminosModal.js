/**
 * TerminosModal: muestra los Términos y Condiciones de Ruta 505.
 * El botón "Aceptar" se habilita al llegar al final del texto.
 */

import { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import {
  TERMINOS_ACTUALIZACION,
  TERMINOS_INTRO,
  TERMINOS_SECCIONES,
  TERMINOS_TITULO,
} from "../../constants/terminosCondiciones";
import S from "../../styles/auth/TerminosModalStyle";

const MARGEN_FINAL = 24;

// Un Modal es otra ventana nativa: ahí useSafeAreaInsets() puede devolver 0 si
// no hay un SafeAreaProvider propio, y el título quedaba pegado a la barra de
// estado. Por eso el contenido va en su propio proveedor y, como respaldo, se
// usa el alto real de la barra de estado en Android.
function ContenidoTerminos({ onAccept, onClose }) {
  const insets = useSafeAreaInsets();
  const topSeguro = Math.max(
    insets.top,
    Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0
  );
  const bottomSeguro = insets.bottom;
  const [llegoAlFinal, setLlegoAlFinal] = useState(false);

  // El contenido se desmonta al cerrar el modal, así que cada vez que se abre
  // el usuario vuelve a leer hasta el final.

  const alScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - MARGEN_FINAL
    ) {
      setLlegoAlFinal(true);
    }
  };

  // Si el contenido cabe sin scroll, se habilita de inmediato
  const [altoVisible, setAltoVisible] = useState(0);
  const alCambiarTamano = (_w, h) => {
    if (altoVisible > 0 && h <= altoVisible + MARGEN_FINAL) {
      setLlegoAlFinal(true);
    }
  };

  return (
    <View style={[S.contenedor, { paddingTop: topSeguro + 12 }]}>
      <View style={S.header}>
        <Text style={S.headerTitulo} numberOfLines={2}>
          {TERMINOS_TITULO}
        </Text>
        <TouchableOpacity
          style={S.botonCerrar}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={22} color="#2b2b2b" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={S.scrollContenido}
        onScroll={alScroll}
        scrollEventThrottle={16}
        onContentSizeChange={alCambiarTamano}
        onLayout={(e) => setAltoVisible(e.nativeEvent.layout.height)}
        showsVerticalScrollIndicator
      >
        <Text style={S.actualizacion}>
          Última actualización: {TERMINOS_ACTUALIZACION}
        </Text>
        <Text style={S.intro}>{TERMINOS_INTRO}</Text>

        {TERMINOS_SECCIONES.map((seccion) => (
          <View key={seccion.titulo}>
            <Text style={S.seccionTitulo}>{seccion.titulo}</Text>

            {(seccion.parrafos || []).map((p, i) => (
              <Text key={`p-${i}`} style={S.parrafo}>
                {p}
              </Text>
            ))}

            {(seccion.items || []).map((item, i) => (
              <View key={`i-${i}`} style={S.itemFila}>
                <Text style={S.itemViñeta}>•</Text>
                <Text style={S.itemTexto}>
                  {item.titulo ? (
                    <Text style={S.itemTextoNegrita}>{item.titulo}: </Text>
                  ) : null}
                  {item.texto}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={[S.footer, { paddingBottom: bottomSeguro + 12 }]}>
        {!llegoAlFinal ? (
          <Text style={S.avisoScroll}>
            Desplázate hasta el final para poder aceptar.
          </Text>
        ) : null}
        <TouchableOpacity
          style={[S.botonAceptar, !llegoAlFinal && S.botonAceptarDeshabilitado]}
          onPress={onAccept}
          disabled={!llegoAlFinal}
          activeOpacity={0.8}
        >
          <Text style={S.botonAceptarTexto}>Acepto los términos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TerminosModal({ visible, onAccept, onClose }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <SafeAreaProvider>
        {visible ? (
          <ContenidoTerminos onAccept={onAccept} onClose={onClose} />
        ) : null}
      </SafeAreaProvider>
    </Modal>
  );
}
