import { StyleSheet } from "react-native";

const COLOR_HEADER = "#086338";
const COLOR_TINTA = "#065F33";
const COLOR_PELIGRO = "#d9534f";

const ActivarDobleFactorStyle = StyleSheet.create({
  // Pantalla completa con fondo propio: así el contenido nunca queda
  // pegado arriba ni tapado por la barra de estado.
  raiz: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },

  // ---- Encabezado (igual que Configuración, Estadísticas, etc.) ----
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  botonAtras: {
    width: 32,
    height: 32,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  tituloPantalla: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: COLOR_HEADER,
  },

  contenedor: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  // ---- Encabezado de estado ----
  iconoCirculo: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#E4F1E9",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  estadoChip: {
    alignSelf: "center",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 16,
  },
  estadoChipActivo: {
    backgroundColor: COLOR_TINTA,
  },
  estadoChipInactivo: {
    backgroundColor: "#E0E0E0",
  },
  estadoChipTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
  },

  // ---- Tarjeta de contenido ----
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  titulo: {
    color: COLOR_HEADER,
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    marginBottom: 8,
  },

  subtitulo: {
    color: "#333333",
    fontSize: 14,
    fontFamily: "Inter-Regular",
    lineHeight: 21,
  },

  paso: {
    color: COLOR_HEADER,
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 6,
  },

  qrWrap: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    padding: 14,
    marginTop: 10,
    marginBottom: 12,
  },

  claveManual: {
    color: "#4a4a4a",
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },

  claveManualTexto: {
    color: COLOR_TINTA,
    fontFamily: "Poppins-Bold",
    letterSpacing: 1,
  },

  input: {
    width: "100%",
    height: 56,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    borderWidth: 1.8,
    borderColor: COLOR_TINTA,
    color: COLOR_TINTA,
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 4,
    marginTop: 10,
  },

  error: {
    color: COLOR_PELIGRO,
    fontSize: 13,
    fontFamily: "Inter-Regular",
    textAlign: "center",
    marginTop: 12,
  },

  aviso: {
    color: COLOR_TINTA,
    fontSize: 13,
    fontFamily: "Inter-Regular",
    lineHeight: 19,
    marginTop: 12,
  },

  boton: {
    width: "100%",
    height: 52,
    backgroundColor: COLOR_TINTA,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },

  botonPeligro: {
    backgroundColor: COLOR_PELIGRO,
  },

  botonTexto: {
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },

  enlaceWrap: {
    alignItems: "center",
    paddingVertical: 8,
    marginTop: 4,
  },

  enlace: {
    color: COLOR_HEADER,
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },
});

export default ActivarDobleFactorStyle;
