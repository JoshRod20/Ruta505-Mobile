import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import FloatingNavButton from "../../components/common/FloatingNavButton";

import { db } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import { usePermisos } from "../../hooks/usePermisos";
import { PERMISOS } from "../../constants/permissions";
import { mapFirebaseError } from "../../utils/firebaseErrors";
import { experienciasCulturalesStyle as styles } from "../../styles/experienciascultarales/experienciasCulturalesStyle";

const CATEGORIAS = [
  { value: "historia", label: "Historia y patrimonio" },
  { value: "naturaleza", label: "Naturaleza y aventura" },
  { value: "gastronomia", label: "Gastronomía" },
  { value: "artesania", label: "Artesanía y oficios" },
  { value: "musica-danza", label: "Música y danza" },
  { value: "tradicion-oral", label: "Tradición oral y leyendas" },
  { value: "festividad", label: "Festividad patronal o religiosa" },
];

const initialForm = {
  titulo: "",
  categoria: CATEGORIAS[0].value,
  descripcion: "",
  ubicacionExacta: "",
};

export default function ExperienciasCulturales() {
  const { profile, user } = useAuth();
  const { puede } = usePermisos();
  const insets = useSafeAreaInsets();
  const topOffset = insets.top + 28 + 4;

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [publicado, setPublicado] = useState(false);

  const puedePublicar = puede(PERMISOS.PUBLICAR_EXPERIENCIA);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError("");

    if (
      !form.titulo.trim() ||
      !form.descripcion.trim() ||
      !form.ubicacionExacta.trim()
    ) {
      setError("Completa título, descripción y ubicación exacta.");
      return;
    }

    try {
      setCargando(true);
      await addDoc(collection(db, "experiencias"), {
        titulo: form.titulo.trim(),
        categoria: form.categoria,
        descripcion: form.descripcion.trim(),
        ubicacionExacta: form.ubicacionExacta.trim(),
        role: profile?.role ?? null,
        actorType: profile?.actorType ?? null,
        creadoPor: user?.uid ?? null,
        email: profile?.email ?? user?.email ?? null,
        createdAt: serverTimestamp(),
      });
      setPublicado(true);
      setForm(initialForm);
    } catch (err) {
      console.error("Error al guardar experiencia:", err);
      const mensaje = mapFirebaseError(err.code);
      setError(
        mensaje === "Ocurrió un error. Inténtalo de nuevo."
          ? `Error al guardar experiencia: ${err.code || err.message || "desconocido"}`
          : mensaje
      );
    } finally {
      setCargando(false);
    }
  };

  if (!puedePublicar) {
    return (
      <View style={[styles.container, { paddingTop: topOffset }]}>
        <FloatingNavButton />
        <View style={styles.card}>
          <Text style={styles.title}>Acceso no disponible</Text>
          <Text style={styles.subtitle}>
            Solo comunidades, artesanos, guías o emprendedores pueden publicar
            experiencias.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: topOffset }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FloatingNavButton />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Publica una experiencia cultural</Text>
          <Text style={styles.subtitle}>
            Comparte un recorrido, taller o vivencia de tu comunidad.
          </Text>
        </View>

        <View style={styles.card}>
          {publicado ? (
            <View style={styles.feedbackBox}>
              <Text style={styles.feedbackText}>
                Tu experiencia se publicó correctamente.
              </Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setPublicado(false)}
              >
                <Text style={styles.primaryButtonText}>
                  Publicar otra experiencia
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Título de la experiencia"
                placeholderTextColor="rgba(43,43,43,0.45)"
                value={form.titulo}
                onChangeText={(value) => handleChange("titulo", value)}
              />

              <View style={styles.categoryWrap}>
                {CATEGORIAS.map((categoria) => {
                  const activa = form.categoria === categoria.value;
                  return (
                    <TouchableOpacity
                      key={categoria.value}
                      style={[
                        styles.categoryChip,
                        activa && styles.categoryChipActive,
                      ]}
                      onPress={() => handleChange("categoria", categoria.value)}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          activa && styles.categoryChipTextActive,
                        ]}
                      >
                        {categoria.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TextInput
                style={styles.textarea}
                placeholder="Descripción de la experiencia"
                placeholderTextColor="rgba(43,43,43,0.45)"
                multiline
                value={form.descripcion}
                onChangeText={(value) => handleChange("descripcion", value)}
              />

              <TextInput
                style={styles.input}
                placeholder="Ubicación exacta (dirección o punto de referencia)"
                placeholderTextColor="rgba(43,43,43,0.45)"
                value={form.ubicacionExacta}
                onChangeText={(value) =>
                  handleChange("ubicacionExacta", value)
                }
              />

              {!!error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  cargando && styles.primaryButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={cargando}
              >
                {cargando ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>
                    Publicar experiencia
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}