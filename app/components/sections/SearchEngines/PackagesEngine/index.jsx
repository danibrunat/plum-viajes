"use client";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { useEffect } from "react";
import Select from "react-select";
import {
  FaCalendar,
  FaGlobeAmericas,
  FaMapMarked,
  FaSearch,
} from "react-icons/fa";
import PackageEngineItem from "./PackageEngineItem";
import { ProviderService } from "../../../../api/services/providers.service";

const getPackageEngineItems = () => {
  const getCitiesAutocompleteApi = async (query, inputName) => {
    try {
      const cities = await fetch(
        `/api/cities/autocomplete?query=${query}&input=${inputName}`,
        {
          method: "GET",
        }
      );
      const citiesResponse = await cities.json();
      return citiesResponse;
    } catch (error) {
      return error;
    }
  };

  const loadOptions = async (query, callback, inputName) => {
    if (query.length >= 3) {
      const citiesFetch = await getCitiesAutocompleteApi(query, inputName);
      await callback(citiesFetch);
    }
  };

  const packageEngineItems = [
    {
      id: "arrivalCity",
      title: "¿Dónde querés ir?",
      name: "arrivalCity",
      icon: <FaGlobeAmericas className="text-gray-200" />,
      children: (field) => (
        <div className="w-full md:w-72">
          <AsyncSelect
            {...field}
            placeholder="Seleccione"
            loadOptions={(query, callback) =>
              loadOptions(query, callback, "arrivalCity")
            }
          />
        </div>
      ),
    },
    {
      id: "departureMonthYear",
      name: "departureMonthYear",
      title: "¿Cuándo pensás viajar?",
      icon: <FaCalendar className="text-gray-200" />,
      children: (field) => (
        <Select
          {...field}
          className="w-full p-1"
          placeholder="Seleccione"
          options={ProviderService.departureDateMonthYear()}
        />
      ),
    },
    {
      id: "departureCity",
      name: "departureCity",
      title: "¿Desde qué ciudad partís?",
      icon: <FaMapMarked className="text-gray-200" />,
      children: (field) => (
        <AsyncSelect
          {...field}
          className="w-full p-1"
          placeholder="Seleccione"
          loadOptions={(query, callback) =>
            loadOptions(query, callback, "departureCity")
          }
        />
      ),
    },
  ];

  return packageEngineItems;
};

const generateAvailUrl = (product, searchData) => {
  const arrivalCity = searchData["arrivalCity"].value;
  const departureCity = searchData["departureCity"].value;
  const departureFromTo = ProviderService.departureDateFromTo(
    searchData["departureMonthYear"].value
  );
  const availUrl = `/${product}/avail?arrivalCity=${arrivalCity}&departureCity=${departureCity}&dateFrom=${departureFromTo.dateFrom}&dateTo=${departureFromTo.dateTo}`;

  return availUrl;
};

const FormSubmitButton = () => {
  return (
    <div className="flex w-full items-center justify-center md:w-1/4 ">
      <div className="flex p-3 w-auto transition ease-in-out delay-50 rounded hover:-translate-y-1 hover:scale-110 hover:bg-plumPrimaryOrange duration-300">
        <button
          className="flex gap-2 items-center text-white"
          aria-label="Buscar paquetes"
          type="submit"
        >
          <FaSearch className="text-gray-200" /> Buscar Paquetes
        </button>
      </div>
    </div>
  );
};

export default function PackagesEngine({ defaultValues = {} }) {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm(defaultValues);
  const router = useRouter();

  useEffect(() => {
    reset({
      arrivalCity: defaultValues.arrivalCity,
      departureCity: defaultValues.departureCity,
      departureMonthYear: defaultValues.departureMonthYear,
    });
  }, []);

  function handlePkgSearch(data) {
    const packagesAvailUrl = generateAvailUrl("packages", data);
    router.push(packagesAvailUrl);
  }

  const renderFormItems = () => {
    const packageEngineItems = getPackageEngineItems();
    return packageEngineItems.map((item) => {
      return (
        <PackageEngineItem key={item.id} title={item.title} icon={item.icon}>
          <Controller
            name={item.name}
            control={control}
            render={({ field }) => item.children(field)}
          />
        </PackageEngineItem>
      );
    });
  };

  const formItems = renderFormItems();

  return (
    <form
      className="flex flex-col md:flex-row justify-center items-center gap-3 px-2"
      onSubmit={handleSubmit(handlePkgSearch)}
      id="pkgSearchForm"
    >
      {formItems}
      <FormSubmitButton />
    </form>
  );
}
