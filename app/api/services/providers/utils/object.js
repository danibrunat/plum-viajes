/**
 * Checks if a value is a non-null object
 * @param {*} value - The value to check
 * @returns {boolean} - True if value is an object
 */
export const isObject = (value) => value !== null && typeof value === "object";

/**
 * Checks if a string contains nested properties (indicated by dots)
 * @param {string} string - The string to check
 * @returns {boolean} - True if the string contains dots
 */
export const hasNestedProperty = (string) => string && string.includes(".");

/**
 * Retrieves a value from an object using a dot-separated string path
 * @param {Object} object - The object to search in
 * @param {string} path - The dot-separated path to the desired property
 * @param {boolean} isArray - Whether to return array or first element
 * @returns {*} - The value at the specified path, or undefined if not found
 */
export const getByDotOperator = (object, path, isArray = false) => {
  if (!object || !path) return null;

  const reduced = path.split(".").reduce((acc, curr) => {
    // Handle array indices like "[0]", "[1]"
    if (/^\[\d+\]$/.test(curr)) {
      const index = parseInt(curr.slice(1, -1), 10);
      return Array.isArray(acc) ? acc[index] : undefined;
    }
    // Handle "[]" notation
    else if (curr === "[]") {
      if (Array.isArray(acc) && isArray) {
        return acc.map((item) => item);
      } else {
        return Array.isArray(acc) ? acc[0] : acc;
      }
    }
    // Handle arrays by mapping over elements
    else if (Array.isArray(acc)) {
      return acc.map((item) => (item ? item[curr] : undefined));
    }
    // Regular property access
    else {
      return acc ? acc[curr] : undefined;
    }
  }, object);

  // If result is an array with a single value, return that value unless isArray is true
  if (Array.isArray(reduced) && reduced.length === 1 && !isArray) {
    return reduced[0];
  }

  return reduced;
};
