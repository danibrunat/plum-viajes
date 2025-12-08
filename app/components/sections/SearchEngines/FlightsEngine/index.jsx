"use client";
import React, { useReducer, useState } from "react";
import FormLayout from "./FormLayout";
import InputGroup from "./InputGroup";
import OptionsPanel from "./OptionsPanel";
import SearchButton from "./SearchButton";
import Passengers from "./Passengers";
import MultiTripLegContainer from "./MultitripLegContainer";
import { formatDateToDDMMYYYY } from "../../../../helpers/dates";
import { flightsReducer, initialFlightsState, FLIGHTS_ACTIONS } from "./flightsReducer";
import { validateFlightSearch, getFirstError } from "./flightsValidation";

const FLIGHTS_BASE_URL = "https://tucano.aereos.app/aereos/plum-viajes";

const FlightsEngine = () => {
  const [state, dispatch] = useReducer(flightsReducer, initialFlightsState);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  
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

  // Limpiar error de un campo específico cuando cambia
  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    if (generalError) setGeneralError(null);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

    // Preparar datos para validación según el tipo de viaje
    const dataToValidate = {
      tripType,
      flexible,
      business,
      priceInUsd,
      passengers,
      ...(tripType === "multi"
        ? { legs: legs.map((leg) => ({ ...leg, date: leg.date ? new Date(leg.date) : undefined })) }
        : {
            origin,
            destination,
            startDate: startDate || undefined,
            ...(tripType === "roundTrip" && { endDate: endDate || undefined }),
          }),
    };

    const validation = validateFlightSearch(dataToValidate);

    if (!validation.success) {
      setErrors(validation.errors);
      setGeneralError(getFirstError(validation.errors));
      return;
    }

    window.location.href = buildFlightUrl();
  };

  return (
    <FormLayout onSubmit={handleSubmit}>
      <div className="w-full space-y-4">
        {/* Mensaje de error general */}
        {generalError && (
          <div className="bg-red-500/20 border border-red-400 text-red-100 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{generalError}</span>
          </div>
        )}

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
              errors={errors}
              clearFieldError={clearFieldError}
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
            errors={errors}
            clearFieldError={clearFieldError}
          />
        )}

        {/* Footer con Pasajeros y Botón de búsqueda */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
          <Passengers
            passengers={passengers}
            showPassengersModal={showPassengersModal}
            dispatch={dispatch}
            errors={errors}
          />
          <SearchButton />
        </div>
      </div>
    </FormLayout>
  );
};

export default FlightsEngine;
