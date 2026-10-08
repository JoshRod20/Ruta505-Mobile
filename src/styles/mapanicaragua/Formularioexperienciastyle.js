/**
 * Estilos de Formularioexperienciastyle.
 */

import { StyleSheet } from "react-native";

// Modal "Agregar ubicación de mi negocio" (mapa interactivo).
const VERDE = "#0E5A34";
const VERDE_CLARO = "#8CC219";

export const formularioExperienciaStyle = StyleSheet.create({
  fondoOscuro: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  hoja: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 16,
    maxHeight: "90%",
  },
  titulo: {
    fontFamily: "Poppins-Bold",
    fontSize: 17,
    color: VERDE,
    textAlign: "center",
    marginBottom: 6,
  },
  etiqueta: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: "#2D2D2D",
    textTransform: "uppercase",
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: VERDE,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#1F2A24",
    backgroundColor: "#FFFFFF",
  },
  inputMultilinea: {
    minHeight: 86,
    textAlignVertical: "top",
  },

  // ---- Categorías (chips con scroll horizontal + flecha) ----
  categoriasContenedor: {
    flexDirection: "row",
    alignItems: "center",
  },
  filaCategorias: {
    paddingRight: 8,
  },
  chipCategoria: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: VERDE,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 8,
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
    fontSize: 12,
    color: VERDE,
  },
  chipCategoriaTextoActivo: {
    color: "#FFFFFF",
  },
  flechaCategorias: {
    marginLeft: 2,
  },

  // ---- Fotos ----
  cajaMultimedia: {
    borderWidth: 1.5,
    borderColor: VERDE,
    borderRadius: 10,
    minHeight: 70,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
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

  // ---- Ubicación en el mapa (tocable → abre el selector) ----
  tarjetaUbicacion: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: VERDE,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
  },
  tarjetaUbicacionIcono: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: VERDE_CLARO,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  tarjetaUbicacionTexto: {
    flex: 1,
  },
  tarjetaUbicacionCoords: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
    color: VERDE,
  },
  tarjetaUbicacionTitulo: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
    color: VERDE,
  },
  tarjetaUbicacionHint: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: "#6B6B6B",
  },

  // ---- Botones ----
  filaBotones: {
    flexDirection: "row",
    marginTop: 18,
    gap: 12,
  },
  botonCancelar: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    backgroundColor: "#D2D2D2",
    alignItems: "center",
    justifyContent: "center",
  },
  botonCancelarTexto: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
    color: "#7A7A7A",
  },
  botonGuardar: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    backgroundColor: VERDE_CLARO,
    alignItems: "center",
    justifyContent: "center",
  },
  botonGuardarDeshabilitado: {
    opacity: 0.5,
  },
  botonGuardarTexto: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
    color: "#FFFFFF",
  },
});

export const COLOR_VERDE_FORMULARIO = VERDE;
