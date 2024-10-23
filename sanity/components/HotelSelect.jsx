// components/HotelSelect.js
import React, { useEffect, useState } from "react";

const HotelSelect = ({ value, onChange }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch hotels from Next.js API
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        /* const response = await fetch(
          PlumApi.hotels.get.url(),
          PlumApi.hotels.get.options()
        );

        const data = await response.json(); */

        setHotels(data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) {
    return <p>Loading hotels...</p>;
  }

  return (
    <select
      value={value?.id || ""}
      onChange={(e) => {
        const selectedHotel = hotels.find(
          (hotel) => hotel.id === e.target.value
        );
        onChange(
          selectedHotel
            ? { _type: "hotel", id: selectedHotel.id, name: selectedHotel.name }
            : undefined
        );
      }}
    >
      <option value="">Select a hotel</option>
      {hotels.map((hotel) => (
        <option key={hotel.id} value={hotel.id}>
          {hotel.name}
        </option>
      ))}
    </select>
  );
};

export default HotelSelect;
