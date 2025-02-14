import crypto from "crypto";

const CryptoService = {
  encrypt: (data) => {
    return crypto.createHash("md5").update(data).digest("hex");
  },
  generateDepartureId: (provider, departureDate) => {
    return CryptoService.encrypt(`${provider}-${departureDate}`);
  },
};

export default CryptoService;
