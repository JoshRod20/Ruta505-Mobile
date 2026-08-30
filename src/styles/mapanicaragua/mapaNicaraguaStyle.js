import { StyleSheet } from "react-native";

export const mapaNicaraguaStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF6FF",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#123B63",
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#4E6780",
    textAlign: "center",
    lineHeight: 22,
  },

  // Marcadores
  marcadorPunto: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: "#123B63",
  },
  marcadorIcono: {
    fontSize: 18,
  },
  marcadorOrigen: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#1D7A46",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  // Tarjeta inferior de detalle del punto
  tarjeta: {
    position: "absolute",
    // 68 = alto de la barra de tabs custom (navigationTabsStyle.tabBar.height)
    // + ~28 de aire para que no quede pegada.
    bottom: 96,
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  // Capa transparente que cubre el mapa completo mientras la tarjeta está
  // abierta. Detecta el toque "fuera de la tarjeta" para poder cerrarla.
  overlayCierre: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tarjetaTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#123B63",
    marginBottom: 4,
  },
  tarjetaDescripcion: {
    fontSize: 14,
    color: "#4E6780",
    lineHeight: 20,
    marginBottom: 10,
  },
  tarjetaUbicacionExacta: {
    fontSize: 13,
    color: "#8A99A8",
    marginBottom: 10,
    fontStyle: "italic",
  },
  tarjetaFilaFotos: {
    marginBottom: 10,
  },
  tarjetaFoto: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 8,
  },
  botonEditar: {
    alignSelf: "flex-start",
    marginBottom: 10,
    paddingVertical: 6,
  },
  botonEditarTexto: {
    color: "#123B63",
    fontWeight: "600",
    fontSize: 13,
    textDecorationLine: "underline",
  },
  tarjetaEta: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1D7A46",
    marginBottom: 10,
  },
  tarjetaCerrar: {
    marginTop: 10,
    textAlign: "center",
    color: "#8A99A8",
    fontSize: 13,
  },

  botonPrimario: {
    backgroundColor: "#123B63",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  botonPrimarioTexto: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  // Botón flotante "+" para publicar un punto nuevo (solo roles autorizados)
  botonAgregar: {
    position: "absolute",
    right: 16,
    bottom: 96,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1D7A46",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  botonAgregarTexto: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
    marginTop: -2,
  },
});
