import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import styles from "./Cta.module.css";

function cta(props) {
  const { title, route, link } = props;

  if (route && route.slug && route.slug.current) {
    return (
      <Link
        href={{
          pathname: "/LandingPage",
          query: { slug: route.slug.current },
        }}
        as={`/${route.slug.current}`}
        className={styles.button}
      >
        {title}
      </Link>
    );
  }

  if (link) {
    return (
      <Link className={styles.button} href={link}>
        {title}
      </Link>
    );
  }

  return <Link className={styles.button}>{title}</Link>;
}

cta.propTypes = {
  title: PropTypes.string.isRequired,
  route: PropTypes.shape({
    slug: PropTypes.shape({
      current: PropTypes.string,
    }),
  }),
  link: PropTypes.string,
};

export default cta;
