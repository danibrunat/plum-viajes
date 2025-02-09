// src/components/PlumPackages/PackagesTable.jsx
import { format } from "date-fns";
import { FaEdit } from "react-icons/fa";
import { IntentLink } from "sanity/router";
import { client } from "../../lib/client"; // Asegurate de que esta ruta sea correcta

const PackagesTable = ({ packages, loading, refreshPackages, setPage }) => {
  // Función para alternar el valor de active
  const toggleActive = async (pkg) => {
    try {
      await client.patch(pkg._id).set({ active: !pkg.active }).commit();
      // Forzar reconsulta tras un pequeño delay para dar tiempo al backend a actualizar
      setTimeout(() => {
        refreshPackages();
      }, 100);
    } catch (error) {
      console.error("Error updating active state:", error);
    }
  };

  console.log("packages", packages);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="animate-pulse flex space-x-4">
            <div className="flex-1 bg-gray-300 h-6 rounded" />
            <div className="flex-1 bg-gray-300 h-6 rounded" />
            <div className="flex-1 bg-gray-300 h-6 rounded" />
            <div className="flex-1 bg-gray-300 h-6 rounded" />
            <div className="w-10 bg-gray-300 h-6 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-3 text-left">Título</th>
          <th className="p-3 text-left">Destino</th>
          <th className="p-3 text-left">Válido</th>
          <th className="p-3 text-left">Activo</th>
          <th className="p-3 text-left">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {packages.map((pkg) => (
          <tr
            key={pkg._id}
            className="border-b hover:bg-gray-100 transition-all"
          >
            <td className="p-3">{pkg.title}</td>
            <td className="p-3">
              {pkg.destination && pkg.origin && pkg.destination.length > 0
                ? pkg.destination.map((dest, index) => (
                    <span key={index} className="block">
                      {dest.name}
                      <br />
                      desde {pkg.origin[index]?.name || "N/A"}
                      {index < pkg.destination.length - 1 && ", "}
                    </span>
                  ))
                : "N/A"}
            </td>
            <td className="p-3">
              {pkg.validDateFrom && pkg.validDateTo
                ? `${format(new Date(pkg.validDateFrom), "dd-MM-yyyy")} al ${format(
                    new Date(pkg.validDateTo),
                    "dd-MM-yyyy"
                  )}`
                : "N/A"}
            </td>
            <td className="p-3">
              <button
                onClick={() => toggleActive(pkg)}
                className={`px-2 py-1 text-sm rounded-md focus:outline-none ${
                  pkg.active
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {pkg.active ? "Sí" : "No"}
              </button>
            </td>
            <td className="p-3">
              <IntentLink
                intent="edit"
                layout="fullscreen"
                params={{ id: pkg._id, type: "packages" }}
              >
                <button className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all">
                  <FaEdit />
                </button>
              </IntentLink>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PackagesTable;
