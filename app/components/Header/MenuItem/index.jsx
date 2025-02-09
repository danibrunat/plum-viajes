import Link from "next/link";
import React from "react";
import { getPathFromSlug } from "../../../../utils/urls";

const MenuItem = ({ item, icon }) => {
  const { slug, title, id } = item;
  const isActive = true;
  return (
    <Link
      key={id}
      data-is-active={isActive ? "true" : "false"}
      aria-current={isActive}
      href={getPathFromSlug(slug.current)}
      className="flex text-plumPrimaryPurple py-1 mx-5 hover:text-plumPrimaryOrange "
    >
      <i className="text-plumPrimaryPurple text-lg mx-2 self-center">{icon}</i>{" "}
      {title}
    </Link>
  );
};

export default MenuItem;
