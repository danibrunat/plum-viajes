import React from "react";
import LandingGridItem from "../LandingGridItem";

export default function LandingGrid({ product, landingData }) {
  return (
    <div className="grid gap-2 grid-cols-2 md:gap-3 md:grid-cols-6 mb-12 p-2">
      {landingData.map((destination) => (
        <div className="p-2" key={Math.random()}>
          <LandingGridItem product={product} destination={destination} />
        </div>
      ))}
    </div>
  );
}
