"use client";

import React, { useEffect } from "react";
import MenuItem from "./MenuItem";
import { getIconByName } from "../../helpers/iconHelper";

export default function MobileMenu({ isOpen, onClose, navItems }) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" aria-hidden={!isOpen}>
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Cerrar menú"
        onClick={onClose}
      />

      <aside
        className="absolute right-0 top-0 h-full w-4/5 max-w-xs bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        <div className="flex items-center justify-end px-6 pt-6">
          <button
            type="button"
            className="rounded-lg p-2 text-plumPrimaryPurple hover:text-plumPrimaryOrange"
            aria-label="Cerrar"
            onClick={onClose}
          >
            <span className="block h-[1px] w-6 bg-transparent" />
            <span className="relative block h-5 w-6">
              <span className="absolute left-0 top-1/2 block h-[1px] w-full -translate-y-1/2 rotate-45 bg-plumPrimaryPurple" />
              <span className="absolute left-0 top-1/2 block h-[1px] w-full -translate-y-1/2 -rotate-45 bg-plumPrimaryPurple" />
            </span>
          </button>
        </div>

        <nav className="px-6 pb-8 pt-6">
          <menu className="flex flex-col gap-1">
            {navItems?.map((item) => {
              const Icon = getIconByName(item?.icon?.name);
              return (
                <MenuItem
                  key={item._id}
                  item={item}
                  icon={Icon}
                  onClick={onClose}
                  className="mx-0 w-full rounded-xl px-3 py-3 hover:bg-gray-50"
                />
              );
            })}
          </menu>
        </nav>
      </aside>
    </div>
  );
}
