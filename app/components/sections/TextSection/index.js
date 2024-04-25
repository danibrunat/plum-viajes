import React from "react";
import PropTypes from "prop-types";
import SimpleBlockContent from "../../SimpleBlockContent";

function TextSection(props) {
  const { heading, label, text } = props;

  return (
    <section className="p-5">
      <h1 className={`text-2xl my-3`}>{heading}</h1>
      {text && <SimpleBlockContent blocks={text} />}
    </section>
  );
}

TextSection.propTypes = {
  heading: PropTypes.string,
  label: PropTypes.string,
  text: PropTypes.arrayOf(PropTypes.object),
};

export default TextSection;
