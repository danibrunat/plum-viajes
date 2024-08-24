export const sanitizeHtmlString = (string) => {
  return string?.replace(/<[^>]*>/g, "") || "";
};

export const sanitizeUrlFromDoubleSlash = (string) => {
  return string?.replace(/^\/\//, "https://") || "";
};
