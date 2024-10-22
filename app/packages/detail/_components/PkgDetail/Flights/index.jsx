import Image from "next/image";
import React from "react";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";

const Flights = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col rounded-md justify-between border-2  border-gray-400 p-5">
        <div className="flex justify-between mx-10 border-b-2 border-gray-400 py-4">
          <FaPlaneDeparture className="text-2xl" />
          <FaPlaneArrival className="text-2xl" />
        </div>
        <div className="flex justify-between text-center border-b-2 border-gray-400">
          <div className="w-1/3 p-3">
            <span>
              <strong>Buenos Aires (EZE)</strong> Sábado, 08 de febrero 05:01
            </span>
          </div>
          <div className="flex flex-col justify-center items-center w-1/3 p-3 ">
            <Image
              src={
                "https://s3.amazonaws.com/cdn1.tourvector.com/images/entidades/Jet-Smart.jpg"
              }
              width={125}
              height={70}
              alt="Logo"
            />
            Directo
          </div>

          <div className="w-1/3 p-3">
            <span>
              <strong>Rio de Janeiro (GIG)</strong> Sábado, 08 de febrero 08:05
            </span>
          </div>
        </div>
        <div className="flex justify-between text-center border-b-2 ">
          <div className="w-1/3 p-3">
            <span>
              <strong>Rio de Janeiro (GIG)</strong> Domingo, 16 de febrero 19:55
            </span>
          </div>
          <div className="flex flex-col justify-center items-center w-1/3 p-3 ">
            <Image
              src={
                "https://s3.amazonaws.com/cdn1.tourvector.com/images/entidades/Jet-Smart.jpg"
              }
              width={125}
              height={70}
              alt="Logo"
            />
            Directo
          </div>

          <div className="w-1/3 p-3">
            <span>
              <strong>Buenos Aires (EZE)</strong> Domingo, 16 de febrero 23:16
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flights;
