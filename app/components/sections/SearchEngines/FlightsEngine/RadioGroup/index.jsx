import React from "react";

const RadioGroup = ({ tripType, setTripType }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center">
        <input
          type="radio"
          name="tripType"
          value="roundTrip"
          checked={tripType === "roundTrip"}
          onChange={(e) => setTripType(e.target.value)}
          className="h-4 w-4  border-gray-300"
        />
        <span className="ml-2 text-white">Ida y vuelta</span>
      </label>
      <label className="flex items-center">
        <input
          type="radio"
          name="tripType"
          value="oneWay"
          checked={tripType === "oneWay"}
          onChange={(e) => setTripType(e.target.value)}
          className="h-4 w-4  border-gray-300"
        />
        <span className="ml-2 text-white">Solo ida</span>
      </label>
      <label className="flex items-center">
        <input
          type="radio"
          name="tripType"
          value="multi"
          checked={tripType === "multi"}
          onChange={(e) => setTripType(e.target.value)}
          className="h-4 w-4  border-gray-300"
        />
        <span className="ml-2 text-white">Multi destino</span>
      </label>
    </div>
  );
};

export default RadioGroup;
