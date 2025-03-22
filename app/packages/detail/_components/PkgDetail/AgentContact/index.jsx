"use client";
import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { submitAgentContactForm } from "../../../../../actions/forms";
import { openModalBase } from "../../../../../helpers/modals";

const AgentContact = () => {
  const recaptchaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Construimos un FormData a partir del formulario
    const formData = new FormData(e.target);

    // Opcional: Si requieres validar el ReCAPTCHA, podrías obtener el token aquí
    // const recaptchaValue = recaptchaRef.current.getValue();
    // formData.append("recaptchaToken", recaptchaValue);

    // Enviar la data utilizando el nuevo servicio (tipo "agent")
    const response = await submitAgentContactForm(formData);

    if (response.success) {
      openModalBase({
        title: "Consulta Enviada",
        children: "Tu consulta fue enviada. Pronto te contactaremos.",
      });
    } else {
      openModalBase({
        title: "Error",
        children: "Ocurrió un error al enviar la consulta. Intenta nuevamente.",
      });
    }
  };

  return (
    <div className="flex flex-col w-full bg-white p-6 shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Consultá con tu agente de viajes
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          name="name"
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Nombre"
          required
        />
        <input
          name="surname"
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Apellido"
          required
        />
        <div className="flex">
          <select
            name="phoneType"
            className="p-3 border w-2/5 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="movil">Móvil</option>
            <option value="fijo">Fijo</option>
          </select>
          <input
            name="phoneNumber"
            className="p-3 border w-3/5 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Teléfono"
            required
          />
        </div>
        <input
          name="email"
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Email"
          required
        />
        <textarea
          name="inquiry"
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={5}
          placeholder="Consulta"
          required
        />
        <div className="flex items-center">
          <input name="ringMe" className="mr-2" type="checkbox" id="ringMe" />
          <label htmlFor="ringMe" className="text-gray-700">
            Deseo que se comuniquen telefónicamente
          </label>
        </div>
        <div className="flex justify-center min-h-24">
          <ReCAPTCHA
            size="compact"
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
          />
        </div>
        <button
          className="bg-plumPrimaryPurple hover:bg-plumPrimaryOrange text-white p-3 rounded transition duration-300"
          type="submit"
        >
          Enviar Consulta
        </button>
      </form>
    </div>
  );
};

export default AgentContact;
