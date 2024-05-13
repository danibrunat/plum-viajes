import React, { Suspense } from "react";
import { sanityFetch } from "../../../sanity/lib/sanityFetch";
import groq from "groq";
import SearchEngines from "../../components/sections/SearchEngines";
import PkgGridServer from "./PkgGridTestServer";
import { departureDateMonths } from "../../constants/searchEngines";

async function getCity(code) {
  try {
    const citiesSearch = await fetch(
      `http://localhost:3000/api/cities/byCode?code=${code}`,
      { method: "GET", cache: "no-cache" }
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

const delay = (time) => new Promise((res) => setTimeout(res, time));

const PackagesAvailability = async ({ searchParams }) => {
  const { arrivalCity, departureCity, departureDate } = searchParams;
  const pkgAvailQuery = groq`*[_type == "packages" 
  && "${departureCity}" in origin
  && "${arrivalCity}" in destination
  && now() > validDateFrom 
  && now() < validDateTo
 ] {
  ...,
  departures[departureDateRt1 >= now()]
 }`;
  const searchEngineDefaultValues = {
    packages: {
      departureDate: departureDateMonths.filter(
        (ddm) => ddm.value === searchParams.departureDate
      ),
      arrivalCity: await getCity(searchParams.arrivalCity),
      departureCity: await getCity(searchParams.departureCity),
    },
  };
  const sanityQuery = await sanityFetch({ query: pkgAvailQuery });
  const pkgAvailResponse = await sanityQuery;

  await delay(3000);

  return (
    <>
      <SearchEngines
        packages={true}
        defaultValues={searchEngineDefaultValues}
      />
      <Suspense fallback={<p>Cargando pkg grid</p>}>
        <PkgGridServer availResponse={pkgAvailResponse} />
      </Suspense>
    </>
  );
};

export default PackagesAvailability;
