/**
 * UserProfile: perfil del turista.
 *
 * Foto de perfil (se puede cambiar), nombre, acceso a las publicaciones
 * guardadas y acciones (editar perfil y configuración).
 */

import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

import { db } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import { userProfileStyle as s } from "../../styles/usuario/userProfileStyle";

const VERDE = "#065F33";

// La foto se guarda como Base64 dentro de tu perfil (igual que la portada del
// actor cultural), así que se reduce para no pasar el límite de 1 MB por documento.
const ANCHO_FOTO = 500; // px
const CALIDAD_FOTO = 0.6; // 0 a 1
const MAX_PESO_FOTO_KB = 200;

/**
 * UserProfile.
 */
export default function UserProfile() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { profile, user } = useAuth();
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  const cambiarFoto = async () => {
    if (subiendoFoto || !user?.uid) return;

    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert(
        "Permiso necesario",
        "Necesitamos acceso a tus fotos para cambiar tu foto de perfil."
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (resultado.canceled) return;

    try {
      setSubiendoFoto(true);
      const foto = await ImageManipulator.manipulateAsync(
        resultado.assets[0].uri,
        [{ resize: { width: ANCHO_FOTO } }],
        {
          compress: CALIDAD_FOTO,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );
      const pesoKB = Math.round((foto.base64.length * 0.75) / 1024);
      if (pesoKB > MAX_PESO_FOTO_KB) {
        Alert.alert(
          "Imagen muy pesada",
          `La foto comprimida pesa ${pesoKB} KB y el máximo es ${MAX_PESO_FOTO_KB} KB. Prueba con otra foto.`
        );
        return;
      }

      await updateDoc(doc(db, "users", user.uid), {
        fotoPerfil: `data:image/jpeg;base64,${foto.base64}`,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error al cambiar la foto de perfil:", error);
      Alert.alert(
        "No se pudo cambiar la foto",
        "Inténtalo de nuevo en unos minutos."
      );
    } finally {
      setSubiendoFoto(false);
    }
  };

  const acciones = [
    {
      texto: "Editar perfil",
      onPress: () => navigation.navigate("EditarPerfilDrawer"),
    },
    {
      texto: "Configuración",
      onPress: () => navigation.navigate("MiCuentaDrawer"),
    },
  ];

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={{
        paddingTop: insets.top + 36,
        paddingBottom: 68 + insets.bottom + 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Foto de perfil */}
      <View style={s.avatarContenedor}>
        {profile?.fotoPerfil ? (
          <Image source={{ uri: profile.fotoPerfil }} style={s.avatar} />
        ) : (
          <View style={[s.avatar, s.avatarVacio]}>
            <Ionicons name="person" size={52} color="#9DB88A" />
          </View>
        )}
        <TouchableOpacity
          style={s.botonCamara}
          onPress={cambiarFoto}
          activeOpacity={0.85}
          accessibilityLabel="Cambiar foto de perfil"
        >
          {subiendoFoto ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Ionicons name="camera" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      <Text style={s.nombre}>{profile?.nombreCompleto ?? ""}</Text>

      <View style={s.divisor} />

      {/* Publicaciones guardadas */}
      <TouchableOpacity
        style={s.filaGuardados}
        onPress={() => navigation.navigate("GuardadosDrawer")}
        activeOpacity={0.7}
        accessibilityLabel="Ver publicaciones guardadas"
      >
        <Ionicons name="bookmark" size={24} color={VERDE} />
        <Text style={s.filaGuardadosTexto}>Guardados</Text>
      </TouchableOpacity>

      {/* Acciones */}
      <Text style={s.seccion}>ACCIONES</Text>
      {acciones.map((accion) => (
        <TouchableOpacity
          key={accion.texto}
          style={s.botonAccion}
          onPress={accion.onPress}
          activeOpacity={0.85}
        >
          <Text style={s.botonAccionTexto}>{accion.texto}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
