import PkgGridItem from "./PkgGridItem";

const PkgGridServer = ({ availResponse }) => {
  return (
    <section className="flex flex-col md:flex-row md:justify-between items-center w-full gap-2 md:gap-5">
      <aside className="d-none md:flex md:w-1/4">Filtros</aside>
      <div className="flex w-full flex-col md:w-3/4">
        {availResponse.map((pkgItem) => (
          <PkgGridItem key={pkgItem._id} pkgItem={pkgItem} />
        ))}
      </div>
    </section>
  );
};

export default PkgGridServer;
