"use client";
import React, { useState } from "react";
import FormLayout from "./FormLayout";
import InputGroup from "./InputGroup";
import CheckboxGroup from "./CheckboxGroup";
import RadioGroup from "./RadioGroup";
import SearchButton from "./SearchButton";
import Passengers from "./Passengers";

const FlightsEngine = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [flexible, setFlexible] = useState(false);
  const [business, setBusiness] = useState(false);
  const [startDate, endDate] = dateRange;
  const [priceInUsd, setPriceInUsd] = useState(false);
  const [tripType, setTripType] = useState("roundTrip");

  // Estados para pasajeros
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    babies: 0,
  });
  const [showPassengersModal, setShowPassengersModal] = useState(false);

  // Función para actualizar pasajeros
  const updatePassenger = (type, value) => {
    setPassengers((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + value),
    }));
  };

  // Función para armar la URL final y redireccionar
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("origin", origin);
    console.log("destination", destination);
    console.log("startDate", startDate);
    console.log("endDate", endDate);
    console.log("flexibleDates", flexible);
    console.log("business", business);
    console.log("priceInUsd", priceInUsd);
    console.log("tripType", tripType);

    if (!origin || !destination || !startDate || !endDate) {
      alert("Complete los campos obligatorios");
      return;
    }

    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = endDate ? formatDate(endDate) : null;

    const passengersStr = `${passengers.adults}-${passengers.children}-${passengers.babies}`;
    const baseURL = "https://carnival.aereos.app/aereos/plum-viajes";
    let finalURL = "";

    if (tripType === "roundTrip") {
      if (!formattedEndDate) {
        alert("Para viaje de ida y vuelta se requiere la fecha de regreso");
        return;
      }
      finalURL = `${baseURL}/roundTrip/${origin}-${destination}/${formattedStartDate}_${formattedEndDate}/${passengersStr}/ALL/${flexible}/${business}/${priceInUsd}/`;
    } else if (tripType === "oneWay") {
      finalURL = `${baseURL}/oneWay/${origin}-${destination}/${formattedStartDate}/${passengersStr}/ALL/${flexible}/${business}/${priceInUsd}/`;
    } else if (tripType === "multi") {
      if (!formattedEndDate) {
        alert("Para Multi destino se requiere ambas fechas");
        return;
      }
      finalURL = `${baseURL}/multiples/${origin},${destination}-${destination},${origin}/${formattedStartDate},${formattedEndDate}/${passengersStr}/ALL/${flexible}/${business}/${priceInUsd}/`;
    }

    window.location.href = finalURL;
  };

  return (
    <FormLayout onSubmit={handleSubmit}>
      <InputGroup
        origin={origin}
        setOrigin={setOrigin}
        destination={destination}
        setDestination={setDestination}
        setDateRange={setDateRange}
        startDate={startDate}
        endDate={endDate}
        dateRange={dateRange}
      />
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
