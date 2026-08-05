import React from "react";
import { Text, View } from "react-native";

import { experienciasCulturalesStyle } from "../../styles/experienciascultarales/experienciasCulturalesStyle";

export default function ExperienciasCulturales() {
  return (
    <View style={experienciasCulturalesStyle.container}>
      <Text style={experienciasCulturalesStyle.title}>Publicar experiencias</Text>
      <Text style={experienciasCulturalesStyle.subtitle}>
        Aquí podrás compartir experiencias culturales, fotos y detalles de tu comunidad.
      </Text>
    </View>
  );
}