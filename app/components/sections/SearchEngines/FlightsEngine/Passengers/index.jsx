import React from "react";

const Passengers = ({
  showPassengersModal,
  passengers,
  setShowPassengersModal,
  updatePassenger,
}) => {
  return (
    <>
      {/* Modal selector de pasajeros */}
      <div>
        <button
          type="button"
          onClick={() => setShowPassengersModal(true)}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-gray-100 hover:bg-gray-200"
        >
          Pasajeros: {passengers.adults} Adulto(s), {passengers.children}{" "}
          Niño(s), {passengers.babies} Bebé(s)
        </button>

        {showPassengersModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-md p-6 w-80 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
                Seleccionar pasajeros
              </h2>
              <div className="space-y-4">
                {/* Adultos */}
                <div className="flex justify-between items-center">
                  <span>Adultos (+12 años)</span>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => updatePassenger("adults", -1)}
                      className="px-3 py-1 border rounded-md"
                      aria-label="Disminuir cantidad de adultos"
                    >
                      -
                    </button>
                    <span className="px-4">{passengers.adults}</span>
                    <button
                      type="button"
                      onClick={() => updatePassenger("adults", 1)}
                      className="px-3 py-1 border rounded-md"
                      aria-label="Aumentar cantidad de adultos"
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Niños */}
                <div className="flex justify-between items-center">
                  <span>Niños (+2 años)</span>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => updatePassenger("children", -1)}
                      className="px-3 py-1 border rounded-md"
                      aria-label="Disminuir cantidad de niños"
                    >
                      -
                    </button>
                    <span className="px-4">{passengers.children}</span>
                    <button
                      type="button"
                      onClick={() => updatePassenger("children", 1)}
                      className="px-3 py-1 border rounded-md"
                      aria-label="Aumentar cantidad de niños"
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Bebés */}
                <div className="flex justify-between items-center">
                  <span>Bebés (0-2 años)</span>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => updatePassenger("babies", -1)}
                      className="px-3 py-1 border rounded-md"
                      aria-label="Disminuir cantidad de bebés"
                    >
                      -
                    </button>
                    <span className="px-4">{passengers.babies}</span>
                    <button
                      type="button"
                      onClick={() => updatePassenger("babies", 1)}
                      className="px-3 py-1 border rounded-md"
                      aria-label="Aumentar cantidad de bebés"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPassengersModal(false)}
                className="w-full bg-indigo-600 text-white py-2 mt-4 rounded-md hover:bg-indigo-700"
              >
                Aceptar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Passengers;
