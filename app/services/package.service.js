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
        const currency = prices.pricesDetail.currency;
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
};

export default PackageService;
