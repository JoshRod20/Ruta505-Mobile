/**
 * URL base de Nominatim (OpenStreetMap) para búsqueda de lugares.
 * Política: máx. 1 petición/segundo; no autocompletar mientras se escribe.
 */
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

/**
 * Busca lugares, calles y negocios en Nicaragua.
 * @param {string} texto - Texto de búsqueda.
 * @param {Object} [opciones]
 * @param {number} [opciones.limite=6] - Máximo de resultados.
 * @param {AbortSignal} [opciones.signal] - Señal de cancelación.
 * @returns {Promise<Array<{id: string, nombre: string, detalle: string, lat: number, lon: number}>>}
 */
export async function buscarLugares(texto, { limite = 6, signal } = {}) {
  const q = texto.trim();
  if (q.length < 2) return [];

  const params = new URLSearchParams({
    q,
    format: "jsonv2",
    countrycodes: "ni",
    limit: String(limite),
    "accept-language": "es",
  });

  const res = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
    signal,
    headers: { "User-Agent": "Ruta505-Mobile/1.0", Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Error al buscar lugares: ${res.status}`);
  }

  const datos = await res.json();

  return datos
    .map((d) => {
      const partes = String(d.display_name || "").split(",").map((p) => p.trim());
      return {
        id: String(d.place_id),
        nombre: d.name || partes[0] || q,
        detalle: partes.slice(1, 4).join(", "),
        lat: parseFloat(d.lat),
        lon: parseFloat(d.lon),
      };
    })
    .filter((l) => !Number.isNaN(l.lat) && !Number.isNaN(l.lon));
}

/** URL de geocodificación inversa de Nominatim. */
const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";

/**
 * Elimina prefijos administrativos comunes del nombre de lugar.
 * @param {string} texto - Texto a limpiar.
 * @returns {string}
 */
const quitarPrefijo = (texto) =>
  String(texto || "")
    .replace(/^(Departamento|Municipio|Región Autónoma|Región)\s+(de(l)?\s+)?/i, "")
    .trim();

/**
 * Obtiene un nombre corto del lugar a partir de coordenadas (ej. "Catarina, Masaya").
 * Si falla o supera el timeout devuelve null; publicar no debe depender de este dato.
 * @param {number} lat - Latitud.
 * @param {number} lon - Longitud.
 * @param {Object} [opciones]
 * @param {number} [opciones.timeoutMs=5000] - Tiempo máximo de espera.
 * @returns {Promise<string|null>}
 */
export async function obtenerNombreLugar(lat, lon, { timeoutMs = 5000 } = {}) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), timeoutMs);

  try {
    const params = new URLSearchParams({
      format: "jsonv2",
      lat: String(lat),
      lon: String(lon),
      zoom: "14",
      "accept-language": "es",
    });

    const res = await fetch(`${NOMINATIM_REVERSE_URL}?${params.toString()}`, {
      signal: controlador.signal,
      headers: { "User-Agent": "Ruta505-Mobile/1.0", Accept: "application/json" },
    });
    if (!res.ok) return null;

    const { address } = await res.json();
    if (!address) return null;

    const localidad = quitarPrefijo(
      address.village ||
        address.town ||
        address.city ||
        address.suburb ||
        address.municipality ||
        address.county
    );
    const departamento = quitarPrefijo(address.state);

    const partes = [localidad, departamento].filter(Boolean);
    const unicas = partes.filter((p, i) => partes.indexOf(p) === i);
    return unicas.length ? unicas.join(", ") : null;
  } catch {
    return null;
  } finally {
    clearTimeout(temporizador);
  }
}
