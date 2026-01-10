import React from "react";
import AboutUsContactForm from "./AboutUsContactForm";

export const metadata = {
  title: "Quienes Somos",
  description: `Somos una agencia de turismo enfocada en la experiencia de cada uno de
        sus pasajeros. Buscamos hacer la diferencia...`,
  alternates: {
    canonical: '/quienes-somos',
  },
};

const AboutUs = () => {
  return (
    <div className="flex flex-col gap-4 p-4 md:px-10 bg-plumAboutUsBlue text-white">
      <h1 className="text-3xl md:text-4xl">Quienes Somos</h1>
      <p className="text-base">
        Somos una agencia de turismo enfocada en la experiencia de cada uno de
        sus pasajeros. Buscamos hacer la diferencia, por eso te aseguramos:
      </p>
      <div className="flex flex-col text-xl md:text-base my-5 gap-6 md:flex-row md:justify-center">
        <div className="flex flex-col gap-3">
          <h1>
            <strong>Viajes a medida</strong>
          </h1>
          <p>
            Sabemos que cada plan de viaje es único, vamos a buscar la mejor
            opción que se adapte a vos.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h1>
            <strong>Seremos compañeros de ruta</strong>
          </h1>
          <p>
            Esto no se termina cuando te vendimos el viaje, te acompañamos hasta
            que estés de regreso.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h1>
            <strong>Queremos que vuelvas</strong>
          </h1>
          <p>
            Nuestra mayor satisfacción es encontrarte en un próximo viaje, por
            eso vamos a hacer nuestro mayor esfuerzo.
          </p>
        </div>
        <div className="flex flex-col gap-3 my-2">
          <h1 className="text-center">
            <strong>Dejanos tu consulta</strong>
          </h1>
          <AboutUsContactForm />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
