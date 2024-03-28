import Link from "next/link";
import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

const ContactInfo = () => {
  return (
    <>
      <p className=" text-plumPrimaryPink">
        Llámenos por teléfono para consultar sobre destinos y nuestros
        productos:
      </p>
      <Link
        className="text-2xl text-plumPrimaryBlue"
        aria-label="+54 9 11 7079 7586"
        href="tel:+541170797586"
      >
        +54 9 11 7079 7586
      </Link>
      <p className="text-plumPrimaryPink">
        Lunes a viernes de: 09:00 a 18:00 hs - Sábados de 10:00 a 13:00 hs
      </p>
      <p className="text-plumPrimaryPink">Comunicate por:</p>
      <FaWhatsapp className="text-green-500 text-4xl" />
      <p className="text-plumPrimaryPink">Encontranos en:</p>
      <div className="flex gap-2">
        <FaFacebook className="text-4xl text-blue-600" />{" "}
        <FaInstagram className="text-4xl text-purple-400" />
      </div>
    </>
  );
};

export default ContactInfo;
