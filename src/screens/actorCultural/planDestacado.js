/**
 * PlanDestacado: pantalla "Experiencias premium" del actor cultural.
 * Muestra los planes de suscripción (anual y mensual) para destacar su espacio.
 */

import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import {
  planDestacadoStyle as s,
  ALTO_PIE,
} from "../../styles/actorCultural/planDestacadoStyle";

const VERDE = "#0E5A34";

// Para cambiar precios o beneficios, solo edita esta lista.
const PLANES = [
  {
    id: "anual",
    etiqueta: "Más popular",
    nombre: "Plan Anual",
    precio: "$9.99",
    facturacion: "$119.88 facturado al año (2 meses gratis)",
    ahorro: "Ahorra 40%",
    destacado: true,
    beneficios: [
      "Presencia estándar en la aplicación.",
      "Promocionar hasta 3 eventos o talleres.",
      "Recomendación máxima con Pinolito.",
      "Destacado visual.",
    ],
    textoBoton: "Comenzar prueba gratis 7 días",
  },
  {
    id: "mensual",
    etiqueta: "Flexibilidad total",
    nombre: "Plan Mensual",
    precio: "$16.99",
    facturacion: "Facturación flexible mes a mes, cancela cuando quieras.",
    destacado: false,
    beneficios: [
      "Presencia estándar en el mapa.",
      "Prioridad con Pinolito.",
      "Socio Cultural Destacado.",
      "Estadísticas básicas.",
    ],
    textoBoton: "Elegir Mensual",
  },
];

function TarjetaPlan({ plan, onElegir }) {
  return (
    <View style={[s.tarjeta, plan.destacado && s.tarjetaDestacada]}>
      {!!plan.ahorro && (
        <View style={s.insignia}>
          <Ionicons name="star" size={13} color="#FFFFFF" />
          <Text style={s.insigniaTexto}>{plan.ahorro}</Text>
        </View>
      )}

      <Text style={s.etiqueta}>{plan.etiqueta}</Text>
      <Text style={s.nombrePlan}>{plan.nombre}</Text>

      <View style={s.filaPrecio}>
        <Text style={s.precio}>{plan.precio}</Text>
        <Text style={s.precioPeriodo}>/ mes</Text>
      </View>

      {plan.destacado ? (
        <View style={s.pastillaFacturacion}>
          <Text style={s.pastillaFacturacionTexto}>{plan.facturacion}</Text>
        </View>
      ) : (
        <Text style={s.notaFacturacion}>{plan.facturacion}</Text>
      )}

      <View style={s.separador} />

      {plan.beneficios.map((texto) => (
        <View key={texto} style={s.beneficio}>
          <Ionicons name="checkmark-circle" size={22} color={VERDE} />
          <Text style={s.beneficioTexto}>{texto}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={[
          s.boton,
          plan.destacado ? s.botonPrimario : s.botonSecundario,
        ]}
        onPress={() => onElegir(plan)}
        activeOpacity={0.85}
      >
        <Text
          style={
            plan.destacado ? s.botonTextoPrimario : s.botonTextoSecundario
          }
        >
          {plan.textoBoton}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * PlanDestacado.
 */
export default function PlanDestacado({ navigation }) {
  const insets = useSafeAreaInsets();

  const volver = () =>
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.navigate("MainDrawer");

  // Aquí se conectará el pago (Stripe, Google Play Billing, etc.).
  const elegirPlan = (plan) =>
    Alert.alert(
      "Próximamente",
      `El pago del ${plan.nombre} estará disponible muy pronto.`
    );

  const proximamente = (titulo) => () =>
    Alert.alert("Próximamente", `${titulo} estará disponible muy pronto.`);

  const altoPie = ALTO_PIE + insets.bottom;

  return (
    <View style={s.container}>
      <View style={[s.encabezado, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={s.botonVolver}
          onPress={volver}
          accessibilityLabel="Volver"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back-outline" size={26} color={VERDE} />
        </TouchableOpacity>
        <Text style={s.encabezadoTitulo}>Experiencias premium</Text>
      </View>

      <ScrollView
        contentContainerStyle={[s.contenido, { paddingBottom: altoPie + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.introContenedor}>
          <Text style={s.titulo}>Elige el plan ideal para ti</Text>
          <Text style={s.subtitulo}>
            Desbloquea todas las funciones ilimitadas sin interrupciones.
          </Text>
        </View>

        {PLANES.map((plan) => (
          <TarjetaPlan key={plan.id} plan={plan} onElegir={elegirPlan} />
        ))}
      </ScrollView>

      <View style={[s.pie, { height: altoPie, paddingBottom: insets.bottom }]}>
        <Text style={s.pieTexto}>
          Cancela en cualquier momento sin penalizaciones.
        </Text>
        <View style={s.pieEnlaces}>
          <TouchableOpacity onPress={proximamente("Los términos de servicio")}>
            <Text style={s.pieEnlace}>Términos de servicio</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={proximamente("La política de privacidad")}>
            <Text style={s.pieEnlace}>Privacidad</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
