const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";

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
    // [lon, lat][] -> lo convertimos a [lat, lon] para MapLibre/RN
    coordenadas: ruta.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
    duracionMin: Math.round(ruta.duration / 60),
    distanciaKm: (ruta.distance / 1000).toFixed(1),
    // Cada paso trae: instruction (via maneuver), distance, duration, name (calle)
    pasos: leg.steps.map((paso, index) => ({
      id: `paso-${index}`,
      calle: paso.name || "Sin nombre",
      tipoManiobra: paso.maneuver.type, // 'turn', 'depart', 'arrive', etc.
      modificador: paso.maneuver.modifier, // 'left', 'right', 'straight', etc.
      distanciaM: Math.round(paso.distance),
      duracionSeg: Math.round(paso.duration),
      ubicacion: {
        lat: paso.maneuver.location[1],
        lon: paso.maneuver.location[0],
      },
    })),
  };
}

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
