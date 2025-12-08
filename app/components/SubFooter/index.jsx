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
            href="https://drive.google.com/file/d/1IBIthXk9ly7Y5G-1QuVPI-LeRE3hIsBF/view?pli=1"
            target="_blank"
            className="text-blue-300"
            aria-label="Ver licencia de Plum Viajes"
          >
            ver licencia
          </Link>
        </p>
        <br />
        <span className="defensaConsumidor" id="btnPieArrepentimiento">
          Me arrepentí de mi compra. Para cancelarla{" "}
          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLSc681BZJrJFI5YcFwrZ40f7x_CASmYwhIzye_Mt0qRXE7EyQA/viewform?usp=sharing&ouid=106700684850477811148"
            target="_blank"
            className="text-blue-300"
          >
            ingrese aquí
          </Link>
        </span>
        <br/>
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
       
      </div>
  );
}
