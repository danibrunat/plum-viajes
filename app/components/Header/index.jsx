import React from "react";
import Link from "next/link";
import { getPathFromSlug, slugParamToPath } from "../../../utils/urls";
import { urlForImage } from "../../../sanity/lib/image";
import Image from "next/image";

export default function Header(props) {
  const { title = "Missing title", navItems, logo, contact } = props;
  return (
    <nav className="flex items-center justify-between flex-wrap border-b-8 border-plumPrimaryPink">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <Link href={"/"}>
          <Image src={logo.asset.url} alt="logo" width={150} height={120} />
        </Link>
      </div>
      <div className="flex w-full pb-1 flex-grow justify-center self-end items-bottom lg:flex lg:items-end lg:w-auto">
        <div className="text-sm">
          {navItems &&
            navItems.map((item) => {
              const { slug, title, _id, icon } = item;
              // const Icon = iconHelper[icon];
              const isActive = true;
              return (
                <>
                  {/*  <Icon /> */}
                  <Link
                    key={_id}
                    data-is-active={isActive ? "true" : "false"}
                    aria-current={isActive}
                    href={getPathFromSlug(slug.current)}
                    className=" text-black  py-3 px-4 hover:bg-plumPrimaryPink"
                  >
                    {title}
                  </Link>
                </>
              );
            })}
        </div>
      </div>
      {contact && (
        <div className="justify-end p-6 ">
          <Link href={`/contactanos`}>
            <Image
              src={urlForImage(contact)}
              alt={contact?.alt}
              width={200}
              height={150}
            />
          </Link>
        </div>
      )}
    </nav>
  );
}

/* export default function Header(props) {
  const { title = "Missing title", navItems, logo } = props;
  console.log("navItems", navItems);

  return (
    <div className={styles.root}>
      <h1 className={styles.branding}>
        <Link title={title} href={"/"}></Link>
      </h1>
      <nav className={styles.nav}>
        <ul className={styles.navItems}>
          {navItems &&
            navItems.map((item) => {
              const { slug, title, _id } = item;
              const isActive = true;
              return (
                <li key={_id} className={styles.navItem}>
                  <Link
                    data-is-active={isActive ? "true" : "false"}
                    aria-current={isActive}
                    href={getPathFromSlug(slug.current)}
                  >
                    {title}
                  </Link>
                </li>
              );
            })}
        </ul>
        <button className={styles.showNavButton}>
          <HamburgerIcon className={styles.hamburgerIcon} />
        </button>
      </nav>
    </div>
  );
} */
