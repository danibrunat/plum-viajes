"use client";
import React, { useState } from "react";
import Link from "next/link";
import { getPathFromSlug, slugParamToPath } from "../../../utils/urls";
import { urlForImage } from "../../../sanity/lib/image";
import Image from "next/image";
import MenuItem from "./MenuItem";
import { getIconByName } from "../../helpers/iconHelper";

export default function Header(props) {
  const { title = "Missing title", navItems, logo, contact } = props;

  return (
    <nav className="flex flex-col md:flex-row border-b-4 border-plumPrimaryPink md:items-center md:justify-between md:flex-wrap">
      <div className="p-4 mr-0 flex self-center md:self-start text-white md:mr-6 md:p-6">
        <Link href={"/"}>
          <Image
            priority
            src={urlForImage(logo)}
            alt="logo"
            width={220}
            height={130}
          />
        </Link>
      </div>
      <div className="hidden md:flex md:flex-grow md:justify-center md:self-end md:w-auto">
        <menu className="flex md:text-sm items-center">
          {navItems &&
            navItems.map((item) => {
              const Icon = getIconByName(item?.icon?.name);
              return <MenuItem key={item._id} item={item} icon={Icon} />;
            })}
        </menu>
      </div>

      {contact && (
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
      )}
      {/* Begin Mobile Menú */}
      <label
        className="z-40 cursor-pointer px-3 py-6 md:hidden"
        htmlFor="mobile-menu"
      >
        <input className="peer hidden" type="checkbox" id="mobile-menu" />
        <div className="relative z-50 block h-[1px] w-7 bg-black bg-transparent content-[''] before:absolute before:top-[-0.35rem] before:z-50 before:block before:h-full before:w-full before:bg-black before:transition-all before:duration-200 before:ease-out before:content-[''] after:absolute after:right-0 after:bottom-[-0.35rem] after:block after:h-full after:w-full after:bg-black after:transition-all after:duration-200 after:ease-out after:content-[''] peer-checked:bg-transparent before:peer-checked:top-0 before:peer-checked:w-full before:peer-checked:rotate-45 before:peer-checked:transform after:peer-checked:bottom-0 after:peer-checked:w-full after:peer-checked:-rotate-45 after:peer-checked:transform"></div>
        <div className="fixed inset-0 z-40 hidden h-full w-full bg-black/50 backdrop-blur-sm peer-checked:block">
          &nbsp;
        </div>
        <div className="fixed top-0 right-0 z-40 h-full w-full translate-x-full overflow-y-auto overscroll-y-none transition duration-500 peer-checked:translate-x-0">
          <div className="float-right min-h-full w-[60%] bg-white px-6 pt-12 shadow-2xl">
            <menu className="md:text-sm flex flex-col justify-center">
              {navItems &&
                navItems.map((item) => {
                  const Icon = getIconByName(item?.icon?.name);
                  return <MenuItem key={item._id} item={item} icon={Icon} />;
                })}
            </menu>
          </div>
        </div>
      </label>
      {/* End Mobile Menú */}
    </nav>
  );
}
