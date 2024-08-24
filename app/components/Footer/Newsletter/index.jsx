import React from "react";
import { sanitizeHtmlString } from "../../../helpers/strings";

const Newsletter = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col justify-center text-center text-white gap-3 bg-plumPrimaryPink p-5">
      <h1 className="text-xl">{title}</h1>
      <form
        action=""
        className="flex flex-col self-center w-full md:w-1/3 text-left gap-2"
        method="post"
      >
        <label htmlFor="name">Nombre</label>
        <input type="text" id="name" />
        <label htmlFor="mail">E-Mail</label>
        <input type="text" id="mail" />

        <input type="submit" value="Enviar" />
      </form>
      <em className="text-sm">{sanitizeHtmlString(subtitle)}</em>
    </div>
  );
};

export default Newsletter;
