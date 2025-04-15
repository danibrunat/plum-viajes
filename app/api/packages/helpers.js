import { ProviderService } from "../services/providers";

/**
 * Retorna el id de price para una habitación, basándose en la cantidad de adultos y niños.
 * @param {Object} roomConfig - Objeto con la configuración de la habitación: { adults, children }
 * @returns {string|null} - El id correspondiente en PRICES o null si no hay match.
 */
export const getPriceType = (roomConfig) => {
  const { adults, children } = roomConfig;
  const numChildren = children.length;

  // Casos familiares (con niños)
  if (numChildren > 0) {
    if (adults === 2 && numChildren === 1) {
      return "familyOne";
    }
    if (adults === 2 && numChildren === 2) {
      return "familyTwo";
    }
    // Otros casos con niños no definidos
    return null;
  }

  // Casos sin niños (solo adultos)
  switch (adults) {
    case 1:
      return "single";
    case 2:
      return "double";
    case 3:
      return "triple";
    case 4:
      return "quadruple";
    default:
      // Configuración no contemplada
      return null;
  }
};

/**
 * Retorna el id del price correspondiente a la primera habitación configurada
 * a partir del string occupancy.
 * @param {string} occupancyString - Ejemplo: "2" o "2|12" o "2|5-8,1"
 * @returns {string|null} - El id del price o null si no hay configuración válida.
 */
export const getPriceTypeFromOccupancy = (occupancyString) => {
  // Asumimos que ya tienes implementada la función getRoomsConfig
  const roomsConfig = ProviderService.getRoomsConfig(occupancyString);
  if (!roomsConfig.length) return null;

  // Solo tomamos el primer elemento de la configuración
  return getPriceType(roomsConfig[0]);
};
