import XmlService from "./xml.service";

export const OLA = {
  avail: async (request) => {
    // console.log("avail request", request);
    try {
      const url = process.env.OLA_URL;
      const avail = await XmlService.soap.request(
        url,
        request,
        "GetPackagesFares"
      );
      //console.log("avail", avail);
      return avail;
    } catch (error) {
      return error;
    }
  },
};
