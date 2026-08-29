import { View, Text, TouchableOpacity } from "react-native";
import SeleccionarTipoScreenStyle from "../../styles/auth/SeleccionarTipoScreenStyle";

const tiposUsuario = [
  {
    id: "turista",
    titulo: "Turista",
    descripcion: "Nacional o extranjero, descubre experiencias culturales",
    ruta: "RegistroTurista",
  },
  {
    id: "actor-cultural",
    titulo: "Actor Cultural",
    descripcion: "Comunidad, artesano, guía o emprendedor",
    ruta: "SeleccionarActor",
  },
];

const SeleccionarTipoScreen = ({ navigation }) => {
  return (
    <View style={SeleccionarTipoScreenStyle.contenedor}>
      <Text style={SeleccionarTipoScreenStyle.titulo}>¿Cómo quieres usar Ruta 505?</Text>
      <Text style={SeleccionarTipoScreenStyle.subtitulo}>
        Elige el tipo de cuenta que se ajusta a ti
      </Text>

      {tiposUsuario.map((tipo) => (
        <TouchableOpacity
          key={tipo.id}
          style={[SeleccionarTipoScreenStyle.tarjeta, SeleccionarTipoScreenStyle.tarjetaAcento]}
          onPress={() => navigation.navigate(tipo.ruta)}
        >
          <Text style={SeleccionarTipoScreenStyle.tarjetaTitulo}>{tipo.titulo}</Text>
          <Text style={SeleccionarTipoScreenStyle.tarjetaDescripcion}>{tipo.descripcion}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SeleccionarTipoScreen;