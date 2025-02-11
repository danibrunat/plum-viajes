import usePlumPackages from "../hooks/usePlumPackages";
import AddNewPackageButton from "../AddNewPackageButton";
import FilterForm from "./FilterForm";
import PackagesTable from "./PackagesTable";
import Pagination from "./Pagination";

const PlumPackages = () => {
  const PKG_LIMIT = 15;
  const { packages, setFilters, loading, page, setPage, refresh } =
    usePlumPackages(
      {
        title: "",
        destination: "",
        operator: "",
        origin: "",
      },
      PKG_LIMIT
    );

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen w-full">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
          Gestión de Paquetes
        </h1>

        <div className="flex justify-between items-center mb-6">
          <AddNewPackageButton />
        </div>

        <FilterForm setFilters={setFilters} />

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <PackagesTable
            packages={packages}
            loading={loading}
            refreshPackages={refresh}
          />
        </div>

        <Pagination
          page={page}
          setPage={setPage}
          limit={PKG_LIMIT}
          totalRecords={packages.length}
        />
      </div>
    </div>
  );
};

export default PlumPackages;
