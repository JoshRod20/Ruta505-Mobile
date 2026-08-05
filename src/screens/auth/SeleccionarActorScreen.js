import { View, Text, TouchableOpacity } from "react-native";
import SeleccionarActorScreenStyle from "../../styles/auth/SeleccionarActorScreenStyle";

const actoresCulturales = [
  {
    id: "comunidad",
    titulo: "Comunidad",
    descripcion: "Comunidad local que ofrece experiencias culturales",
    ruta: "RegistroComunidad",
  },
  {
    id: "artesano",
    titulo: "Artesano",
    descripcion: "Oficio artesanal y catálogo de productos",
    ruta: "RegistroArtesano",
  },
  {
    id: "guia",
    titulo: "Guía",
    descripcion: "Guía comunitario o independiente",
    ruta: "RegistroGuia",
  },
  {
    id: "emprendedor",
    titulo: "Emprendedor Cultural",
    descripcion: "Eventos y experiencias culturales",
    ruta: "RegistroEmprendedor",
  },
];

const SeleccionarActorScreen = ({ navigation }) => {
  return (
    <View style={SeleccionarActorScreenStyle.contenedor}>
      <TouchableOpacity
        style={SeleccionarActorScreenStyle.volver}
        onPress={() => navigation.goBack()}
      >
        <Text style={SeleccionarActorScreenStyle.volverTexto}>← Volver</Text>
      </TouchableOpacity>

      <Text style={SeleccionarActorScreenStyle.titulo}>
        ¿Qué tipo de actor cultural eres?
      </Text>
      <Text style={SeleccionarActorScreenStyle.subtitulo}>
        Esto define el formulario de registro que verás
      </Text>

      <View style={SeleccionarActorScreenStyle.grid}>
        {actoresCulturales.map((actor) => (
          <TouchableOpacity
            key={actor.id}
            style={SeleccionarActorScreenStyle.tarjeta}
            onPress={() => navigation.navigate(actor.ruta)}
          >
            <Text style={SeleccionarActorScreenStyle.tarjetaTitulo}>{actor.titulo}</Text>
            <Text style={SeleccionarActorScreenStyle.tarjetaDescripcion}>
              {actor.descripcion}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SeleccionarActorScreen;