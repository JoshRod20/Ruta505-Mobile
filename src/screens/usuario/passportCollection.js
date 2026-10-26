/**
 * PassportCollection: colección completa de niveles de perfil e insignias
 * del turista con sesión iniciada. Se abre desde "Ver todas" en CulturalPassport.
 */

import React, { useState } from "react";
import {
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

export default function PassportCollection({ navigation }) {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const { insignias, niveles, claim } = usePassport(user?.uid);
  const [scannerOpen, setScannerOpen] = useState(false);

  // Math.floor evita que la suma de 3 sellos + separaciones se pase del ancho
  // por una fracción y el tercer sello salte a la fila de abajo (2 columnas).
  const cardSize = Math.floor(
    (width - SCREEN_PADDING * 2 - GRID_GAP * 2) / 3,
  );

  return (
    <View style={s.container}>
      <View style={s.topBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          accessibilityLabel="Volver"
        >
          <Ionicons name="arrow-back" size={24} color="#0B5D2E" />
        </Pressable>
        <Pressable
          style={s.qrButtonSmall}
          onPress={() => setScannerOpen(true)}
          accessibilityLabel="Escanear código QR"
        >
          <Ionicons name="qr-code-outline" size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.sectionTitle}>Niveles de Perfiles</Text>
        <View style={[s.grid, s.gridSpaced]}>
          {niveles.map((item) => (
            <StampCard key={item.id} item={item} size={cardSize} />
          ))}
        </View>

        <Text style={s.sectionTitle}>Insignias</Text>
        <View style={[s.grid, s.gridSpaced]}>
          {insignias.map((item) => (
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
