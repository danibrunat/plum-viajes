import { FLOW_STAGES } from "../constants/site";

const PackageService = {
  prices: {
    getPkgPrice: (prices, consumer) => {
      if (!prices) return "Consulte";
      // Podemos tener diferente política de precios según el consumer.
      if (
        consumer === FLOW_STAGES.PKG_AVAILABILITY ||
        consumer === FLOW_STAGES.PKG_DETAIL
      ) {
        console.log("prices", prices);
        const currency = prices.pricesDetail.currency || "ARS";
        const basePrice = parseFloat(prices.pricesDetail.basePrice);
        const iva = parseFloat(prices.taxes.iva);
        const ivaAgency = parseFloat(prices.taxes.ivaAgency);
        const paisTax = parseFloat(prices.taxes.paisTax);
        const baseTax = parseFloat(prices.taxes.baseTax);
        const additionalTax = parseFloat(prices.taxes.additionalTax.value);
        const finalPrice = Math.ceil(basePrice + iva + paisTax + baseTax);

        return {
          currency,
          finalPrice,
        };
      }
    },
  },
  hotels: {
    getMealPlanName: (mealPlanId) => {
      const mealPlanDictionary = [
        {
          title: "Desayuno",
          id: ["desayuno", "breakfast"],
          value: "breakfast",
        },
        {
          title: "Media Pensión",
          id: ["halfBoard"],
          value: "halfBoard",
        },
        {
          title: "Pensión Completa",
          id: ["fullBoard"],
          value: "fullBoard",
        },
        {
          title: "All Inclusive",
          id: ["allInclusive"],
          value: "allInclusive",
        },
      ];

      return mealPlanDictionary.find((plan) => {
        const planId = plan.id.map((planId) => planId.toLowerCase());
        console.log("planId", planId);
        return planId.includes(mealPlanId.toLowerCase())?.title;
      });
    },
  },
};

export default PackageService;
