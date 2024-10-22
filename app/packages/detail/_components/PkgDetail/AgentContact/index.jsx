"use client";
import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const AgentContact = () => {
  const recaptchaRef = useRef(null);

  return (
    <div className="flex flex-col w-full bg-white p-6  shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Consultá con tu agente de viajes
      </h2>
      <form className="flex flex-col space-y-4">
        <input
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Nombre"
        />
        <input
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Apellido"
        />
        <div className="flex">
          <select className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="movil">Móvil</option>
            <option value="fijo">Fijo</option>
          </select>
          <input
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Teléfono"
          />
        </div>
        <input
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Email"
        />
        <input
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Consulta"
        />
        <div className="flex items-center">
          <input className="mr-2" type="checkbox" />
          <label className="text-gray-700">
            Deseo que se comuniquen telefónicamente
          </label>
        </div>
        <div className="min-w-auto min-h-24">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
          />
        </div>
        <button
          className="bg-plumPrimaryPink hover:bg-plumPrimaryOrange text-white p-3 rounded  transition duration-300"
          type="submit"
        >
          Enviar Consulta
        </button>
      </form>
    </div>
  );
};

export default AgentContact;
