import React from "react";
import LegInputGroup from "../LegInputGroup";

const MultiTripLegContainer = ({ legs, dispatch }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white/80">Tramos del viaje</h3>
      <div className="space-y-3">
        {legs.map((leg, index) => (
          <LegInputGroup
            key={index}
            index={index}
            leg={leg}
            dispatch={dispatch}
            canRemove={legs.length > 1}
          />
        ))}
      </div>
    </div>
  );
};

export default MultiTripLegContainer;
