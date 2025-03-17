import React from "react";
import ReservationSummary from "../ReservationSummary";
import AgentContact from "../AgentContact";
import PackageService from "../../../../../services/package.service";
import { FLOW_STAGES } from "../../../../../constants/site";

const PricesAndAgentContact = ({
  prices,
  occupancy,
  hotels,
  isSoldOutDeparture,
}) => {
  const { currency = "", finalPrice } = PackageService.prices.getPkgPrice(
    prices,
    FLOW_STAGES.PKG_DETAIL
  );
  return (
    <div className="flex flex-col gap-5">
      <ReservationSummary
        currency={currency}
        finalPrice={finalPrice}
        occupancy={occupancy}
        isSoldOutDeparture={isSoldOutDeparture}
      />
      <AgentContact />
    </div>
  );
};

export default PricesAndAgentContact;
