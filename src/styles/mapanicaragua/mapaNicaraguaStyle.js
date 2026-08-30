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
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
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

  // Barra de "arrastre" puramente decorativa — sugiere que la tarjeta es
  // un panel que se puede descartar, en el mismo lenguaje visual de un
  // bottom sheet aunque el cierre real sea con la X o tocando afuera.
  tarjetaAsa: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E4E9EF",
    marginBottom: 12,
  },

  tarjetaHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  tarjetaBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  tarjetaBadgeIcono: {
    fontSize: 22,
  },
  tarjetaHeaderTexto: {
    flex: 1,
    paddingTop: 2,
  },
  botonCerrarX: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F2F4F7",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  botonCerrarXTexto: {
    color: "#8A99A8",
    fontSize: 14,
    fontWeight: "700",
  },

  tarjetaTitulo: {
    fontSize: 17,
    fontWeight: "700",
    color: "#123B63",
  },
  tarjetaDescripcion: {
    fontSize: 14,
    color: "#4E6780",
    lineHeight: 20,
    marginBottom: 12,
  },
  tarjetaUbicacionExacta: {
    fontSize: 12,
    color: "#8A99A8",
    marginTop: 2,
  },
  tarjetaFilaFotos: {
    marginBottom: 14,
  },
  tarjetaFoto: {
    width: 110,
    height: 84,
    borderRadius: 12,
    marginRight: 8,
  },

  tarjetaEtaPill: {
    alignSelf: "flex-start",
    backgroundColor: "#EAF5EE",
    borderRadius: 20,
    paddingHorizontal: 110,
    paddingVertical: 6,
    marginBottom: 14,
  },
  tarjetaEtaPillTexto: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1D7A46",
  },

  tarjetaFilaAcciones: {
    flexDirection: "row",
    gap: 10,
  },
  botonSecundario: {
    borderWidth: 1.5,
    borderColor: "#123B63",
    borderRadius: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  botonSecundarioTexto: {
    color: "#123B63",
    fontWeight: "700",
    fontSize: 14,
  },
  botonPrimarioFlex: {
    flex: 1,
    backgroundColor: "#123B63",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
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