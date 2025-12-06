import React from "react";
import { FLIGHTS_ACTIONS } from "../flightsReducer";

const PassengerCounter = ({ label, ageRange, count, onUpdate }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
    <div>
      <span className="font-medium text-gray-800">{label}</span>
      <span className="block text-xs text-gray-500">{ageRange}</span>
    </div>
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onUpdate(-1)}
        disabled={count === 0 && label !== "Adultos"}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label={`Disminuir cantidad de ${label.toLowerCase()}`}
      >
        −
      </button>
      <span className="w-8 text-center font-semibold text-gray-800">{count}</span>
      <button
        type="button"
        onClick={() => onUpdate(1)}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label={`Aumentar cantidad de ${label.toLowerCase()}`}
      >
        +
      </button>
    </div>
  </div>
);

const Passengers = ({
  showPassengersModal,
  passengers,
  dispatch,
}) => {
  const totalPassengers = passengers.adults + passengers.children + passengers.babies;

  const handleUpdatePassenger = (passengerType, value) => {
    dispatch({
      type: FLIGHTS_ACTIONS.UPDATE_PASSENGER,
      payload: { passengerType, value },
    });
  };

  const toggleModal = (value) => {
    dispatch({ type: FLIGHTS_ACTIONS.TOGGLE_PASSENGERS_MODAL, payload: value });
  };

  return (
    <div className="relative flex-1 sm:flex-none">
      <button
        type="button"
        onClick={() => toggleModal(!showPassengersModal)}
        className="w-full sm:w-auto px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 flex items-center justify-between gap-3 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-gray-700 font-medium">
            {totalPassengers} {totalPassengers === 1 ? "Pasajero" : "Pasajeros"}
          </span>
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${showPassengersModal ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Modal de pasajeros */}
      {showPassengersModal && (
        <>
          {/* Overlay para cerrar al hacer click afuera */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => toggleModal(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 sm:right-auto mt-2 w-full sm:w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Pasajeros</h3>
              
              <PassengerCounter
                label="Adultos"
                ageRange="+12 años"
                count={passengers.adults}
                onUpdate={(value) => handleUpdatePassenger("adults", value)}
              />
              <PassengerCounter
                label="Niños"
                ageRange="2-11 años"
                count={passengers.children}
                onUpdate={(value) => handleUpdatePassenger("children", value)}
              />
              <PassengerCounter
                label="Bebés"
                ageRange="0-2 años"
                count={passengers.babies}
                onUpdate={(value) => handleUpdatePassenger("babies", value)}
              />
            </div>
            
            <div className="px-4 py-3 bg-gray-50 border-t">
              <button
                type="button"
                onClick={() => toggleModal(false)}
                className="w-full py-2 bg-plumPrimaryPurple text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Passengers;
