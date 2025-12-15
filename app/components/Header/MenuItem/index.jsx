import Link from "next/link";
import React from "react";
import { getPathFromSlug } from "../../../../utils/urls";

const MenuItem = ({ item, icon, onClick, className = "" }) => {
  const { slug, title, id } = item;
  const isActive = true;
  return (
    <Link
      key={id}
      data-is-active={isActive ? "true" : "false"}
      aria-current={isActive}
      href={getPathFromSlug(slug.current)}
      onClick={onClick}
      className={`flex items-center text-plumPrimaryPurple hover:text-plumPrimaryOrange md:py-1 md:mx-5 ${className}`}
    >
      <i className="text-plumPrimaryPurple text-lg mx-2 self-center">{icon}</i>{" "}
      {title}
    </Link>
  );
};

export default MenuItem;
