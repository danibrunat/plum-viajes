"use client";
import React, { useRef, useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { submitContactForm } from "../../actions/forms";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CITIES } from "../../constants/destinations";
import { openModalBase } from "../../helpers/modals";
import ChildrenAgesFields from "./ChildrenAgesFields";
import { useCookieConsentContext } from "../../context/CookieConsentContext";
import { COOKIE_CATEGORIES } from "../../constants/cookieCategories";

const inputBaseStyles = "w-full rounded-xl px-4 py-3 border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400 focus:border-plumPrimaryPurple focus:ring-2 focus:ring-plumPrimaryPurple/20 focus:bg-white transition-all outline-none";
const labelStyles = "block text-sm font-medium text-gray-700 mb-1.5";
const selectStyles = "w-full rounded-xl px-4 py-3 border border-gray-200 bg-gray-50 text-gray-700 focus:border-plumPrimaryPurple focus:ring-2 focus:ring-plumPrimaryPurple/20 focus:bg-white transition-all outline-none appearance-none cursor-pointer";

const MAX_CHILDREN = 10;

// Componente del botón de submit
function SubmitButton({ isSubmitting }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full py-4 bg-plumPrimaryOrange text-white font-semibold rounded-xl hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-plumPrimaryOrange"
      aria-label="Enviar"
      name="submit"
      id="submit"
    >
      {isSubmitting ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
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
          <span>Enviando...</span>
        </>
      ) : (
        <>
          <span>Enviar consulta</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </>
      )}
    </button>
  );
}

const ContactForm = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [recaptchaError, setRecaptchaError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [childrenCount, setChildrenCount] = useState(0);
  const [childrenAges, setChildrenAges] = useState([]);
  const [canShowRecaptcha, setCanShowRecaptcha] = useState(false);
  const recaptchaRef = useRef(null);
  const formRef = useRef(null);
  const { hasConsent, openSettings } = useCookieConsentContext();

  useEffect(() => {
    setCanShowRecaptcha(hasConsent(COOKIE_CATEGORIES.FUNCTIONAL));
  }, [hasConsent]);

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
    setRecaptchaError(false);
  };

  const handleRecaptchaExpired = () => {
    setRecaptchaToken(null);
  };

  const handleChildrenCountChange = (e) => {
    const count = Math.min(Math.max(0, parseInt(e.target.value) || 0), MAX_CHILDREN);
    setChildrenCount(count);
    // Ajustar el array de edades al nuevo tamaño
    setChildrenAges((prev) => {
      if (count > prev.length) {
        return [...prev, ...Array(count - prev.length).fill("")];
      }
      return prev.slice(0, count);
    });
  };

  const handleChildAgeChange = (index, age) => {
    setChildrenAges((prev) => {
      const newAges = [...prev];
      newAges[index] = age;
      return newAges;
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validar que se completó el captcha - NO resetea el form
    if (!recaptchaToken) {
      setRecaptchaError(true);
      // Scroll al captcha para que lo vea
      recaptchaRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(formRef.current);
    formData.append("recaptchaToken", recaptchaToken);

    try {
      const sendContactFormMailResponse = await submitContactForm(formData);
      if (sendContactFormMailResponse.success) {
        openModalBase({
          title: "Consulta Enviada",
          children:
            "Tu consulta fue enviada y será atendida por un representante.",
        });
        // Solo resetear el form si fue exitoso
        formRef.current?.reset();
        setStartDate(new Date());
        setChildrenCount(0);
        setChildrenAges([]);
        recaptchaRef.current?.reset();
        setRecaptchaToken(null);
      } else {
        openModalBase({
          title: "Ocurrió un error",
          children: sendContactFormMailResponse.error || "Error al enviar el formulario",
        });
        // Reset solo el captcha, mantener los datos del form
        recaptchaRef.current?.reset();
        setRecaptchaToken(null);
      }
    } catch (error) {
      openModalBase({
        title: "Ocurrió un error",
        children: error.message || "Error inesperado",
      });
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header del formulario */}
      <div className="border-b border-gray-100 pb-4">
        <p className="text-gray-500 mt-2">
          Completá el formulario con tus datos y uno de nuestros Consultores de Viaje se pondrá en contacto con vos a la brevedad para asesorarte de forma personalizada.
        </p>
        <p className="text-gray-500">
          En Plum Viajes te acompañamos en todo el proceso para que solo te ocupes de disfrutar tu próximo viaje.
        </p>
      </div>

      <form
        id="contactForm"
        ref={formRef}
        className="flex flex-col gap-6"
        onSubmit={handleSubmit}
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
              <label htmlFor="phoneNumber" className={labelStyles}>Teléfono</label>
              <div className="grid grid-cols-[80px_70px_1fr] gap-2">
                <div>
                  <label htmlFor="phoneType" className="sr-only">Tipo de teléfono</label>
                  <select className={selectStyles} name="phoneType" id="phoneType" aria-label="Tipo de teléfono">
                    <option value="cellphone">Celular</option>
                    <option value="home">Fijo</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="phoneAreaCode" className="sr-only">Código de área</label>
                  <input
                    className={inputBaseStyles}
                    type="text"
                    maxLength={5}
                    name="phoneAreaCode"
                    id="phoneAreaCode"
                    placeholder="Cód"
                    aria-label="Código de área"
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="sr-only">Número de teléfono</label>
                  <input
                    className={inputBaseStyles}
                    type="text"
                    maxLength={12}
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="Número"
                    aria-label="Número de teléfono"
                  />
                </div>
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
                  <option key={city.id} value={`${city.name}, ${city.countryName}`}>
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
                max={MAX_CHILDREN}
                name="childQty"
                id="childQty"
                placeholder="0"
                value={childrenCount}
                onChange={handleChildrenCountChange}
              />
            </div>
           
          </div>

          {/* Campos de edad de menores - aparecen dinámicamente */}
          <ChildrenAgesFields 
            childrenCount={childrenCount} 
            childrenAges={childrenAges}
            onAgeChange={handleChildAgeChange}
            labelStyles={labelStyles}
          />
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
          <div className="flex flex-col items-center gap-2">
            {canShowRecaptcha ? (
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
                onChange={handleRecaptchaChange}
                onExpired={handleRecaptchaExpired}
              />
            ) : (
              <div className="bg-gray-100 border border-gray-300 rounded-md p-4 text-gray-700 text-sm text-center">
                <p className="mb-2">
                  Para enviar el formulario, necesitamos verificar que no sos un robot.
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
            {recaptchaError && (
              <p className="text-red-500 text-sm animate-pulse">
                ⚠️ Por favor, completá el captcha para continuar
              </p>
            )}
          </div>

          <SubmitButton isSubmitting={isSubmitting} />
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
