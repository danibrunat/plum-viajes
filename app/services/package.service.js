import { CONSUMERS, FLOW_STAGES } from "../constants/site";

export const PackageService = {
  prices: {
    getPkgPrice,
  },
  hotels: {
    getMealPlanName,
  },
};

function getPkgPrice(prices, consumer) {
  if (!prices) return "Consulte";
  if (!prices.pricesDetail || prices.pricesDetail.length === 0)
    return "Consulte";
  // Podemos tener diferente política de precios según el consumer.
  if (
    consumer === FLOW_STAGES.PKG_AVAILABILITY ||
    consumer === FLOW_STAGES.PKG_DETAIL ||
    consumer === CONSUMERS.TAGGED_PKG
  ) {
    const currency = prices.pricesDetail.currency || "ARS";

    // Asegurarse de que los valores NaN se conviertan a 0
    const parseNumberSafe = (value) => {
      const parsed = parseFloat(value ?? 0);
      return isNaN(parsed) ? 0 : parsed;
    };

    const basePrice = parseNumberSafe(prices.pricesDetail?.basePrice);
    // Verificar que prices.taxes existe antes de acceder a sus propiedades
    const taxes = prices.taxes || {};
    const iva = parseNumberSafe(taxes.iva);
    const ivaAgency = parseNumberSafe(taxes.ivaAgency);
    const paisTax = parseNumberSafe(taxes.paisTax);
    const baseTax = parseNumberSafe(taxes.baseTax);
    const additionalTax = parseNumberSafe(taxes.additionalTax?.value);

    const finalPrice = Math.ceil(basePrice + iva + paisTax + baseTax);
    return {
      currency,
      finalPrice,
    };
  }
}

function getMealPlanName(mealPlanId) {
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
    return planId.includes(mealPlanId.toLowerCase())?.title;
  });
}

export default PackageService;
