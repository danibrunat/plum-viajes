/**
 * Cookie categories for consent management
 * Each category can be individually accepted or rejected by the user
 */

export const COOKIE_CATEGORIES = {
  NECESSARY: "necessary",
  ANALYTICS: "analytics",
  MARKETING: "marketing",
  FUNCTIONAL: "functional",
};

export const COOKIE_CATEGORY_INFO = {
  [COOKIE_CATEGORIES.NECESSARY]: {
    id: COOKIE_CATEGORIES.NECESSARY,
    name: "Necesarias",
    description:
      "Cookies esenciales para el funcionamiento básico del sitio web. No se pueden desactivar.",
    required: true,
  },
  [COOKIE_CATEGORIES.FUNCTIONAL]: {
    id: COOKIE_CATEGORIES.FUNCTIONAL,
    name: "Funcionales",
    description:
      "Cookies que permiten funciones adicionales como formularios de contacto y verificación de seguridad (reCAPTCHA).",
    required: false,
  },
  [COOKIE_CATEGORIES.ANALYTICS]: {
    id: COOKIE_CATEGORIES.ANALYTICS,
    name: "Analíticas",
    description:
      "Cookies que nos ayudan a entender cómo interactúan los visitantes con nuestro sitio web.",
    required: false,
  },
  [COOKIE_CATEGORIES.MARKETING]: {
    id: COOKIE_CATEGORIES.MARKETING,
    name: "Marketing",
    description:
      "Cookies utilizadas para mostrar anuncios relevantes y medir la efectividad de las campañas publicitarias.",
    required: false,
  },
};

export const CONSENT_STORAGE_KEY = "plum_cookie_consent";
export const CONSENT_VERSION = "1.0";
