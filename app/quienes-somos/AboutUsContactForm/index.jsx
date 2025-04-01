"use client";
import React, { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { submitContactForm } from "../../actions/forms";
import { openModalBase } from "../../helpers/modals";

const AboutUsContactForm = () => {
  const recaptchaRef = useRef(null);

  const submitForm = async (formData) => {
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
        {/* Se establecen los min width para prevenir el layout shift */}
        <div className="min-w-auto min-h-24">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
          />
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
