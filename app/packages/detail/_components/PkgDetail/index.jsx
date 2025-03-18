import GoBackAndShare from "./GoBackAndShare";
import { urlForImage } from "../../../../../sanity/lib/image";
import Slider from "../../../../components/commons/Slider";
import Departures from "./Departures";
import DepartureDetail from "./DepartureDetail";
import Flights from "./Flights";
import HotelCard from "./HotelCard";
import DestinationCity from "./DestinationCity";
import AgentContact from "./AgentContact";
import PricesAndAgentContact from "./PricesAndAgentContact";
import { ProviderService } from "../../../../api/services/providers.service";

export default function PkgDetail({ detailResponse, searchParams }) {
  const provider = detailResponse?.provider;
  const name = detailResponse?.title;
  const occupancy = ProviderService.getRoomsConfig(searchParams.occupancy);
  const departureDate = searchParams.startDate;
  const departureCity = searchParams.departureCity;
  const description = detailResponse?.description;
  const nights = detailResponse?.nights;
  const hotels = detailResponse?.departures[0]?.hotels;
  console.log("hotels detail", hotels);
  const hotelsData = detailResponse?.hotelsData;
  const citiesData = detailResponse?.citiesData;
  const flights = detailResponse?.departures[0].flights;
  console.log("detailResponse?.departures[0]", detailResponse?.departures[0]);
  const isSoldOutDeparture = detailResponse?.departures[0]?.seats === 0;
  const prices = detailResponse?.departures[0]?.prices;
  const sliderImages = detailResponse?.images?.map(({ sourceUrl }) => {
    return {
      src:
        provider === "ola"
          ? sourceUrl.replace("//", "https://")
          : urlForImage(sourceUrl),
    };
  });

  return (
    <div className="flex flex-col">
      <GoBackAndShare />
      <div className="flex flex-col md:flex-row md:gap-5">
        <div className="flex flex-col w-full md:w-3/4 p-3 md:p-0 my-3 gap-5">
          <h1 className="text-3xl font-bold">{name}</h1>
          {isSoldOutDeparture && (
            <span className="rounded-full bg-red-600 px-2 text-center text-sm font-medium text-white">
              Agotado
            </span>
          )}
          <span className=" text-sm uppercase">
            {nights} noches desde {departureCity}
          </span>
          <Slider slides={sliderImages} deviceType="desktop" />
          <div className="flex w-full rounded">
            <Departures searchParams={searchParams} />
          </div>
          <div className="flex w-full rounded">
            <DepartureDetail
              description={description}
              departureDate={departureDate}
              hotels={hotels}
              roomConfig={occupancy}
            />
          </div>
          <div className="flex flex-col w-full rounded">
            <h1 className="text-xl">Itinerario de Vuelos</h1>
            <Flights flights={flights} />
          </div>
          {hotelsData?.map((hotel) => (
            <div key={Math.random()} className="flex flex-col w-full rounded">
              <h2 className="text-xl">Alojamiento</h2>
              <HotelCard hotelData={hotel} />
            </div>
          ))}
          {citiesData?.map((city) => (
            <div key={Math.random()} className="flex flex-col w-full rounded">
              <h2 className="text-xl">Destino</h2>
              <DestinationCity sliderImages={sliderImages} city={city} />
            </div>
          ))}
          <div className="flex flex-col md:hidden w-full rounded">
            <h2 className="text-xl">Consultá con tu agente de viajes</h2>
            <AgentContact />
          </div>
        </div>
        <aside className="flex flex-col w-full md:w-1/4">
          <PricesAndAgentContact
            prices={prices}
            occupancy={occupancy}
            hotels={hotels}
            isSoldOutDeparture={isSoldOutDeparture}
          />
        </aside>
      </div>
    </div>
  );
}
