"use client";

import Image from "next/image";
import React from "react";

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
        className="p-2 fixed 
          bottom-28 right-4 cursor-pointer md:right-4"
        onClick={handleClick}
      >
        <Image
          alt="Whatsapp"
          src={`${process.env.NEXT_PUBLIC_URL}/Whatsapp.png`}
          width={200}
          height={84}
        />
      </div>
    </>
  );
};

export default Whatsapp;
