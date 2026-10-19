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

  // ---- Intereses elegidos (se muestran debajo del selector) ----
  chipsFila: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
    marginBottom: 6,
  },
  chipInteres: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "100%",
    backgroundColor: "#EAF4E7",
    borderWidth: 1,
    borderColor: VERDE,
    borderRadius: 999,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 8,
  },
  chipInteresTexto: {
    flexShrink: 1,
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
    color: VERDE,
    marginRight: 6,
  },
  avisoSinPermiso: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#4A4A4A",
  },
});
