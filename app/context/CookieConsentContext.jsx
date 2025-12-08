"use client";

import React, { createContext, useContext } from "react";
import useCookieConsent from "../hooks/useCookieConsent";

const CookieConsentContext = createContext(null);

/**
 * Provider component for cookie consent state
 * Wrap your app with this provider to access consent state from any component
 */
export const CookieConsentProvider = ({ children }) => {
  const cookieConsent = useCookieConsent();

  return (
    <CookieConsentContext.Provider value={cookieConsent}>
      {children}
    </CookieConsentContext.Provider>
  );
};

/**
 * Hook to access cookie consent context
 * @returns {Object} Cookie consent state and methods
 */
export const useCookieConsentContext = () => {
  const context = useContext(CookieConsentContext);

  if (!context) {
    throw new Error(
      "useCookieConsentContext must be used within a CookieConsentProvider"
    );
  }

  return context;
};

export default CookieConsentContext;
