"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getStoredConsent,
  saveConsent,
  getDefaultConsent,
  getAcceptAllConsent,
  getRejectAllConsent,
  hasConsentBeenSet,
} from "../helpers/cookies";
import { COOKIE_CATEGORIES } from "../constants/cookieCategories";

/**
 * Hook for managing cookie consent state
 * @returns {Object} Cookie consent state and methods
 */
const useCookieConsent = () => {
  const [consent, setConsent] = useState(getDefaultConsent());
  const [isConsentSet, setIsConsentSet] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize consent state from localStorage
  useEffect(() => {
    const stored = getStoredConsent();
    const consentSet = hasConsentBeenSet();

    if (stored) {
      setConsent(stored);
    }

    setIsConsentSet(consentSet);
    setShowBanner(!consentSet);
    setIsLoading(false);
  }, []);

  // Accept all cookies
  const acceptAll = useCallback(() => {
    const allAccepted = getAcceptAllConsent();
    setConsent(allAccepted);
    saveConsent(allAccepted);
    setIsConsentSet(true);
    setShowBanner(false);
  }, []);

  // Reject all optional cookies
  const rejectAll = useCallback(() => {
    const allRejected = getRejectAllConsent();
    setConsent(allRejected);
    saveConsent(allRejected);
    setIsConsentSet(true);
    setShowBanner(false);
  }, []);

  // Save custom preferences
  const savePreferences = useCallback((preferences) => {
    // Ensure necessary cookies are always enabled
    const finalPreferences = {
      ...preferences,
      [COOKIE_CATEGORIES.NECESSARY]: true,
    };
    setConsent(finalPreferences);
    saveConsent(finalPreferences);
    setIsConsentSet(true);
    setShowBanner(false);
  }, []);

  // Update a single category
  const updateCategory = useCallback((category, value) => {
    if (category === COOKIE_CATEGORIES.NECESSARY) return; // Can't disable necessary cookies

    setConsent((prev) => ({
      ...prev,
      [category]: value,
    }));
  }, []);

  // Check if a specific category is consented
  const hasConsent = useCallback(
    (category) => {
      return consent[category] === true;
    },
    [consent]
  );

  // Open settings modal
  const openSettings = useCallback(() => {
    setShowBanner(true);
  }, []);

  return {
    consent,
    isConsentSet,
    showBanner,
    isLoading,
    acceptAll,
    rejectAll,
    savePreferences,
    updateCategory,
    hasConsent,
    openSettings,
    setShowBanner,
  };
};

export default useCookieConsent;
