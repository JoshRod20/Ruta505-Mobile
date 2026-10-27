/**
 * Guardados: publicaciones que el usuario marcó con el marcador.
 * Se abre desde "Guardados" en el perfil del turista.
 */

import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../context/AuthContext";
import { escucharExperiencias } from "../../services/Experienciasservice";
import PublicacionCard from "../../components/comunidad/PublicacionCard";
import { guardadosStyle as s } from "../../styles/usuario/guardadosStyle";

/**
 * Guardados.
 */
export default function Guardados({ navigation }) {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const [experiencias, setExperiencias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(
    () =>
      escucharExperiencias(
        (lista) => {
          setExperiencias(lista);
          setCargando(false);
        },
        () => setCargando(false)
      ),
    []
  );

  // Las más recientes guardadas primero. Si una publicación se eliminó, se omite.
  const idsGuardados = profile?.guardados;
  const guardadas = useMemo(() => {
    const porId = new Map(experiencias.map((e) => [e.id, e]));
    return [...(idsGuardados ?? [])]
      .reverse()
      .map((id) => porId.get(id))
      .filter(Boolean);
  }, [idsGuardados, experiencias]);

  const volver = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("MainDrawer", { initialTab: "Perfil" });
    }
  };

  return (
    <View style={[s.container, { paddingTop: insets.top + 8 }]}>
      <View style={s.header}>
        <TouchableOpacity
          style={s.botonAtras}
          onPress={volver}
          accessibilityLabel="Volver"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </TouchableOpacity>
        <Text style={s.titulo}>Guardados</Text>
        <View style={s.botonAtras} />
      </View>

      {cargando ? (
        <ActivityIndicator size="large" color="#065F33" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={guardadas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PublicacionCard experiencia={item} />}
          contentContainerStyle={{
            paddingTop: 12,
            paddingBottom: insets.bottom + 32,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={s.vacio}>
              <Ionicons name="bookmark-outline" size={44} color="#9DB88A" />
              <Text style={s.vacioTitulo}>Aún no tienes guardados</Text>
              <Text style={s.vacioTexto}>
                Toca el marcador de una publicación para guardarla y verla aquí.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
