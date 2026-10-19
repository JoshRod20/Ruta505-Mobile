/**
 * CampoHorario: un solo campo "Horario disponible" (día + hora de inicio +
 * hora de fin). Al tocarlo abre un modal con los tres selectores y deja un
 * resumen como "Día 2 · 08:00 AM - 09:00 PM". Por dentro se siguen guardando
 * "dia" y "horario" por separado (el chip de días sale del día más alto).
 */

import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DIAS_RUTA, HORAS } from "../../services/rutasService";

const VERDE = "#0E5A34";

/**
 * CampoHorario.
 * @param {{dia:string, horaInicio:string, horaFin:string}} valor
 * @param {function} onChange - Recibe { dia, horaInicio, horaFin }.
 * @param {Object} estiloCampo - Estilo de caja de los inputs de la pantalla.
 */
export default function CampoHorario({ valor, onChange, estiloCampo }) {
  const insets = useSafeAreaInsets();
  const [abierto, setAbierto] = useState(false);
  const [borrador, setBorrador] = useState(valor);

  const completo = !!(valor.dia && valor.horaInicio && valor.horaFin);
  const resumen = completo
    ? `Día ${valor.dia} · ${valor.horaInicio} - ${valor.horaFin}`
    : "Selecciona día y horario";

  const abrir = () => {
    setBorrador(valor);
    setAbierto(true);
  };

  const aceptar = () => {
    onChange(borrador);
    setAbierto(false);
  };

  const selector = (etiqueta, valorActual, alCambiar, opciones, placeholder) => (
    <>
      <Text style={st.etiqueta}>{etiqueta}</Text>
      <View style={st.selector}>
        <Picker
          selectedValue={valorActual}
          onValueChange={alCambiar}
          style={{ color: "#1A1A1A" }}
          itemStyle={{ color: "#1A1A1A", height: 120 }}
          dropdownIconColor="#111111"
        >
          <Picker.Item label={placeholder} value="" />
          {opciones.map((o) => (
            <Picker.Item key={o.valor} label={o.label} value={o.valor} />
          ))}
        </Picker>
      </View>
    </>
  );

  return (
    <>
      <TouchableOpacity
        style={[estiloCampo, st.campo]}
        onPress={abrir}
        activeOpacity={0.7}
        accessibilityLabel="Elegir día y horario"
      >
        <Text style={[st.resumen, !completo && st.resumenVacio]} numberOfLines={1}>
          {resumen}
        </Text>
        <View style={st.reloj}>
         <Image source={require("../../assets/icons/reloj-tres.png")} style={{ width: 24, height: 24 }} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={abierto}
        transparent
        animationType="slide"
        onRequestClose={() => setAbierto(false)}
      >
        <View style={st.fondo}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setAbierto(false)}
          />
          <View style={[st.caja, { paddingBottom: insets.bottom + 16 }]}>
            <Text style={st.titulo}>Horario disponible</Text>
            {selector(
              "Día de la ruta",
              borrador.dia,
              (v) => setBorrador((p) => ({ ...p, dia: v })),
              DIAS_RUTA.map((d) => ({ valor: String(d), label: `Día ${d}` })),
              "Selecciona el día"
            )}
            {selector(
              "Hora de inicio",
              borrador.horaInicio,
              (v) => setBorrador((p) => ({ ...p, horaInicio: v })),
              HORAS.map((h) => ({ valor: h, label: h })),
              "Selecciona la hora de inicio"
            )}
            {selector(
              "Hora de fin",
              borrador.horaFin,
              (v) => setBorrador((p) => ({ ...p, horaFin: v })),
              HORAS.map((h) => ({ valor: h, label: h })),
              "Selecciona la hora de fin"
            )}
            <TouchableOpacity style={st.boton} onPress={aceptar} activeOpacity={0.85}>
              <Text style={st.botonTexto}>Listo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const st = StyleSheet.create({
  campo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resumen: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#1A1A1A",
  },
  resumenVacio: { color: "#8A8A8A" },
  reloj: {
    width: 24,
    height: 24,
  },
  fondo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  caja: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  titulo: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: VERDE,
    textAlign: "center",
    marginBottom: 8,
  },
  etiqueta: {
    fontFamily: "Poppins-Reg",
    fontSize: 13,
    color: VERDE,
    marginTop: 10,
    marginBottom: 4,
  },
  selector: {
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    overflow: "hidden",
  },
  boton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: "#95C11F",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  botonTexto: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#1A1A1A",
  },
});
