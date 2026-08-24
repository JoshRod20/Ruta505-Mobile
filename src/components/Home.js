import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FloatingNavButton from "../components/common/FloatingNavButton";
import { useAuth } from "../context/AuthContext";
import { ROLES, ESTADOS_VERIFICACION } from "../constants/roles";
import { homeStyle } from "../styles/home/homeStyle";

export default function Home() {
  const insets = useSafeAreaInsets();
  const topOffset = insets.top + 26;

  const { role, estadoVerificacion } = useAuth();

  // Actor cultural que entró por "Explorar" desde
  // PendienteAprobacionScreen: puede ver Home, pero no
  // publicar hasta que se apruebe su perfil.
  const revisionPendiente =
    role === ROLES.ACTOR_CULTURAL &&
    estadoVerificacion === ESTADOS_VERIFICACION.PENDIENTE;

  return (
    <View style={[homeStyle.container, { paddingTop: topOffset }]}>
      {/* ⚠️ No tengo el código de FloatingNavButton — le paso
          modoLimitado para que oculte o deshabilite ahí la opción
          de publicar mientras el perfil está pendiente, pero ese
          componente todavía necesita leer esta prop. */}
      <FloatingNavButton modoLimitado={revisionPendiente} />

      <Text style={homeStyle.title}>Ruta505</Text>
      <Text style={homeStyle.subtitle}>
        Explora tu comunidad, revisa el mapa y publica experiencias desde la
        barra inferior.
      </Text>

      {revisionPendiente ? (
        <View style={homeStyle.avisoTarjeta}>
          <Text style={homeStyle.avisoTexto}>
            Tu perfil sigue en revisión — puedes explorar Ruta 505, pero
            todavía no puedes publicar contenido.
          </Text>
        </View>
      ) : null}
    </View>
  );
}