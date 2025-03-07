import { format } from "date-fns";
import { FaEdit } from "react-icons/fa";
import { IntentLink } from "sanity/router";
import { client } from "../../lib/client";

const PackagesTable = ({ packages, loading, refreshPackages }) => {
  const toggleActive = async (pkg) => {
    try {
      await client.patch(pkg._id).set({ active: !pkg.active }).commit();
      setTimeout(() => {
        refreshPackages();
      }, 100);
    } catch (error) {
      console.error("Error updating active state:", error);
    }
  };

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
    <div className="overflow-hidden rounded-lg shadow-lg border border-gray-200 bg-white dark:bg-gray-800">
      <table className="w-full text-sm text-gray-700 dark:text-gray-300">
        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200">
          <tr>
            <th className="p-4 text-left">Título</th>
            <th className="p-4 text-left">Destino</th>
            <th className="p-4 text-left">Válido</th>
            <th className="p-4 text-left">Activo</th>
            <th className="p-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr
              key={pkg._id}
              className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              <td className="p-4 font-medium">{pkg.title}</td>
              <td className="p-4">
                {pkg.destination && pkg.origin && pkg.destination.length > 0
                  ? pkg.destination.map((dest, index) => (
                      <span
                        key={index}
                        className="block text-gray-600 dark:text-gray-400"
                      >
                        {dest.name} desde {pkg.origin.map((d) => d)}
                      </span>
                    ))
                  : "N/A"}
              </td>
              <td className="p-4">
                {pkg.validDateFrom && pkg.validDateTo
                  ? `${format(new Date(pkg.validDateFrom), "dd-MM-yyyy")} al ${format(
                      new Date(pkg.validDateTo),
                      "dd-MM-yyyy"
                    )}`
                  : "N/A"}
              </td>
              <td className="p-4">
                <button
                  onClick={() => toggleActive(pkg)}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-all focus:outline-none ${
                    pkg.active
                      ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200"
                  }`}
                >
                  {pkg.active ? "Sí" : "No"}
                </button>
              </td>
              <td className="p-4">
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
    </div>
  );
};

export default PackagesTable;
