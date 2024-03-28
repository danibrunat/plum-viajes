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
      className="flex text-black  py-3 px-4 hover:bg-plumPrimaryPink "
    >
      <i className="text-black mx-2 self-center">{icon}</i> {title}
    </Link>
  );
};

export default MenuItem;
