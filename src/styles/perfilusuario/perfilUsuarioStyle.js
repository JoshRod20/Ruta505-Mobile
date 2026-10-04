import { StyleSheet } from "react-native";

// Pantalla "Configuración" (Mi cuenta): secciones con filas, igual que el diseño.
const COLOR_HEADER = "#086338";
const COLOR_TINTA = "#065F33";

export const perfilUsuarioStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },

  // ---- Encabezado ----
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 12,
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
    color: COLOR_HEADER,
  },

  // ---- Contenido ----
  contenido: {
    paddingHorizontal: 16,
  },
  seccionTitulo: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#333333",
    textTransform: "uppercase",
    marginTop: 14,
    marginBottom: 8,
    marginLeft: 4,
  },
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    paddingHorizontal: 12,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // ---- Fila ----
  fila: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  filaConSeparador: {
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  iconoCaja: {
    width: 38,
    height: 38,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#BDBDBD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  filaTextos: {
    flex: 1,
  },
  filaTitulo: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#111111",
  },
  filaSubtitulo: {
    fontFamily: "Inter-Regular",
    fontSize: 11.5,
    color: "#555555",
    marginTop: 1,
  },
  filaDerecha: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  insignia: {
    backgroundColor: COLOR_TINTA,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  insigniaTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 10.5,
    color: "#FFFFFF",
  },
  filaTituloLinea: {
    flexDirection: "row",
    alignItems: "center",
  },

  // ---- Cerrar sesión ----
  botonCerrarSesion: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#9E9E9E",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  botonCerrarSesionTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#555555",
  },
});

export default perfilUsuarioStyle;
