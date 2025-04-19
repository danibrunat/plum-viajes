import Image from "next/image";

export default function Loading({
  message = "Buscando los mejores paquetes para vos...",
}) {
  return (
    <div className="flex p-5 justify-center items-center text-center">
      <div className="flex flex-col gap-3 text-center">
        <Image
          width={250}
          height={250}
          alt="loading..."
          className="align-middle self-center"
          src={`/images/avail-loader.gif`}
        />
        {message && <h1 className="text-xl">{message}</h1>}
      </div>
    </div>
  );
}
