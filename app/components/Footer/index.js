import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";
import SimpleBlockContent from "../SimpleBlockContent";
import { getPathFromSlug, slugParamToPath } from "../../../utils/urls";

export default function Footer(props) {
  const { navItems, text } = props;
  return (
    <div className={styles.root}>
      <nav>
        <ul className={styles.items}>
          {navItems &&
            navItems.map((item) => {
              const isActive = true;
              return (
                <li key={item._id} className={styles.item}>
                  <Link href={getPathFromSlug(item.slug.current)}>
                    {item.title}
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>
      <div className={styles.text}>
        <SimpleBlockContent blocks={text} />
      </div>
    </div>
  );
}
