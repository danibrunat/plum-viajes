import React, { useEffect, useState } from "react";
import { Api } from "../../app/services/api.service";
import { PatchEvent, set, unset } from "sanity";

const HotelSelect = ({ value, onChange }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    const selectedHotel = hotels.find(
      (hotel) => hotel.id === Number(e.target.value)
    );

    if (selectedHotel) {
      onChange(
        PatchEvent.from(
          set({
            _key: value?._key,
            id: selectedHotel.id,
            name: selectedHotel.name,
          })
        )
      );
    } else {
      onChange(PatchEvent.from(unset()));
    }
  };

  // Fetch hotels from Next.js API
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(
          Api.hotels.get.url(),
          Api.hotels.get.options()
        );

        const data = await response.json();
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
    <select value={value?.id || ""} onChange={handleChange}>
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
