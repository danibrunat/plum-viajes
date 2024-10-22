"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa6";

const Whatsapp = () => {
  const router = useRouter();

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
        className="bg-green-600 w-min p-2 rounded-full fixed 
          bottom-28 right-4 cursor-pointer md:right-8"
        onClick={handleClick}
      >
        <FaWhatsapp color="white" className=" w-14 h-14 md:w-10 md:h-10" />
      </div>
    </>
  );
};

export default Whatsapp;
