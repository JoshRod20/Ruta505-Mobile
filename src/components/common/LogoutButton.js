import { TouchableOpacity, Text } from "react-native";
import { useAuth } from "../../context/AuthContext";
import LogoutButtonStyle from "../../styles/common/LogoutButtonStyle";

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <TouchableOpacity style={LogoutButtonStyle.boton} onPress={logout}>
      <Text style={LogoutButtonStyle.texto}>Cerrar sesión</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;