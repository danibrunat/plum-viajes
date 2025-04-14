"use client";

import Image from "next/image";
import React from "react";
import { FaWhatsapp, FaWhatsappSquare } from "react-icons/fa";

const Whatsapp = () => {
  const handleClick = async () => {
    // Check if WhatApp installed, if yes open whatsapp else open whatsapp web
    const isAndroid =
      navigator.userAgent.toLowerCase().indexOf("android") !== -1;

    if (isAndroid) {
      // WhatsApp is installed
      window.open(`whatsapp://send?phone=541161758142`);
    } else {
      // WhatsApp is not installed, open WhatsApp Web
      window.open("https://web.whatsapp.com/send?phone=541161758142", "_blank");
    }
  };

  return (
    <>
      <div
        className="p-2 fixed bottom-28 right-4 cursor-pointer md:right-4"
        onClick={handleClick}
      >
        {/* Mostrar imagen en dispositivos de escritorio */}
        <div className="hidden md:block">
          <Image
            alt="Whatsapp"
            src={`/images/Whatsapp.png`}
            width={200}
            height={84}
          />
        </div>
        {/* Mostrar ícono en dispositivos móviles */}
        <div className="block md:hidden z-50">
          <div className="bg-[#25D366] p-3 rounded-full shadow-lg">
            <FaWhatsapp className="text-white w-10 h-10" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Whatsapp;
