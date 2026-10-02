// Convierte un Timestamp de Firestore (o Date) en un texto relativo
// como "Hace un momento", "Hace 22 horas", "Hace 3 días".
export function formatearTiempoRelativo(valor) {
  if (!valor) return "";

  const fecha = typeof valor.toDate === "function" ? valor.toDate() : valor;
  if (!(fecha instanceof Date) || Number.isNaN(fecha.getTime())) return "";

  const segundos = Math.max(0, Math.floor((Date.now() - fecha.getTime()) / 1000));

  if (segundos < 60) return "Hace un momento";

  const minutos = Math.floor(segundos / 60);
  if (minutos < 60) return `Hace ${minutos} ${minutos === 1 ? "minuto" : "minutos"}`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Hace ${horas} ${horas === 1 ? "hora" : "horas"}`;

  const dias = Math.floor(horas / 24);
  if (dias < 7) return `Hace ${dias} ${dias === 1 ? "día" : "días"}`;

  const semanas = Math.floor(dias / 7);
  if (semanas < 5) return `Hace ${semanas} ${semanas === 1 ? "semana" : "semanas"}`;

  const meses = Math.floor(dias / 30);
  if (meses < 12) return `Hace ${meses} ${meses === 1 ? "mes" : "meses"}`;

  const anios = Math.floor(dias / 365);
  return `Hace ${anios} ${anios === 1 ? "año" : "años"}`;
}
