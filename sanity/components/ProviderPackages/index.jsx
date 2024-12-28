// pages/ProviderPackages.jsx
import React from "react";
import { useForm } from "react-hook-form";
import SearchForm from "./SearchForm";
import PackageList from "./PackageList";
import TagModal from "./TagModal";
import { useProviderPackages } from "../hooks/useProviderPackages";
import { loadOptions } from "../../services/cityService";

const ProviderPackages = () => {
  const { watch, control } = useForm();
  const formWatch = watch();
  const {
    packages,
    open,
    selectedPackage,
    availableTags,
    selectedTags,
    selectedProviders,
    isLoading, // Añadir estado de carga
    setOpen,
    setSelectedPackage,
    handleSearch,
    handleTagAssign,
    handleTagSave,
    handleProviderChange,
  } = useProviderPackages(formWatch);

  return (
    <div className="flex flex-col p-5 mx-auto w-full">
      <SearchForm
        control={control}
        handleSearch={handleSearch}
        loadOptions={loadOptions}
      />
      {isLoading ? (
        <div className="flex justify-center items-center h-64 my-10">
          <img src="/avail-loader.gif" alt="Cargando..." />
        </div>
      ) : (
        <PackageList
          packages={packages}
          onTagClick={(pkg) => setSelectedPackage(pkg) || setOpen(true)}
        />
      )}
      <TagModal
        isOpen={open}
        onClose={() => setOpen(false)}
        selectedPackage={selectedPackage}
        availableTags={availableTags}
        selectedTags={selectedTags}
        onTagChange={handleTagAssign}
        onSave={handleTagSave}
      />
    </div>
  );
};

export default ProviderPackages;
