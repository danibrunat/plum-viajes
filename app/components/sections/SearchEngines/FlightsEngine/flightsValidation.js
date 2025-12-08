import { z } from "zod";

/**
 * Schema para validar un tramo de vuelo (multi-city)
 */
const legSchema = z.object({
  origin: z.string().min(3, "Seleccioná un origen"),
  destination: z.string().min(3, "Seleccioná un destino"),
  date: z.date({ required_error: "Seleccioná una fecha" }),
});

/**
 * Schema para validar pasajeros
 */
const passengersSchema = z.object({
  adults: z.number().min(1, "Debe haber al menos 1 adulto").max(9, "Máximo 9 adultos"),
  children: z.number().min(0).max(9, "Máximo 9 niños"),
  babies: z.number().min(0).max(9, "Máximo 9 bebés"),
}).refine(
  (data) => data.babies <= data.adults,
  { message: "No puede haber más bebés que adultos", path: ["babies"] }
);

/**
 * Schema para vuelo de ida (one way)
 */
export const oneWayFlightSchema = z.object({
  tripType: z.literal("oneWay"),
  origin: z.string().min(3, "Seleccioná un aeropuerto de origen"),
  destination: z.string().min(3, "Seleccioná un aeropuerto de destino"),
  startDate: z.date({ required_error: "Seleccioná la fecha de ida" }),
  passengers: passengersSchema,
  flexible: z.boolean(),
  business: z.boolean(),
  priceInUsd: z.boolean(),
});

/**
 * Schema para vuelo de ida y vuelta (round trip)
 */
export const roundTripFlightSchema = z.object({
  tripType: z.literal("roundTrip"),
  origin: z.string().min(3, "Seleccioná un aeropuerto de origen"),
  destination: z.string().min(3, "Seleccioná un aeropuerto de destino"),
  startDate: z.date({ required_error: "Seleccioná la fecha de ida" }),
  endDate: z.date({ required_error: "Seleccioná la fecha de vuelta" }),
  passengers: passengersSchema,
  flexible: z.boolean(),
  business: z.boolean(),
  priceInUsd: z.boolean(),
}).refine(
  (data) => data.endDate >= data.startDate,
  { message: "La fecha de vuelta debe ser posterior a la de ida", path: ["endDate"] }
);

/**
 * Schema para múltiples destinos (multi-city)
 */
export const multiFlightSchema = z.object({
  tripType: z.literal("multi"),
  legs: z.array(legSchema).min(2, "Debe haber al menos 2 tramos"),
  passengers: passengersSchema,
  flexible: z.boolean(),
  business: z.boolean(),
  priceInUsd: z.boolean(),
});

/**
 * Obtiene el schema correcto según el tipo de viaje
 * @param {string} tripType 
 * @returns {z.ZodSchema}
 */
function getSchemaByTripType(tripType) {
  switch (tripType) {
    case "oneWay":
      return oneWayFlightSchema;
    case "roundTrip":
      return roundTripFlightSchema;
    case "multi":
      return multiFlightSchema;
    default:
      return z.object({ tripType: z.enum(["oneWay", "roundTrip", "multi"]) });
  }
}

/**
 * Valida los datos del formulario de búsqueda de vuelos
 * @param {Object} data - Datos del formulario
 * @returns {{ success: boolean, data?: Object, errors?: Record<string, string> }}
 */
export function validateFlightSearch(data) {
  const schema = getSchemaByTripType(data?.tripType);
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Convertir errores de Zod a un objeto más simple
  const errors = {};
  result.error.errors.forEach((err) => {
    const path = err.path.join(".");
    errors[path] = err.message;
  });

  return { success: false, errors };
}

/**
 * Obtiene el primer error del objeto de errores
 * @param {Record<string, string>} errors 
 * @returns {string | null}
 */
export function getFirstError(errors) {
  if (!errors) return null;
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : null;
}
