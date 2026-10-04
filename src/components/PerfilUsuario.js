import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import perfilUsuarioStyle from "../styles/perfilusuario/perfilUsuarioStyle";

const VERDE = "#086338";

const proximamente = (titulo) => () =>
  Alert.alert(titulo, "Esta sección estará disponible próximamente.");

// Fila de una sección. "derecha" reemplaza la flecha (por ejemplo, un switch).
function Fila({
  icono,
  titulo,
  subtitulo,
  insignia,
  derecha,
  onPress,
  ultima = false,
}) {
  const s = perfilUsuarioStyle;
  const contenido = (
    <View style={[s.fila, !ultima && s.filaConSeparador]}>
      <View style={s.iconoCaja}>
        <Ionicons name={icono} size={21} color="#222222" />
      </View>
      <View style={s.filaTextos}>
        <View style={s.filaTituloLinea}>
          <Text style={s.filaTitulo} numberOfLines={1}>
            {titulo}
          </Text>
          {!!insignia && (
            <View style={s.insignia}>
              <Text style={s.insigniaTexto}>{insignia}</Text>
            </View>
          )}
        </View>
        {!!subtitulo && (
          <Text style={s.filaSubtitulo} numberOfLines={2}>
            {subtitulo}
          </Text>
        )}
      </View>
      <View style={s.filaDerecha}>
        {derecha ?? <Ionicons name="chevron-forward" size={18} color="#222222" />}
      </View>
    </View>
  );

  if (!onPress) return contenido;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      {contenido}
    </TouchableOpacity>
  );
}

export default function PerfilUsuario({ navigation }) {
  const s = perfilUsuarioStyle;
  const insets = useSafeAreaInsets();
  const { user, profile, logout } = useAuth();

  const esActor = profile?.role === "actor-cultural";
  const version = Constants.expoConfig?.version;

  // Preferencia guardada en tu perfil. Por ahora solo se guarda: todavía no
  // se envían notificaciones push ni correos desde la app.
  const [notificaciones, setNotificaciones] = useState(
    profile?.notificaciones !== false
  );

  const volver = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("MainDrawer");
    }
  };

  const cambiarNotificaciones = async (valor) => {
    setNotificaciones(valor);
    if (!user?.uid) return;
    try {
      await updateDoc(doc(db, "users", user.uid), {
        notificaciones: valor,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn("Error guardando notificaciones:", error);
      setNotificaciones(!valor);
      Alert.alert(
        "No se pudo guardar",
        "No pudimos guardar tu preferencia. Inténtalo de nuevo."
      );
    }
  };

  const confirmarCerrarSesion = () =>
    Alert.alert("Cerrar sesión", "¿Quieres cerrar tu sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar sesión", style: "destructive", onPress: () => logout() },
    ]);

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
        <Text style={s.titulo}>Configuración</Text>
        <View style={s.botonAtras} />
      </View>

      <ScrollView
        contentContainerStyle={[
          s.contenido,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* CUENTA */}
        <Text style={s.seccionTitulo}>Cuenta</Text>
        <View style={s.tarjeta}>
          <Fila
            icono="id-card-outline"
            titulo="Información personal y seguridad"
            subtitulo="Datos de contacto, contraseña y 2FA"
            onPress={() => navigation.navigate("ActivarDobleFactorDrawer")}
            ultima={!esActor}
          />
          {esActor && (
            <>
              <Fila
                icono="card-outline"
                titulo="Métodos de pago y facturación"
                subtitulo="Administra tus pagos y facturas"
                onPress={proximamente("Métodos de pago y facturación")}
              />
              <Fila
                icono="sparkles-outline"
                titulo="Suscripción actual"
                subtitulo="Conoce el Plan Destacado"
                onPress={proximamente("Suscripción")}
                ultima
              />
            </>
          )}
        </View>

        {/* PREFERENCIAS */}
        <Text style={s.seccionTitulo}>Preferencias</Text>
        <View style={s.tarjeta}>
          <Fila
            icono="notifications-outline"
            titulo="Notificaciones y alertas"
            subtitulo="Push y avisos vía email"
            derecha={
              <Switch
                value={notificaciones}
                onValueChange={cambiarNotificaciones}
                trackColor={{ false: "#CFCFCF", true: VERDE }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <Fila
            icono="color-palette-outline"
            titulo="Apariencia y Tema"
            subtitulo="Automático / Claro"
            onPress={proximamente("Apariencia y Tema")}
          />
          <Fila
            icono="language-outline"
            titulo="Idioma de la aplicación"
            subtitulo="Español (ES)"
            onPress={proximamente("Idioma de la aplicación")}
            ultima
          />
        </View>

        {/* SOPORTE Y AYUDA */}
        <Text style={s.seccionTitulo}>Soporte y ayuda</Text>
        <View style={s.tarjeta}>
          <Fila
            icono="help-circle-outline"
            titulo="Centro de ayuda y FAQ"
            subtitulo="Preguntas frecuentes y tutoriales"
            onPress={proximamente("Centro de ayuda y FAQ")}
          />
          <Fila
            icono="headset-outline"
            titulo="Contactar a Soporte técnico"
            subtitulo="Escríbenos si necesitas ayuda"
            onPress={proximamente("Soporte técnico")}
          />
          <Fila
            icono="bug-outline"
            titulo="Reportar un problema"
            subtitulo="Envía registros o incidencias"
            onPress={proximamente("Reportar un problema")}
            ultima
          />
        </View>

        {/* ACERCA DE & LEGAL */}
        <Text style={s.seccionTitulo}>Acerca de & legal</Text>
        <View style={s.tarjeta}>
          <Fila
            icono="information-circle-outline"
            titulo="Acerca de Ruta 505"
            subtitulo="Información de la aplicación"
            insignia={version ? `v${version}` : undefined}
            onPress={() => navigation.navigate("AcercaDeDrawer")}
          />
          <Fila
            icono="shield-checkmark-outline"
            titulo="Términos de Servicio y Privacidad"
            subtitulo="Condiciones de uso y manejo de tus datos"
            onPress={proximamente("Términos de Servicio y Privacidad")}
          />
          <Fila
            icono="code-slash-outline"
            titulo="Licencia de código abierto"
            subtitulo="Avisos y atribuciones de terceros"
            onPress={proximamente("Licencia de código abierto")}
            ultima
          />
        </View>

        <TouchableOpacity
          style={s.botonCerrarSesion}
          onPress={confirmarCerrarSesion}
          activeOpacity={0.7}
        >
          <Text style={s.botonCerrarSesionTexto}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
