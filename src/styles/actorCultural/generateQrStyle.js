/**
 * Estilos de generateQrStyle.
 */

import { StyleSheet } from "react-native";

// Pestaña "Generar QR" del actor cultural (Pasaporte Cultural QR).
const VERDE = "#0E5A34";
const LIMA = "#95C11F";
const AZUL_ESQUINA = "#1E9BD7";
const LADO_MARCO = 270;
const LARGO_ESQUINA = 38;
const GROSOR_ESQUINA = 3;

const esquina = {
  position: "absolute",
  width: LARGO_ESQUINA,
  height: LARGO_ESQUINA,
  borderColor: AZUL_ESQUINA,
};

export const generateQrStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contenido: {
    flexGrow: 1,
    paddingHorizontal: 28,
  },

  // ---- Bienvenida ----
  bienvenidaTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    lineHeight: 23,
    color: "#1A1A1A",
    textAlign: "center",
    marginTop: 28,
  },
  bienvenidaNegrita: {
    fontFamily: "Poppins-Bold",
    color: VERDE,
  },

  // ---- Botón lima (Generar / Descargar) ----
  boton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: LIMA,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
  botonTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#1A1A1A",
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },

  // ---- Código QR ----
  // Esta tarjeta es la que se captura como imagen al tocar "Descargar":
  // lleva fondo blanco para que se imprima bien.
  tarjetaQr: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
  },
  tituloQr: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: VERDE,
    textAlign: "center",
    marginTop: 8,
  },
  vinculado: {
    fontFamily: "Inter-Regular",
    fontSize: 12.5,
    color: "#444444",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 22,
  },
  marco: {
    width: LADO_MARCO,
    height: LADO_MARCO,
    alignItems: "center",
    justifyContent: "center",
  },
  esquinaSuperiorIzquierda: {
    ...esquina,
    top: 0,
    left: 0,
    borderTopWidth: GROSOR_ESQUINA,
    borderLeftWidth: GROSOR_ESQUINA,
  },
  esquinaSuperiorDerecha: {
    ...esquina,
    top: 0,
    right: 0,
    borderTopWidth: GROSOR_ESQUINA,
    borderRightWidth: GROSOR_ESQUINA,
  },
  esquinaInferiorIzquierda: {
    ...esquina,
    bottom: 0,
    left: 0,
    borderBottomWidth: GROSOR_ESQUINA,
    borderLeftWidth: GROSOR_ESQUINA,
  },
  esquinaInferiorDerecha: {
    ...esquina,
    bottom: 0,
    right: 0,
    borderBottomWidth: GROSOR_ESQUINA,
    borderRightWidth: GROSOR_ESQUINA,
  },
  instrucciones: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    lineHeight: 21,
    color: "#1A1A1A",
    textAlign: "center",
    marginTop: 18,
  },

  // ---- Aviso (sin permiso) ----
  aviso: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    lineHeight: 22,
    color: "#555555",
    textAlign: "center",
  },
  avisoContenedor: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: "#FFFFFF",
  },
});

export const QR_TAMANO = LADO_MARCO - 56;
