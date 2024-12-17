import Link from "next/link";
import React from "react";
import { FaSearch } from "react-icons/fa";

const NoResults = () => {
  return (
    <div className="flex flex-col justify-center items-center m-10 gap-5 p-5 ">
      <FaSearch className="w-full text-gray-500" size={100} />
      <p className="text-xl text-center">
        <strong>No hemos encontrado resultados.</strong> <br />
        Puede modificar su búsqueda o dejarnos su consulta:{" "}
        <Link className="text-blue-600" href={`${process.env.URL}/contacto`}>
          click aquí
        </Link>
      </p>
    </div>
  );
};

export default NoResults;
