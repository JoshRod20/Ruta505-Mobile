/**
 * Estilos de editUserProfileStyle: edición del perfil del turista.
 * Los campos (input, dropdownInput, boton...) reutilizan RegistroActorFormStyle
 * para verse igual que en el registro y en la edición del actor cultural.
 */

import { StyleSheet } from "react-native";
import { campo } from "../common/campoStyle";

const VERDE = "#086338";

export const editUserProfileStyle = StyleSheet.create({
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
    ...campo.etiqueta,
    marginTop: 6,
    marginBottom: 6,
  },
  soloLectura: {
    backgroundColor: "#E6E8E6",
    color: "#6B6B6B",
    borderWidth: 0,
  },

  // ---- Intereses (tipos de turismo) ----
  interesFila: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
  },
  interesCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: VERDE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  interesCheckActivo: {
    backgroundColor: VERDE,
  },
  interesTexto: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#1F2A24",
  },
  avisoSinPermiso: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#4A4A4A",
  },
});
