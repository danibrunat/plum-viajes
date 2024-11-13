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

export default function PkgDetail({ detailResponse }) {
  const provider = detailResponse?.provider;
  const departures = Array.isArray(detailResponse?.departures)
    ? detailResponse?.departures.sort((a, b) => a.date < b.date)
    : [detailResponse?.departures];
  const name = detailResponse?.title;
  const subtitle = detailResponse?.subtitle;
  const hotelsData = detailResponse?.hotelsData;
  const citiesData = detailResponse?.citiesData;
  const sliderImages = detailResponse?.images.map((image) => {
    return {
      src:
        provider === "ola"
          ? image.replace("//", "https://")
          : urlForImage(image),
    };
  });

  return (
    <div className="flex flex-col">
      <GoBackAndShare />
      <div className="flex flex-col md:flex-row md:gap-5">
        <div className="flex flex-col w-full md:w-3/4 p-3 md:p-0 my-3 gap-5">
          <h1 className="text-3xl font-bold">{name}</h1>
          <p className="text-lg ">{subtitle}</p>

          <Slider slides={sliderImages} deviceType="desktop" />
          <div className="flex w-full rounded">
            <Departures departures={departures} />
          </div>
          <div className="flex w-full rounded">
            <DepartureDetail />
          </div>
          <div className="flex flex-col w-full rounded">
            <h1 className="text-xl">Itinerario de Vuelos</h1>
            <Flights />
          </div>
          {hotelsData?.map((hotel) => (
            <div className="flex flex-col w-full rounded">
              <h2 className="text-xl">Alojamiento</h2>
              <HotelCard hotelData={hotel} />
            </div>
          ))}
          {citiesData?.map((city) => (
            <div className="flex flex-col w-full rounded">
              <h2 className="text-xl">Destino</h2>
              <DestinationCity sliderImages={sliderImages} city={city} />
            </div>
          ))}
          <div className="flex flex-col md:hidden w-full rounded">
            <h2 className="text-xl">Consultá con tu agente de viajes</h2>
            <AgentContact />
          </div>
        </div>
        <aside className="hidden md:flex md:flex-col md:w-1/4">
          <PricesAndAgentContact />
        </aside>
      </div>
    </div>
  );
}
