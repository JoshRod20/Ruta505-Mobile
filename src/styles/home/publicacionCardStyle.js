/**
 * Estilos de publicacionCardStyle.
 */

import { StyleSheet, Dimensions } from "react-native";

const { width: ANCHO_PANTALLA } = Dimensions.get("window");

const MARGEN_CARD = 20;
const PADDING_CARD = 12;
// Ancho útil de la imagen dentro de la tarjeta (descuenta márgenes, padding y borde)
export const ANCHO_IMAGEN = ANCHO_PANTALLA - MARGEN_CARD * 2 - PADDING_CARD * 2 - 2;
export const ALTO_IMAGEN = Math.round(ANCHO_IMAGEN * 0.78);

const VERDE = "#0E5A34";

export const publicacionCardStyle = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DADFDB",
    marginHorizontal: MARGEN_CARD,
    marginBottom: 20,
    padding: PADDING_CARD,
  },

  // ---- Encabezado (avatar + título + ubicación) ----
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F1ECE4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  headerTextos: {
    flex: 1,
  },
  filaTitulo: {
    flexDirection: "row",
    alignItems: "center",
  },
  titulo: {
    flexShrink: 1,
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: VERDE,
  },
  verificado: {
    marginLeft: 5,
  },
  filaUbicacion: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 1,
  },
  ubicacionTexto: {
    flex: 1,
    marginLeft: 3,
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#2D2D2D",
  },

  // ---- Carrusel de imágenes ----
  carruselContenedor: {
    width: ANCHO_IMAGEN,
    height: ALTO_IMAGEN,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#EFF3EC",
  },
  imagen: {
    width: ANCHO_IMAGEN,
    height: ALTO_IMAGEN,
  },
  imagenPlaceholder: {
    width: ANCHO_IMAGEN,
    height: ALTO_IMAGEN,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF3EC",
  },
  imagenPlaceholderTexto: {
    marginTop: 8,
    color: "#8FA391",
    fontSize: 13,
  },
  contadorBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  contadorBadgeTexto: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  puntosContenedor: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 8,
  },
  punto: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D7DED6",
    marginHorizontal: 3,
  },
  puntoActivo: {
    backgroundColor: VERDE,
  },

  // ---- Descripción ----
  descripcion: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#1F1F1F",
    lineHeight: 17,
    marginTop: 12,
  },
  tiempoTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: "#9A9A9A",
    marginTop: 6,
  },

  // ---- Acciones (me gusta / guardar) ----
  accionesFila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#ECEFEC",
    marginTop: 12,
    paddingTop: 10,
  },
  pastilla: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  pastillaTexto: {
    marginLeft: 6,
    fontFamily: "Inter-SemiBold",
    fontSize: 13,
    color: "#1F1F1F",
  },

  // ---- Comentarios (hoja inferior) ----
  comentariosFondo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  comentariosHoja: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "75%",
    paddingTop: 16,
  },
  comentariosCabecera: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ECEFEC",
  },
  comentariosTitulo: {
    fontFamily: "Poppins-Bold",
    fontSize: 17,
    color: VERDE,
  },
  comentariosLista: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  comentariosVacio: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    paddingVertical: 32,
  },
  comentarioFila: {
    flexDirection: "row",
    marginBottom: 16,
  },
  comentarioAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#8AD8E8",
    alignItems: "center",
    justifyContent: "center",
  },
  comentarioAvatarTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: "#1A1A1A",
  },
  comentarioCuerpo: {
    flex: 1,
    marginLeft: 10,
  },
  comentarioEncabezado: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  comentarioAutor: {
    flex: 1,
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#1A1A1A",
  },
  comentarioTiempo: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: "#777777",
    marginLeft: 8,
  },
  comentarioTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#1A1A1A",
    marginTop: 2,
  },
  comentarioBorrar: {
    marginLeft: 8,
  },
  comentarioEstrellas: {
    flexDirection: "row",
    marginTop: 2,
  },
  comentarioFoto: {
    width: "100%",
    height: 150,
    borderRadius: 14,
    marginTop: 8,
    backgroundColor: "#E6E6E6",
  },
  comentarioRespuesta: {
    backgroundColor: "#F1F6F2",
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },
  comentarioRespuestaTitulo: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
    color: VERDE,
    marginBottom: 2,
  },
  comentarioRespuestaTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    lineHeight: 18,
    color: "#1A1A1A",
  },
  comentarioComposer: {
    borderTopWidth: 1,
    borderTopColor: "#ECEFEC",
    paddingTop: 10,
  },
  comentarioSelectorEstrellas: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  comentarioSelectorTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#555555",
    marginRight: 8,
  },
  comentarioMiniaturas: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  comentarioMiniaturaContenedor: {
    width: 56,
    height: 56,
    marginRight: 8,
  },
  comentarioMiniatura: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#E6E6E6",
  },
  comentarioMiniaturaQuitar: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  comentarioBotonFoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: VERDE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  comentarioEntradaFila: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
  },
  comentarioInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: VERDE,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: 110,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#1A1A1A",
  },
  comentarioEnviar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: VERDE,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  comentarioEnviarDeshabilitado: {
    opacity: 0.5,
  },
  comentarioAviso: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#666666",
    textAlign: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#ECEFEC",
  },
});
