"use client";
import React, { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { submitContactForm } from "../../actions/forms";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CITIES } from "../../constants/destinations";
import { openModalBase } from "../../helpers/modals";
//TODO: Usar este objeto como guía para renderizar.
const formFields = [
  {
    id: "name",
    fields: [
      {
        type: "text",
        maxSize: 40,
        required: true,
        placeholder: "tu nombre",
        label: "Nombre",
      },
    ],
  },
  {
    id: "surname",
    fields: [
      {
        type: "text",
        maxSize: 40,
        required: true,
        placeholder: "tu apellido",
        label: "Apellido",
      },
    ],
  },
  {
    id: "phone",
    fields: [
      {
        type: "select",
        maxSize: 40,
        required: true,
        placeholder: "tu apellido",
        label: "Apellido",
      },
    ],
  },
];

const ContactForm = () => {
  const [startDate, setStartDate] = useState(new Date());
  const recaptchaRef = useRef(null);

  const submitForm = async (formData) => {
    if (formData) {
      try {
        const response = await submitContactForm(formData);
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
    document.getElementById("contactForm").reset();
  };

  return (
    <div className="flex flex-col p-2 gap-2 text-plumPrimaryPink">
      <p className="text-xl">Formulario de contacto</p>
      <p>
        Puede comunicarse con nosotros completando el siguiente formulario. Uno
        de nuestros representantes se comunicará con usted para atender sus
        consultas
      </p>
      <form
        id="contactForm"
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
            <select className="py-2" name="phoneType" id="phoneType">
              <option value="home">Fijo</option>
              <option value="cellphone">Celular</option>
            </select>
            <input
              required
              className="w-1/3 rounded-md p-2 border-2 border-gray-300"
              type="text"
              size={2}
              maxLength={5}
              name="phoneAreaCode"
              id="phoneAreaCode"
            />
            <input
              required
              className="w-full rounded-md p-2 border-2 border-gray-300"
              type="text"
              maxLength={12}
              name="phoneNumber"
              id="phoneNumber"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 p-1">
          <label htmlFor="contactTime">Horario de contacto</label>
          <input
            required
            className=" rounded-md p-2 border-2 border-gray-300"
            type="text"
            name="contactTime"
            id="contactTime"
          />
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

        <div className="flex flex-col gap-2 p-1 w-full">
          <label htmlFor="destination">Destino</label>
          <select
            name="destination"
            id="destination"
            className="py-2 w-full text-sm"
          >
            {CITIES.filter((city) => city.active).map((city) => (
              <option key={city.id} value={city.name} className="w-full">
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2 p-1 w-auto md:w-1/3">
          <label htmlFor="surname">Fecha de salida</label>
          <DatePicker
            selected={startDate}
            id="departureDate"
            onChange={(date) => setStartDate(date)}
            dateFormat={"dd-MM-YYYY"}
            className="w-auto"
          />
        </div>
        <div className="flex flex-col gap-2 p-1">
          <label htmlFor="nightsQty">Cantidad de noches</label>
          <input
            required
            className=" rounded-md p-2 border-2 border-gray-300"
            type="number"
            size={2}
            maxLength={2}
            name="nightsQty"
            id="nightsQty"
          />
        </div>
        <div className="flex flex-col gap-2 p-1">
          <label htmlFor="adultsQty">Adultos</label>
          <input
            required
            className=" rounded-md p-2 border-2 border-gray-300"
            type="number"
            size={2}
            maxLength={2}
            min={1}
            max={10}
            name="adultsQty"
            id="adultsQty"
          />
        </div>
        <div className="flex flex-col gap-2 p-1">
          <label htmlFor="childQty">Menores (hasta 11 años)</label>
          <input
            required
            className=" rounded-md p-2 border-2 border-gray-300"
            type="number"
            size={2}
            maxLength={2}
            min={1}
            max={10}
            name="childQty"
            id="childQty"
          />
        </div>
        <div className="flex flex-col gap-2 p-1">
          <label htmlFor="mealPlan">Régimen de comidas</label>
          <select className="py-2" name="mealPlan" id="mealPlan">
            <option value="breakfast">Desayuno</option>
            <option value="halfPension">Media pensión</option>
            <option value="fullPension">Pensión completa</option>
            <option value="allInclusive">All inclusive</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 p-1">
          <label htmlFor="inquiry">
            Contanos cuál es tu idea para tu próximo viaje
          </label>
          <textarea
            className=" rounded-md p-2 border-2 border-gray-300"
            maxLength={300}
            rows={5}
            name="inquiry"
            id="inquiry"
          />
        </div>
        <div className="flex gap-2 p-1">
          <input
            type="checkbox"
            className=" rounded-md p-2 border-2 border-gray-300"
            name="ringMe"
            id="ringMe"
          />
          <label htmlFor="ringMe">
            Deseo que se comuniquen telefónicamente
          </label>
        </div>
        <div className="flex gap-2 p-1">
          <input
            type="checkbox"
            className=" rounded-md p-2 border-2 border-gray-300"
            name="notifyPromotions"
            id="notifyPromotions"
          />
          <label htmlFor="notifyPromotions">
            Quiero suscribirme para recibir las mejores promociones
          </label>
        </div>
        <div className="min-w-96 min-h-24">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
          />
        </div>

        <button
          className="bg-plumPrimaryPink text-white rounded-md p-2"
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

export default ContactForm;
