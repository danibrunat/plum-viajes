import React from "react";

const PkgFilterItem = ({ item: { title, id, items } }) => {
  return (
    <div className="p-5 border-b-2 border-opacity-50">
      <h2>{title}</h2>
    </div>
  );
};

export default PkgFilterItem;
