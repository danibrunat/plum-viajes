/**
 * Formatea el texto de escalas.
 * - null, undefined, "", 0, "0" => "Directo"
 * - >= 1 => "X Escala" o "X Escalas"
 * @param {string|number|null|undefined} stopovers
 * @returns {string}
 */
export function formatStopovers(stopovers) {
  if (
    stopovers === null ||
    stopovers === undefined ||
    stopovers === "" ||
    stopovers === 0 ||
    stopovers === "0"
  ) {
    return "Directo";
  }

  const numStopovers = Number(stopovers);
  if (isNaN(numStopovers) || numStopovers < 1) {
    return "Directo";
  }

  return numStopovers === 1 ? "1 Escala" : `${numStopovers} Escalas`;
}

/**
 * Capitaliza la primera letra de un texto.
 * @param {string} text
 * @returns {string}
 */
export function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const DAYS_OF_WEEK = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

const MONTHS_OF_YEAR = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

/**
 * Formatea una fecha en formato legible en español.
 * @param {string} dateString - Fecha en formato "YYYY-MM-DD HH:mm" o similar
 * @returns {string} - Formato: "Lunes, 01 de enero\n10:30"
 */
export function formatFlightDateTime(dateString) {
  if (!dateString) return "Fecha inválida";

  try {
    // Reemplazar espacio por 'T' para formato ISO válido
    const normalizedDateString = dateString.replace(" ", "T");
    const date = new Date(normalizedDateString);

    if (isNaN(date.getTime())) {
      console.error("Fecha inválida:", dateString);
      return "Fecha inválida";
    }

    const dayOfWeek = DAYS_OF_WEEK[date.getDay()];
    const day = date.getDate().toString().padStart(2, "0");
    const month = MONTHS_OF_YEAR[date.getMonth()];
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${capitalize(dayOfWeek)}, ${day} de ${month}\n${hours}:${minutes}`;
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return "Fecha inválida";
  }
}
