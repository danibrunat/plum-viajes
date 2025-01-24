/**
 * Formatters object containing various formatting functions.
 */
const Formatters = {
  /**
   * Formats a given price into a localized currency string.
   *
   * @param {number} price - The price value to be formatted.
   * @param {string} currency - The currency code (e.g., 'EUR', 'USD') to format the price with.
   * @returns {string} The formatted price string with the specified currency, without fraction digits.
   *
   * @example
   * const formattedPrice = Formatters.price(1000, 'EUR');
   * // Returns: "€1,000"
   */
  price: (price, currency) => {
    return (
      price?.toLocaleString("es-AR", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }) ?? "Consulte"
    );
  },
};

export default Formatters;
