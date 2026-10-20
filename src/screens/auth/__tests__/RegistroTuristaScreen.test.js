import { render, screen, fireEvent } from "@testing-library/react-native";
import RegistroTuristaScreen from "../RegistroTuristaScreen";
jest.mock("../../../services/registro", () => ({ registrarUsuario: jest.fn() }));

const navigation = { navigate: jest.fn(), goBack: jest.fn() };

const campo = (placeholder, texto) =>
  fireEvent.changeText(screen.getByPlaceholderText(placeholder), texto);

const botonRegistrarse = () => screen.getAllByText("Registrarse").at(-1);

// Abre un selector, busca la opción y la elige.
const elegir = (triggerTexto, placeholderBusqueda, opcion) => {
  fireEvent.press(screen.getByText(triggerTexto));
  fireEvent.changeText(screen.getByPlaceholderText(placeholderBusqueda), opcion);
  fireEvent.press(screen.getByText(opcion));
};

const llenarValido = () => {
  campo("Nombre completo", "Ana Pérez");
  campo("Correo electrónico", "ana@correo.com");
  campo("Teléfono", "8888-8888");
  campo("Contraseña", "123456");
  campo("Confirmar contraseña", "123456");
  campo("Edad", "30");
  elegir("Idioma", "Buscar idioma...", "Español");
  elegir("País", "Buscar país...", "Nicaragua");
};

beforeEach(() => {
  jest.clearAllMocks();
  render(<RegistroTuristaScreen navigation={navigation} />);
});

test("enviar vacío muestra todos los errores y no navega", () => {
  fireEvent.press(botonRegistrarse());
  [
    "El nombre completo es obligatorio.",
    "El correo es obligatorio.",
    "El teléfono es obligatorio.",
    "La contraseña es obligatoria.",
    "Confirma tu contraseña.",
    "Escribe una edad válida.",
    "Selecciona tu idioma preferido.",
    "Selecciona tu país de origen.",
  ].forEach((msg) => expect(screen.getByText(msg)).toBeTruthy());
  expect(navigation.navigate).not.toHaveBeenCalled();
});

test("contraseñas distintas no permiten continuar", () => {
  llenarValido();
  campo("Confirmar contraseña", "654321");
  fireEvent.press(botonRegistrarse());
  expect(screen.getAllByText("Las contraseñas no coinciden.").length).toBeGreaterThan(0);
  expect(navigation.navigate).not.toHaveBeenCalled();
});

test("edad fuera de rango no permite continuar", () => {
  llenarValido();
  campo("Edad", "150");
  fireEvent.press(botonRegistrarse());
  expect(screen.getAllByText("Escribe una edad válida.").length).toBeGreaterThan(0);
  expect(navigation.navigate).not.toHaveBeenCalled();
});

test("con datos válidos navega a SeleccionarIntereses con datosRegistro", () => {
  llenarValido();
  fireEvent.press(botonRegistrarse());
  expect(navigation.navigate).toHaveBeenCalledWith(
    "SeleccionarIntereses",
    expect.objectContaining({
      datosRegistro: expect.objectContaining({
        nombreCompleto: "Ana Pérez",
        email: "ana@correo.com",
        paisOrigen: "Nicaragua",
        tipoTurista: "nacional",
        idiomaPreferido: "Español",
      }),
    })
  );
});
