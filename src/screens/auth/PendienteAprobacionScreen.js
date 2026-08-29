import { View, Text } from "react-native";
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../../components/common/LogoutButton";
import PendienteAprobacionScreenStyle from "../../styles/auth/PendienteAprobacionScreenStyle";

// A diferencia de la web, esta pantalla no necesita un useEffect que
// navegue al aprobarse: RootNavigator ya deja de mostrarla solo en
// cuanto AuthContext detecta (en tiempo real) que estadoVerificacion
// cambió a "aprobado".
const PendienteAprobacionScreen = () => {
  const { profile } = useAuth();

  return (
    <View style={PendienteAprobacionScreenStyle.contenedor}>
      <Text style={PendienteAprobacionScreenStyle.titulo}>Tu cuenta está en revisión</Text>
      <Text style={PendienteAprobacionScreenStyle.subtitulo}>
        INTUR está revisando tu perfil. Te notificaremos por correo cuando sea aprobado.
      </Text>

      <View style={PendienteAprobacionScreenStyle.tarjeta}>
        <Text style={PendienteAprobacionScreenStyle.mensaje}>
          Mientras tanto, puedes seguir explorando Ruta 505, pero no podrás
          publicar contenido hasta que tu cuenta sea verificada.
        </Text>
        <LogoutButton />
      </View>
    </View>
  );
};

export default PendienteAprobacionScreen;