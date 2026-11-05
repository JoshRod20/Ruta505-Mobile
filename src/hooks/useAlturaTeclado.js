import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

/**
 * useAlturaTeclado: devuelve la altura (dp) del teclado mientras está abierto.
 *
 * Sirve para levantar a mano un <Modal> cuando tiene un TextInput. Un Modal es
 * una ventana aparte de la Activity, así que `softwareKeyboardLayoutMode: "pan"`
 * (app.json) NO se aplica dentro de él y KeyboardAvoidingView no es fiable
 * (en Android con `behavior` indefinido no hace nada).
 *
 * Uso:
 *   const tecladoAlto = useAlturaTeclado(visible);
 *   <View style={[estilos.fondo, { paddingBottom: tecladoAlto }]}>
 *
 * @param {boolean} activo  Solo escucha el teclado mientras el modal está visible.
 */
export default function useAlturaTeclado(activo = true) {
  const [alto, setAlto] = useState(0);

  useEffect(() => {
    if (!activo) {
      setAlto(0);
      return undefined;
    }

    const esIOS = Platform.OS === "ios";
    const subShow = Keyboard.addListener(
      esIOS ? "keyboardWillShow" : "keyboardDidShow",
      (e) => setAlto(e.endCoordinates?.height ?? 0)
    );
    const subHide = Keyboard.addListener(
      esIOS ? "keyboardWillHide" : "keyboardDidHide",
      () => setAlto(0)
    );

    // Por si el teclado ya estaba visible cuando se abrió el modal
    if (Keyboard.isVisible?.()) {
      setAlto(Keyboard.metrics?.()?.height ?? 0);
    }

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, [activo]);

  return alto;
}
