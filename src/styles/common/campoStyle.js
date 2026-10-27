/**
 * campoStyle: diseño único de campos de formulario (Figma "Publicar Experiencia").
 *
 * Etiqueta verde encima, caja gris clara sin borde y esquinas redondeadas.
 * Se reutiliza con `...campo.input`, `...campo.etiqueta`, etc. en los estilos
 * de cada formulario para que todos los inputs se vean igual.
 */

export const VERDE_CAMPO = "#0E5A34";
export const GRIS_CAMPO = "#F3F3F3";
export const GRIS_CAMPO_BLOQUEADO = "#E6E8E6";
export const COLOR_PLACEHOLDER_CAMPO = "#8A8A8A";
export const ROJO_ERROR_CAMPO = "#d32f2f";

export const campo = {
  // Texto que va encima de cada campo.
  etiqueta: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: VERDE_CAMPO,
    marginTop: 18,
    marginBottom: 8,
  },

  // Campo de una línea.
  input: {
    backgroundColor: GRIS_CAMPO,
    borderWidth: 0,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 44,
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#1F2A24",
  },

  // Se combina con `input` para campos de varias líneas (descripción).
  inputMultilinea: {
    minHeight: 84,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: "top",
  },

  // Caja gris para elementos que no son texto (ubicación, multimedia).
  caja: {
    backgroundColor: GRIS_CAMPO,
    borderWidth: 0,
    borderRadius: 10,
  },

  // Campo con error de validación.
  invalido: {
    borderWidth: 1,
    borderColor: ROJO_ERROR_CAMPO,
  },
};
