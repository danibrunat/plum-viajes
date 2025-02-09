// src/components/PlumPackages/Pagination.jsx
const Pagination = ({ page, setPage, limit, totalRecords }) => {
  // Si totalRecords es menor que el límite, no se muestra nada.
  if (totalRecords < limit && page === 1) return null;

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="flex justify-end mt-4 space-x-2">
      {page > 1 && (
        <button
          onClick={handlePrevPage}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-all"
        >
          Anterior
        </button>
      )}
      {totalRecords === limit && (
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-all"
        >
          Siguiente
        </button>
      )}
    </div>
  );
};

export default Pagination;
