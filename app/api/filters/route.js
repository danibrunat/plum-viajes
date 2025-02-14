import { capitalizeFirstLetter } from "../../helpers/strings";
import { Filters } from "../services/filters.service";

/**
 * Función recursiva para obtener valores a partir de un objeto y una ruta (path)
 * que puede incluir notación dot y arrays mediante "[]".
 *
 * @param {Object|Array} obj - Objeto o array actual.
 * @param {Array<string>} paths - Array de segmentos del camino.
 * @returns {Array} - Array de valores encontrados.
 */
function getValuesAtPath(obj, paths) {
  if (paths.length === 0) {
    return [obj];
  }

  const [currentPath, ...restPaths] = paths;
  let results = [];

  if (typeof obj === "undefined" || obj === null) {
    return results;
  }

  if (currentPath.endsWith("[]")) {
    const key = currentPath.slice(0, -2);
    const arr = obj[key];
    if (!Array.isArray(arr)) {
      return [];
    }
    arr.forEach((item) => {
      results = results.concat(getValuesAtPath(item, restPaths));
    });
  } else {
    const nextObj = obj[currentPath];
    results = results.concat(getValuesAtPath(nextObj, restPaths));
  }

  return results;
}

/**
 * Extrae los valores de un paquete basándose en la ruta (grouper) definida en la configuración del filtro.
 *
 * @param {Array} availability - Lista de paquetes disponibles.
 * @param {string} grouper - Ruta con notación dot y "[]" para arrays.
 * @returns {Array<string>} - Valores únicos extraídos, normalizados a minúsculas.
 */
function extractFilterValues(availability, grouper) {
  const result = new Set();
  const paths = grouper.split(".");

  availability.forEach((pkg) => {
    const values = getValuesAtPath(pkg, paths);
    values.forEach((value) => {
      if (value !== undefined && value !== null) {
        result.add(String(value).toLowerCase());
      }
    });
  });

  return Array.from(result);
}

/**
 * Construye dinámicamente los filtros basados en la disponibilidad y la configuración definida.
 *
 * @param {Array} availability - Lista de paquetes disponibles.
 * @returns {Array} - Lista de filtros construidos dinámicamente.
 */
function buildFilters(availability) {
  const config = Filters.config; // Configuración de filtros desde el servicio
  return config.map((filter) => {
    const values = extractFilterValues(availability, filter.grouper);
    return {
      id: filter.id,
      title: filter.title,
      type: filter.type,
      items: values.map((value) => ({
        label: capitalizeFirstLetter(value),
        value: value,
      })),
    };
  });
}

/**
 * API que recibe la disponibilidad y devuelve los filtros dinámicos basados en ella.
 *
 * @param {Request} req - Solicitud HTTP entrante.
 * @returns {Promise<Response>} - Filtros generados dinámicamente en formato JSON.
 */
export async function POST(req) {
  const { availability } = await req.json();
  const filters = buildFilters(availability);
  return Response.json(filters);
}
