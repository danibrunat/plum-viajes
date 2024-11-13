import PkgFilters from "../PkgFilters";
import PkgGridItem from "./PkgGridItem";

const filters = [
  /* {
    id: "productType",
    title: "Producto",
    type: "checkbox",
    items: [],
    grouper: "productType",
  },
  {
    id: "transportation",
    title: "Transporte",
    type: "checkbox",
    items: [],
    grouper: "transportation",
  }, */
  {
    id: "mealPlan",
    title: "Régimen de Comidas",
    type: "checkbox",
    items: [],
    grouper: "mealPlan",
  },
  {
    id: "nights",
    title: "Cantidad de noches",
    type: "checkbox",
    items: [],
    grouper: "nights",
  },
  {
    id: "rating",
    title: "Estrellas",
    type: "checkbox",
    items: [],
    grouper: "rating",
  },
  {
    id: "hotel",
    title: "Alojamiento",
    type: "checkbox",
    items: [],
    grouper: "hotel",
  },
];

const PkgGrid = ({ availResponse, searchParams }) => {
  const hydratedFilters = filters;
  return (
    <section className="flex flex-col md:flex-row md:justify-between w-full gap-2 md:gap-5">
      <PkgFilters filters={hydratedFilters} />
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
