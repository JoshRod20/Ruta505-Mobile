import { EMAIL_REGEX, CEDULA_REGEX, TELEFONO_REGEX } from "../validators";

describe("EMAIL_REGEX", () => {
  test.each(["a@b.com", "turista.nica@correo.com.ni"])("acepta %s", (v) =>
    expect(EMAIL_REGEX.test(v)).toBe(true)
  );
  test.each(["", "a@b", "a b@c.com", "@b.com", "a@.com"])("rechaza '%s'", (v) =>
    expect(EMAIL_REGEX.test(v)).toBe(false)
  );
});

describe("CEDULA_REGEX", () => {
  test("acepta formato 000-000000-0000X", () => {
    expect(CEDULA_REGEX.test("001-123456-0001A")).toBe(true);
    expect(CEDULA_REGEX.test("001-123456-0001a")).toBe(true);
  });
  test.each(["0011234560001A", "001-123456-0001", "001-12345-0001A", "001-123456-0001AB"])(
    "rechaza '%s'",
    (v) => expect(CEDULA_REGEX.test(v)).toBe(false)
  );
});

describe("TELEFONO_REGEX", () => {
  test.each(["8888-8888", "+505 8888 8888", "88888888"])("acepta %s", (v) =>
    expect(TELEFONO_REGEX.test(v)).toBe(true)
  );
  test.each(["123", "abcdefgh", ""])("rechaza '%s'", (v) =>
    expect(TELEFONO_REGEX.test(v)).toBe(false)
  );
});
