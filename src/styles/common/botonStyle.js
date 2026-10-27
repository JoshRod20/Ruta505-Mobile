/**
 * botonStyle: diseño único de botones de formulario (Figma "Publicar").
 *
 * Rectángulo verde con esquinas redondeadas y texto blanco en negrita media.
 * Se reutiliza con `...boton.primario` / `...boton.primarioTexto` en los estilos
 * de cada formulario; cada pantalla solo añade lo suyo (marginTop, width, flex…).
 */

export const BOTON_VERDE = "#065F33";
export const BOTON_GRIS = "#E9ECE9";

const base = {
  height: 50,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
};

const textoBase = {
  fontFamily: "Inter-SemiBold",
  fontSize: 16,
};

export const boton = {
  // Acción principal: Publicar, Guardar, Iniciar sesión, Continuar…
  primario: { ...base, backgroundColor: BOTON_VERDE },
  primarioTexto: { ...textoBase, color: "#FFFFFF" },

  // Acción secundaria: Cancelar, Volver…
  secundario: { ...base, backgroundColor: BOTON_GRIS },
  secundarioTexto: { ...textoBase, color: "#1F2A24" },

  // Botón con solo borde (Declinar, etc.).
  contorno: {
    ...base,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#9E9E9E",
  },
  contornoTexto: { ...textoBase, color: "#1F2A24" },

  // Se agrega junto a cualquiera de los anteriores cuando está deshabilitado.
  deshabilitado: { opacity: 0.55 },
};
