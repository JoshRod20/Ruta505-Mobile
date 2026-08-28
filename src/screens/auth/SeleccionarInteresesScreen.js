import { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import InteresesUbicacionStyle from "../../styles/auth/InteresesUbicacionStyle";
import { INTERESES_TURISTA } from "../../constants/intereses";

const SeleccionarInteresesScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { datosRegistro } = route.params;

  const [seleccionados, setSeleccionados] = useState([]);
  const [error, setError] = useState("");

  const alternarInteres = (interes) => {
    setError("");
    setSeleccionados((prev) =>
      prev.includes(interes)
        ? prev.filter((item) => item !== interes)
        : [...prev, interes]
    );
  };

  const handleContinuar = () => {
    if (seleccionados.length === 0) {
      setError("Selecciona al menos un tipo de turismo.");
      return;
    }

    navigation.navigate("SolicitarUbicacion", {
      datosRegistro,
      intereses: seleccionados,
    });
  };

  return (
    <View
      style={[
        InteresesUbicacionStyle.contenedor,
        { paddingTop: insets.top + 16 },
      ]}
    >

      <View style={InteresesUbicacionStyle.barraProgreso}>
        <View
          style={[
            InteresesUbicacionStyle.segmentoProgreso,
            InteresesUbicacionStyle.segmentoActivo,
          ]}
        />
        <View style={InteresesUbicacionStyle.segmentoProgreso} />
      </View>

      <Text style={InteresesUbicacionStyle.titulo}>
        ¿Qué tipo de turismo realizas actualmente?
      </Text>

      <FlatList
        data={INTERESES_TURISTA}
        keyExtractor={(item) => item}
        contentContainerStyle={InteresesUbicacionStyle.listaIntereses}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const activo = seleccionados.includes(item);
          return (
            <TouchableOpacity
              style={InteresesUbicacionStyle.opcionFila}
              onPress={() => alternarInteres(item)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  InteresesUbicacionStyle.checkboxCirculo,
                  activo && InteresesUbicacionStyle.checkboxCirculoActivo,
                ]}
              >
                {activo && (
                  <Ionicons name="checkmark" size={14} color="#ffffff" />
                )}
              </View>
              <Text style={InteresesUbicacionStyle.opcionTexto}>{item}</Text>
            </TouchableOpacity>
          );
        }}
      />

      {error ? (
        <Text style={InteresesUbicacionStyle.error}>{error}</Text>
      ) : null}

      <TouchableOpacity
        style={InteresesUbicacionStyle.boton}
        onPress={handleContinuar}
        activeOpacity={0.85}
      >
        <Text style={InteresesUbicacionStyle.botonTexto}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SeleccionarInteresesScreen;