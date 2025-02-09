// src/components/PlumPackages/PlumPackages.jsx
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
    <div className="p-6 bg-gray-100 min-h-screen w-full">
      <h1 className="text-2xl font-bold mb-4">Gestión de Paquetes</h1>

      {/* Botón para crear un nuevo paquete */}
      <AddNewPackageButton />
      <FilterForm setFilters={setFilters} />

      <PackagesTable
        packages={packages}
        loading={loading}
        refreshPackages={refresh}
      />

      <Pagination
        page={page}
        setPage={setPage}
        limit={PKG_LIMIT}
        totalRecords={packages.length}
      />
    </div>
  );
};

export default PlumPackages;
