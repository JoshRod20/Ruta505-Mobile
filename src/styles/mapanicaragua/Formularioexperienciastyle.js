import { StyleSheet } from "react-native";

export const formularioExperienciaStyle = StyleSheet.create({
  fondoOscuro: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  hoja: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "85%",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#123B63",
    marginBottom: 16,
  },
  etiqueta: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4E6780",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D9DEE4",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#2D3748",
  },
  inputMultilinea: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  filaCategorias: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chipCategoria: {
    borderWidth: 1,
    borderColor: "#D9DEE4",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  chipCategoriaActiva: {
    backgroundColor: "#123B63",
    borderColor: "#123B63",
  },
  chipCategoriaTexto: {
    fontSize: 13,
    color: "#2D3748",
  },
  cajaUbicacion: {
    backgroundColor: "#F2F4F7",
    borderRadius: 10,
    padding: 12,
  },
  textoUbicacion: {
    fontSize: 13,
    color: "#1D7A46",
  },
  textoUbicacionError: {
    fontSize: 13,
    color: "#B45309",
  },
  enlaceElegirMapa: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  enlaceElegirMapaTexto: {
    fontSize: 13,
    color: "#123B63",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  filaImagenes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  miniaturaContenedor: {
    width: 80,
    height: 80,
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
  botonQuitarImagenTexto: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  botonAgregarImagen: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#D9DEE4",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  botonAgregarImagenTexto: {
    fontSize: 12,
    color: "#123B63",
    fontWeight: "600",
  },
  filaBotones: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
    marginBottom: 8,
    gap: 10,
  },
  botonCancelar: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  botonCancelarTexto: {
    color: "#8A99A8",
    fontWeight: "600",
  },
  botonGuardar: {
    backgroundColor: "#123B63",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 100,
    alignItems: "center",
  },
  botonGuardarDeshabilitado: {
    backgroundColor: "#B7C3CE",
  },
  botonGuardarTexto: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
