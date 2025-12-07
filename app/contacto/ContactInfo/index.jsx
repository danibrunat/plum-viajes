import Link from "next/link";
import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

const ContactInfo = () => {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-plumPrimaryPurple/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-plumPrimaryPurple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-plumPrimaryPurple">Contacto directo</h3>
      </div>

      {/* Teléfono */}
      <div className="space-y-2">
        <p className="text-gray-600 text-sm">
          Llámenos para consultar sobre destinos y productos:
        </p>
        <Link
          className="text-2xl font-bold text-plumPrimaryPurple hover:text-plumSecondaryPurple transition-colors block"
          aria-label="+54 9 11 3087 5513"
          href="tel:+541130875513"
        >
          +54 9 11 3087 5513
        </Link>
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Lun-Vie: 09:00-18:00 | Sáb: 10:00-13:00
        </p>
      </div>

      {/* WhatsApp */}
      <Link
        href="https://wa.me/541130875513?text=Hola,%20quiero%20realizar%20una%20consulta%20"
        target="_blank"
        className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
      >
        <FaWhatsapp className="text-green-500 text-2xl group-hover:scale-110 transition-transform" />
        <span className="text-green-700 font-medium">Escribinos por WhatsApp</span>
      </Link>

      {/* Redes sociales */}
      <div className="pt-3 border-t border-gray-100">
        <p className="text-sm text-gray-500 mb-3">Seguinos en redes:</p>
        <div className="flex gap-3">
          <Link
            href="#"
            className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors group"
          >
            <FaFacebook className="text-xl text-blue-600 group-hover:scale-110 transition-transform" />
          </Link>
          <Link
            href="#"
            className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center hover:bg-purple-100 transition-colors group"
          >
            <FaInstagram className="text-xl text-purple-500 group-hover:scale-110 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
