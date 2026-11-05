import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Keyboard, Platform, ScrollView, TextInput, View } from "react-native";
import { NavigationContext } from "@react-navigation/native";

/**
 * ScrollFormulario: ScrollView para TODOS los formularios de la app.
 *
 * Cuando se abre el teclado (o se pasa de un campo a otro, o el campo crece
 * mientras se escribe) desplaza el contenido para que el campo enfocado
 * quede visible, con un margen cómodo por encima del teclado.
 *
 * - No usa KeyboardAvoidingView: en Android con edge-to-edge no mueve nada y
 *   en iOS no desplaza el ScrollView hasta el campo enfocado.
 * - Agrega al final un espacio del alto del teclado para poder subir los
 *   últimos campos.
 *
 * Props propias:
 *   margen  Espacio (dp) que se deja entre el campo y el teclado.
 *   activo  false para ignorar el teclado (p. ej. cuando hay un modal con su
 *           propio buscador abierto encima del formulario).
 * Todas las demás props se pasan al ScrollView.
 */
export const MARGEN_TECLADO = 110;

const ScrollFormulario = forwardRef(function ScrollFormulario(
  {
    margen = MARGEN_TECLADO,
    activo = true,
    onScroll,
    onContentSizeChange,
    onTouchEnd,
    children,
    ...resto
  },
  ref
) {
  const scrollRef = useRef(null);
  const scrollYRef = useRef(0);
  const tecladoTopRef = useRef(null); // Y (pantalla) donde empieza el teclado
  const activoRef = useRef(activo);
  activoRef.current = activo;
  const margenRef = useRef(margen);
  margenRef.current = margen;
  const [tecladoAlto, setTecladoAlto] = useState(0);

  useImperativeHandle(ref, () => scrollRef.current);

  // Al salir de la pantalla (cambiar de pestaña, navegar o desmontar) se cierra
  // el teclado y se quita el foco, para que Android no deje la ventana
  // encogida con el espacio del teclado.
  const navigation = useContext(NavigationContext);
  useEffect(() => {
    const cerrar = () => {
      TextInput.State.currentlyFocusedInput?.()?.blur?.();
      Keyboard.dismiss();
    };
    const unsub = navigation?.addListener?.("blur", cerrar);
    return () => {
      unsub?.();
      cerrar();
    };
  }, [navigation]);

  const asegurarCampoVisible = useCallback(() => {
    if (!activoRef.current) return;
    const input = TextInput.State.currentlyFocusedInput?.();
    const tecladoTop = tecladoTopRef.current;
    if (!input || tecladoTop == null) return;

    input.measureInWindow((_x, y, _w, h) => {
      const exceso = y + h + margenRef.current - tecladoTop;
      if (exceso > 0) {
        scrollRef.current?.scrollTo({
          y: scrollYRef.current + exceso,
          animated: true,
        });
      }
    });
  }, []);

  useEffect(() => {
    const esIOS = Platform.OS === "ios";

    const subShow = Keyboard.addListener(
      esIOS ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        if (!activoRef.current) return;
        tecladoTopRef.current = e.endCoordinates.screenY;
        setTecladoAlto(e.endCoordinates.height);
        // Deja que se pinte el espacio extra y reintenta por si la
        // animación del teclado o el layout tardan más de lo esperado.
        setTimeout(asegurarCampoVisible, 80);
        setTimeout(asegurarCampoVisible, 350);
      }
    );
    const subHide = Keyboard.addListener(
      esIOS ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        tecladoTopRef.current = null;
        setTecladoAlto(0);
      }
    );

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, [asegurarCampoVisible]);

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
      showsVerticalScrollIndicator={false}
      {...resto}
      ref={scrollRef}
      scrollEventThrottle={16}
      onScroll={(e) => {
        scrollYRef.current = e.nativeEvent.contentOffset.y;
        onScroll?.(e);
      }}
      // Pasar de un campo a otro con el teclado abierto no genera evento de
      // teclado: reaccionamos al toque.
      onTouchEnd={(e) => {
        if (tecladoTopRef.current != null) setTimeout(asegurarCampoVisible, 150);
        onTouchEnd?.(e);
      }}
      // Campos multilínea que crecen mientras se escribe.
      onContentSizeChange={(w, h) => {
        if (tecladoTopRef.current != null) asegurarCampoVisible();
        onContentSizeChange?.(w, h);
      }}
    >
      {children}
      {/* Espacio para poder desplazar los últimos campos sobre el teclado */}
      <View style={{ height: tecladoAlto }} />
    </ScrollView>
  );
});

export default ScrollFormulario;
