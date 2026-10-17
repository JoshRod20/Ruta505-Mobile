/**
 * QrScannerModal: abre la cámara, lee el QR del lugar y reclama la insignia.
 * Requiere: npx expo install expo-camera
 */

import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

import { culturalPassportStyle as s } from "../../styles/usuario/culturalPassportStyle";

export default function QrScannerModal({ visible, onClose, onClaim }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const locked = useRef(false); // evita procesar el mismo QR varias veces

  useEffect(() => {
    if (visible) {
      locked.current = false;
      setResult(null);
      if (permission && !permission.granted && permission.canAskAgain)
        requestPermission();
    }
  }, [visible, permission?.granted]);

  const handleScan = async ({ data }) => {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    try {
      setResult(await onClaim(data));
    } finally {
      setBusy(false);
    }
  };

  const retry = () => {
    locked.current = false;
    setResult(null);
  };

  const reward = result?.reward?.item;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={s.scannerRoot}>
        {permission?.granted ? (
          <CameraView
            style={s.scannerCamera}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={result ? undefined : handleScan}
          />
        ) : (
          <View style={s.scannerPermission}>
            <Text style={s.scannerPermissionText}>
              Necesitamos acceso a la cámara para escanear el código QR del
              lugar.
            </Text>
            <Pressable style={s.primaryButton} onPress={requestPermission}>
              <Text style={s.primaryButtonText}>Permitir cámara</Text>
            </Pressable>
          </View>
        )}

        <Pressable
          style={s.scannerClose}
          onPress={onClose}
          accessibilityLabel="Cerrar escáner"
        >
          <Ionicons name="close" size={26} color="#FFFFFF" />
        </Pressable>

        {permission?.granted && !result ? (
          <>
            <View style={s.scannerFrame} />
            <Text style={s.scannerHint}>
              Apunta al código QR del lugar que estás visitando
            </Text>
          </>
        ) : null}

        {busy ? (
          <ActivityIndicator
            style={s.scannerBusy}
            size="large"
            color="#FFFFFF"
          />
        ) : null}

        {result ? (
          <View style={s.resultOverlay}>
            <View style={s.resultCard}>
              <Text style={s.resultTitle}>{result.message}</Text>
              {reward?.image ? (
                <Image
                  source={reward.image}
                  style={s.resultImage}
                  resizeMode="cover"
                />
              ) : null}
              {reward?.title ? (
                <Text style={s.resultSubtitle}>{reward.title}</Text>
              ) : null}
              <Pressable style={s.primaryButton} onPress={onClose}>
                <Text style={s.primaryButtonText}>Ver mi pasaporte</Text>
              </Pressable>
              {!result.ok ? (
                <Pressable onPress={retry}>
                  <Text style={s.resultRetry}>Escanear otro código</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}
