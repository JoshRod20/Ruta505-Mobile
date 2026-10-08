/**
 * CulturalProfile: componente/pantalla de la aplicación Ruta505.
 */

import React, { useEffect, useState } from "react";
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
import { usePermisos } from "../../hooks/usePermisos";
import { PERMISOS } from "../../constants/permissions";
import { ESTADOS_VERIFICACION } from "../../constants/roles";
import {
  escucharActividadDeActor,
  resumirResenas,
} from "../../services/Experienciasservice";
import { culturalProfileStyle as s } from "../../styles/actorCultural/culturalProfileStyle";

const VERDE = "#086338";

// La portada se guarda como Base64 dentro de tu perfil (sin Firebase Storage),
// así que se comprime para no pasar el límite de 1 MB por documento.
const ANCHO_PORTADA = 1000; // px
const CALIDAD_PORTADA = 0.5; // 0 a 1
const MAX_PESO_PORTADA_KB = 350;

const ETIQUETA_TIPO_ACTOR = {
  comunidad: "Comunidad",
  artesano: "Artesano",
  guia: "Guía turístico",
  emprendedor: "Emprendedor",
};

/**
 * CulturalProfile.
 */
export default function CulturalProfile() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { profile, user, estadoVerificacion } = useAuth();
  const { puede } = usePermisos();
  const [subiendoPortada, setSubiendoPortada] = useState(false);
  // Promedio de las reseñas que recibió este actor en sus publicaciones.
  const [resumenResenas, setResumenResenas] = useState(null);

  useEffect(() => {
    if (!user?.uid) return undefined;
    return escucharActividadDeActor(
      user.uid,
      ({ comentarios }) => setResumenResenas(resumirResenas(comentarios)),
      () => setResumenResenas(null)
    );
  }, [user?.uid]);

  if (!puede(PERMISOS.VER_PERFIL_CULTURAL)) {
    return (
      <View style={[s.avisoContenedor, { paddingTop: insets.top + 24 }]}>
        <Text style={s.avisoTexto}>
          Esta sección es solo para actores culturales.
        </Text>
      </View>
    );
  }

  const tipo = ETIQUETA_TIPO_ACTOR[profile?.tipoActor] ?? "";
  const ubicacion = [profile?.municipio, profile?.departamento]
    .filter(Boolean)
    .join(", ");
  const subtitulo = [tipo, ubicacion].filter(Boolean).join(" • ");
  const verificado = estadoVerificacion === ESTADOS_VERIFICACION.APROBADO;
  const tieneCalificacion = resumenResenas?.promedio != null;

  const cambiarPortada = async () => {
    if (subiendoPortada || !user?.uid) return;

    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert(
        "Permiso necesario",
        "Necesitamos acceso a tus fotos para cambiar la portada."
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (resultado.canceled) return;

    try {
      setSubiendoPortada(true);
      const manipulado = await ImageManipulator.manipulateAsync(
        resultado.assets[0].uri,
        [{ resize: { width: ANCHO_PORTADA } }],
        {
          compress: CALIDAD_PORTADA,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );
      const pesoKB = Math.round((manipulado.base64.length * 0.75) / 1024);
      if (pesoKB > MAX_PESO_PORTADA_KB) {
        Alert.alert(
          "Imagen muy pesada",
          `La portada comprimida pesa ${pesoKB} KB y el máximo es ${MAX_PESO_PORTADA_KB} KB. Prueba con otra foto.`
        );
        return;
      }

      await updateDoc(doc(db, "users", user.uid), {
        fotoPortada: `data:image/jpeg;base64,${manipulado.base64}`,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error al cambiar la portada:", error);
      Alert.alert(
        "No se pudo cambiar la portada",
        "Inténtalo de nuevo en unos minutos."
      );
    } finally {
      setSubiendoPortada(false);
    }
  };

  const proximamente = (mensaje) => () =>
    Alert.alert("Próximamente", mensaje);

  const acciones = [
    {
      texto: "Editar perfil cultural",
      onPress: () => navigation.navigate("EditarPerfilCulturalDrawer"),
    },
    {
      texto: "Ver valoraciones recibidas",
      onPress: () =>
        navigation.navigate("EstadisticasDrawer"),
    },
    {
      texto: "Conocer Plan Destacado",
      onPress: proximamente("Muy pronto podrás conocer el Plan Destacado."),
    },
    {
      texto: "Configuración",
      onPress: () => navigation.navigate("MiCuentaDrawer"),
    },
  ];

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={{ paddingBottom: 68 + insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Portada */}
      <View>
        <Image
          source={
            profile?.fotoPortada
              ? { uri: profile.fotoPortada }
              : require("../../assets/images/Patron-2.png")
          }
          style={s.portada}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={s.botonPortada}
          onPress={cambiarPortada}
          activeOpacity={0.85}
          accessibilityLabel="Cambiar foto de portada"
        >
          {subiendoPortada ? (
            <ActivityIndicator color={VERDE} />
          ) : (
            <Ionicons name="image-outline" size={22} color={VERDE} />
          )}
        </TouchableOpacity>
      </View>

      <View style={s.cuerpo}>
        {verificado && (
          <View style={s.insignia}>
            <Ionicons name="shield-checkmark" size={14} color={VERDE} />
            <Text style={s.insigniaTexto}>Experiencia Verificada</Text>
          </View>
        )}

        <Text style={s.nombre}>{profile?.nombreCompleto ?? ""}</Text>
        {!!subtitulo && <Text style={s.subtitulo}>{subtitulo}</Text>}

        {tieneCalificacion && (
          <View style={s.filaCalificacion}>
            <Ionicons name="star" size={20} color="#F29100" />
            <Text style={s.calificacionTexto}>
              {resumenResenas.promedio.toFixed(1)}
            </Text>
          </View>
        )}

        {profile?.descripcion ? (
          <Text style={s.descripcion}>{profile.descripcion}</Text>
        ) : (
          <Text style={s.descripcionVacia}>
            Agrega una descripción de tu negocio en “Editar perfil cultural”.
          </Text>
        )}

        <Text style={s.seccion}>ACCIONES</Text>
        {acciones.map((accion) => (
          <TouchableOpacity
            key={accion.texto}
            style={s.botonAccion}
            onPress={accion.onPress}
            activeOpacity={0.8}
          >
            <Text style={s.botonAccionTexto}>{accion.texto}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
