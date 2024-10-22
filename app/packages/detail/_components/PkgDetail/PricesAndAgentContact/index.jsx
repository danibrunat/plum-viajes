import React from "react";
import ReservationSummary from "../ReservationSummary";
import AgentContact from "../AgentContact";

const PricesAndAgentContact = () => {
  return (
    <div className="flex flex-col gap-5">
      <ReservationSummary />
      <AgentContact />
    </div>
  );
};

export default PricesAndAgentContact;
