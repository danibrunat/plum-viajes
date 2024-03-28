import React from "react";
import Link from "next/link";
import { getPathFromSlug, slugParamToPath } from "../../../utils/urls";
import SocialLinks from "./SocialLinks";
import ContactInfo from "./ContactInfo";
import {
  FaClock,
  FaMailBulk,
  FaMap,
  FaMapMarked,
  FaMarker,
  FaPhone,
  FaWhatsapp,
} from "react-icons/fa";
import Newsletter from "./Newsletter";
import { openModalBase } from "../../helpers/modals";

const contactInfo = [
  {
    id: "address",
    icon: <FaMapMarked />,
    title: "Dirección",
    detail: "Sargento Cabral 2644 Loc 05",
  },
  {
    id: "workingTime",
    icon: <FaClock />,
    title: "Horarios",
    detail: "Lunes a viernes de: 09:00 a 18:00 hs Sábados de 10:00 a 13:00 hs",
  },
  {
    id: "phone",
    icon: <FaPhone />,
    title: "Teléfono",
    detail: "+54 9 11 7079 7586",
  },
  {
    id: "whatsapp",
    icon: <FaWhatsapp />,
    title: "Whatsapp",
    detail: "5491130875513",
  },
  {
    id: "mail",
    icon: <FaMailBulk />,
    title: "E-mail",
    detail: "ventas@plumviajes.com.ar",
  },
];

export default function Footer(props) {
  const { navItems, text } = props;
  return (
    <footer className=" bg-plumPrimaryBlue border-b-2 text-white">
      <Newsletter />
      <div className="flex flex-col md:flex-row p-4">
        <div className="flex gap-2 justify-center p-4 text-xl w-full md:w-1/3">
          <SocialLinks />
        </div>
        <ul className="flex flex-col w-full items-center gap-2 md:gap-10 md:w-2/3 md:flex-row ">
          {navItems &&
            navItems.map((item) => {
              return (
                <li
                  key={item._id}
                  className="flex justify-center p-3 border-b-2 border-blue-500"
                >
                  <Link href={getPathFromSlug(item.slug.current)}>
                    {item.title}
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
      <div className="flex flex-col md:flex-row w-full justify-normal md:justify-around text-md bg-plumSecondaryBlue">
        <div className="flex p-8 flex-col gap-4">
          <h1 className="text-xl">Dónde encontrarnos</h1>
          {contactInfo.map((ci) => (
            <ContactInfo
              Icon={ci.icon}
              key={ci.id}
              title={ci.title}
              detail={ci.detail}
            />
          ))}
        </div>
        <div className="flex items-center">
          <iframe
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fplumviajes&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
            className=" my-3 mx-3 w-[380px] h-[500px]"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
            frameBorder="0"
            loading="lazy"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          ></iframe>
        </div>
      </div>
    </footer>
  );
}
