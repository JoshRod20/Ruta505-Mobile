import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import {
  escucharActividadDeActor,
  esResenaBuena,
  resumirResenas,
} from "../../services/Experienciasservice";
import { useAuth } from "../../context/AuthContext";
import {
  estadisticasStyle as s,
  VERDE,
  NARANJA,
} from "../../styles/actorCultural/estadisticasStyle";

// Etiqueta según el promedio de calificación.
function etiquetaCalificacion(promedio) {
  if (promedio >= 4.5) return "Excelente";
  if (promedio >= 4) return "Muy buena";
  if (promedio >= 3) return "Buena";
  if (promedio >= 2) return "Regular";
  return "Baja";
}

// Estrellas con media estrella (4.8 se dibuja como 4 llenas y una a medias).
function EstrellasPromedio({ promedio, size = 26 }) {
  return (
    <View style={s.estrellasFila}>
      {[1, 2, 3, 4, 5].map((n) => {
        let nombre = "star-outline";
        if (promedio >= n) nombre = "star";
        else if (promedio >= n - 0.5) nombre = "star-half";
        return (
          <Ionicons
            key={n}
            name={nombre}
            size={size}
            color={nombre === "star-outline" ? "#BDBDBD" : NARANJA}
            style={{ marginRight: 3 }}
          />
        );
      })}
    </View>
  );
}

function EstrellasEnteras({ valor, size = 26 }) {
  return (
    <View style={s.estrellasFila}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Ionicons
          key={n}
          name="star"
          size={size}
          color={n <= valor ? NARANJA : "#BDBDBD"}
          style={{ marginRight: 3 }}
        />
      ))}
    </View>
  );
}

export default function Estadisticas() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, profile } = useAuth();

  const [actividad, setActividad] = useState({
    publicaciones: [],
    comentarios: [],
    likesTotal: 0,
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      setCargando(false);
      return undefined;
    }
    return escucharActividadDeActor(
      user.uid,
      (datos) => {
        setActividad(datos);
        setCargando(false);
        setError(false);
      },
      () => {
        setCargando(false);
        setError(true);
      }
    );
  }, [user?.uid]);

  const resumen = useMemo(
    () => resumirResenas(actividad.comentarios),
    [actividad.comentarios]
  );
  const ultima = actividad.comentarios[0] ?? null;

  const porcentajeFavorable =
    resumen.total > 0 ? Math.round((resumen.buenas / resumen.total) * 100) : 0;
  const porcentajeDesfavorable = resumen.total > 0 ? 100 - porcentajeFavorable : 0;

  const volver = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  const verTodas = () =>
    navigation.navigate("ResenasDrawer", {
      actorId: user?.uid ?? null,
      titulo: profile?.nombreCompleto ?? "",
    });

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
        <Text style={s.tituloPantalla}>Estadísticas</Text>
        <View style={s.botonAtras} />
      </View>

      {cargando ? (
        <ActivityIndicator
          size="large"
          color={VERDE}
          style={{ marginTop: 48 }}
        />
      ) : (
        <ScrollView
          contentContainerStyle={[
            s.contenido,
            { paddingBottom: insets.bottom + 32 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.titulo}>Estadísticas de tu Espacio Cultural</Text>
          <Text style={s.subtitulo}>
            Monitorea la satisfacción de los visitantes y el impacto de tus
            actividades.
          </Text>

          {error && (
            <Text style={[s.sinDatos, { marginBottom: 12 }]}>
              No se pudieron cargar todos los datos. Intenta de nuevo más tarde.
            </Text>
          )}

          {/* Calificación promedio */}
          <View style={s.tarjeta}>
            <View style={s.tarjetaFila}>
              <Text style={s.etiquetaTarjeta}>Calificación promedio</Text>
              {resumen.promedio != null && (
                <View style={s.insignia}>
                  <Text style={s.insigniaTexto}>
                    {etiquetaCalificacion(resumen.promedio)}
                  </Text>
                </View>
              )}
            </View>

            {resumen.promedio != null ? (
              <>
                <View style={s.promedioFila}>
                  <Text style={s.promedioNumero}>
                    {resumen.promedio.toFixed(1)}
                  </Text>
                  <Text style={s.promedioSobre}>/5.0</Text>
                </View>
                <View style={s.estrellasYBase}>
                  <EstrellasPromedio promedio={resumen.promedio} />
                  <Text style={s.basadoEn}>
                    (basado en {resumen.total}{" "}
                    {resumen.total === 1 ? "reseña" : "reseñas"})
                  </Text>
                </View>
              </>
            ) : (
              <Text style={s.sinDatos}>
                Aún no tienes reseñas. Aparecerán aquí cuando los visitantes
                comenten tus publicaciones.
              </Text>
            )}
          </View>

          {/* Balance de reseñas */}
          <View style={s.tarjeta}>
            <View style={s.tarjetaFila}>
              <Text style={s.etiquetaTarjeta}>Balance de reseñas</Text>
              <Text style={s.totalOpiniones}>
                {resumen.total} {resumen.total === 1 ? "opinión" : "opiniones"}
              </Text>
            </View>

            <View style={s.balanceCajas}>
              <View style={[s.balanceCaja, s.balanceCajaIzquierda]}>
                <View style={[s.balanceIcono, { backgroundColor: VERDE }]}>
                  <Ionicons name="thumbs-up-outline" size={20} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={s.balanceTexto}>Buenas</Text>
                  <Text style={s.balanceNumero}>{resumen.buenas}</Text>
                </View>
              </View>
              <View style={s.balanceCaja}>
                <View style={[s.balanceIcono, { backgroundColor: NARANJA }]}>
                  <Ionicons
                    name="thumbs-down-outline"
                    size={20}
                    color="#1A1A1A"
                  />
                </View>
                <View>
                  <Text style={s.balanceTexto}>Malas</Text>
                  <Text style={s.balanceNumero}>{resumen.malas}</Text>
                </View>
              </View>
            </View>

            <View style={s.barra}>
              {resumen.total > 0 && (
                <>
                  <View
                    style={[s.barraBuenas, { flex: porcentajeFavorable }]}
                  />
                  <View
                    style={[s.barraMalas, { flex: porcentajeDesfavorable }]}
                  />
                </>
              )}
            </View>
            <View style={s.porcentajesFila}>
              <Text style={s.porcentajeTexto}>
                {porcentajeFavorable}% favorables
              </Text>
              <Text style={s.porcentajeTexto}>
                {porcentajeDesfavorable}% desfavorables
              </Text>
            </View>
          </View>

          {/* Reacciones e interacción */}
          <Text style={s.seccionTitulo}>Reacciones e interacción</Text>
          <View style={s.metricasFila}>
            <View style={[s.metricaTarjeta, s.metricaIzquierda]}>
              <View style={s.metricaIcono}>
                <Ionicons name="heart" size={26} color="#111111" />
              </View>
              <Text style={s.metricaEtiqueta}>Me gusta totales</Text>
              <Text style={s.metricaValor}>{actividad.likesTotal}</Text>
            </View>
            <View style={s.metricaTarjeta}>
              <View style={s.metricaIcono}>
                <Ionicons name="calendar-outline" size={26} color="#111111" />
              </View>
              <Text style={s.metricaEtiqueta}>Publicaciones activas</Text>
              <View style={s.metricaValorFila}>
                <Text style={s.metricaValor}>
                  {actividad.publicaciones.length}
                </Text>
                <Text style={s.metricaNota}>(eventos/talleres)</Text>
              </View>
            </View>
          </View>

          {/* Última reseña agregada */}
          <Text style={s.seccionTitulo}>Última reseña agregada</Text>
          <View style={s.tarjeta}>
            {ultima ? (
              <>
                <View style={s.ultimaCabecera}>
                  <EstrellasEnteras valor={Number(ultima.calificacion) || 0} />
                  <View
                    style={[
                      s.insignia,
                      !esResenaBuena(ultima) && s.insigniaMala,
                    ]}
                  >
                    <Text
                      style={[
                        s.insigniaTexto,
                        !esResenaBuena(ultima) && s.insigniaTextoMala,
                      ]}
                    >
                      {esResenaBuena(ultima) ? "Buena" : "Mala"}
                    </Text>
                  </View>
                </View>
                <View style={s.ultimaCita}>
                  <Text style={s.ultimaCitaTexto} numberOfLines={3}>
                    “{ultima.texto}”
                  </Text>
                </View>
                <Text style={s.ultimaAutor}>{ultima.autorNombre}</Text>
              </>
            ) : (
              <Text style={s.ultimaVacia}>Aún no hay reseñas.</Text>
            )}

            <TouchableOpacity
              style={s.botonVerTodas}
              onPress={verTodas}
              activeOpacity={0.85}
            >
              <Text style={s.botonVerTodasTexto}>Ver todas las reseñas</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
