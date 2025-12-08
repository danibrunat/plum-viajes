"use client";
import React, { useRef, useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { submitContactForm } from "../../actions/forms";
import { openModalBase } from "../../helpers/modals";
import { useCookieConsentContext } from "../../context/CookieConsentContext";
import { COOKIE_CATEGORIES } from "../../constants/cookieCategories";

const AboutUsContactForm = () => {
  const recaptchaRef = useRef(null);
  const { hasConsent, openSettings } = useCookieConsentContext();
  const [canShowRecaptcha, setCanShowRecaptcha] = useState(false);

  // Check consent on mount and when it changes
  useEffect(() => {
    setCanShowRecaptcha(hasConsent(COOKIE_CATEGORIES.FUNCTIONAL));
  }, [hasConsent]);

  const submitForm = async (formData) => {
    // Check if reCAPTCHA consent is given
    if (!canShowRecaptcha) {
      openModalBase({
        title: "Cookies requeridas",
        children:
          "Para enviar el formulario, necesitás aceptar las cookies funcionales que permiten la verificación de seguridad.",
      });
      return;
    }

    if (formData) {
      try {
        const response = await submitContactForm(formData, "agent");
        if (response.statusCode === 200) {
          openModalBase({
            title: "Éxito",
            children:
              "Recibimos tu consulta. Te vamos a estar contactando a la brevedad!",
          });
        }
      } catch (error) {
        openModalBase({
          title: "Error",
          children: "No pudimos enviar tu formulario",
        });
      }
    }
    document.getElementById("aboutUsContactForm").reset();
  };

  return (
    <div className="flex flex-col gap-2 md:gap-1 text-white">
      <form
        id="aboutUsContactForm"
        className="flex flex-col gap-3"
        action={submitForm}
      >
        <div className="flex flex-col gap-2 p-1">
          <label htmlFor="name">Nombre</label>
          <input
            required
            className=" rounded-md p-2 border-2 border-gray-300"
            type="text"
            name="name"
            id="name"
          />
        </div>
        <div className="flex flex-col gap-2 p-1">
          <label htmlFor="surname">Apellido</label>
          <input
            required
            className=" rounded-md p-2 border-2 border-gray-300"
            type="text"
            name="surname"
            id="surname"
          />
        </div>
        <div className="flex flex-col gap-2 p-1">
          <label htmlFor="phone">Teléfono</label>
          <div className="flex gap-1 w-full">
            <input
              required
              className="w-full rounded-md p-2 border-2 border-gray-300"
              type="text"
              maxLength={15}
              name="phoneNumber"
              id="phoneNumber"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 p-1">
          <label htmlFor="email">Email</label>
          <input
            required
            className=" rounded-md p-2 border-2 border-gray-300"
            type="email"
            name="email"
            id="email"
          />
        </div>

        <div className="flex flex-col gap-2 p-1">
          <label htmlFor="inquiry">Deje su comentario</label>
          <textarea
            className=" rounded-md p-2 border-2 border-gray-300 text-black"
            maxLength={300}
            rows={5}
            name="inquiry"
            id="inquiry"
          />
        </div>
        {/* reCAPTCHA section - only loads if consent is given */}
        <div className="min-w-auto min-h-24">
          {canShowRecaptcha ? (
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
            />
          ) : (
            <div className="bg-gray-100 border border-gray-300 rounded-md p-4 text-gray-700 text-sm">
              <p className="mb-2">
                Para completar el formulario, necesitamos verificar que no sos
                un robot.
              </p>
              <button
                type="button"
                onClick={openSettings}
                className="text-plumPrimaryPurple underline hover:text-plumSecondaryPurple"
              >
                Aceptar cookies funcionales
              </button>
            </div>
          )}
        </div>

        <button
          className="bg-plumPrimaryPurple text-white rounded-md p-2"
          aria-label="Enviar"
          name="submit"
          id="submit"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default AboutUsContactForm;
