/**
 * Estilos de invitacionesRutaStyle: Notificaciones (invitaciones recibidas),
 * "Invitación a una ruta" (participantes) y la pantalla "¡Listo!".
 */

import { StyleSheet } from "react-native";

export const VERDE_OSCURO = "#065F33";
export const LIMA_BOTON = "#8CC219";
export const AZUL_ACEPTO = "#0B9BE3";

// Espacio reservado para la imagen de la pantalla "¡Listo!" (la mascota).
export const ANCHO_IMAGEN_LISTO = 230;
export const ALTO_IMAGEN_LISTO = 200;

export const invitacionesRutaStyle = StyleSheet.create({
  // ---- Notificaciones: tarjeta verde de invitación ----
  notificacion: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: VERDE_OSCURO,
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
  },
  notificacionAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginRight: 10,
  },
  notificacionAvatarImagen: {
    width: "100%",
    height: "100%",
  },
  notificacionCuerpo: {
    flex: 1,
  },
  notificacionTitulo: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12.5,
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  notificacionTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    lineHeight: 17,
    color: "#FFFFFF",
    marginTop: 2,
  },
  notificacionBotones: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  botonChico: {
    height: 28,
    borderRadius: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  botonChicoGris: {
    backgroundColor: "#C9C9C9",
  },
  botonChicoLima: {
    backgroundColor: LIMA_BOTON,
  },
  botonChicoTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11.5,
    color: "#1A1A1A",
  },

  // ---- Invitación a una ruta: encabezado y participantes ----
  subtituloRuta: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13.5,
    lineHeight: 20,
    color: "#0E5A34",
    textAlign: "center",
    marginTop: 14,
    marginBottom: 14,
    paddingHorizontal: 20,
  },
  participante: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
  },
  participanteIcono: {
    width: 62,
    height: 62,
    borderRadius: 10,
    backgroundColor: VERDE_OSCURO,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  participanteCuerpo: {
    flex: 1,
  },
  participanteNombre: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#1A1A1A",
  },
  participanteTipo: {
    fontFamily: "Inter-Regular",
    fontSize: 10.5,
    color: "#1A1A1A",
    marginTop: 1,
  },
  participanteFila: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  participanteFilaTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 10.5,
    color: "#1A1A1A",
    marginLeft: 3,
  },
  participantePropietario: {
    fontFamily: "Inter-Regular",
    fontSize: 10,
    color: "#1A1A1A",
    marginTop: 3,
  },
  participantePropietarioNombre: {
    fontFamily: "Inter-SemiBold",
  },
  estadoChip: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginLeft: 8,
    alignSelf: "flex-end",
  },
  estadoChipTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11.5,
  },
  avisoParticipantes: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    lineHeight: 17,
    color: "#777777",
    textAlign: "center",
    marginBottom: 10,
  },

  // ---- Pantalla "¡Listo!" ----
  listoContenedor: {
    flex: 1,
    paddingHorizontal: 32,
  },
  listoCentro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // Aquí va la imagen: ver IMAGEN_LISTO en invitacionesRuta.js.
  listoImagenEspacio: {
    width: ANCHO_IMAGEN_LISTO,
    height: ALTO_IMAGEN_LISTO,
    marginBottom: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  listoImagen: {
    width: "100%",
    height: "100%",
  },
  listoTitulo: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#0E5A34",
    textAlign: "center",
    marginBottom: 8,
  },
  listoTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 12.5,
    lineHeight: 18,
    color: "#1A1A1A",
    textAlign: "center",
  },
  listoTextoNegrita: {
    fontFamily: "Inter-SemiBold",
  },
});
