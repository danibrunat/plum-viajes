"use client";
import React, { useState } from "react";
import FormLayout from "./FormLayout";
import InputGroup from "./InputGroup";
import CheckboxGroup from "./CheckboxGroup";
import RadioGroup from "./RadioGroup";
import SearchButton from "./SearchButton";
import Passengers from "./Passengers";
import LegInputGroup from "./LegInputGroup";
import MultiTripLegContainer from "./MultitripLegContainer";

const FlightsEngine = () => {
  // Estados para viajes no multi
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [flexible, setFlexible] = useState(false);
  const [business, setBusiness] = useState(false);
  const [startDate, endDate] = dateRange;
  const [priceInUsd, setPriceInUsd] = useState(false);
  const [tripType, setTripType] = useState("roundTrip");

  // Estado para pasajeros
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    babies: 0,
  });
  const [showPassengersModal, setShowPassengersModal] = useState(false);
  const updatePassenger = (type, value) => {
    setPassengers((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + value),
    }));
  };

  // Estado para tramos en modo multi (inicia con un tramo por defecto)
  const [legs, setLegs] = useState([{ origin: "", destination: "", date: "" }]);

  const addLeg = () => {
    setLegs([...legs, { origin: "", destination: "", date: "" }]);
  };

  // Función para actualizar un tramo en particular
  const updateLeg = (index, field, value) => {
    setLegs((prevLegs) =>
      prevLegs.map((leg, i) => (i === index ? { ...leg, [field]: value } : leg))
    );
  };

  // Función para eliminar un tramo
  const removeLeg = (index) => {
    setLegs((prevLegs) => prevLegs.filter((_, i) => i !== index));
  };

  // Función para formatear fechas
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const passengersStr = `${passengers.adults}-${passengers.children}-${passengers.babies}`;
    const baseURL = "https://tucano.aereos.app/aereos/plum-viajes";
    let finalURL = "";

    if (tripType === "multi") {
      // Validación: todos los tramos deben tener sus campos completos
      for (let i = 0; i < legs.length; i++) {
        const leg = legs[i];
        if (!leg.origin || !leg.destination || !leg.date) {
          alert("Complete todos los campos en cada tramo");
          return;
        }
      }
      // Armar la parte de rutas: concatenamos cada tramo con guión (-)
      const routePart = legs
        .map((leg) => `${leg.origin},${leg.destination}`)
        .join("-");
      // Armar la parte de fechas: cada fecha formateada y separada por coma
      const datesPart = legs.map((leg) => formatDate(leg.date)).join(",");
      finalURL = `${baseURL}/multiples/${routePart}/${datesPart}/${passengersStr}/ALL/${flexible}/${business}/${priceInUsd ? "USD" : "false"}/`;
    } else {
      // Validación para roundTrip y oneWay
      if (!origin || !destination || !startDate) {
        alert("Complete los campos obligatorios");
        return;
      }
      if (tripType === "roundTrip" && !endDate) {
        alert("Para viaje de ida y vuelta se requiere la fecha de regreso");
        return;
      }
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = endDate ? formatDate(endDate) : null;
      if (tripType === "roundTrip") {
        finalURL = `${baseURL}/roundTrip/${origin}-${destination}/${formattedStartDate}_${formattedEndDate}/${passengersStr}/ALL/${flexible}/${business}/${priceInUsd ? "USD" : "false"}/`;
      } else if (tripType === "oneWay") {
        finalURL = `${baseURL}/oneWay/${origin}-${destination}/${formattedStartDate}/${passengersStr}/ALL/${flexible}/${business}/${priceInUsd ? "USD" : "false"}/`;
      }
    }
    window.location.href = finalURL;
  };

  return (
    <FormLayout onSubmit={handleSubmit}>
      {tripType === "multi" ? (
        <>
          <MultiTripLegContainer
            legs={legs}
            updateLeg={updateLeg}
            removeLeg={removeLeg}
          />
          <button
            type="button"
            onClick={addLeg}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Agregar tramo
          </button>
        </>
      ) : (
        <InputGroup
          origin={origin}
          setOrigin={setOrigin}
          destination={destination}
          setDestination={setDestination}
          dateRange={dateRange}
          setDateRange={setDateRange}
          startDate={startDate}
          endDate={endDate}
        />
      )}
      <CheckboxGroup
        flexibleDates={flexible}
        setFlexibleDates={setFlexible}
        business={business}
        setBusiness={setBusiness}
        priceInUsd={priceInUsd}
        setPriceInUsd={setPriceInUsd}
      />
      <Passengers
        setShowPassengersModal={setShowPassengersModal}
        showPassengersModal={showPassengersModal}
        passengers={passengers}
        updatePassenger={updatePassenger}
      />
      <RadioGroup tripType={tripType} setTripType={setTripType} />
      <SearchButton />
    </FormLayout>
  );
};

export default FlightsEngine;
