"use client";
import React, { useRef, useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { submitContactForm } from "../../actions/forms";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CITIES } from "../../constants/destinations";
import { openModalBase } from "../../helpers/modals";
import { useFormState } from "react-dom";

const inputBaseStyles = "w-full rounded-xl px-4 py-3 border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400 focus:border-plumPrimaryPurple focus:ring-2 focus:ring-plumPrimaryPurple/20 focus:bg-white transition-all outline-none";
const labelStyles = "block text-sm font-medium text-gray-700 mb-1.5";
const selectStyles = "w-full rounded-xl px-4 py-3 border border-gray-200 bg-gray-50 text-gray-700 focus:border-plumPrimaryPurple focus:ring-2 focus:ring-plumPrimaryPurple/20 focus:bg-white transition-all outline-none appearance-none cursor-pointer";

const ContactForm = () => {
  const [startDate, setStartDate] = useState(new Date());

  const recaptchaRef = useRef(null);

  async function submitForm(formData) {
    if (formData) {
      try {
        const sendContactFormMailResponse = await submitContactForm(formData);
        if (sendContactFormMailResponse.success)
          openModalBase({
            title: "Consulta Enviada",
            children:
              "Tu consulta fue enviada y será atendida por un representante.",
          });
      } catch (error) {
        openModalBase({
          title: "Ocurrió un error",
          children: JSON.stringify(error),
        });
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header del formulario */}
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-plumPrimaryPurple flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Formulario de contacto
        </h2>
        <p className="text-gray-500 mt-2">
          Puede comunicarse con nosotros completando el siguiente formulario. Uno de nuestros representantes se comunicará con usted para atender sus consultas.
        </p>
      </div>

      <form
        id="contactForm"
        className="flex flex-col gap-6"
        action={submitForm}
      >
        {/* Sección: Datos personales */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-plumPrimaryPurple uppercase tracking-wide flex items-center gap-2">
            <span className="w-8 h-8 bg-plumPrimaryPurple/10 rounded-lg flex items-center justify-center text-plumPrimaryPurple">1</span>
            Datos personales
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className={labelStyles}>Nombre</label>
              <input
                className={inputBaseStyles}
                type="text"
                name="name"
                id="name"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label htmlFor="surname" className={labelStyles}>Apellido</label>
              <input
                className={inputBaseStyles}
                type="text"
                name="surname"
                id="surname"
                placeholder="Tu apellido"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className={labelStyles}>Teléfono</label>
              <div className="grid grid-cols-[80px_70px_1fr] gap-2">
                <select className={selectStyles} name="phoneType" id="phoneType">
                  <option value="cellphone">Celular</option>
                  <option value="home">Fijo</option>
                </select>
                <input
                  className={inputBaseStyles}
                  type="text"
                  maxLength={5}
                  name="phoneAreaCode"
                  id="phoneAreaCode"
                  placeholder="Cód"
                />
                <input
                  className={inputBaseStyles}
                  type="text"
                  maxLength={12}
                  name="phoneNumber"
                  id="phoneNumber"
                  placeholder="Número"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className={labelStyles}>Email</label>
              <input
                className={inputBaseStyles}
                type="email"
                name="email"
                id="email"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="w-1/3">
            <label htmlFor="contactTime" className={labelStyles}>Horario preferido de contacto</label>
            <input
              className={inputBaseStyles}
              type="text"
              name="contactTime"
              id="contactTime"
              placeholder="Ej: Mañanas de 9 a 12"
            />
          </div>
        </div>

        {/* Sección: Detalles del viaje */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-plumPrimaryPurple uppercase tracking-wide flex items-center gap-2">
            <span className="w-8 h-8 bg-plumPrimaryPurple/10 rounded-lg flex items-center justify-center text-plumPrimaryPurple">2</span>
            Detalles del viaje
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="destination" className={labelStyles}>Destino</label>
              <select
                name="destination"
                id="destination"
                className={selectStyles}
              >
                <option value="">Seleccionar destino</option>
                {CITIES.filter((city) => city.active).map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}, {city.countryName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="departureDate" className={labelStyles}>Fecha de salida</label>
              <DatePicker
                selected={startDate}
                id="departureDate"
                name="departureDate"
                onChange={(date) => setStartDate(date)}
                dateFormat={"dd/MM/yyyy"}
                className={inputBaseStyles}
                wrapperClassName="w-full"
                minDate={new Date()}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="nightsQty" className={labelStyles}>Noches</label>
              <input
                className={inputBaseStyles}
                type="number"
                min={1}
                max={30}
                name="nightsQty"
                id="nightsQty"
                placeholder="7"
              />
            </div>
            <div>
              <label htmlFor="adultsQty" className={labelStyles}>Adultos</label>
              <input
                required
                className={inputBaseStyles}
                type="number"
                min={1}
                max={10}
                name="adultsQty"
                id="adultsQty"
                placeholder="2"
              />
            </div>
            <div>
              <label htmlFor="childQty" className={labelStyles}>Menores</label>
              <input
                required
                className={inputBaseStyles}
                type="number"
                min={0}
                max={10}
                name="childQty"
                id="childQty"
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="mealPlan" className={labelStyles}>Comidas</label>
              <select
                className={selectStyles}
                name="mealPlan"
                id="mealPlan"
              >
                <option value="breakfast">Desayuno</option>
                <option value="halfPension">Media pensión</option>
                <option value="fullPension">Pensión completa</option>
                <option value="allInclusive">All inclusive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sección: Tu consulta */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-plumPrimaryPurple uppercase tracking-wide flex items-center gap-2">
            <span className="w-8 h-8 bg-plumPrimaryPurple/10 rounded-lg flex items-center justify-center text-plumPrimaryPurple">3</span>
            Tu consulta
          </h3>

          <div>
            <label htmlFor="inquiry" className={labelStyles}>
              Contanos cuál es tu idea para tu próximo viaje
            </label>
            <textarea
              className={`${inputBaseStyles} resize-none`}
              maxLength={500}
              rows={4}
              name="inquiry"
              id="inquiry"
              placeholder="Describe qué tipo de viaje te gustaría, preferencias de hotel, actividades que te interesan..."
            />
          </div>

          {/* Checkboxes con estilo moderno */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-plumPrimaryPurple/30 hover:bg-gray-50 transition-all cursor-pointer group">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-gray-300 text-plumPrimaryPurple focus:ring-plumPrimaryPurple/20"
                name="ringMe"
                id="ringMe"
              />
              <span className="text-gray-700 group-hover:text-plumPrimaryPurple transition-colors">
                Deseo que se comuniquen telefónicamente
              </span>
            </label>
            
            <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-plumPrimaryPurple/30 hover:bg-gray-50 transition-all cursor-pointer group">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-gray-300 text-plumPrimaryPurple focus:ring-plumPrimaryPurple/20"
                name="notifyPromotions"
                id="notifyPromotions"
              />
              <span className="text-gray-700 group-hover:text-plumPrimaryPurple transition-colors">
                Quiero suscribirme para recibir las mejores promociones
              </span>
            </label>
          </div>
        </div>

        {/* ReCAPTCHA y Botón */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-plumPrimaryOrange text-white font-semibold rounded-xl hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            aria-label="Enviar"
            name="submit"
            id="submit"
          >
            <span>Enviar consulta</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
