/**
 * Formats a date to DD-MM-YYYY string
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDateToDDMMYYYY(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}
