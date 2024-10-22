"use client";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import Slider from "../../../../../components/commons/Slider";

const DestinationCity = ({ sliderImages }) => {
  // State to handle text expansion
  const [expanded, setExpanded] = useState(false);

  // Handler to toggle text expansion
  const toggleText = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="w-full h-auto border rounded-lg overflow-hidden shadow-lg p-4">
      {/* Card title */}
      <h2 className="flex text-xl font-bold mb-2">Rio de Janeiro</h2>

      {/* Image section */}
      <div className="relative w-full h-48 mb-4">
        <Slider slides={sliderImages} deviceType="desktop" />
      </div>

      {/* Large text (expandable) with ellipsis */}
      <div className={`transition-all ${expanded ? "" : "line-clamp-5"}`}>
        <p className="text-gray-700">
          Buzios se encuentra al norte de Rio de Janeiro a solo 30 minutos del
          aeropuerto mas próximo, el de la ciudad de Cabo Frio. Esta península
          que cuenta con mas de 20 playas es uno de los destinos mas visitados y
          elegidos por argentinos, cariocas y europeos. Buzios ofrece un
          elegante entorno de naturelaza e infrastructura turística y también
          una gran diversidad cultural aportada por habitantes que llegaron como
          turistas y terminaron siendo parte de este increíble destino. El
          centro de Buzios es muy elegante , en él se destaca la peatonal Rua
          das Pedras que ofrece un sin número de tiendas, bares , restaurantes y
          gran cantidad de opciones para que la noche sea entretenida y variada.
          Una caminata por la Orla Bardot para ver el atarceder sobre el mar es
          un paseo que nadie puede perderse en Buzios y tampoco una cena en el
          centro gastronómico de Porto da Barra de Manguinhos. Las atractivas
          playas Joao Fernandez, Ferradura, Geribá , Tartaruga, Brava, Osos son
          algunas de las mas visitas. Con un sin número de posadas para todo
          tipo de turistas su oferta para alojamiento es mas que completa. Sin
          duda Buzios es un destino para ir y repetir
        </p>
      </div>

      {/* "Ver más" button */}
      <div className="flex justify-end">
        <button onClick={toggleText} className="mt-4 text-blue-500">
          {expanded ? "Ver menos" : "Ver más"}
        </button>
      </div>
    </div>
  );
};

export default DestinationCity;
