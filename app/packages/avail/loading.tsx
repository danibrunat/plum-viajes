import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex p-5 justify-center items-center text-center">
      <div className="flex flex-col gap-3 text-center">
        <Image
          alt="loading..."
          width={250}
          height={250}
          className="align-middle self-center"
          src={`/images/avail-loader.gif`}
        />
        <h1 className="text-xl">Buscando los mejores paquetes para vos...</h1>
      </div>
    </div>
  );
}
