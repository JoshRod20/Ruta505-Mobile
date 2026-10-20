import { renderHook, act } from "@testing-library/react-native";
import { useRegistroForm } from "../useRegistroForm";
import { registrarUsuario } from "../../services/registro";

jest.mock("../../services/registro", () => ({ registrarUsuario: jest.fn() }));

const VALIDO = {
  email: "turista@correo.com",
  password: "123456",
  confirmPassword: "123456",
  nombreCompleto: "Ana Pérez",
  telefono: "8888-8888",
  edad: "30",
  cedula: "001-123456-0001A",
};

const montar = (valores = {}) =>
  renderHook(() => useRegistroForm({ initialValues: { ...VALIDO, ...valores } }));

const validar = (hook, campos) => {
  let ok;
  act(() => {
    ok = hook.result.current.validarCredenciales(campos);
  });
  return ok;
};

beforeEach(() => jest.clearAllMocks());

describe("validarCredenciales", () => {
  test("datos válidos pasan y limpian el error", () => {
    const h = montar();
    expect(validar(h, ["nombreCompleto", "telefono", "edad", "cedula"])).toBe(true);
    expect(h.result.current.error).toBe("");
  });

  test("correo vacío", () => {
    const h = montar({ email: "  " });
    expect(validar(h)).toBe(false);
    expect(h.result.current.error).toBe("Falta completar el correo electrónico.");
  });

  test("correo inválido", () => {
    const h = montar({ email: "no-es-correo" });
    expect(validar(h)).toBe(false);
    expect(h.result.current.error).toBe("Escribe un correo electrónico válido.");
  });

  test("campo requerido faltante usa su etiqueta", () => {
    const h = montar({ nombreCompleto: "" });
    expect(validar(h, ["nombreCompleto"])).toBe(false);
    expect(h.result.current.error).toBe("Falta completar el nombre completo.");
  });

  test("cédula con formato incorrecto", () => {
    const h = montar({ cedula: "123" });
    expect(validar(h, ["cedula"])).toBe(false);
    expect(h.result.current.error).toBe("La cédula debe tener el formato 000-000000-0000X.");
  });

  test("teléfono inválido", () => {
    const h = montar({ telefono: "12" });
    expect(validar(h, ["telefono"])).toBe(false);
    expect(h.result.current.error).toBe("Escribe un número de teléfono válido.");
  });

  test.each(["0", "-5", "121", "abc"])("edad inválida: %s", (edad) => {
    const h = montar({ edad });
    expect(validar(h, ["edad"])).toBe(false);
    expect(h.result.current.error).toBe("Escribe una edad válida.");
  });

  test("contraseñas distintas", () => {
    const h = montar({ confirmPassword: "654321" });
    expect(validar(h)).toBe(false);
    expect(h.result.current.error).toBe("Las contraseñas no coinciden.");
  });

  test("contraseña corta", () => {
    const h = montar({ password: "123", confirmPassword: "123" });
    expect(validar(h)).toBe(false);
    expect(h.result.current.error).toBe("La contraseña debe tener al menos 6 caracteres.");
  });
});

describe("registrar", () => {
  test("con datos válidos llama a registrarUsuario con email recortado", async () => {
    registrarUsuario.mockResolvedValue();
    const h = montar({ email: " turista@correo.com " });
    await act(async () => {
      await h.result.current.registrar({ rol: "turista" });
    });
    expect(registrarUsuario).toHaveBeenCalledWith("turista@correo.com", "123456", { rol: "turista" });
    expect(h.result.current.cargando).toBe(false);
  });

  test("no llama a Firebase si la validación falla", async () => {
    const h = montar({ email: "" });
    await act(async () => {
      await h.result.current.registrar({});
    });
    expect(registrarUsuario).not.toHaveBeenCalled();
  });

  test("traduce el error de Firebase", async () => {
    registrarUsuario.mockRejectedValue({ code: "auth/email-already-in-use" });
    const h = montar();
    await act(async () => {
      await h.result.current.registrar({});
    });
    expect(h.result.current.error).toBe("Ya existe una cuenta con este correo.");
    expect(h.result.current.cargando).toBe(false);
  });
});
