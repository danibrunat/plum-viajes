"use client";

import React, { useState } from "react";
import { submitNewsletterSubscription } from "../../../actions/forms";

const Newsletter = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id === "mail" ? "email" : id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      const result = await submitNewsletterSubscription(formData);

      if (result.success) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "" });
      } else {
        setSubmitStatus("error");
        setErrorMessage(result.error || "Hubo un error al procesar tu suscripción");
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage("Hubo un error al procesar tu suscripción");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center text-center text-white gap-6 bg-plumPrimaryOrange p-8 rounded-lg shadow-lg">
      <h1 className="text-xl font-bold">
        Registrate y comenzá a recibir nuestras promociones
      </h1>

      {submitStatus === "success" ? (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="text-4xl">✅</div>
          <p className="text-lg font-semibold">¡Gracias por suscribirte!</p>
          <p className="text-sm opacity-90">
            Pronto recibirás nuestras mejores promociones en tu correo.
          </p>
          <button
            type="button"
            onClick={() => setSubmitStatus(null)}
            className="mt-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
          >
            Suscribir otro email
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-row flex-wrap justify-center align-middle items-end w-full gap-4"
        >
          <div className="flex flex-col w-full md:w-auto">
            <label htmlFor="name" className="text-sm font-medium">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-plumPrimaryOrange focus:border-transparent text-gray-900 disabled:opacity-50"
            />
          </div>
          <div className="flex flex-col w-full md:w-auto">
            <label htmlFor="mail" className="text-sm font-medium">
              E-Mail
            </label>
            <input
              type="email"
              id="mail"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-plumPrimaryOrange focus:border-transparent text-gray-900 disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="p-2 px-6 bg-white text-plumPrimaryOrange font-bold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Enviando...
              </>
            ) : (
              "Enviar"
            )}
          </button>
        </form>
      )}

      {submitStatus === "error" && (
        <div className="bg-red-500/20 border border-red-300 rounded-lg p-3 text-sm">
          {errorMessage}
        </div>
      )}

      <em className="text-sm">
        Recibirás emails promocionales, no compartiremos tus datos personales
        con terceros. Para más información consulta las políticas de privacidad.
      </em>
    </div>
  );
};

export default Newsletter;
