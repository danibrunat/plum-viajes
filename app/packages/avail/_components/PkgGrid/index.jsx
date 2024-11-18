import PkgFilters from "../PkgFilters";
import PkgGridItem from "./PkgGridItem";

const PkgGrid = async ({ filters, availResponse, searchParams }) => {
  return (
    <section className="flex flex-col md:flex-row md:justify-between w-full gap-2 md:gap-5">
      <PkgFilters filters={filters} currentSearchParams={searchParams} />
      <div className="flex w-full p-2 md:p-0 flex-col md:w-3/4">
        {availResponse.map((pkgItem) => (
          <PkgGridItem
            key={pkgItem?.id}
            pkgItem={pkgItem}
            searchParams={searchParams}
          />
        ))}
      </div>
    </section>
  );
};

export default PkgGrid;
