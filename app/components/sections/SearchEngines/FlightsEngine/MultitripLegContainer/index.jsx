import React from "react";
import LegInputGroup from "../LegInputGroup";

const MultiTripLegContainer = ({ legs, updateLeg, removeLeg }) => {
  return (
    <div className="flex-1 flex-col space-y-3">
      {legs.map((leg, index) => (
        <LegInputGroup
          key={index}
          index={index}
          leg={leg}
          updateLeg={updateLeg}
          removeLeg={legs.length > 1 ? removeLeg : null}
        />
      ))}
    </div>
  );
};

export default MultiTripLegContainer;
