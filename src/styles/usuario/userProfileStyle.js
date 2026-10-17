/**
 * Estilos de userProfileStyle: perfil del turista.
 */

import { StyleSheet } from "react-native";
import { boton } from "../common/botonStyle";

const VERDE = "#065F33";
const TAMANO_AVATAR = 112;

export const userProfileStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // ---- Foto y nombre ----
  avatarContenedor: {
    alignSelf: "center",
    width: TAMANO_AVATAR,
    height: TAMANO_AVATAR,
  },
  avatar: {
    width: TAMANO_AVATAR,
    height: TAMANO_AVATAR,
    borderRadius: TAMANO_AVATAR / 2,
    backgroundColor: "#E7F2D3",
  },
  avatarVacio: {
    alignItems: "center",
    justifyContent: "center",
  },
  botonCamara: {
    position: "absolute",
    right: -4,
    bottom: -2,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8CC219",
    alignItems: "center",
    justifyContent: "center",
  },
  nombre: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: VERDE,
    textAlign: "center",
    marginTop: 16,
    paddingHorizontal: 24,
  },
  divisor: {
    height: 1,
    backgroundColor: "#E8E8E8",
    marginTop: 20,
    marginHorizontal: 20,
  },

  // ---- Guardados ----
  filaGuardados: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 28,
  },
  filaGuardadosTexto: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#111111",
    marginLeft: 18,
  },

  // ---- Acciones ----
  seccion: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: "#086338",
    marginLeft: 20,
    marginTop: 12,
    marginBottom: 12,
  },
  botonAccion: {
    ...boton.primario,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  botonAccionTexto: {
    ...boton.primarioTexto,
  },
});
