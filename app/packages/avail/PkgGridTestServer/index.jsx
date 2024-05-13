import PkgGridItem from "./PkgGridItem";

const PkgGridServer = ({ availResponse }) => {
  return (
    <section className="flex justify-center items-center w-full gap-5">
      <aside className="d-none md:flex md:w-1/3">This is the aside</aside>
      <div className="flex w-full md:w-2/3">
        <PkgGridItem />
        <PkgGridItem />
      </div>
    </section>
  );
};

export default PkgGridServer;
