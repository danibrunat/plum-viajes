import React, { Fragment } from "react";
import PropTypes from "prop-types";
import * as SectionComponents from "./sections";
import capitalizeString from "../../utils/capitalizeString";

function resolveSections(section) {
  const Section = SectionComponents[capitalizeString(section._type)];

  if (Section) {
    return Section;
  }

  console.error("Cant find section", section);
  return null;
}

function RenderSections(props) {
  const { sections } = props;

  if (!sections) {
    console.error("Missing section");
    return <div>Missing sections</div>;
  }

  return (
    <main>
      {sections.map((section, i) => {
        const SectionComponent = resolveSections(section);
        if (!SectionComponent) {
          return (
            <div key={section._key || i}>Missing section {section._type}</div>
          );
        }
        return (
          <div className="p-3 md:p-0 flex flex-col gap-2">
            <SectionComponent {...section} key={section._key} />
          </div>
        );
      })}
    </main>
  );
}

RenderSections.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      _type: PropTypes.string,
      _key: PropTypes.string,
      section: PropTypes.instanceOf(PropTypes.object),
    })
  ),
};

export default RenderSections;
