import {
  useMemo,
  useState,
} from "react";

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

import {
  useRegistroForm,
} from "../../hooks/useRegistroForm";

import {
  ROLES,
} from "../../constants/roles";

import {
  EMAIL_REGEX,
  TELEFONO_REGEX,
} from "../../utils/validators";

import RegistroTuristaScreenStyle
  from "../../styles/auth/RegistroFormStyle";

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

  C${w * 0.20},${CURVE_HEIGHT * 0.98}
   ${w * 0.38},${CURVE_HEIGHT * 0.85}
   ${w * 0.50},${CURVE_HEIGHT * 0.62}

  C${w * 0.62},${CURVE_HEIGHT * 0.40}
   ${w * 0.72},${CURVE_HEIGHT * 0.15}
   ${w * 0.85},${CURVE_HEIGHT * 0.06}

  C${w * 0.90},${CURVE_HEIGHT * 0.02}
   ${w * 0.95},0
   ${w},0

  L${w},${CURVE_HEIGHT}
  L0,${CURVE_HEIGHT}

  Z
`;

// ==================================================
// IDIOMAS
// ==================================================

const IDIOMAS = [
  "Español",
  "English",
  "Français",
  "Português",
  "Deutsch",
  "Italiano",
  "中文",
  "日本語",
  "한국어",
  "Русский",
  "العربية",
  "Otro",
];

// ==================================================
// PAÍSES
// ==================================================

const PAISES = [
  "Nicaragua",
  "Costa Rica",
  "Honduras",
  "El Salvador",
  "Guatemala",
  "Panamá",
  "Belice",
  "México",
  "Estados Unidos",
  "Canadá",
  "Colombia",
  "Venezuela",
  "Ecuador",
  "Perú",
  "Bolivia",
  "Chile",
  "Argentina",
  "Uruguay",
  "Paraguay",
  "Brasil",
  "España",
  "Francia",
  "Alemania",
  "Italia",
  "Portugal",
  "Reino Unido",
  "Países Bajos",
  "Suiza",
  "China",
  "Japón",
  "Corea del Sur",
  "India",
  "Australia",
  "Otro país",
];

// ==================================================
// COMPONENTE
// ==================================================

const RegistroTuristaScreen = ({
  navigation,
}) => {
  const insets =
    useSafeAreaInsets();

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
      telefono: "",
      password: "",
      confirmPassword: "",
      edad: "",
      paisOrigen: "",
      idiomaPreferido: "",
    },
  });

  // ==================================================
  // CAMPOS TOCADOS
  // ==================================================

  const [
    tocado,
    setTocado,
  ] = useState({});

  const marcarTocado = (
    campo
  ) => {
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

  const passwordInvalida =
    tocado.password &&
    (
      form.password.length === 0 ||
      form.password.length < 6
    );

  const confirmPasswordInvalida =
    tocado.confirmPassword &&
    (
      form.confirmPassword.length === 0 ||
      form.password !==
        form.confirmPassword
    );

  const edadInvalida =
    useMemo(() => {
      if (!tocado.edad) {
        return false;
      }

      if (
        !form.edad ||
        !String(
          form.edad
        ).trim()
      ) {
        return true;
      }

      const edadNum =
        Number(form.edad);

      return (
        !Number.isFinite(
          edadNum
        ) ||
        edadNum <= 0 ||
        edadNum > 120
      );
    }, [
      tocado.edad,
      form.edad,
    ]);

  const paisInvalido =
    tocado.paisOrigen &&
    !form.paisOrigen;

  const idiomaInvalido =
    tocado.idiomaPreferido &&
    !form.idiomaPreferido;

  // ==================================================
  // MODALES
  // ==================================================

  const [
    modalIdiomaVisible,
    setModalIdiomaVisible,
  ] = useState(false);

  const [
    modalPaisVisible,
    setModalPaisVisible,
  ] = useState(false);

  const [
    busquedaIdioma,
    setBusquedaIdioma,
  ] = useState("");

  const [
    busquedaPais,
    setBusquedaPais,
  ] = useState("");

  // ==================================================
  // FILTRADO
  // ==================================================

  const idiomasFiltrados =
    useMemo(() => {
      if (
        !busquedaIdioma.trim()
      ) {
        return IDIOMAS;
      }

      return IDIOMAS.filter(
        (idioma) =>
          idioma
            .toLowerCase()
            .includes(
              busquedaIdioma
                .trim()
                .toLowerCase()
            )
      );
    }, [busquedaIdioma]);

  const paisesFiltrados =
    useMemo(() => {
      if (
        !busquedaPais.trim()
      ) {
        return PAISES;
      }

      return PAISES.filter(
        (pais) =>
          pais
            .toLowerCase()
            .includes(
              busquedaPais
                .trim()
                .toLowerCase()
            )
      );
    }, [busquedaPais]);

  // ==================================================
  // VOLVER
  // ==================================================

  const handleVolver = () => {
    navigation.goBack();
  };

  // ==================================================
  // MODAL IDIOMA
  // ==================================================

  const handleCerrarModalIdioma =
    () => {
      setModalIdiomaVisible(false);
      setBusquedaIdioma("");
    };

  // ==================================================
  // MODAL PAÍS
  // ==================================================

  const handleCerrarModalPais =
    () => {
      setModalPaisVisible(false);
      setBusquedaPais("");
    };

  // ==================================================
  // SELECCIONAR IDIOMA
  // ==================================================

  const handleSeleccionarIdioma =
    (idioma) => {
      handleChange(
        "idiomaPreferido",
        idioma
      );

      marcarTocado(
        "idiomaPreferido"
      );

      handleCerrarModalIdioma();
    };

  // ==================================================
  // SELECCIONAR PAÍS
  // ==================================================

  const handleSeleccionarPais =
    (pais) => {
      handleChange(
        "paisOrigen",
        pais
      );

      marcarTocado(
        "paisOrigen"
      );

      handleCerrarModalPais();
    };

  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit = () => {
    setTocado({
      nombreCompleto: true,
      email: true,
      telefono: true,
      password: true,
      confirmPassword: true,
      edad: true,
      paisOrigen: true,
      idiomaPreferido: true,
    });

    if (
      !validarCredenciales([
        "nombreCompleto",
        "telefono",
        "edad",
        "paisOrigen",
        "idiomaPreferido",
      ])
    ) {
      return;
    }

    navigation.navigate(
      "SeleccionarIntereses",
      {
        datosRegistro: {
          role:
            ROLES.TURISTA,

          nombreCompleto:
            form.nombreCompleto,

          email:
            form.email.trim(),

          password:
            form.password,

          telefono:
            form.telefono,

          edad:
            form.edad,

          tipoTurista:
            form.paisOrigen ===
            "Nicaragua"
              ? "nacional"
              : "extranjero",

          paisOrigen:
            form.paisOrigen,

          idiomaPreferido:
            form.idiomaPreferido,
        },
      }
    );
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <View
      style={
        RegistroTuristaScreenStyle
          .contenedor
      }
      testID="registro-turista-screen"
    >
      {/* ==================================================
          HEADER FIJO
          ================================================== */}

      <View
        style={
          RegistroTuristaScreenStyle
            .header
        }
      >
        <ImageBackground
          source={require(
            "../../assets/images/Patron-2.png"
          )}
          style={
            RegistroTuristaScreenStyle
              .headerPatron
          }
          resizeMode="cover"
        >
          <TouchableOpacity
            testID="registro-turista-back-button"
            style={[
              RegistroTuristaScreenStyle
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

        {/* ==================================================
            CURVA
            ================================================== */}

        <Svg
          pointerEvents="none"
          style={
            RegistroTuristaScreenStyle
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
          TÍTULO FIJO

          IMPORTANTE:
          Ahora está FUERA del KeyboardAvoidingView
          y FUERA del ScrollView.
          ================================================== */}

      <Text
        style={
          RegistroTuristaScreenStyle
            .titulo
        }
      >
        DATOS GENERALES
      </Text>

      {/* ==================================================
          KEYBOARD AVOIDING VIEW

          Solo el formulario se adapta al teclado.
          ================================================== */}

      <KeyboardAvoidingView
        style={[
          RegistroTuristaScreenStyle
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
        {/* ==================================================
            SCROLL DEL FORMULARIO
            ================================================== */}

        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={
            RegistroTuristaScreenStyle
              .card
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
            testID="registro-turista-nombre-input"
            style={[
              RegistroTuristaScreenStyle
                .input,

              nombreInvalido &&
                RegistroTuristaScreenStyle
                  .inputInvalido,
            ]}
            placeholder="Nombre completo"
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
                RegistroTuristaScreenStyle
                  .errorCampo
              }
            >
              El nombre completo es
              obligatorio.
            </Text>
          ) : null}

          {/* ==================================================
              EMAIL
              ================================================== */}

          <TextInput
            testID="registro-turista-email-input"
            style={[
              RegistroTuristaScreenStyle
                .input,

              emailInvalido &&
                RegistroTuristaScreenStyle
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
              marcarTocado(
                "email"
              )
            }
          />

          {emailVacio ? (
            <Text
              style={
                RegistroTuristaScreenStyle
                  .errorCampo
              }
            >
              El correo es obligatorio.
            </Text>
          ) : emailFormatoInvalido ? (
            <Text
              style={
                RegistroTuristaScreenStyle
                  .errorCampo
              }
            >
              Escribe un correo
              electrónico válido.
            </Text>
          ) : null}

          {/* ==================================================
              TELÉFONO
              ================================================== */}

          <TextInput
            testID="registro-turista-telefono-input"
            style={[
              RegistroTuristaScreenStyle
                .input,

              telefonoInvalido &&
                RegistroTuristaScreenStyle
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
                RegistroTuristaScreenStyle
                  .errorCampo
              }
            >
              El teléfono es obligatorio.
            </Text>
          ) : telefonoFormatoInvalido ? (
            <Text
              style={
                RegistroTuristaScreenStyle
                  .errorCampo
              }
            >
              Escribe un número de
              teléfono válido.
            </Text>
          ) : null}

          {/* ==================================================
              CONTRASEÑA
              ================================================== */}

          <View
            style={
              RegistroTuristaScreenStyle
                .inputWrap
            }
          >
            <TextInput
              testID="registro-turista-password-input"
              style={[
                RegistroTuristaScreenStyle
                  .input,

                RegistroTuristaScreenStyle
                  .inputPassword,

                passwordInvalida &&
                  RegistroTuristaScreenStyle
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
              testID="registro-turista-toggle-password-button"
              style={
                RegistroTuristaScreenStyle
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

          {passwordInvalida ? (
            <Text
              style={
                RegistroTuristaScreenStyle
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
              CONFIRMAR CONTRASEÑA
              ================================================== */}

          <View
            style={
              RegistroTuristaScreenStyle
                .inputWrap
            }
          >
            <TextInput
              testID="registro-turista-confirm-password-input"
              style={[
                RegistroTuristaScreenStyle
                  .input,

                RegistroTuristaScreenStyle
                  .inputPassword,

                confirmPasswordInvalida &&
                  RegistroTuristaScreenStyle
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
              testID="registro-turista-toggle-confirm-password-button"
              style={
                RegistroTuristaScreenStyle
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

          {confirmPasswordInvalida ? (
            <Text
              style={
                RegistroTuristaScreenStyle
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
              EDAD
              ================================================== */}

          <TextInput
            testID="registro-turista-edad-input"
            style={[
              RegistroTuristaScreenStyle
                .input,

              edadInvalida &&
                RegistroTuristaScreenStyle
                  .inputInvalido,
            ]}
            placeholder="Edad"
            placeholderTextColor="#a8a8a8"
            keyboardType="number-pad"
            value={form.edad}
            onChangeText={(texto) =>
              handleChange(
                "edad",
                texto
              )
            }
            onBlur={() =>
              marcarTocado(
                "edad"
              )
            }
          />

          {edadInvalida ? (
            <Text
              style={
                RegistroTuristaScreenStyle
                  .errorCampo
              }
            >
              Escribe una edad válida.
            </Text>
          ) : null}

          {/* ==================================================
              SELECTORES
              ================================================== */}

          <View
            style={
              RegistroTuristaScreenStyle
                .selectoresFila
            }
          >
            {/* IDIOMA */}

            <TouchableOpacity
              testID="registro-turista-idioma-selector"
              style={[
                RegistroTuristaScreenStyle
                  .selectorBoton,

                idiomaInvalido &&
                  RegistroTuristaScreenStyle
                    .inputInvalido,
              ]}
              onPress={() =>
                setModalIdiomaVisible(
                  true
                )
              }
              activeOpacity={0.8}
            >
              <Text
                style={
                  RegistroTuristaScreenStyle
                    .selectorTexto
                }
                numberOfLines={1}
              >
                {
                  form.idiomaPreferido ||
                  "Idioma"
                }
              </Text>
            </TouchableOpacity>

            {/* PAÍS */}

            <TouchableOpacity
              testID="registro-turista-pais-selector"
              style={[
                RegistroTuristaScreenStyle
                  .selectorBoton,

                paisInvalido &&
                  RegistroTuristaScreenStyle
                    .inputInvalido,
              ]}
              onPress={() =>
                setModalPaisVisible(
                  true
                )
              }
              activeOpacity={0.8}
            >
              <Text
                style={
                  RegistroTuristaScreenStyle
                    .selectorTexto
                }
                numberOfLines={1}
              >
                {
                  form.paisOrigen ||
                  "País"
                }
              </Text>
            </TouchableOpacity>
          </View>

          {/* ==================================================
              ERRORES SELECTORES
              ================================================== */}

          {idiomaInvalido ? (
            <Text
              style={
                RegistroTuristaScreenStyle
                  .errorCampo
              }
            >
              Selecciona tu idioma
              preferido.
            </Text>
          ) : null}

          {paisInvalido ? (
            <Text
              style={
                RegistroTuristaScreenStyle
                  .errorCampo
              }
            >
              Selecciona tu país de
              origen.
            </Text>
          ) : null}

          {/* ==================================================
              ERROR GENERAL
              ================================================== */}

          {error ? (
            <Text
              testID="registro-turista-error-text"
              style={
                RegistroTuristaScreenStyle
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
            testID="registro-turista-submit-button"
            style={
              RegistroTuristaScreenStyle
                .boton
            }
            onPress={handleSubmit}
          >
            <Text
              style={
                RegistroTuristaScreenStyle
                  .botonTexto
              }
            >
              Registrarse
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ==================================================
          MODAL IDIOMA
          ================================================== */}

      <Modal
        visible={
          modalIdiomaVisible
        }
        transparent
        animationType="fade"
        onRequestClose={
          handleCerrarModalIdioma
        }
      >
        <KeyboardAvoidingView
          style={
            RegistroTuristaScreenStyle
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
            testID="registro-turista-modal-idioma-backdrop"
            style={
              RegistroTuristaScreenStyle
                .modalFondoTouch
            }
            activeOpacity={1}
            onPress={
              handleCerrarModalIdioma
            }
          />

          <View
            style={
              RegistroTuristaScreenStyle
                .modalCaja
            }
            testID="registro-turista-modal-idioma"
          >
            <Text
              style={
                RegistroTuristaScreenStyle
                  .modalTitulo
              }
            >
              Selecciona tu idioma
            </Text>

            <View
              style={
                RegistroTuristaScreenStyle
                  .modalBusquedaWrap
              }
            >
              <Ionicons
                name="search-outline"
                size={18}
                color="#8a8a8a"
                style={
                  RegistroTuristaScreenStyle
                    .modalBusquedaIcono
                }
              />

              <TextInput
                testID="registro-turista-modal-idioma-search"
                style={
                  RegistroTuristaScreenStyle
                    .modalBusquedaInput
                }
                placeholder="Buscar idioma..."
                placeholderTextColor="#a8a8a8"
                value={
                  busquedaIdioma
                }
                onChangeText={
                  setBusquedaIdioma
                }
                autoFocus
              />
            </View>

            <FlatList
              data={
                idiomasFiltrados
              }
              keyExtractor={
                (item) => item
              }
              keyboardShouldPersistTaps="handled"
              style={
                RegistroTuristaScreenStyle
                  .modalLista
              }
              ListEmptyComponent={
                <Text
                  style={
                    RegistroTuristaScreenStyle
                      .modalVacioTexto
                  }
                >
                  No se encontraron
                  idiomas.
                </Text>
              }
              renderItem={({ item }) => {
                const activo =
                  form.idiomaPreferido ===
                  item;

                return (
                  <TouchableOpacity
                    testID={`registro-turista-idioma-item-${item}`}
                    style={[
                      RegistroTuristaScreenStyle
                        .modalOpcion,

                      activo &&
                        RegistroTuristaScreenStyle
                          .modalOpcionActiva,
                    ]}
                    onPress={() =>
                      handleSeleccionarIdioma(
                        item
                      )
                    }
                  >
                    <Text
                      style={[
                        RegistroTuristaScreenStyle
                          .modalOpcionTexto,

                        activo &&
                          RegistroTuristaScreenStyle
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

      {/* ==================================================
          MODAL PAÍS
          ================================================== */}

      <Modal
        visible={
          modalPaisVisible
        }
        transparent
        animationType="fade"
        onRequestClose={
          handleCerrarModalPais
        }
      >
        <KeyboardAvoidingView
          style={
            RegistroTuristaScreenStyle
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
            testID="registro-turista-modal-pais-backdrop"
            style={
              RegistroTuristaScreenStyle
                .modalFondoTouch
            }
            activeOpacity={1}
            onPress={
              handleCerrarModalPais
            }
          />

          <View
            style={
              RegistroTuristaScreenStyle
                .modalCaja
            }
            testID="registro-turista-modal-pais"
          >
            <Text
              style={
                RegistroTuristaScreenStyle
                  .modalTitulo
              }
            >
              Selecciona tu país
            </Text>

            <View
              style={
                RegistroTuristaScreenStyle
                  .modalBusquedaWrap
              }
            >
              <Ionicons
                name="search-outline"
                size={18}
                color="#8a8a8a"
                style={
                  RegistroTuristaScreenStyle
                    .modalBusquedaIcono
                }
              />

              <TextInput
                testID="registro-turista-modal-pais-search"
                style={
                  RegistroTuristaScreenStyle
                    .modalBusquedaInput
                }
                placeholder="Buscar país..."
                placeholderTextColor="#a8a8a8"
                value={
                  busquedaPais
                }
                onChangeText={
                  setBusquedaPais
                }
                autoFocus
              />
            </View>

            <FlatList
              data={
                paisesFiltrados
              }
              keyExtractor={
                (item) => item
              }
              keyboardShouldPersistTaps="handled"
              style={
                RegistroTuristaScreenStyle
                  .modalLista
              }
              ListEmptyComponent={
                <Text
                  style={
                    RegistroTuristaScreenStyle
                      .modalVacioTexto
                  }
                >
                  No se encontraron
                  países.
                </Text>
              }
              renderItem={({ item }) => {
                const activo =
                  form.paisOrigen ===
                  item;

                return (
                  <TouchableOpacity
                    testID={`registro-turista-pais-item-${item}`}
                    style={[
                      RegistroTuristaScreenStyle
                        .modalOpcion,

                      activo &&
                        RegistroTuristaScreenStyle
                          .modalOpcionActiva,
                    ]}
                    onPress={() =>
                      handleSeleccionarPais(
                        item
                      )
                    }
                  >
                    <Text
                      style={[
                        RegistroTuristaScreenStyle
                          .modalOpcionTexto,

                        activo &&
                          RegistroTuristaScreenStyle
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

export default RegistroTuristaScreen;