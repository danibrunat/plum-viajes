"use client";
import React, { useReducer } from "react";
import FormLayout from "./FormLayout";
import InputGroup from "./InputGroup";
import OptionsPanel from "./OptionsPanel";
import SearchButton from "./SearchButton";
import Passengers from "./Passengers";
import MultiTripLegContainer from "./MultitripLegContainer";
import { formatDateToDDMMYYYY } from "../../../../helpers/dates";
import { flightsReducer, initialFlightsState, FLIGHTS_ACTIONS } from "./flightsReducer";

const FLIGHTS_BASE_URL = "https://tucano.aereos.app/aereos/plum-viajes";

const FlightsEngine = () => {
  const [state, dispatch] = useReducer(flightsReducer, initialFlightsState);
  
  const {
    origin,
    destination,
    dateRange,
    tripType,
    flexible,
    business,
    priceInUsd,
    passengers,
    showPassengersModal,
    legs,
  } = state;

  const [startDate, endDate] = dateRange;

  const buildFlightUrl = () => {
    const passengersStr = `${passengers.adults}-${passengers.children}-${passengers.babies}`;
    const optionsStr = `${flexible}/${business}/${priceInUsd ? "USD" : "false"}`;

    if (tripType === "multi") {
      const routePart = legs
        .map((leg) => `${leg.origin},${leg.destination}`)
        .join("-");
      const datesPart = legs.map((leg) => formatDateToDDMMYYYY(leg.date)).join(",");
      return `${FLIGHTS_BASE_URL}/multiples/${routePart}/${datesPart}/${passengersStr}/ALL/${optionsStr}/`;
    }

    const formattedStartDate = formatDateToDDMMYYYY(startDate);

    if (tripType === "roundTrip") {
      const formattedEndDate = formatDateToDDMMYYYY(endDate);
      return `${FLIGHTS_BASE_URL}/roundTrip/${origin}-${destination}/${formattedStartDate}_${formattedEndDate}/${passengersStr}/ALL/${optionsStr}/`;
    }

    return `${FLIGHTS_BASE_URL}/oneWay/${origin}-${destination}/${formattedStartDate}/${passengersStr}/ALL/${optionsStr}/`;
  };

  const validateForm = () => {
    if (tripType === "multi") {
      for (let i = 0; i < legs.length; i++) {
        const leg = legs[i];
        if (!leg.origin || !leg.destination || !leg.date) {
          alert("Complete todos los campos en cada tramo");
          return false;
        }
      }
      return true;
    }

    if (!origin || !destination || !startDate) {
      alert("Complete los campos obligatorios");
      return false;
    }

    if (tripType === "roundTrip" && !endDate) {
      alert("Para viaje de ida y vuelta se requiere la fecha de regreso");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    window.location.href = buildFlightUrl();
  };

  return (
    <FormLayout onSubmit={handleSubmit}>
      <div className="w-full space-y-4">
        <OptionsPanel
          tripType={tripType}
          flexible={flexible}
          business={business}
          priceInUsd={priceInUsd}
          dispatch={dispatch}
        />

        {tripType === "multi" ? (
          <div className="space-y-3">
            <MultiTripLegContainer
              legs={legs}
              dispatch={dispatch}
            />
            <button
              type="button"
              onClick={() => dispatch({ type: FLIGHTS_ACTIONS.ADD_LEG })}
              className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar tramo
            </button>
          </div>
        ) : (
          <InputGroup
            origin={origin}
            destination={destination}
            startDate={startDate}
            endDate={endDate}
            tripType={tripType}
            dispatch={dispatch}
          />
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Passengers
            passengers={passengers}
            showPassengersModal={showPassengersModal}
            dispatch={dispatch}
          />
          <SearchButton />
        </div>
      </div>
    </FormLayout>
  );
};

export default FlightsEngine;
