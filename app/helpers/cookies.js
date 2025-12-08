import {
  COOKIE_CATEGORIES,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
} from "../constants/cookieCategories";

/**
 * Get default consent state (only necessary cookies enabled)
 * @returns {Object} Default consent preferences
 */
export const getDefaultConsent = () => ({
  [COOKIE_CATEGORIES.NECESSARY]: true,
  [COOKIE_CATEGORIES.FUNCTIONAL]: false,
  [COOKIE_CATEGORIES.ANALYTICS]: false,
  [COOKIE_CATEGORIES.MARKETING]: false,
});

/**
 * Get consent preferences from localStorage
 * @returns {Object|null} Stored consent preferences or null if not found
 */
export const getStoredConsent = () => {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // Check if consent version matches
    if (parsed.version !== CONSENT_VERSION) {
      return null;
    }

    return parsed.preferences;
  } catch (error) {
    console.error("Error reading cookie consent from localStorage:", error);
    return null;
  }
};

/**
 * Save consent preferences to localStorage
 * @param {Object} preferences - Consent preferences object
 */
export const saveConsent = (preferences) => {
  if (typeof window === "undefined") return;

  try {
    const consentData = {
      version: CONSENT_VERSION,
      preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
  } catch (error) {
    console.error("Error saving cookie consent to localStorage:", error);
  }
};

/**
 * Check if user has given consent for a specific category
 * @param {string} category - Cookie category to check
 * @returns {boolean} Whether consent has been given
 */
export const hasConsentFor = (category) => {
  const consent = getStoredConsent();
  if (!consent) return category === COOKIE_CATEGORIES.NECESSARY;
  return consent[category] === true;
};

/**
 * Check if user has made any consent decision
 * @returns {boolean} Whether consent has been set
 */
export const hasConsentBeenSet = () => {
  return getStoredConsent() !== null;
};

/**
 * Clear all consent data
 */
export const clearConsent = () => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing cookie consent:", error);
  }
};

/**
 * Get all consent preferences with accept all
 * @returns {Object} All categories set to true
 */
export const getAcceptAllConsent = () => ({
  [COOKIE_CATEGORIES.NECESSARY]: true,
  [COOKIE_CATEGORIES.FUNCTIONAL]: true,
  [COOKIE_CATEGORIES.ANALYTICS]: true,
  [COOKIE_CATEGORIES.MARKETING]: true,
});

/**
 * Get consent preferences with only necessary cookies
 * @returns {Object} Only necessary category set to true
 */
export const getRejectAllConsent = () => ({
  [COOKIE_CATEGORIES.NECESSARY]: true,
  [COOKIE_CATEGORIES.FUNCTIONAL]: false,
  [COOKIE_CATEGORIES.ANALYTICS]: false,
  [COOKIE_CATEGORIES.MARKETING]: false,
});
