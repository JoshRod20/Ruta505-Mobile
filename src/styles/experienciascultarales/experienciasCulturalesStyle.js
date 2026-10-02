import { StyleSheet } from "react-native";

// Pantalla "Publicar Experiencia" (botón + de la barra de navegación).
// Diseño verde de Ruta505, distinto al modal del mapa (Formularioexperienciastyle).
export const VERDE = "#0E5A34";
export const VERDE_CLARO = "#8CC219";

export const experienciasCulturalesStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 4,
  },

  // ---- Encabezado ----
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  botonAtras: {
    width: 32,
    height: 32,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  titulo: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: VERDE,
  },
  rol: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: "#2D2D2D",
    paddingHorizontal: 24,
    marginTop: -2,
    marginBottom: 14,
  },

  // ---- Campos ----
  etiqueta: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#2D2D2D",
    textTransform: "uppercase",
    marginTop: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: VERDE,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#1F2A24",
    backgroundColor: "#FFFFFF",
  },
  inputMultilinea: {
    minHeight: 100,
    textAlignVertical: "top",
  },

  // ---- Categorías (chips en fila con scroll horizontal) ----
  filaCategorias: {
    paddingRight: 24,
  },
  chipCategoria: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: VERDE,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: "#FFFFFF",
  },
  chipCategoriaActiva: {
    backgroundColor: VERDE,
  },
  chipCategoriaIcono: {
    marginRight: 6,
  },
  chipCategoriaTexto: {
    fontFamily: "Poppins-Bold",
    fontSize: 13,
    color: VERDE,
  },
  chipCategoriaTextoActivo: {
    color: "#FFFFFF",
  },

  // ---- Ubicación ----
  tarjetaUbicacion: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: VERDE,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
  },
  tarjetaUbicacionIcono: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: VERDE_CLARO,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  tarjetaUbicacionTexto: {
    flex: 1,
  },
  tarjetaUbicacionCoords: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: VERDE,
  },
  tarjetaUbicacionTitulo: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: VERDE,
  },
  tarjetaUbicacionHint: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#6B6B6B",
  },

  // ---- Fotos / vídeos ----
  cajaMultimedia: {
    borderWidth: 1.5,
    borderColor: VERDE,
    borderRadius: 12,
    minHeight: 88,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  textoMultimedia: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#7A7A7A",
  },
  filaImagenes: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "stretch",
    gap: 10,
  },
  miniaturaContenedor: {
    width: 64,
    height: 64,
    borderRadius: 10,
    overflow: "hidden",
  },
  miniatura: {
    width: "100%",
    height: "100%",
  },
  botonQuitarImagen: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  botonAgregarMas: {
    width: 64,
    height: 64,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: VERDE,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },

  // ---- Publicar ----
  botonPublicar: {
    marginTop: 40,
    backgroundColor: VERDE,
    borderRadius: 999,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  botonPublicarDeshabilitado: {
    opacity: 0.55,
  },
  botonPublicarTexto: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  errorText: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#C0392B",
    marginTop: 16,
    lineHeight: 18,
  },

  // ---- Sin permiso ----
  avisoTitulo: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: VERDE,
    marginBottom: 6,
  },
  avisoTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#4A4A4A",
    lineHeight: 20,
  },
});
