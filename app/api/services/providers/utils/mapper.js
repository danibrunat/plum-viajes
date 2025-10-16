import { isObject, hasNestedProperty, getByDotOperator } from "./iterators.js";

/**
 * Maps nested object structure according to configuration
 * @param {Object} pkg - Source package data
 * @param {Object} configObj - Mapping configuration
 * @param {string} provider - Provider identifier
 * @returns {Object} - Mapped object
 */
export const mapNestedObject = (pkg, configObj, provider) => {
  let result = {};

  Object.entries(configObj).forEach(([key, value]) => {
    if (value.isArray) {
      let arrayData = [];
      if (value.baseKey && value.baseKey[provider]) {
        const baseKeyValue = value.baseKey[provider].trim();
        if (baseKeyValue === "@self" || baseKeyValue === "continue") {
          arrayData = pkg;
        } else {
          arrayData = getByDotOperator(pkg, baseKeyValue) || [];
        }
      } else {
        arrayData = pkg[key];
      }

      if (arrayData === undefined || arrayData === null) {
        arrayData = [];
      } else if (!Array.isArray(arrayData)) {
        arrayData = [arrayData];
      }

      result[key] = arrayData.map((item) =>
        isObject(item) ? mapNestedObject(item, value.items, provider) : item
      );
      return;
    }

    if (isObject(value) && !value[provider]) {
      result[key] = mapNestedObject(pkg, value, provider);
      return;
    }

    if (!isObject(value) || !value[provider]) {
      return;
    }

    const providerConfigProp = value[provider];
    result[key] = hasNestedProperty(providerConfigProp)
      ? getByDotOperator(pkg, providerConfigProp)
      : pkg[providerConfigProp];
  });

  return result;
};

/**
 * Maps the response data according to the provider's configuration
 * @param {Array} response - The response data to map
 * @param {string} provider - The provider identifier
 * @param {Object} availConfig - Availability configuration
 * @param {Object} detailConfig - Detail configuration
 * @param {string} consumer - The consumer type ("detail" or other)
 * @returns {Array} The mapped response data
 */
export const mapProviderResponse = (
  response,
  provider,
  availConfig,
  detailConfig,
  consumer
) => {
  if (!response || !Array.isArray(response) || response.length === 0)
    return response;

  const respConfig = consumer === "detail" ? detailConfig : availConfig;

  return response.map((pkg) => {
    const mappedPkg = mapNestedObject(pkg, respConfig, provider);
    mappedPkg.provider = provider;
    return mappedPkg;
  });
};
