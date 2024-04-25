import Link from "next/link";
import React from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const SocialLinks = () => {
  return (
    <>
      <span className="mx-3">Seguinos </span>
      <div className="flex gap-2 text-xl items-center">
        <Link href="https://www.facebook.com/plumviajes" target="_blank">
          <FaFacebook />
        </Link>
        <Link href="https://www.instagram.com/plumviajes" target="_blank">
          <FaInstagram />
        </Link>
      </div>
    </>
  );
};

export default SocialLinks;
