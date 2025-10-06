import { MONTHS } from "./providers/utils/constants.js";

/**
 * Generates departure date options for the current month and year
 * @param {string} [startDate] - Optional start date in 'YYYY-MM-DD' format
 * @returns {Array<Object>|Object} Array of departure date options or single option
 */
export const departureDateMonthYear = (startDate) => {
  const currentDate = startDate ? new Date(startDate) : new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = startDate
    ? parseInt(startDate.split("-")[1]) - 1
    : currentDate.getMonth();

  // Si se proporciona startDate, devolver solo el mes correspondiente
  if (startDate) {
    const monthNumber = currentMonth + 1;
    const monthString = monthNumber.toString().padStart(2, "0");
    const value = `${monthString}-${currentYear}`;

    return {
      id: monthNumber,
      value: value,
      label: `${MONTHS[currentMonth]}, ${currentYear}`,
    };
  }

  const options = [];

  // Agregar meses del año actual
  const currentYearOptions = MONTHS.map((month, index) => {
    const monthNumber = index + 1;
    const monthString = monthNumber.toString().padStart(2, "0");
    const value = `${monthString}-${currentYear}`;

    return {
      id: monthNumber,
      value,
      label: `${month}, ${currentYear}`,
    };
  }).filter((_, index) => index >= currentMonth);

  if (currentYearOptions.length > 0) {
    options.push({
      label: `Este año ${currentYear}`,
      options: currentYearOptions,
    });
  }

  // Agregar meses del próximo año
  const nextYearOptions = MONTHS.map((month, index) => {
    const monthNumber = index + 1;
    const monthString = monthNumber.toString().padStart(2, "0");
    const value = `${monthString}-${currentYear + 1}`;

    return {
      id: monthNumber + 12,
      value,
      label: `${month}, ${currentYear + 1}`,
    };
  });

  if (nextYearOptions.length > 0) {
    options.push({
      label: `Próximo año ${currentYear + 1}`,
      options: nextYearOptions,
    });
  }

  return options;
};

/**
 * Generates start and end dates for a given month and year
 * @param {string} monthYear - Month and year in 'MM-YYYY' format
 * @returns {Object|null} Object with startDate and endDate, or null if invalid input
 */
export const departureDateFromTo = (monthYear) => {
  if (!monthYear) return null;

  const [month, year] = monthYear.split("-");
  const today = new Date();
  const currentMonthLastDay = new Date(year, month, 0).getDate();

  // Verificar si el mes y año proporcionados coinciden con el mes y año actual
  const isCurrentMonth =
    today.getMonth() + 1 === parseInt(month) &&
    today.getFullYear() === parseInt(year);
  const startDay = isCurrentMonth ? today.getDate() : 1;

  return {
    startDate: `${year}-${month}-${String(startDay).padStart(2, "0")}`,
    endDate: `${year}-${month}-${currentMonthLastDay}`,
  };
};
