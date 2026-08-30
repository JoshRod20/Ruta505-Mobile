import { useMemo, useState } from "react";

import {
  Dimensions,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useRegistroForm } from "../../hooks/useRegistroForm";

import {
  ESTADOS_VERIFICACION,
  ROLES,
} from "../../constants/roles";

import {
  ACTORES_CULTURALES_CONFIG,
} from "../../constants/actoresCulturales";

import {
  CEDULA_REGEX,
  EMAIL_REGEX,
  TELEFONO_REGEX,
} from "../../utils/validators";

import RegistroActorFormStyle
  from "../../styles/auth/RegistroActorFormStyle";

// ==================================================
// DIMENSIONES
// ==================================================

const { width: SCREEN_WIDTH } =
  Dimensions.get("window");

const CURVE_HEIGHT = 130;

// ==================================================
// CURVA
// ==================================================

const curvaPath = (w) => `
  M0,${CURVE_HEIGHT * 0.99}

  C${w * 0.2},${CURVE_HEIGHT * 0.98}
   ${w * 0.38},${CURVE_HEIGHT * 0.85}
   ${w * 0.5},${CURVE_HEIGHT * 0.62}

  C${w * 0.62},${CURVE_HEIGHT * 0.4}
   ${w * 0.72},${CURVE_HEIGHT * 0.15}
   ${w * 0.85},${CURVE_HEIGHT * 0.06}

  C${w * 0.9},${CURVE_HEIGHT * 0.02}
   ${w * 0.95},0
   ${w},0

  L${w},${CURVE_HEIGHT}
  L0,${CURVE_HEIGHT}

  Z
`;

// ==================================================
// COMPONENTE
// ==================================================

const RegistroActorScreen = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();

  // ==================================================
  // ACTOR
  // ==================================================

  const { tipoActor } =
    route.params || {};

  const config =
    ACTORES_CULTURALES_CONFIG[
      tipoActor
    ];

  const tiposTurismoDisponibles =
    config?.tiposTurismo ?? [];

  const tituloEncabezado =
    config?.tituloEncabezado ||
    "Datos Generales";

  // ==================================================
  // FORMULARIO
  // ==================================================

  const {
    form,
    handleChange,

    mostrarPassword,
    setMostrarPassword,

    mostrarConfirmPassword,
    setMostrarConfirmPassword,

    error,
    validarCredenciales,
  } = useRegistroForm({
    initialValues: {
      nombreCompleto: "",
      email: "",
      cedula: "",
      telefono: "",
      password: "",
      confirmPassword: "",
      tipoTurismo: "",
    },
  });

  // ==================================================
  // CAMPOS TOCADOS
  // ==================================================

  const [tocado, setTocado] =
    useState({});

  const marcarTocado = (campo) => {
    setTocado((prev) => ({
      ...prev,
      [campo]: true,
    }));
  };

  // ==================================================
  // VALIDACIONES
  // ==================================================

  const nombreInvalido =
    tocado.nombreCompleto &&
    form.nombreCompleto
      .trim()
      .length === 0;

  const emailVacio =
    tocado.email &&
    form.email
      .trim()
      .length === 0;

  const emailFormatoInvalido =
    tocado.email &&
    form.email
      .trim()
      .length > 0 &&
    !EMAIL_REGEX.test(
      form.email.trim()
    );

  const emailInvalido =
    emailVacio ||
    emailFormatoInvalido;

  const cedulaVacia =
    tocado.cedula &&
    form.cedula
      .trim()
      .length === 0;

  const cedulaFormatoInvalido =
    tocado.cedula &&
    form.cedula
      .trim()
      .length > 0 &&
    !CEDULA_REGEX.test(
      form.cedula.trim()
    );

  const cedulaInvalida =
    cedulaVacia ||
    cedulaFormatoInvalido;

  const telefonoVacio =
    tocado.telefono &&
    form.telefono
      .trim()
      .length === 0;

  const telefonoFormatoInvalido =
    tocado.telefono &&
    form.telefono
      .trim()
      .length > 0 &&
    !TELEFONO_REGEX.test(
      form.telefono.trim()
    );

  const telefonoInvalido =
    telefonoVacio ||
    telefonoFormatoInvalido;

  const passwordCorta =
    tocado.password &&
    (
      form.password.length === 0 ||
      form.password.length < 6
    );

  const passwordsNoCoinciden =
    tocado.confirmPassword &&
    (
      form.confirmPassword.length === 0 ||
      form.password !==
        form.confirmPassword
    );

  // ==================================================
  // MODAL TURISMO
  // ==================================================

  const [
    modalTurismoVisible,
    setModalTurismoVisible,
  ] = useState(false);

  const [
    busquedaTurismo,
    setBusquedaTurismo,
  ] = useState("");

  const tiposTurismoFiltrados =
    useMemo(() => {
      if (!busquedaTurismo.trim()) {
        return tiposTurismoDisponibles;
      }

      return tiposTurismoDisponibles.filter(
        (tipo) =>
          tipo
            .toLowerCase()
            .includes(
              busquedaTurismo
                .trim()
                .toLowerCase()
            )
      );
    }, [
      busquedaTurismo,
      tiposTurismoDisponibles,
    ]);

  // ==================================================
  // VOLVER
  // ==================================================

  const handleVolver = () => {
    navigation.goBack();
  };

  // ==================================================
  // MODAL
  // ==================================================

  const handleCerrarModalTurismo =
    () => {
      setModalTurismoVisible(false);
      setBusquedaTurismo("");
    };

  const handleSeleccionarTipoTurismo =
    (tipo) => {
      handleChange(
        "tipoTurismo",
        tipo
      );

      marcarTocado(
        "tipoTurismo"
      );

      handleCerrarModalTurismo();
    };

  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit = () => {
    setTocado({
      nombreCompleto: true,
      email: true,
      cedula: true,
      telefono: true,
      password: true,
      confirmPassword: true,
      tipoTurismo: true,
    });

    if (
      !validarCredenciales([
        "nombreCompleto",
        "telefono",
        "cedula",
        "tipoTurismo",
      ])
    ) {
      return;
    }

    navigation.navigate(
      "SolicitarUbicacion",
      {
        datosRegistro: {
          role:
            ROLES.ACTOR_CULTURAL,

          tipoActor,

          estadoVerificacion:
            ESTADOS_VERIFICACION
              .PENDIENTE,

          nombreCompleto:
            form.nombreCompleto,

          email:
            form.email.trim(),

          password:
            form.password,

          cedula:
            form.cedula,

          telefono:
            form.telefono,

          tipoTurismo:
            form.tipoTurismo,
        },
      }
    );
  };

  // ==================================================
  // GUARD
  // ==================================================

  if (!config) {
    return (
      <View
        style={
          RegistroActorFormStyle
            .contenedor
        }
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <Text
            style={
              RegistroActorFormStyle
                .error
            }
          >
            No se pudo determinar el
            tipo de actor cultural.
            Vuelve a la pantalla
            anterior e inténtalo de
            nuevo.
          </Text>

          <TouchableOpacity
            style={[
              RegistroActorFormStyle
                .boton,
              {
                marginTop: 16,
              },
            ]}
            onPress={handleVolver}
          >
            <Text
              style={
                RegistroActorFormStyle
                  .botonTexto
              }
            >
              Volver
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <View
      style={
        RegistroActorFormStyle
          .contenedor
      }
    >
      {/* ==================================================
          HEADER
          Queda FUERA del KeyboardAvoidingView
          ================================================== */}

      <View
        style={
          RegistroActorFormStyle
            .header
        }
      >
        <ImageBackground
          source={require(
            "../../assets/images/Patron-2.png"
          )}
          style={
            RegistroActorFormStyle
              .headerPatron
          }
          resizeMode="cover"
        >
          <TouchableOpacity
            style={[
              RegistroActorFormStyle
                .botonVolver,
              {
                top:
                  insets.top + 10,
              },
            ]}
            onPress={handleVolver}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color="#2b2b2b"
            />
          </TouchableOpacity>
        </ImageBackground>

        <Svg
          pointerEvents="none"
          style={
            RegistroActorFormStyle
              .curva
          }
          width={SCREEN_WIDTH}
          height={CURVE_HEIGHT}
          viewBox={
            `0 0 ${SCREEN_WIDTH} ${CURVE_HEIGHT}`
          }
        >
          <Path
            fill="#ffffff"
            d={
              curvaPath(
                SCREEN_WIDTH
              )
            }
          />
        </Svg>
      </View>

      {/* ==================================================
          TÍTULO
          También queda fuera
          ================================================== */}

      <Text
        style={
          RegistroActorFormStyle
            .titulo
        }
      >
        {tituloEncabezado}
      </Text>

      {/* ==================================================
          KEYBOARD AVOIDING VIEW
          ================================================== */}

      <KeyboardAvoidingView
        style={[
          RegistroActorFormStyle
            .scroll,
          {
            flex: 1,
          },
        ]}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
        keyboardVerticalOffset={0}
        enabled
      >
        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={
            RegistroActorFormStyle.card
          }
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === "ios"
              ? "interactive"
              : "on-drag"
          }
          showsVerticalScrollIndicator={
            false
          }
          nestedScrollEnabled
        >
          {/* ==================================================
              NOMBRE
              ================================================== */}

          <TextInput
            style={[
              RegistroActorFormStyle
                .input,

              nombreInvalido &&
                RegistroActorFormStyle
                  .inputInvalido,
            ]}
            placeholder="Nombre completo/Negocio"
            placeholderTextColor="#a8a8a8"
            value={
              form.nombreCompleto
            }
            onChangeText={(texto) =>
              handleChange(
                "nombreCompleto",
                texto
              )
            }
            onBlur={() =>
              marcarTocado(
                "nombreCompleto"
              )
            }
          />

          {nombreInvalido ? (
            <Text
              style={
                RegistroActorFormStyle
                  .errorCampo
              }
            >
              El nombre completo/negocio
              es obligatorio.
            </Text>
          ) : null}

          {/* ==================================================
              EMAIL
              ================================================== */}

          <TextInput
            style={[
              RegistroActorFormStyle
                .input,

              emailInvalido &&
                RegistroActorFormStyle
                  .inputInvalido,
            ]}
            placeholder="Correo electrónico"
            placeholderTextColor="#a8a8a8"
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(texto) =>
              handleChange(
                "email",
                texto
              )
            }
            onBlur={() =>
              marcarTocado("email")
            }
          />

          {emailVacio ? (
            <Text
              style={
                RegistroActorFormStyle
                  .errorCampo
              }
            >
              El correo es obligatorio.
            </Text>
          ) : emailFormatoInvalido ? (
            <Text
              style={
                RegistroActorFormStyle
                  .errorCampo
              }
            >
              Escribe un correo
              electrónico válido.
            </Text>
          ) : null}

          {/* ==================================================
              CÉDULA
              ================================================== */}

          <TextInput
            style={[
              RegistroActorFormStyle
                .input,

              cedulaInvalida &&
                RegistroActorFormStyle
                  .inputInvalido,
            ]}
            placeholder="Cédula de identidad"
            placeholderTextColor="#a8a8a8"
            autoCapitalize="characters"
            keyboardType="default"
            maxLength={16}
            value={form.cedula}
            onChangeText={(texto) =>
              handleChange(
                "cedula",
                texto
              )
            }
            onBlur={() =>
              marcarTocado(
                "cedula"
              )
            }
          />

          {cedulaVacia ? (
            <Text
              style={
                RegistroActorFormStyle
                  .errorCampo
              }
            >
              La cédula es obligatoria.
            </Text>
          ) : cedulaFormatoInvalido ? (
            <Text
              style={
                RegistroActorFormStyle
                  .errorCampo
              }
            >
              La cédula debe tener el
              formato 000-000000-0000X.
            </Text>
          ) : null}

          {/* ==================================================
              TELÉFONO
              ================================================== */}

          <TextInput
            style={[
              RegistroActorFormStyle
                .input,

              telefonoInvalido &&
                RegistroActorFormStyle
                  .inputInvalido,
            ]}
            placeholder="Teléfono"
            placeholderTextColor="#a8a8a8"
            keyboardType="phone-pad"
            value={form.telefono}
            onChangeText={(texto) =>
              handleChange(
                "telefono",
                texto
              )
            }
            onBlur={() =>
              marcarTocado(
                "telefono"
              )
            }
          />

          {telefonoVacio ? (
            <Text
              style={
                RegistroActorFormStyle
                  .errorCampo
              }
            >
              El teléfono es obligatorio.
            </Text>
          ) : telefonoFormatoInvalido ? (
            <Text
              style={
                RegistroActorFormStyle
                  .errorCampo
              }
            >
              Escribe un número de
              teléfono válido.
            </Text>
          ) : null}

          {/* ==================================================
              PASSWORD
              ================================================== */}

          <View
            style={
              RegistroActorFormStyle
                .inputWrap
            }
          >
            <TextInput
              style={[
                RegistroActorFormStyle
                  .input,

                RegistroActorFormStyle
                  .inputPassword,

                passwordCorta &&
                  RegistroActorFormStyle
                    .inputInvalido,
              ]}
              placeholder="Contraseña"
              placeholderTextColor="#a8a8a8"
              secureTextEntry={
                !mostrarPassword
              }
              value={form.password}
              onChangeText={(texto) =>
                handleChange(
                  "password",
                  texto
                )
              }
              onBlur={() =>
                marcarTocado(
                  "password"
                )
              }
            />

            <TouchableOpacity
              style={
                RegistroActorFormStyle
                  .iconoOjo
              }
              onPress={() =>
                setMostrarPassword(
                  (value) =>
                    !value
                )
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  mostrarPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={22}
                color="#086338"
              />
            </TouchableOpacity>
          </View>

          {passwordCorta ? (
            <Text
              style={
                RegistroActorFormStyle
                  .errorCampo
              }
            >
              {
                form.password
                  .length === 0
                  ? "La contraseña es obligatoria."
                  : "La contraseña debe tener al menos 6 caracteres."
              }
            </Text>
          ) : null}

          {/* ==================================================
              CONFIRMAR PASSWORD
              ================================================== */}

          <View
            style={
              RegistroActorFormStyle
                .inputWrap
            }
          >
            <TextInput
              style={[
                RegistroActorFormStyle
                  .input,

                RegistroActorFormStyle
                  .inputPassword,

                passwordsNoCoinciden &&
                  RegistroActorFormStyle
                    .inputInvalido,
              ]}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#a8a8a8"
              secureTextEntry={
                !mostrarConfirmPassword
              }
              value={
                form.confirmPassword
              }
              onChangeText={(texto) =>
                handleChange(
                  "confirmPassword",
                  texto
                )
              }
              onBlur={() =>
                marcarTocado(
                  "confirmPassword"
                )
              }
            />

            <TouchableOpacity
              style={
                RegistroActorFormStyle
                  .iconoOjo
              }
              onPress={() =>
                setMostrarConfirmPassword(
                  (value) =>
                    !value
                )
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  mostrarConfirmPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={22}
                color="#086338"
              />
            </TouchableOpacity>
          </View>

          {passwordsNoCoinciden ? (
            <Text
              style={
                RegistroActorFormStyle
                  .errorCampo
              }
            >
              {
                form.confirmPassword
                  .length === 0
                  ? "Confirma tu contraseña."
                  : "Las contraseñas no coinciden."
              }
            </Text>
          ) : null}

          {/* ==================================================
              TURISMO
              ================================================== */}

          <TouchableOpacity
            style={[
              RegistroActorFormStyle
                .dropdownInput,

              tocado.tipoTurismo &&
                !form.tipoTurismo &&
                RegistroActorFormStyle
                  .inputInvalido,
            ]}
            onPress={() =>
              setModalTurismoVisible(
                true
              )
            }
            activeOpacity={0.8}
          >
            <Text
              style={[
                RegistroActorFormStyle
                  .dropdownTexto,

                !form.tipoTurismo &&
                  RegistroActorFormStyle
                    .dropdownPlaceholder,
              ]}
              numberOfLines={1}
            >
              {
                form.tipoTurismo ||
                "Tipo de turismo"
              }
            </Text>

            <Ionicons
              name="chevron-down-outline"
              size={20}
              color="#086338"
            />
          </TouchableOpacity>

          {tocado.tipoTurismo &&
          !form.tipoTurismo ? (
            <Text
              style={
                RegistroActorFormStyle
                  .errorCampo
              }
            >
              Selecciona un tipo de
              turismo.
            </Text>
          ) : null}

          {/* ==================================================
              ERROR
              ================================================== */}

          {error ? (
            <Text
              style={
                RegistroActorFormStyle
                  .error
              }
            >
              {error}
            </Text>
          ) : null}

          {/* ==================================================
              BOTÓN
              ================================================== */}

          <TouchableOpacity
            style={
              RegistroActorFormStyle
                .boton
            }
            onPress={handleSubmit}
          >
            <Text
              style={
                RegistroActorFormStyle
                  .botonTexto
              }
            >
              Registrarse
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ==================================================
          MODAL TURISMO
          ================================================== */}

      <Modal
        visible={
          modalTurismoVisible
        }
        transparent
        animationType="fade"
        onRequestClose={
          handleCerrarModalTurismo
        }
      >
        <KeyboardAvoidingView
          style={
            RegistroActorFormStyle
              .modalFondo
          }
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : "height"
          }
          enabled
        >
          <TouchableOpacity
            style={
              RegistroActorFormStyle
                .modalFondoTouch
            }
            activeOpacity={1}
            onPress={
              handleCerrarModalTurismo
            }
          />

          <View
            style={
              RegistroActorFormStyle
                .modalCaja
            }
          >
            <Text
              style={
                RegistroActorFormStyle
                  .modalTitulo
              }
            >
              Selecciona tu tipo de
              turismo
            </Text>

            <View
              style={
                RegistroActorFormStyle
                  .modalBusquedaWrap
              }
            >
              <Ionicons
                name="search-outline"
                size={18}
                color="#8a8a8a"
                style={
                  RegistroActorFormStyle
                    .modalBusquedaIcono
                }
              />

              <TextInput
                style={
                  RegistroActorFormStyle
                    .modalBusquedaInput
                }
                placeholder="Buscar tipo de turismo..."
                placeholderTextColor="#a8a8a8"
                value={
                  busquedaTurismo
                }
                onChangeText={
                  setBusquedaTurismo
                }
                autoFocus
              />
            </View>

            <FlatList
              data={
                tiposTurismoFiltrados
              }
              keyExtractor={
                (item) => item
              }
              keyboardShouldPersistTaps="handled"
              style={
                RegistroActorFormStyle
                  .modalLista
              }
              ListEmptyComponent={
                <Text
                  style={
                    RegistroActorFormStyle
                      .modalVacioTexto
                  }
                >
                  No se encontraron
                  tipos de turismo.
                </Text>
              }
              renderItem={({ item }) => {
                const activo =
                  form.tipoTurismo ===
                  item;

                return (
                  <TouchableOpacity
                    style={[
                      RegistroActorFormStyle
                        .modalOpcion,

                      activo &&
                        RegistroActorFormStyle
                          .modalOpcionActiva,
                    ]}
                    onPress={() =>
                      handleSeleccionarTipoTurismo(
                        item
                      )
                    }
                  >
                    <Text
                      style={[
                        RegistroActorFormStyle
                          .modalOpcionTexto,

                        activo &&
                          RegistroActorFormStyle
                            .modalOpcionTextoActivo,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default RegistroActorScreen;