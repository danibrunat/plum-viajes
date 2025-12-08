"use client";

import React from "react";
import { CookieConsentProvider } from "../context/CookieConsentContext";
import CookieConsent from "../components/CookieConsent";
import CookieSettingsButton from "../components/CookieConsent/CookieSettingsButton";

/**
 * Client-side providers wrapper
 * Wraps children with all necessary client-side context providers
 */
const ClientProviders = ({ children }) => {
  return (
    <CookieConsentProvider>
      {children}
      <CookieConsent />
      <CookieSettingsButton />
    </CookieConsentProvider>
  );
};

export default ClientProviders;
