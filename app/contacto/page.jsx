import React from "react";
import PropTypes from "prop-types";
import ContactInfo from "./ContactInfo";
import VisitUs from "./VisitUs";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contáctenos",
  description: `Dejá tu consulta`,
};

const Contact = (props) => {
  return (
    <div className="flex flex-col gap-3 ">
      <h1 className="text-2xl p-4">Contáctenos</h1>
      <div className="flex flex-col md:flex-row md:justify-center">
        <div className="flex flex-col">
          <div className="flex flex-col gap-2 m-3 p-3 border-2 rounded-xl">
            <ContactInfo />
          </div>
          <div className="flex flex-col gap-2 m-3 p-3 border-2 rounded-xl">
            <VisitUs />
          </div>
        </div>
        <div className="flex flex-col gap-2 m-3 p-3 border-2 rounded-xl">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

Contact.propTypes = {};

export default Contact;
