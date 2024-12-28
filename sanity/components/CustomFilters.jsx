import React, { useState, useEffect } from "react";
import { client } from "../lib/client";

const CustomFilters = () => {
  const [packages, setPackages] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    fetchPackages();
  }, [selectedProvider, selectedTag]);

  const fetchPackages = async () => {
    const query = `*[_type == "taggedPackages" ${
      selectedProvider ? `&& provider == "${selectedProvider}"` : ""
    } ${selectedTag ? `&& "${selectedTag}" in tags[]->title` : ""}]`;
    const results = await client.fetch(query);
    setPackages(results);
  };

  return (
    <div>
      <h2>Filtros Personalizados</h2>
      <div>
        <label>Proveedor:</label>
        <input
          type="text"
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
        />
      </div>
      <div>
        <label>Tag:</label>
        <input
          type="text"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        />
      </div>
      <div>
        <h3>Resultados:</h3>
        <ul>
          {packages.map((pkg) => (
            <li key={pkg._id}>
              {pkg.title} - {pkg.provider} -{" "}
              {pkg.tags.map((tag) => tag.title).join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomFilters;
