export const sanitizeHtmlString = (string) => {
  return string?.replace(/<[^>]*>/g, "") || "";
};

export const sanitizeUrlFromDoubleSlash = (string) => {
  if (!string) return "";
  if (string.startsWith("https://")) return string;
  return string.replace(/^\/\//, "https://");
};

export const toLowerCase = (string) => {
  return string?.toLowerCase() || "";
};

export const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};
