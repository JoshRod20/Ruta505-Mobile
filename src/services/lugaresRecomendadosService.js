/**
 * lugaresRecomendadosService: lugares de interés turístico cercanos que NO
 * están registrados en Ruta505, tomados de OpenStreetMap (Overpass API).
 *
 * Son un complemento al carrusel del mapa del turista: no tienen fotos ni
 * calificación (solo nombre, tipo y coordenadas), así que se muestran más
 * discretos que los negocios registrados por actores culturales.
 */

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const TIMEOUT_MS = 12000;
const RADIO_METROS = 25000;
const MAX_LUGARES = 40;

// Caché en memoria: evita repetir la consulta mientras la app está abierta.
const cache = new Map();

/** Etiqueta OSM -> categoría del catálogo de la app + texto legible. */
const TIPOS = [
  { clave: "tourism", valor: "viewpoint", categoria: "naturaleza", etiqueta: "Mirador" },
  { clave: "natural", valor: "volcano", categoria: "naturaleza", etiqueta: "Volcán" },
  { clave: "natural", valor: "beach", categoria: "naturaleza", etiqueta: "Playa" },
  { clave: "natural", valor: "hot_spring", categoria: "naturaleza", etiqueta: "Aguas termales" },
  { clave: "leisure", valor: "nature_reserve", categoria: "naturaleza", etiqueta: "Reserva natural" },
  { clave: "boundary", valor: "national_park", categoria: "naturaleza", etiqueta: "Parque nacional" },
  { clave: "tourism", valor: "museum", categoria: "cultura", etiqueta: "Museo" },
  { clave: "tourism", valor: "gallery", categoria: "cultura", etiqueta: "Galería" },
  { clave: "tourism", valor: "attraction", categoria: "cultura", etiqueta: "Atracción turística" },
  { clave: "historic", valor: "monument", categoria: "cultura", etiqueta: "Monumento" },
  { clave: "historic", valor: "ruins", categoria: "cultura", etiqueta: "Ruinas" },
  { clave: "historic", valor: "castle", categoria: "cultura", etiqueta: "Fortaleza" },
  { clave: "amenity", valor: "place_of_worship", categoria: "cultura", etiqueta: "Iglesia" },
  { clave: "tourism", valor: "zoo", categoria: "aventura", etiqueta: "Zoológico" },
  { clave: "tourism", valor: "theme_park", categoria: "aventura", etiqueta: "Parque temático" },
];

function clasificar(tags = {}) {
  return TIPOS.find((t) => tags[t.clave] === t.valor) ?? null;
}

/** Distancia en km entre dos coordenadas (fórmula de Haversine). */
export function distanciaKm(a, b) {
  const R = 6371;
  const rad = (g) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Busca lugares de interés alrededor de un punto.
 * Devuelve objetos con la misma forma que los negocios del mapa
 * (id, titulo, categoria, lat, lng, descripcion) más `externo: true`.
 * Si falla o se agota el tiempo devuelve [] (el mapa sigue con los registrados).
 *
 * @param {{lat:number, lon:number}} centro
 * @param {Object} [opciones]
 * @param {number} [opciones.radio] - Radio en metros.
 * @returns {Promise<Array>}
 */
export async function buscarLugaresDeInteres(centro, { radio = RADIO_METROS } = {}) {
  if (!centro) return [];

  // Se redondea a ~1 km para reutilizar la caché si el usuario se mueve poco.
  const llave = `${centro.lat.toFixed(2)},${centro.lon.toFixed(2)},${radio}`;
  if (cache.has(llave)) return cache.get(llave);

  const filtros = TIPOS.map(
    (t) => `nwr["${t.clave}"="${t.valor}"]["name"](around:${radio},${centro.lat},${centro.lon});`
  ).join("");
  const consulta = `[out:json][timeout:20];(${filtros});out center ${MAX_LUGARES * 3};`;

  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      signal: controlador.signal,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Ruta505-Mobile/1.0",
      },
      body: `data=${encodeURIComponent(consulta)}`,
    });
    if (!res.ok) return [];

    const { elements = [] } = await res.json();
    const vistos = new Set();

    const lugares = elements
      .map((el) => {
        const tipo = clasificar(el.tags);
        const lat = el.lat ?? el.center?.lat;
        const lng = el.lon ?? el.center?.lon;
        if (!tipo || typeof lat !== "number" || typeof lng !== "number") return null;

        const nombre = el.tags.name;
        const llaveNombre = nombre.toLowerCase();
        if (vistos.has(llaveNombre)) return null; // OSM repite lugares (nodo + área)
        vistos.add(llaveNombre);

        const lugar = [el.tags["addr:city"], el.tags["addr:state"]]
          .filter(Boolean)
          .join(", ");

        return {
          id: `osm-${el.type}-${el.id}`,
          externo: true,
          titulo: nombre,
          categoria: tipo.categoria,
          etiquetaTipo: tipo.etiqueta,
          lat,
          lng,
          lugar,
          descripcion: el.tags.description ?? "",
          ubicacionExacta: "",
          imagenes: [],
        };
      })
      .filter(Boolean)
      .sort((a, b) => distanciaKm(centro, { lat: a.lat, lon: a.lng }) - distanciaKm(centro, { lat: b.lat, lon: b.lng }))
      .slice(0, MAX_LUGARES);

    cache.set(llave, lugares);
    return lugares;
  } catch (error) {
    console.warn("No se pudieron cargar lugares de interés:", error?.message);
    return [];
  } finally {
    clearTimeout(temporizador);
  }
}
