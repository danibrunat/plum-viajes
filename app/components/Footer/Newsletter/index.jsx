import React from "react";

const Newsletter = () => {
  return (
    <div className="flex flex-col justify-center text-center text-white gap-6 bg-plumPrimaryOrange p-8 rounded-lg shadow-lg">
      <h1 className="text-xl font-bold">
        Registrate y comenzá a recibir nuestras promociones
      </h1>
      <form
        action=""
        className="flex flex-row flex-wrap justify-center align-middle items-end w-full gap-4"
        method="post"
      >
        <div className="flex flex-col w-full md:w-auto">
          <label htmlFor="name" className="text-sm font-medium">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-plumPrimaryOrange focus:border-transparent"
          />
        </div>
        <div className="flex flex-col w-full md:w-auto">
          <label htmlFor="mail" className="text-sm font-medium">
            E-Mail
          </label>
          <input
            type="email"
            id="mail"
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-plumPrimaryOrange focus:border-transparent"
          />
        </div>
        <input
          type="submit"
          value="Enviar"
          className="p-2 bg-white text-plumPrimaryOrange font-bold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        />
      </form>
      <em className="text-sm">
        Recibirás emails promocionales, no compartiremos tus datos personales
        con terceros. Para más información consulta las políticas de privacidad.
      </em>
    </div>
  );
};

export default Newsletter;
