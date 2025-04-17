import React from "react";
import { Helpers } from "../../../../../services/helpers.service";

/**
 * Renders hotel star rating as SVG icons
 */
const getHotelRating = (rating) => {
  if (!rating) return null;
  const stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(
      <svg
        aria-hidden="true"
        className="h-5 w-5 text-yellow-300"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        key={i}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    );
  }
  return <div className="flex items-center">{stars}</div>;
};

/**
 * Converts meal plan ID to human-readable text
 */
const getHotelMealPlanName = (mealPlan) => {
  console.log("mealPlan", mealPlan);
  const mealPlans = [
    { title: "Desayuno", id: "breakfast", value: "breakfast" },
    { title: "Media Pensión", id: "halfBoard", value: "halfBoard" },
    { title: "Pensión Completa", id: "fullBoard", value: "fullBoard" },
    { title: "All Inclusive", id: "allInclusive", value: "allInclusive" },
  ];
  const selectedMealPlan = mealPlans.filter((mp) => mp.id === mealPlan);

  if (selectedMealPlan.length > 0) return selectedMealPlan[0].title;
  return mealPlan;
};

/**
 * Displays hotel information including name, rating, room type and meal plan
 */
const HotelInfo = ({ hotel, index }) => {
  const hotelStars = getHotelRating(hotel.rating);
  const hotelName = Helpers.capitalizeFirstLetter(hotel.name);
  const hotelMealPlan = getHotelMealPlanName(hotel.mealPlan);
  const hotelRoomType = Helpers.capitalizeFirstLetter(hotel.roomType);
  const hotelRoomSize = Helpers.capitalizeFirstLetter(hotel.roomSize);

  return (
    <div className={index > 0 ? "py-2 border-t" : ""}>
      <span className="flex items-center gap-1">
        {`${hotelName} `} {hotelStars}
      </span>
      {(hotelRoomType || hotelRoomSize) && (
        <span>{`Habitación: ${hotelRoomType} ${hotelRoomSize && `- ${hotelRoomSize}`}`}</span>
      )}
      {hotelMealPlan && <span>{hotelMealPlan}</span>}
    </div>
  );
};

export default HotelInfo;
