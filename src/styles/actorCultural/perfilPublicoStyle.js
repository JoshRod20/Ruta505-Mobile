/**
 * Estilos de perfilPublicoStyle (perfil del actor visto por otros usuarios).
 */

import { StyleSheet } from "react-native";
import { VERDE, NARANJA } from "../comunidad/resenasStyle";
import { campo } from "../common/campoStyle";
import { boton } from "../common/botonStyle";

const AZUL = "#0B9BE3";

export const perfilPublicoStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  portada: { width: "100%", height: 230, backgroundColor: "#DDE7DD" },
  botonAtras: {
    position: "absolute",
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  hoja: {
    marginTop: -26,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 22,
  },
  titulo: { fontFamily: "Poppins-Bold", fontSize: 22, color: VERDE },
  filaCalificacion: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  promedio: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#1A1A1A",
    marginRight: 6,
  },
  totalResenas: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#777777",
    marginLeft: 4,
  },
  filaLugar: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  lugarTexto: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 12.5,
    color: "#444444",
    marginLeft: 4,
  },
  seccion: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: VERDE,
    marginTop: 22,
    marginBottom: 8,
  },
  descripcion: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    lineHeight: 20,
    color: "#333333",
    marginTop: 14,
  },
  mostrarMas: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12.5,
    color: NARANJA,
    marginTop: 4,
  },
  vacioTexto: { fontFamily: "Inter-Regular", fontSize: 13, color: "#777777" },
  fotoPublicacion: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: "#E6E6E6",
  },
  cajaMapa: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 14,
    padding: 12,
  },
  cajaMapaTextos: { flex: 1, marginLeft: 10 },
  cajaMapaTitulo: { fontFamily: "Poppins-SemiBold", fontSize: 13, color: "#1A1A1A" },
  cajaMapaDetalle: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#555555",
    marginTop: 2,
  },
  botonMapa: {
    backgroundColor: VERDE,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  botonMapaTexto: { fontFamily: "Poppins-SemiBold", fontSize: 12, color: "#FFFFFF" },
  botonEscribir: {
    height: 46,
    borderRadius: 12,
    backgroundColor: VERDE,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  botonEscribirTexto: { fontFamily: "Inter-SemiBold", fontSize: 15, color: "#FFFFFF" },

  // ---- Modal "¿Qué tipo de reseña quiere publicar?" ----
  centroFondo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  cajaCentro: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
  },
  cajaTitulo: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 16,
  },
  tipoFila: { flexDirection: "row" },
  botonTipo: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  botonTipoTexto: { fontFamily: "Poppins-SemiBold", fontSize: 14, color: "#FFFFFF", marginLeft: 8 },
  etiquetaCampo: { fontFamily: "Inter-Regular", fontSize: 13, color: VERDE, marginTop: 10, marginBottom: 6 },
  botonesFila: { flexDirection: "row", marginTop: 18 },

  // ---- Pestañas: Información del perfil | Reseñas ----
  pestanasFila: {
    flexDirection: "row",
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6",
  },
  pestana: {
    paddingVertical: 10,
    marginRight: 24,
    marginBottom: -1,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  pestanaActiva: { borderBottomColor: VERDE },
  pestanaTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#8A8A8A",
  },
  pestanaTextoActivo: { fontFamily: "Inter-SemiBold", color: VERDE },

  // ---- Reseñas: botón "+" azul y puntaje ----
  filaAgregar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 14,
  },
  botonMas: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: AZUL,
    alignItems: "center",
    justifyContent: "center",
  },
  puntajeResena: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#1A1A1A",
    marginRight: 8,
  },

  // ---- Modales: flecha de volver y "Nueva reseña" ----
  modalAtras: {
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  tituloNuevaResena: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: VERDE,
    textAlign: "center",
    marginBottom: 8,
  },
  cajaMultimedia: {
    ...campo.caja,
    minHeight: 50,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  textoMultimedia: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#6B6B6B",
  },
  agregarMasTile: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  botonesFilaCentro: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 22,
  },
  botonCancelarPeque: {
    ...boton.secundario,
    height: 40,
    minWidth: 104,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  botonCancelarPequeTexto: { ...boton.secundarioTexto, fontSize: 14 },
  botonPublicarPeque: {
    ...boton.primario,
    height: 40,
    minWidth: 104,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  botonPublicarPequeTexto: { ...boton.primarioTexto, fontSize: 14 },
});
