import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function SubFooter() {
  return (
    <div className="flex-1 flex-col md:flex-row p-5 text-sm bg-plumPrimaryPurple">
        <p>
          <Link
            className="fiscal"
            href="http://qr.afip.gob.ar/?qr=xDw61Q_xW_agsSKRU95oww,,"
            target="_F960AFIPInfo"
            rel="noopener noreferrer"
            aria-label="Ver datos fiscales en AFIP"
          >
            <Image
              src="https://www.afip.gob.ar/images/f960/DATAWEB.jpg"
              alt="Datos fiscales AFIP"
              width={60}
              height={60}
            />
          </Link>
        </p>
        <p>
          Plum Viajes - Legajo 18.156 -&nbsp;
          <Link
            href="#"
            target="_blank"
            className="text-blue-300"
            aria-label="Ver licencia de Plum Viajes"
          >
            ver licencia
          </Link>
        </p>
        <br />
        {/* <span className="defensaConsumidor" id="btnPieArrepentimiento">
          Me arrepentí de mi compra. Para cancelarla{" "}
          <Link
            href="/solicitar-cancelacion.php"
            target="_blank"
            className="text-blue-300"
          >
            ingrese aquí
          </Link>
        </span> */}
        <span className="defensaConsumidor" id="btnPieConsumidor">
          Defensa del consumidor. Para reclamos{" "}
          <Link
            href="https://www.argentina.gob.ar/produccion/defensadelconsumidor/formulario"
            target="_blank"
            prefetch={false}
            className="text-blue-300"
          >
            ingrese aquí
          </Link>
        </span>
        <br />
        <span className="defensaConsumidor" id="btnPieDenuncia">
          Denuncia contra una agencia. Para reclamos{" "}
          <Link
            href="https://www.argentina.gob.ar/servicio/presentar-una-denuncia-contra-una-agencia-de-viajes"
            prefetch={false}
            target="_blank"
            className="text-blue-300"
          >
            ingrese aquí
          </Link>
        </span>
      </div>
  );
}
