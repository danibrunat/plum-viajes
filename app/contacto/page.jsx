import React from "react";
import PropTypes from "prop-types";
import ContactInfo from "./ContactInfo";
import VisitUs from "./VisitUs";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contáctenos",
  description: `Dejá tu consulta`,
  alternates: {
    canonical: '/contacto',
  },
};

const Contact = (props) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-plumPrimaryPurple text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Contáctenos</h1>
          <p className="text-white/80 text-lg">
            Estamos aquí para ayudarte a planificar tu próximo viaje
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <ContactInfo />
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <VisitUs />
            </div>
          </div>

          {/* Main - Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Contact.propTypes = {};

export default Contact;
