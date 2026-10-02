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
});
