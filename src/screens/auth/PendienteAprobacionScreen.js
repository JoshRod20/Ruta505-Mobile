import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../../components/common/LogoutButton";
import PendienteAprobacionScreenStyle from "../../styles/auth/PendienteAprobacionScreenStyle";

// A diferencia de la web, esta pantalla no necesita un useEffect que
// navegue al aprobarse: RootNavigator ya deja de mostrarla solo en
// cuanto AuthContext detecta (en tiempo real) que estadoVerificacion
// cambió a "aprobado".
//
// onExplorar lo pasa RootNavigator: al presionarlo, se monta
// NavigationDrawer (Home con funcionalidad reducida) sin dejar de
// escuchar el perfil — apenas se apruebe, el resto de la app se
// desbloquea solo, sin volver a pasar por aquí.
const PendienteAprobacionScreen = ({ onExplorar }) => {
  const { profile } = useAuth();

  return (
    <View
      style={PendienteAprobacionScreenStyle.contenedor}
      testID="pendiente-aprobacion-screen"
    >
      <Text style={PendienteAprobacionScreenStyle.titulo}>Tu cuenta está en revisión</Text>
      <Text style={PendienteAprobacionScreenStyle.subtitulo}>
        El equipo de soporte de Ruta 505 está revisando tu perfil. Te notificaremos por correo cuando sea aprobado.
      </Text>

      <View style={PendienteAprobacionScreenStyle.tarjeta}>
        <Text style={PendienteAprobacionScreenStyle.mensaje}>
          Mientras tanto, puedes seguir explorando Ruta 505, pero no podrás
          publicar contenido hasta que tu cuenta sea verificada.
        </Text>

        <View style={PendienteAprobacionScreenStyle.filaBotones}>
          <TouchableOpacity
            testID="pendiente-aprobacion-explorar-button"
            style={PendienteAprobacionScreenStyle.botonExplorar}
            onPress={onExplorar}
            activeOpacity={0.8}
          >
            <Text style={PendienteAprobacionScreenStyle.botonExplorarTexto}>Explorar</Text>
          </TouchableOpacity>

          <LogoutButton />
        </View>
      </View>
    </View>
  );
};

export default PendienteAprobacionScreen;