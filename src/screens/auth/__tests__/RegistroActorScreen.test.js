import { render, screen, fireEvent } from "@testing-library/react-native";
import RegistroActorScreen from "../RegistroActorScreen";
import { ACTORES_CULTURALES_CONFIG } from "../../../constants/actoresCulturales";
jest.mock("../../../services/registro", () => ({ registrarUsuario: jest.fn() }));

const navigation = { navigate: jest.fn(), goBack: jest.fn() };
// Usa un tipo de actor real del proyecto, sin depender de su nombre.
const tipoActor = Object.keys(ACTORES_CULTURALES_CONFIG)[0];

const botonRegistrarse = () => screen.getAllByText("Registrarse").at(-1);

beforeEach(() => jest.clearAllMocks());

describe("con tipo de actor válido", () => {
  beforeEach(() => {
    render(<RegistroActorScreen navigation={navigation} route={{ params: { tipoActor } }} />);
  });

  test("enviar vacío muestra los errores y no navega", () => {
    fireEvent.press(botonRegistrarse());
    [
      "El nombre completo/negocio es obligatorio.",
      "La descripción del negocio es obligatoria.",
      "La dirección del negocio es obligatoria.",
      "Selecciona un departamento.",
      "El correo es obligatorio.",
      "La cédula es obligatoria.",
      "El teléfono es obligatorio.",
      "La contraseña es obligatoria.",
      "Confirma tu contraseña.",
      "Selecciona un tipo de turismo.",
      "Selecciona tu idioma preferido.",
    ].forEach((msg) => expect(screen.getByText(msg)).toBeTruthy());
    expect(navigation.navigate).not.toHaveBeenCalled();
  });

  test("la cédula con formato incorrecto muestra su mensaje", () => {
    fireEvent.changeText(screen.getByPlaceholderText("Cédula de identidad"), "123");
    fireEvent.press(botonRegistrarse());
    expect(screen.getByText("La cédula debe tener el formato 000-000000-0000X.")).toBeTruthy();
  });

  test("correo inválido y contraseñas distintas", () => {
    fireEvent.changeText(screen.getByPlaceholderText("Correo electrónico"), "xx");
    fireEvent.changeText(screen.getByPlaceholderText("Contraseña"), "123456");
    fireEvent.changeText(screen.getByPlaceholderText("Confirmar contraseña"), "000000");
    fireEvent.press(botonRegistrarse());
    expect(screen.getByText("Escribe un correo electrónico válido.")).toBeTruthy();
    expect(screen.getByText("Las contraseñas no coinciden.")).toBeTruthy();
  });
});

test("sin tipo de actor muestra el aviso y permite volver", () => {
  render(<RegistroActorScreen navigation={navigation} route={{ params: {} }} />);
  expect(
    screen.getByText(/No se pudo determinar el tipo de actor cultural/)
  ).toBeTruthy();
  fireEvent.press(screen.getByText("Volver"));
  expect(navigation.goBack).toHaveBeenCalled();
});
