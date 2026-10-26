/**
 * CulturalPassport: pantalla "Mi Pasaporte" de la aplicación Ruta505.
 * Muestra el perfil del turista, sus contadores, 6 insignias y 6 niveles de perfil.
 * Todo el progreso es individual: depende del uid del usuario con sesión iniciada.
 */

import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import QrScannerModal from "../../components/pasaporte/QrScannerModal";
import StampCard from "../../components/pasaporte/StampCard";
import { useAuth } from "../../context/AuthContext";
import usePassport from "../../hooks/usePassport";
import {
  culturalPassportStyle as s,
  GRID_GAP,
  SCREEN_PADDING,
} from "../../styles/usuario/culturalPassportStyle";

const PREVIEW_COUNT = 6;
// Imagen de perfil por defecto: la del nivel 1 (Viajero novato).
const AVATAR_POR_DEFECTO = require("../../assets/niveles/Viajero novato.png");

/**
 * CulturalPassport.
 */
export default function CulturalPassport({ navigation }) {
  const { user, profile } = useAuth();
  const { width } = useWindowDimensions();
  const { rutas, totalInsignias, insignias, niveles, claim } = usePassport(
    user?.uid,
  );
  const [scannerOpen, setScannerOpen] = useState(false);

  // Ajusta los nombres de campo a los que uses en users/{uid}.
  const nombre =
    profile?.nombreCompleto ||
    profile?.nombre ||
    profile?.name ||
    profile?.displayName ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Turista";

  // Math.floor evita que la suma de 3 sellos + separaciones se pase del ancho
  // por una fracción y el tercer sello salte a la fila de abajo (2 columnas).
  const cardSize = Math.floor(
    (width - SCREEN_PADDING * 2 - GRID_GAP * 2) / 3,
  );
  const nivelesDesbloqueados = niveles.filter((n) => n.unlocked);
  const nivelActual = Math.max(nivelesDesbloqueados.length, 1);
  // Nivel actual = el último desbloqueado (por defecto, el nivel 1).
  const nivelActualItem = nivelesDesbloqueados.length
    ? nivelesDesbloqueados[nivelesDesbloqueados.length - 1]
    : niveles[0];
  const nivelTitulo = nivelActualItem.title;
  // La imagen de arriba es la del nivel actual, NO la foto de perfil del usuario.
  const imagenNivel = nivelActualItem.image || AVATAR_POR_DEFECTO;

  return (
    <View style={s.container}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.title}>Mi Pasaporte</Text>

        <View style={s.profileRow}>
          <View style={s.avatarWrap}>
            <Image
              source={imagenNivel}
              style={s.avatar}
              resizeMode="cover"
            />
            <Pressable
              style={s.qrButton}
              onPress={() => setScannerOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Escanear código QR"
            >
              <Ionicons name="qr-code-outline" size={26} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={s.profileInfo}>
            <Text style={s.userName} numberOfLines={1}>
              {nombre}
            </Text>
            <Text style={s.userLevel}>
              Lv{nivelActual}: {nivelTitulo}
            </Text>
            <View style={s.statsRow}>
              <View style={s.stat}>
                <Text style={s.statNumber}>{rutas}</Text>
                <Text style={s.statLabel}>Rutas</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.stat}>
                <Text style={s.statNumber}>{totalInsignias}</Text>
                <Text style={s.statLabel}>Insignias</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={s.hint}>
          Suma una nueva insignia a tu colección.{"\n"}¡Desbloquea las
          siguientes!
        </Text>

        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Mis insignias</Text>
          <Pressable
            onPress={() => navigation.navigate("PassportCollection")}
            hitSlop={8}
          >
            <Text style={s.seeAll}>Ver todas</Text>
          </Pressable>
        </View>
        <View style={s.grid}>
          {insignias.slice(0, PREVIEW_COUNT).map((item) => (
            <StampCard key={item.id} item={item} size={cardSize} />
          ))}
        </View>

        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Niveles de Perfiles</Text>
        </View>
        <View style={s.grid}>
          {niveles.slice(0, PREVIEW_COUNT).map((item) => (
            <StampCard key={item.id} item={item} size={cardSize} />
          ))}
        </View>
      </ScrollView>

      <QrScannerModal
        visible={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onClaim={claim}
      />
    </View>
  );
}
