// components/SearchForm.jsx
import { Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { FaGlobeAmericas, FaMapMarked, FaSearch } from "react-icons/fa";

const PackageEngineItem = ({
  controllerId,
  name,
  icon,
  control,
  loadOptionsFn,
}) => (
  <div className="w-full md:w-72">
    <label className="flex gap-3 items-center mb-2 text-gray-600">
      {icon} {name}
    </label>
    <Controller
      name={controllerId}
      control={control}
      render={({ field }) => (
        <AsyncSelect
          {...field}
          placeholder="Seleccione"
          loadOptions={(query, callback) =>
            loadOptionsFn(query, callback, name)
          }
        />
      )}
    />
  </div>
);

const SearchForm = ({ control, handleSearch, loadOptions }) => (
  <form className="flex gap-3 items-end self-center" id="pkgSearchForm">
    <PackageEngineItem
      name="Destino"
      controllerId="arrivalCity"
      icon={<FaGlobeAmericas className="text-gray-400" />}
      control={control}
      loadOptionsFn={loadOptions}
    />
    <PackageEngineItem
      name="Ciudad de salida"
      controllerId="departureCity"
      icon={<FaMapMarked className="text-gray-400" />}
      control={control}
      loadOptionsFn={loadOptions}
    />
    <button
      type="button"
      onClick={handleSearch}
      className="p-2 flex gap-3 items-center bg-gray-800 text-white rounded border-1"
    >
      <FaSearch /> Buscar
    </button>
  </form>
);

export default SearchForm;
