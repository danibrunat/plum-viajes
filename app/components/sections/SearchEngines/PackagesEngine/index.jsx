import { FaSearch } from "react-icons/fa";
import PackageEngineItem from "./PackageEngineItem";
import { packageEngineItems } from "../../../../constants/searchEngines";

export default function PackagesEngine() {
  return (
    <form className="flex flex-col md:flex-row justify-center items-center gap-3 px-2">
      {packageEngineItems.map((item) => (
        <PackageEngineItem key={item.id} title={item.title} icon={item.icon}>
          {item.children}
        </PackageEngineItem>
      ))}

      <div className="flex w-full items-center justify-center md:w-1/4 ">
        <div className="flex p-3 w-auto transition ease-in-out delay-50 rounded hover:-translate-y-1 hover:scale-110 hover:bg-red-400 duration-300">
          <button className="flex gap-2 items-center text-white" type="submit">
            <FaSearch className="text-gray-200" /> Buscar Paquetes
          </button>
        </div>
      </div>
    </form>
  );
}
