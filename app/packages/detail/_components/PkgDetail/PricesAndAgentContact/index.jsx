import React from "react";
import ReservationSummary from "../ReservationSummary";
import AgentContact from "../AgentContact";
import PackageService from "../../../../../services/package.service";
import { FLOW_STAGES } from "../../../../../constants/site";

const PricesAndAgentContact = ({ prices, occupancy, hotels }) => {
  console.log("PricesAndAgentContact | hotels", hotels);
  const { currency = "", finalPrice } = PackageService.prices.getPkgPrice(
    prices,
    FLOW_STAGES.PKG_DETAIL
  );
  return (
    <div className="flex flex-col gap-5">
      <ReservationSummary
        finalPrice={finalPrice}
        currency={currency}
        occupancy={occupancy}
        hotels={hotels}
      />
      <AgentContact />
    </div>
  );
};

export default PricesAndAgentContact;
