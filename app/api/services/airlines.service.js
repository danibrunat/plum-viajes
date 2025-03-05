import SanityService from "./sanity.service";

export const Airlines = {
  get: () => SanityService.getFromSanity(`*[_type == "airline"]`),
  getByCode: (code) =>
    SanityService.getFromSanity(`*[_type == "airline" && code == "${code}"]`),
};
