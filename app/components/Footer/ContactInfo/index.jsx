import React from "react";

const ContactInfo = ({ Icon, title, detail }) => {
  return (
    <div className="flex flex-col">
      <div className="flex gap-2 items-center font-bold">
        {Icon} {title}
      </div>
      <span>{detail}</span>
    </div>
  );
};

export default ContactInfo;
