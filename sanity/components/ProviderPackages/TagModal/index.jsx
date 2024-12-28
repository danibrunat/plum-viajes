// components/TagModal.jsx
const TagModal = ({
  isOpen,
  onClose,
  selectedPackage,
  availableTags,
  selectedTags,
  onTagChange,
  onSave,
}) => {
  if (!isOpen || !selectedPackage) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md flex justify-center items-center transition-opacity duration-300 ease-in-out">
      <div className="bg-white p-6 rounded-lg shadow-lg relative mx-4 max-w-md w-full transform transition-transform duration-300 ease-in-out scale-100 border border-gray-300">
        {/* Icono de cierre en la esquina superior derecha */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
          Taggear paquete: {selectedPackage.title}
        </h2>

        <div className="space-y-3 mb-6">
          {availableTags.map((tag) => (
            <div key={tag._id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag._id)}
                onChange={() => onTagChange(tag._id)}
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-gray-700">{tag.name}</label>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          {/* Botón de guardar */}
          <button
            onClick={() => {
              onSave(selectedPackage.id);
              onClose();
            }}
            className="bg-purple-500 text-white font-semibold py-2 px-4 rounded hover:bg-purple-900 transition-colors duration-200"
          >
            Guardar
          </button>
          {/* Botón de cancelar */}
          <button
            onClick={onClose}
            className="py-2 px-4 text-sm bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagModal;
