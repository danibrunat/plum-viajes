export const Helpers = {
  capitalizeFirstLetter: (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  },
  slugify: (text) => {
    if (!text) return "";
    return text
      .normalize("NFD") // Normalize to decompose characters
      .replace(/[\u0300-\u036f]/g, "") // Remove all decomposed characters
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, "") // Remove non-alphanumeric characters except hyphens
      .replace(/[-]+/g, "-"); // Replace multiple hyphens with a single hyphen
  },
};
