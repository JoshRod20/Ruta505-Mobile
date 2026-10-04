import { StyleSheet } from "react-native";

// Pantalla "Reseñas": lista de reseñas de una experiencia (o de todas las
// experiencias de un actor) y modales para escribir una reseña o responderla.
export const VERDE = "#0E5A34";
export const NARANJA = "#F29100";
const GRIS_ESTRELLA = "#BDBDBD";
const AZUL_AVATAR = "#8AD8E8";

export const resenasStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },

  // ---- Encabezado ----
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
    color: VERDE,
  },

  // ---- Resumen y filtros ----
  resumenContenedor: {
    paddingHorizontal: 24,
    paddingTop: 4,
  },
  nombreEspacio: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 22,
    color: "#1A1A1A",
  },
  totalOpiniones: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#555555",
    marginTop: 2,
  },
  filtrosFila: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: VERDE,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: "#FFFFFF",
  },
  chipActivo: {
    backgroundColor: VERDE,
  },
  chipTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: "#1A1A1A",
    marginLeft: 5,
  },
  chipTextoActivo: {
    color: "#FFFFFF",
  },

  // ---- Lista ----
  lista: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  estadoContenedor: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  estadoTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#555555",
    textAlign: "center",
    lineHeight: 20,
  },

  // ---- Tarjeta de reseña ----
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  tarjetaCabecera: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AZUL_AVATAR,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#1A1A1A",
  },
  autorBloque: {
    flex: 1,
    marginLeft: 12,
  },
  autorNombre: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#1A1A1A",
  },
  autorTiempo: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#666666",
  },
  insignia: {
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginLeft: 8,
  },
  insigniaBuena: {
    backgroundColor: VERDE,
  },
  insigniaMala: {
    backgroundColor: NARANJA,
  },
  insigniaTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
  },
  insigniaTextoBuena: {
    color: "#FFFFFF",
  },
  insigniaTextoMala: {
    color: "#1A1A1A",
  },
  estrellasFila: {
    flexDirection: "row",
    marginTop: 10,
  },
  comentario: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    lineHeight: 21,
    color: "#1A1A1A",
    marginTop: 10,
  },
  fotosFila: {
    marginTop: 12,
  },
  foto: {
    width: 260,
    height: 170,
    borderRadius: 18,
    marginRight: 8,
    backgroundColor: "#E6E6E6",
  },
  fotoUnica: {
    width: "100%",
    height: 190,
    borderRadius: 18,
    backgroundColor: "#E6E6E6",
  },

  // ---- Respuesta del actor ----
  respuestaBloque: {
    backgroundColor: "#F1F6F2",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  respuestaTitulo: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: VERDE,
    marginBottom: 2,
  },
  respuestaTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    lineHeight: 19,
    color: "#1A1A1A",
  },
  pieTarjeta: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
    marginTop: 12,
    paddingTop: 10,
    minHeight: 24,
  },
  botonResponder: {
    flexDirection: "row",
    alignItems: "center",
  },
  botonResponderTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    color: "#555555",
    marginLeft: 6,
  },

  // ---- Botón fijo "Escribir reseña" ----
  pie: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: "rgba(250,250,250,0.96)",
  },
  botonEscribir: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: VERDE,
    borderRadius: 14,
    paddingVertical: 14,
  },
  botonEscribirTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 8,
  },

  // ---- Modales (escribir reseña / responder) ----
  modalFondo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalHoja: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  modalTitulo: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: VERDE,
    textAlign: "center",
  },
  modalSubtitulo: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#555555",
    textAlign: "center",
    marginTop: 2,
  },
  selectorEstrellas: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 4,
  },
  etiqueta: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#2D2D2D",
    textTransform: "uppercase",
    marginTop: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: VERDE,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 110,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#1A1A1A",
    textAlignVertical: "top",
  },
  contadorCaracteres: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: "#777777",
    textAlign: "right",
    marginTop: 4,
  },
  miniaturasFila: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  miniaturaContenedor: {
    width: 76,
    height: 76,
    marginRight: 8,
    marginBottom: 8,
  },
  miniatura: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: "#E6E6E6",
  },
  miniaturaQuitar: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  miniaturaAgregar: {
    width: 76,
    height: 76,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: VERDE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  error: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#C1443C",
    marginTop: 10,
    textAlign: "center",
  },
  modalBotones: {
    flexDirection: "row",
    marginTop: 18,
  },
  botonCancelar: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E6E6E6",
    borderRadius: 14,
    paddingVertical: 14,
    marginRight: 8,
  },
  botonCancelarTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#1A1A1A",
  },
  botonConfirmar: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: VERDE,
    borderRadius: 14,
    paddingVertical: 14,
    marginLeft: 8,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  botonConfirmarTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
  },
});
