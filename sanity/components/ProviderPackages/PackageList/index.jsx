import { FaTags } from "react-icons/fa";

const PackageList = ({ packages, onTagClick }) => {
  return (
    <div className="flex w-full flex-col gap-3">
      {packages.map((pkg) => (
        <div
          key={pkg.packageId}
          className="flex flex-col items-start p-4 gap-2 w-1/3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          {/* Tag List */}
          <div className="flex flex-wrap gap-2 mb-3">
            {/* Ejemplo de etiquetas estáticas */}
            {pkg.tags?.length > 0 &&
              pkg.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-1 text-sm font-medium text-white bg-purple-500 rounded-full transition-colors duration-200 cursor-pointer"
                  onClick={() => onTagClick(tag)}
                >
                  {tag}
                </span>
              ))}
          </div>

          <div className="flex gap-2 w-full">
            {/* Thumbnail */}
            <img
              src={pkg.thumbnails[0]?.sourceUrl || "placeholder.jpg"}
              alt={pkg.title}
              className="w-24 h-24 rounded-lg object-cover mr-6"
            />
            {/* Package Info */}
            <div className="mx-5">
              <h3 className="text-lg font-bold text-gray-800">{pkg.title}</h3>
              <p className="text-gray-600">{pkg.provider}</p>
            </div>
            {/* Tag Button */}
            <div className="flex justify-end self-center items-end ml-auto">
              <button
                onClick={() => onTagClick(pkg)}
                className="text-2xl p-3 bg-gradient-to-r bg-[#556bfc] text-white font-semibold rounded-lg transition-colors duration-200"
              >
                <FaTags size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PackageList;
