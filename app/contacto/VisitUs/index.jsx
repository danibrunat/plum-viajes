import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

function VisitUs() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-plumPrimaryOrange/10 rounded-xl flex items-center justify-center">
          <FaMapMarkerAlt className="w-5 h-5 text-plumPrimaryOrange" />
        </div>
        <h3 className="text-lg font-semibold text-plumPrimaryPurple">Visitanos</h3>
      </div>

      {/* Dirección */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <p className="font-medium text-gray-800">Sargento Cabral 2644</p>
        <p className="text-gray-600">Local 05</p>
        <p className="text-sm text-gray-500 mt-2">Caseros, Buenos Aires</p>
      </div>

      {/* Link a mapa */}
      <a
        href="https://maps.google.com/?q=Sargento+Cabral+2644+Caseros"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 text-plumPrimaryPurple border border-plumPrimaryPurple/30 rounded-xl hover:bg-plumPrimaryPurple hover:text-white transition-all font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        Ver en Google Maps
      </a>
    </div>
  );
}

export default VisitUs;
