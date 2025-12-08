"use client";

import React, { useState } from "react";
import { FaCookieBite, FaCog, FaCheck, FaTimes } from "react-icons/fa";
import { useCookieConsentContext } from "../../context/CookieConsentContext";
import {
  COOKIE_CATEGORIES,
  COOKIE_CATEGORY_INFO,
} from "../../constants/cookieCategories";

const CookieConsent = () => {
  const {
    consent,
    showBanner,
    isLoading,
    acceptAll,
    rejectAll,
    savePreferences,
    updateCategory,
    setShowBanner,
  } = useCookieConsentContext();

  const [showSettings, setShowSettings] = useState(false);
  const [localConsent, setLocalConsent] = useState(consent);

  // Don't render anything while loading or if banner shouldn't be shown
  if (isLoading || !showBanner) return null;

  const handleToggleCategory = (category) => {
    if (category === COOKIE_CATEGORIES.NECESSARY) return;

    setLocalConsent((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSavePreferences = () => {
    savePreferences(localConsent);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    acceptAll();
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    rejectAll();
    setShowSettings(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={() => setShowBanner(false)}
      />

      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white shadow-2xl border-t border-gray-200 animate-slide-up">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {!showSettings ? (
            // Simple Banner View
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <FaCookieBite className="text-plumPrimaryPurple text-3xl flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Utilizamos cookies
                  </h3>
                  <p className="text-sm text-gray-600">
                    Usamos cookies para mejorar tu experiencia de navegación,
                    personalizar contenido y analizar nuestro tráfico. Al hacer
                    clic en &quot;Aceptar todas&quot;, aceptás el uso de todas
                    las cookies. Podés personalizar tus preferencias haciendo
                    clic en &quot;Configurar&quot;.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <FaCog />
                  Configurar
                </button>
                <button
                  onClick={handleRejectAll}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FaTimes />
                  Rechazar
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-plumPrimaryPurple hover:bg-plumSecondaryPurple rounded-lg transition-colors"
                >
                  <FaCheck />
                  Aceptar todas
                </button>
              </div>
            </div>
          ) : (
            // Settings View
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaCookieBite className="text-plumPrimaryPurple text-2xl" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Preferencias de cookies
                  </h3>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Cerrar configuración"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <p className="text-sm text-gray-600">
                Elegí qué cookies querés aceptar. Las cookies necesarias no se
                pueden desactivar ya que son esenciales para el funcionamiento
                del sitio.
              </p>

              <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                {Object.values(COOKIE_CATEGORY_INFO).map((category) => (
                  <div
                    key={category.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {category.name}
                        </span>
                        {category.required && (
                          <span className="text-xs bg-plumPrimaryPurple text-white px-2 py-0.5 rounded">
                            Requerida
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {category.description}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localConsent[category.id]}
                        onChange={() => handleToggleCategory(category.id)}
                        disabled={category.required}
                        className="sr-only peer"
                      />
                      <div
                        className={`w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-plumPrimaryPurple/50 rounded-full peer 
                        ${category.required ? "opacity-50 cursor-not-allowed" : ""}
                        peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-plumPrimaryPurple`}
                      ></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-200">
                <button
                  onClick={handleRejectAll}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Rechazar opcionales
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-plumSecondaryPurple hover:bg-plumPrimaryPurple rounded-lg transition-colors"
                >
                  Guardar preferencias
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-plumPrimaryPurple hover:bg-plumSecondaryPurple rounded-lg transition-colors"
                >
                  Aceptar todas
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CookieConsent;
