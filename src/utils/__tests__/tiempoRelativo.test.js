import { formatearTiempoRelativo } from "../tiempoRelativo";

const AHORA = new Date("2026-10-20T12:00:00Z").getTime();
const hace = (ms) => new Date(AHORA - ms);
const MIN = 60 * 1000;
const HORA = 60 * MIN;
const DIA = 24 * HORA;

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(AHORA);
});
afterEach(() => jest.useRealTimers());

test("valores no válidos devuelven cadena vacía", () => {
  expect(formatearTiempoRelativo(null)).toBe("");
  expect(formatearTiempoRelativo(undefined)).toBe("");
  expect(formatearTiempoRelativo(new Date("x"))).toBe("");
  expect(formatearTiempoRelativo("texto")).toBe("");
});

test.each([
  [30 * 1000, "Hace un momento"],
  [1 * MIN, "Hace 1 minuto"],
  [5 * MIN, "Hace 5 minutos"],
  [1 * HORA, "Hace 1 hora"],
  [22 * HORA, "Hace 22 horas"],
  [1 * DIA, "Hace 1 día"],
  [3 * DIA, "Hace 3 días"],
  [7 * DIA, "Hace 1 semana"],
  [14 * DIA, "Hace 2 semanas"],
  [60 * DIA, "Hace 2 meses"],
  [400 * DIA, "Hace 1 año"],
])("hace %i ms → %s", (ms, esperado) => {
  expect(formatearTiempoRelativo(hace(ms))).toBe(esperado);
});

test("acepta un Timestamp de Firestore (objeto con toDate)", () => {
  const ts = { toDate: () => hace(2 * HORA) };
  expect(formatearTiempoRelativo(ts)).toBe("Hace 2 horas");
});

test("una fecha futura no genera números negativos", () => {
  expect(formatearTiempoRelativo(new Date(AHORA + HORA))).toBe("Hace un momento");
});
