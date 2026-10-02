// Búsqueda de lugares, calles y negocios en Nicaragua con Nominatim (OpenStreetMap).
// Política de uso: máx. 1 petición por segundo, sin autocompletar mientras se
// escribe (por eso la barra solo llama aquí al enviar) y con User-Agent propio.
// Si la app crece, cambia NOMINATIM_URL por un proveedor propio (MapTiler, Photon, etc.)
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

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

const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";

const quitarPrefijo = (texto) =>
  String(texto || "")
    .replace(/^(Departamento|Municipio|Región Autónoma|Región)\s+(de(l)?\s+)?/i, "")
    .trim();

/**
 * Devuelve un nombre corto del lugar para mostrar en las publicaciones,
 * por ejemplo "Catarina, Masaya". Si falla o tarda demasiado devuelve null
 * (publicar nunca debe depender de este dato).
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
