/**
 * Mapeo de símbolos de moneda personalizados.
 * Define cómo se muestra cada moneda en el formato deseado.
 */
const CURRENCY_SYMBOLS = {
  USD: "USD $",
  ARS: "$",
  EUR: "EUR €",
  BRL: "R$",
};

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
   * const formattedPrice = Formatters.price(1000, 'USD');
   * // Returns: "USD $1.000"
   * const formattedPrice = Formatters.price(1000, 'ARS');
   * // Returns: "$1.000"
   */
  price: (price, currency) => {
    if (price == null) return "Consulte";

    // Formatear el número sin símbolo de moneda
    const formattedNumber = price.toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    // Obtener el símbolo personalizado o usar el código de moneda como fallback
    const symbol = CURRENCY_SYMBOLS[currency] || `${currency} `;

    return `${symbol}${formattedNumber}`;
  },
};

export default Formatters;
