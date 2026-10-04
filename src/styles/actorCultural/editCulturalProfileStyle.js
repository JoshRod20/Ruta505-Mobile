import { StyleSheet } from "react-native";

const VERDE = "#086338";

// Los campos (input, dropdownInput, botonIdioma, boton...) reutilizan
// RegistroActorFormStyle para verse igual que en el registro.
export const editCulturalProfileStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 6,
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
    fontSize: 17,
    color: VERDE,
  },
  contenido: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  etiqueta: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: "#2D2D2D",
    textTransform: "uppercase",
    marginTop: 6,
    marginBottom: 6,
  },
  soloLectura: {
    backgroundColor: "#F2F4F2",
    color: "#6B6B6B",
    borderColor: "#B9C9BE",
  },
});
