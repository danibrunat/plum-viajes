import React, { Suspense } from "react";
import SearchEngines from "../../components/sections/SearchEngines";
import PkgGridServer from "./PkgGridTestServer";
import { departureDateMonths } from "../../constants/searchEngines";
import PkgGridHeader from "./PkgGridTestServer/PkgGridHeader";
import Loading from "../../components/commons/Loading";

export const metadata = {
  title: "Paquetes | Plum Viajes",
  keywords: "Paquetes Plum Viajes El mejor precio para tu viaje",
};

async function getCity(code) {
  try {
    const citiesSearch = await fetch(
      `${process.env.URL}/api/cities/byCode?code=${code}`,
      {
        method: "GET",
        //cache: "no-cache",
      }
    );
    const citiesResponse = await citiesSearch.json();

    const mapResponse = citiesResponse.map(
      ({ id, name, label, countryName }) => ({
        id,
        name,
        label: `${label}, ${countryName}`,
        value: id,
      })
    );

    return mapResponse;
  } catch (error) {
    return { error: error.message };
  }
}

async function getPkgAvailability(searchParams) {
  const pkgAvailabilityRequest = await fetch(
    `${process.env.URL}/api/packages/availability`,
    { method: "POST", body: JSON.stringify({ searchParams }) }
  );

  if (!pkgAvailabilityRequest.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return pkgAvailabilityRequest.json();
}

const PackagesAvailability = async ({ searchParams }) => {
  const { arrivalCity, departureCity, departureDate } = searchParams;

  const searchEngineDefaultValues = {
    packages: {
      departureDate: departureDateMonths.filter(
        (ddm) => ddm.value === departureDate
      ),
      arrivalCity: await getCity(arrivalCity),
      departureCity: await getCity(departureCity),
    },
  };

  const pkgAvailabilityResponse = await getPkgAvailability(searchParams);

  return (
    <>
      <SearchEngines
        packages={true}
        defaultValues={searchEngineDefaultValues}
      />
      <div className="mx-2 py-2 md:py-5 md:mx-40">
        <PkgGridHeader searchParams={searchParams} />
        <PkgGridServer
          availResponse={pkgAvailabilityResponse}
          searchParams={searchParams}
        />
      </div>
    </>
  );
};

export default PackagesAvailability;
