import React from "react";

const PackageEngineItem = ({ title, icon, children }) => {
  return (
    <div className="flex flex-col gap-0 w-full md:w-1/4 md:gap-2">
      <span className="block text-center text-white">{title}</span>
      <div className="flex justify-between md:justify-center items-center">
        <div className="p-2 md:p-3">{icon}</div>
        {children}
      </div>
    </div>
  );
};

export default PackageEngineItem;
