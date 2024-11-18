import { capitalizeFirstLetter, toLowerCase } from "../../helpers/strings";
import { Filters } from "../services/filters.service";

/**
 * Extrae los valores de los filtros de la disponibilidad según la configuración definida.
 *
 * @param {Array} availability - Lista de paquetes de disponibilidad.
 * @param {string} grouper - La ruta dentro del objeto `availability` que define dónde se encuentran los valores.
 * @returns {Array} - Lista de valores únicos extraídos de la disponibilidad.
 */
function extractFilterValues(availability, grouper) {
  const result = new Set(); // Usamos un Set para eliminar duplicados automáticamente
  const paths = grouper.split("."); // Dividimos el 'grouper' para recorrer los niveles anidados

  // Recorremos cada paquete disponible
  availability.forEach((pkg) => {
    let current = pkg;

    // Recorremos los niveles del 'grouper' dentro del paquete
    paths.forEach((path) => {
      if (path.endsWith("[]")) {
        const arrayKey = path.slice(0, -2); // Removemos '[]' para obtener el nombre real de la propiedad
        if (Array.isArray(current[arrayKey])) {
          // Si es un array, agregamos cada valor del array al resultado
          current[arrayKey].forEach((item) => {
            const nextPath = paths[paths.indexOf(path) + 1]; // Obtenemos el siguiente nivel en el path
            if (nextPath) {
              result.add(item[nextPath]); // Si hay otro nivel, agregamos ese valor
            } else {
              result.add(item); // Si no hay más niveles, agregamos el valor actual
            }
          });
        }
      } else {
        // Vamos descendiendo dentro del objeto según los niveles definidos en el 'grouper'
        current = current[path];
      }
    });
  });

  return Array.from(result); // Convertimos el Set a un Array para mantener la consistencia
}

/**
 * Construye dinámicamente los filtros basados en la disponibilidad y la configuración de filtros.
 *
 * @param {Array} availability - Lista de paquetes disponibles.
 * @returns {Array} - Lista de filtros construidos dinámicamente.
 */
function buildFilters(availability) {
  const config = Filters.config; // Obtenemos la configuración de filtros desde el servicio

  // Recorremos cada filtro en la configuración para construirlo dinámicamente
  return config.map((filter) => {
    // Extraemos los valores correspondientes a este filtro desde la disponibilidad
    const values = extractFilterValues(availability, filter.grouper);

    // Devolvemos el objeto filtro con los valores formateados correctamente
    return {
      id: filter.id, // Identificador del filtro
      title: filter.title, // Título del filtro (visible al usuario)
      type: filter.type, // Tipo de filtro (por ejemplo: checkbox, radio, etc.)
      items: values.map((value) => ({
        label: capitalizeFirstLetter(toLowerCase(value)), // El valor mostrado en el checkbox, con capitalización adecuada
        value: toLowerCase(value), // El valor que se enviará al seleccionar este filtro
      })),
    };
  });
}

/**
 * API que recibe la disponibilidad y devuelve los filtros dinámicos basados en la configuración.
 *
 * @param {Request} req - Solicitud HTTP entrante.
 * @returns {Promise<Response>} - Filtros generados dinámicamente basados en la disponibilidad.
 */
export async function POST(req) {
  const { availability } = await req.json(); // Extraemos la disponibilidad desde el cuerpo de la solicitud

  // Construimos los filtros basados en la disponibilidad recibida
  const filters = buildFilters(availability);

  // Devolvemos los filtros generados en formato JSON
  return Response.json(filters);
}
