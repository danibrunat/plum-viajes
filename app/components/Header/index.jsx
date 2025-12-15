"use client";
import React, { useState } from "react";
import Link from "next/link";
import { urlForImage } from "../../lib/image";
import Image from "next/image";
import MenuItem from "./MenuItem";
import { getIconByName } from "../../helpers/iconHelper";
import MobileMenu from "./MobileMenu";

export default function Header(props) {
  const { title = "Missing title", navItems, logo, contact } = props;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="flex flex-col md:flex-row  md:items-center md:justify-between md:flex-wrap md:mx-12">
      <div className="flex w-full items-center justify-between p-4 md:w-auto md:self-start md:mr-2 md:p-1">
        <Link href={"/"} aria-label="Ir a la página principal">
          <Image
            priority
            src={urlForImage(logo)}
            alt="Logo de Plum Viajes"
            width={238}
            height={98}
          />
        </Link>

        <button
          type="button"
          className="md:hidden rounded-lg p-3 text-plumPrimaryPurple"
          aria-label="Abrir menú"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <span className="relative block h-5 w-7" aria-hidden="true">
            <span className="absolute left-0 top-0 block h-[1px] w-full bg-plumPrimaryPurple" />
            <span className="absolute left-0 top-1/2 block h-[1px] w-full -translate-y-1/2 bg-plumPrimaryPurple" />
            <span className="absolute left-0 bottom-0 block h-[1px] w-5 bg-plumPrimaryPurple" />
          </span>
        </button>
      </div>
      <div className="hidden md:flex md:flex-grow md:justify-end md:self-center">
        <menu className="flex md:text-sm items-center">
          {navItems &&
            navItems.map((item) => {
              const Icon = getIconByName(item?.icon?.name);
              return <MenuItem key={item._id} item={item} icon={Icon} />;
            })}
        </menu>
      </div>

      {/*  {contact && (
        <div className="hidden md:flex md:justify-end md:p-4 ">
          <Link href={`/contactanos`}>
            <Image
              src={urlForImage(contact)}
              alt={contact?.alt}
              width={238}
              height={98}
              priority
            />
          </Link>
        </div>
      )} */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
      />
    </nav>
  );
}
