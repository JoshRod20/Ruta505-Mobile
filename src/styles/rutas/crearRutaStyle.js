import { StyleSheet } from "react-native";

// Estilos compartidos del flujo "Ruta Creativa": Mis servicios (tab +),
// el asistente de 5 pasos y la pantalla de invitaciones.
export const VERDE = "#0E5A34";
export const LIMA = "#95C11F";
export const NARANJA = "#F29100";
export const AZUL = "#0B9BE3";
const GRIS_TARJETA = "#F2F2F2";

export const crearRutaStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contenido: {
    paddingHorizontal: 20,
  },

  // ---- Encabezado con flecha ----
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 6,
  },
  botonAtras: {
    width: 32,
    height: 32,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  tituloPantalla: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: VERDE,
  },
  tituloGrande: {
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    color: VERDE,
    marginBottom: 8,
  },

  // ---- Subencabezado con el contador "n / 5" ----
  subHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6",
    marginBottom: 14,
  },
  subHeaderTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: VERDE,
  },
  contadorPaso: {
    backgroundColor: NARANJA,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 3,
  },
  contadorPasoTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: "#1A1A1A",
  },

  // ---- Tarjeta de parada / negocio ----
  tarjeta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GRIS_TARJETA,
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
  },
  tarjetaMiniatura: {
    width: 62,
    height: 62,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginRight: 12,
  },
  tarjetaMiniaturaImagen: {
    width: 62,
    height: 62,
  },
  tarjetaCuerpo: {
    flex: 1,
  },
  tarjetaTitulo: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13.5,
    color: "#1A1A1A",
  },
  tarjetaDetalle: {
    fontFamily: "Inter-Regular",
    fontSize: 11.5,
    color: "#444444",
    marginTop: 1,
  },
  tarjetaLugarFila: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  tarjetaPrecio: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
    color: "#1A1A1A",
    marginTop: 2,
  },
  insignia: {
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 8,
  },
  insigniaTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11.5,
  },

  // ---- Botones ----
  botonLima: {
    height: 50,
    borderRadius: 12,
    backgroundColor: LIMA,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  botonLimaTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#1A1A1A",
  },
  botonVerde: {
    height: 50,
    borderRadius: 12,
    backgroundColor: VERDE,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  botonVerdeTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
  },
  botonNaranja: {
    height: 48,
    borderRadius: 12,
    backgroundColor: NARANJA,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  botonNaranjaTexto: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
    color: "#1A1A1A",
  },
  botonContorno: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#9E9E9E",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  botonContornoTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#7A7A7A",
  },
  botonDeshabilitado: {
    opacity: 0.45,
  },
  enlace: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#555555",
    textAlign: "center",
    marginTop: 14,
  },
  enlaceSubrayado: {
    textDecorationLine: "underline",
  },

  // ---- Mis servicios (sin negocio / avisos) ----
  aviso: {
    fontFamily: "Inter-Regular",
    fontSize: 13.5,
    lineHeight: 20,
    color: "#555555",
    textAlign: "center",
    marginBottom: 10,
  },
  avisoContenedor: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: "#FFFFFF",
  },

  // ---- Formulario (paso 2 e invitación) ----
  etiqueta: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
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
    height: 46,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#1A1A1A",
    backgroundColor: "#FFFFFF",
  },
  inputMultilinea: {
    height: 92,
    paddingTop: 10,
    textAlignVertical: "top",
  },
  inputConIcono: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
  },
  inputConIconoTexto: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#1A1A1A",
    height: 44,
  },
  multimedia: {
    borderWidth: 1.5,
    borderColor: VERDE,
    borderRadius: 10,
    minHeight: 70,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  multimediaTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#777777",
  },
  miniaturasFila: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  miniaturaContenedor: {
    width: 64,
    height: 64,
    marginRight: 8,
    marginBottom: 4,
  },
  miniatura: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#E6E6E6",
  },
  miniaturaQuitar: {
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
  error: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#C1443C",
    textAlign: "center",
    marginTop: 12,
  },

  // ---- Paso 3: buscar aliados ----
  indicacion: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
    marginBottom: 12,
  },
  buscador: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: VERDE,
    borderRadius: 14,
    height: 50,
    overflow: "hidden",
    marginBottom: 14,
  },
  buscadorIcono: {
    width: 58,
    height: "100%",
    backgroundColor: VERDE,
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
  },
  buscadorInput: {
    flex: 1,
    paddingHorizontal: 14,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#1A1A1A",
  },
  miNegocio: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: LIMA,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  miNegocioCategoria: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: VERDE,
    textTransform: "uppercase",
  },
  seccionTitulo: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: VERDE,
    marginBottom: 10,
  },
  carrusel: {
    paddingRight: 20,
  },
  tarjetaAliado: {
    width: 176,
    borderWidth: 1.2,
    borderColor: VERDE,
    borderRadius: 18,
    padding: 10,
    marginRight: 12,
    backgroundColor: "#FFFFFF",
  },
  aliadoImagenCaja: {
    height: 92,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 8,
  },
  aliadoImagen: {
    width: "100%",
    height: "100%",
  },
  aliadoTitulo: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13.5,
    color: "#1A1A1A",
    textAlign: "center",
    minHeight: 36,
  },
  aliadoLugarFila: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  aliadoLugar: {
    fontFamily: "Inter-Regular",
    fontSize: 12.5,
    color: "#444444",
    marginLeft: 6,
    flex: 1,
  },
  botonInvitar: {
    height: 38,
    borderRadius: 8,
    backgroundColor: AZUL,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  botonInvitarInvitado: {
    backgroundColor: "#B5B5B5",
  },
  botonInvitarTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13.5,
    color: "#FFFFFF",
  },
  contadorInvitados: {
    fontFamily: "Inter-Regular",
    fontSize: 12.5,
    color: "#555555",
    textAlign: "center",
    marginTop: 14,
  },

  // ---- Paso 6: ruta publicada ----
  nombreRutaPublicada: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#1A1A1A",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 14,
    paddingHorizontal: 8,
  },
  totalFila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  totalEtiqueta: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: VERDE,
  },
  totalValor: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: VERDE,
  },

  // ---- Invitación recibida ----
  invitacionTitulo: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: VERDE,
    marginBottom: 4,
  },
  invitacionTexto: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    lineHeight: 21,
    color: "#1A1A1A",
    marginBottom: 6,
  },
  invitacionNegrita: {
    fontFamily: "Poppins-SemiBold",
    color: VERDE,
  },
  botonesFila: {
    flexDirection: "row",
    marginTop: 8,
  },
  botonFilaMitad: {
    flex: 1,
  },
  confirmacionContenedor: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  confirmacionTitulo: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    color: VERDE,
    textAlign: "center",
    marginBottom: 8,
  },
});
