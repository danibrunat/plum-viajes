import { capitalizeFirstLetter, toLowerCase } from "../../helpers/strings";
import { Filters } from "../services/filters.service";

// Función para extraer los valores dinámicamente usando la configuración
function extractFilterValues(availability, grouper) {
  const result = new Set();
  const paths = grouper.split(".");

  availability.forEach((pkg) => {
    let current = pkg;

    paths.forEach((path) => {
      if (path.endsWith("[]")) {
        const arrayKey = path.slice(0, -2); // Remueve los '[]' para obtener el nombre de la propiedad
        if (Array.isArray(current[arrayKey])) {
          // Si es un array, agregamos cada valor del array al resultado
          current[arrayKey].forEach((item) => {
            const nextPath = paths[paths.indexOf(path) + 1]; // El siguiente nivel en el path
            if (nextPath) {
              result.add(item[nextPath]);
            } else {
              result.add(item); // Si no hay más niveles, agregamos el valor actual
            }
          });
        }
      } else {
        current = current[path]; // Vamos bajando en el objeto
      }
    });
  });

  return Array.from(result); // Convertir Set a Array para eliminar duplicados
}

// Función para construir los filtros dinámicamente
function buildFilters(availability) {
  const config = Filters.config;
  return config.map((filter) => {
    const values = extractFilterValues(availability, filter.grouper);
    return {
      id: filter.id,
      title: filter.title,
      type: filter.type,
      items: values.map((value) => ({
        label: capitalizeFirstLetter(toLowerCase(value)), // El valor mostrado en el checkbox
        value: capitalizeFirstLetter(toLowerCase(value)), // El valor enviado si se selecciona
      })),
    };
  });
}

// API que recibe la disponibilidad y devuelve los filtros dinámicos
export async function POST(req) {
  const { availability } = await req.json();

  // Construir filtros basados en la configuración
  const filters = buildFilters(availability);

  return Response.json(filters);
}
