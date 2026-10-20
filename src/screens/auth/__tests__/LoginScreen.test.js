import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  getMultiFactorResolver,
} from "firebase/auth";
import LoginScreen from "../LoginScreen";

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  getMultiFactorResolver: jest.fn(),
}));

const navigation = { navigate: jest.fn(), goBack: jest.fn() };

// "Iniciar Sesión" aparece dos veces (título y botón): el botón es el último.
const botonLogin = () => screen.getAllByText("Iniciar Sesión").at(-1);

const escribir = (correo, clave) => {
  if (correo !== undefined)
    fireEvent.changeText(screen.getByPlaceholderText("Nombre de usuario o correo"), correo);
  if (clave !== undefined)
    fireEvent.changeText(screen.getByPlaceholderText("Contraseña"), clave);
};

beforeEach(() => {
  jest.clearAllMocks();
  render(<LoginScreen navigation={navigation} />);
});

describe("validación", () => {
  test("enviar vacío muestra errores y no llama a Firebase", async () => {
    fireEvent.press(botonLogin());
    expect(await screen.findByText("Completa tu correo y contraseña.")).toBeTruthy();
    expect(screen.getByText("El correo es obligatorio.")).toBeTruthy();
    expect(screen.getByText("La contraseña es obligatoria.")).toBeTruthy();
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  });

  test("correo con formato inválido", async () => {
    escribir("no-es-correo", "123456");
    fireEvent.press(botonLogin());
    await waitFor(() =>
      expect(screen.getAllByText("Escribe un correo electrónico válido.").length).toBeGreaterThan(0)
    );
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  });
});

describe("inicio de sesión", () => {
  test("con datos válidos llama a Firebase con el correo recortado", async () => {
    signInWithEmailAndPassword.mockResolvedValue({});
    escribir("  turista@correo.com  ", "123456");
    fireEvent.press(botonLogin());
    await waitFor(() =>
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "turista@correo.com",
        "123456"
      )
    );
  });

  test("credenciales incorrectas muestran el mensaje en español", async () => {
    signInWithEmailAndPassword.mockRejectedValue({ code: "auth/invalid-credential" });
    escribir("turista@correo.com", "mala");
    fireEvent.press(botonLogin());
    expect(await screen.findByText("Correo o contraseña incorrectos.")).toBeTruthy();
  });

  test("con 2FA activo navega a VerificarCodigo con el resolver", async () => {
    const resolver = { hints: [] };
    getMultiFactorResolver.mockReturnValue(resolver);
    signInWithEmailAndPassword.mockRejectedValue({ code: "auth/multi-factor-auth-required" });
    escribir("actor@correo.com", "123456");
    fireEvent.press(botonLogin());
    await waitFor(() =>
      expect(navigation.navigate).toHaveBeenCalledWith("VerificarCodigo", { resolver })
    );
  });
});

describe("recuperar contraseña", () => {
  test("sin correo pide escribirlo", async () => {
    fireEvent.press(screen.getByText("¿Olvidaste tu contraseña?"));
    expect(await screen.findByText("Escribe tu correo para enviarte el enlace.")).toBeTruthy();
    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  test("con correo válido envía el enlace y muestra mensaje neutro", async () => {
    sendPasswordResetEmail.mockResolvedValue();
    escribir("turista@correo.com");
    fireEvent.press(screen.getByText("¿Olvidaste tu contraseña?"));
    expect(
      await screen.findByText(
        "Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña."
      )
    ).toBeTruthy();
  });

  test("si el usuario no existe muestra el mismo mensaje (no revela cuentas)", async () => {
    sendPasswordResetEmail.mockRejectedValue({ code: "auth/user-not-found" });
    escribir("nadie@correo.com");
    fireEvent.press(screen.getByText("¿Olvidaste tu contraseña?"));
    expect(
      await screen.findByText(
        "Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña."
      )
    ).toBeTruthy();
  });
});

test("'Regístrate' navega a SeleccionarTipo", () => {
  fireEvent.press(screen.getByText("Regístrate"));
  expect(navigation.navigate).toHaveBeenCalledWith("SeleccionarTipo");
});
