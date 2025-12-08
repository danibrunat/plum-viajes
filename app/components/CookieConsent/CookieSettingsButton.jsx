"use client";

import React from "react";
import { FaCookieBite } from "react-icons/fa";
import { useCookieConsentContext } from "../../context/CookieConsentContext";

/**
 * Floating button to open cookie settings
 * Can be placed anywhere in the app to allow users to update their preferences
 */
const CookieSettingsButton = () => {
  const { openSettings, isConsentSet } = useCookieConsentContext();

  // Only show after consent has been set
  if (!isConsentSet) return null;

  return (
    <button
      onClick={openSettings}
      className="fixed bottom-4 left-4 z-[9997] p-3 bg-plumPrimaryPurple text-white rounded-full shadow-lg hover:bg-plumSecondaryPurple transition-all hover:scale-110"
      aria-label="Configurar cookies"
      title="Configurar cookies"
    >
      <FaCookieBite className="text-xl" />
    </button>
  );
};

export default CookieSettingsButton;
