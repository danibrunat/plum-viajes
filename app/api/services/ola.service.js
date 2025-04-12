import CACHE from "../../constants/cachePolicies";
import { ApiUtils } from "./apiUtils.service";
import { ProviderService } from "./providers.service";
import XmlService from "./xml.service";

const baseUrl = process.env.NEXT_PUBLIC_URL; // URL para Next.js o Frontend

const olaUserName = process.env.OLA_USERNAME;
const olaApiKey = process.env.OLA_API_KEY;
const olaUrl = process.env.OLA_URL;

export const OLA = {
  avail: {
    getRequest: (searchParams) => {
      const { departureCity, arrivalCity, startDate, endDate, occupancy } =
        searchParams;
      const formattedDateFrom = ProviderService.ola.olaDateFormat(startDate);
      const formattedDateTo = ProviderService.ola.olaDateFormat(endDate);

      const getPackagesFaresRequest = `
      <GetPackagesFaresRequest>
        <GeneralParameters>
          <Username>${olaUserName}</Username>
          <Password>${olaApiKey}</Password>
          <CustomerIp>186.57.221.35</CustomerIp>
        </GeneralParameters>
        <DepartureDate>
          <From>${formattedDateFrom}</From>
          <To>${formattedDateTo}</To>
        </DepartureDate>
        <Rooms>
          <Room>
            <Passenger Type="ADL"/>
            <Passenger Type="ADL"/>
          </Room>
        </Rooms>
        <DepartureDestination>${departureCity}</DepartureDestination>
        <ArrivalDestination>${arrivalCity}</ArrivalDestination>
        <FareCurrency>ARS</FareCurrency>
        <Outlet>1</Outlet>
        <PackageType>ALL</PackageType>
      </GetPackagesFaresRequest>
`;
      return getPackagesFaresRequest;
    },
    url: () => `${baseUrl}/api/providers/ola/avail`,
    options: (body, cacheKey) => {
      return {
        body: JSON.stringify(body),
        method: "POST",
        headers: ApiUtils.getCommonHeaders(),
        next: {
          revalidate: 10000,
        },
      };
    },
    name: "POST Availability | OLA",
  },
  detail: {
    url: () => `${baseUrl}/api/providers/ola/detail`,
    options: (body, cacheKey) => {
      return {
        body: JSON.stringify(body),
        method: "POST",
        headers: ApiUtils.getCommonHeaders(),
      };
    },
    name: "POST Detail | OLA",
  },
  getHotelsOla: async (request) => {
    // console.log("avail request", request);
    try {
      const url = olaUrl;
      const getHotelsOlaRequest = await XmlService.soap.request(
        url,
        request,
        "GetHotelsOla"
      );
      //console.log("getHotelsOlaRequest", getHotelsOlaRequest);
      return getHotelsOlaRequest;
    } catch (error) {
      return error;
    }
  },
  getPackagesFaresDepartureDates: async (request) => {
    // console.log("avail request", request);
    try {
      const url = olaUrl;
      const getPackagesFaresDepartureDatesRequest =
        await XmlService.soap.request(
          url,
          request,
          "GetPackagesFaresDepartureDates"
        );
      //console.log("getPackagesFaresDepartureDatesRequest", getPackagesFaresDepartureDatesRequest);
      return getPackagesFaresDepartureDatesRequest;
    } catch (error) {
      return error;
    }
  },
};
