/** URL base del servicio de rutas OSRM (modo driving). */
const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";

/**
 * Calcula una ruta en carro entre dos puntos.
 * @param {{lat: number, lon: number}} origen - Punto de origen.
 * @param {{lat: number, lon: number}} destino - Punto de destino.
 * @returns {Promise<{coordenadas: number[][], duracionMin: number, distanciaKm: string, pasos: Object[]}>}
 */
export async function obtenerRuta(origen, destino) {
  const url = `${OSRM_BASE_URL}/${origen.lon},${origen.lat};${destino.lon},${destino.lat}?overview=full&geometries=geojson&steps=true&annotations=false`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error al pedir ruta a OSRM: ${res.status}`);
  }

  const data = await res.json();

  if (data.code !== "Ok" || !data.routes?.length) {
    throw new Error("OSRM no encontró una ruta entre esos puntos.");
  }

  const ruta = data.routes[0];
  const leg = ruta.legs[0];

  return {
    coordenadas: ruta.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
    duracionMin: Math.round(ruta.duration / 60),
    distanciaKm: (ruta.distance / 1000).toFixed(1),
    pasos: leg.steps.map((paso, index) => ({
      id: `paso-${index}`,
      calle: paso.name || "Sin nombre",
      tipoManiobra: paso.maneuver.type,
      modificador: paso.maneuver.modifier,
      distanciaM: Math.round(paso.distance),
      duracionSeg: Math.round(paso.duration),
      ubicacion: {
        lat: paso.maneuver.location[1],
        lon: paso.maneuver.location[0],
      },
    })),
  };
}

/**
 * Calcula una ruta en carro que pasa por varias paradas en orden.
 * @param {Array<{lat: number, lon: number}>} puntos - Paradas (mínimo 2).
 * @returns {Promise<{coordenadas: number[][], duracionMin: number, distanciaKm: string}>}
 */
export async function obtenerRutaConParadas(puntos) {
  if (!Array.isArray(puntos) || puntos.length < 2) {
    throw new Error("Se necesitan al menos 2 paradas para trazar la ruta.");
  }

  const coordenadas = puntos.map((p) => `${p.lon},${p.lat}`).join(";");
  const url = `${OSRM_BASE_URL}/${coordenadas}?overview=full&geometries=geojson&steps=false&annotations=false`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error al pedir ruta a OSRM: ${res.status}`);
  }

  const data = await res.json();
  if (data.code !== "Ok" || !data.routes?.length) {
    throw new Error("OSRM no encontró una ruta entre esas paradas.");
  }

  const ruta = data.routes[0];
  return {
    coordenadas: ruta.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
    duracionMin: Math.round(ruta.duration / 60),
    distanciaKm: (ruta.distance / 1000).toFixed(1),
  };
}

/**
 * Traduce tipo y modificador de maniobra OSRM a texto en español.
 * @param {string} tipoManiobra - Tipo de maniobra (turn, depart, arrive, etc.).
 * @param {string} modificador - Dirección (left, right, straight, etc.).
 * @returns {string} Descripción legible de la maniobra.
 */
export function describirManiobra(tipoManiobra, modificador) {
  const modificadores = {
    left: "izquierda",
    right: "derecha",
    "slight left": "leve a la izquierda",
    "slight right": "leve a la derecha",
    "sharp left": "cerrada a la izquierda",
    "sharp right": "cerrada a la derecha",
    straight: "de frente",
    uturn: "vuelta en U",
  };

  switch (tipoManiobra) {
    case "depart":
      return "Iniciar recorrido";
    case "arrive":
      return "Has llegado a tu destino";
    case "turn":
    case "end of road":
    case "fork":
      return `Gira a la ${modificadores[modificador] || "frente"}`;
    case "roundabout":
    case "rotary":
      return "Continúa en la rotonda";
    case "merge":
      return "Incorpórate a la vía";
    default:
      return "Continúa por la ruta";
  }
}
