import React from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import imageUrlBuilder from "@sanity/image-url";
import styles from "./ImageSection.module.css";
import client from "@/sanity/lib/client";
import { urlForImage } from "../../../../sanity/lib/image";
import SimpleBlockContent from "../../SimpleBlockContent";
import Cta from "../../Cta";

function ImageSection(props) {
  const { heading, label, text, image, cta } = props;
  ////console.log("image", JSON.stringify(props));
  if (!image) {
    return null;
  }

  const imageSrc = urlForImage(image);

  return (
    <div className={styles.root}>
      <figure className={styles.content}>
        <Image
          src={imageSrc}
          className={styles.image}
          width={2000}
          height={1000}
          alt={heading}
        />
        <figcaption>
          <div className={styles.caption}>
            <div className={styles.captionBox}>
              <div className={styles.label}>{label}</div>
              <h2 className={styles.title}>{heading}</h2>
              {text && <SimpleBlockContent blocks={text} />}
              {cta && cta.route && <Cta {...cta} />}
            </div>
          </div>
        </figcaption>
      </figure>
    </div>
  );
}

ImageSection.propTypes = {
  heading: PropTypes.string,
  label: PropTypes.string,
  text: PropTypes.array,
  image: PropTypes.shape({
    asset: PropTypes.shape({
      _ref: PropTypes.string,
    }),
  }),
  backgroundImage: PropTypes.string,
  tagline: PropTypes.string,
  cta: PropTypes.object,
};

export default ImageSection;
