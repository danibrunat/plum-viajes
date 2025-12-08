const CHILD_AGE_OPTIONS = Array.from({ length: 18 }, (_, i) => i); // Edades de 0 a 17

function ChildrenAgesFields({ childrenCount, childrenAges, onAgeChange, labelStyles }) {
  if (childrenCount === 0) return null;

  return (
    <div 
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ 
        maxHeight: childrenCount > 0 ? '200px' : '0',
        opacity: childrenCount > 0 ? 1 : 0 
      }}
    >
      <div className="pt-3">
        <label className={labelStyles}>
          Edad de los menores
        </label>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: childrenCount }, (_, index) => (
            <div key={index} className="flex items-center gap-1">
              <select
                name={`childAge_${index}`}
                id={`childAge_${index}`}
                value={childrenAges[index] || ""}
                onChange={(e) => onAgeChange(index, e.target.value)}
                className="w-20 rounded-lg px-2 py-2 border border-gray-200 bg-gray-50 text-gray-700 text-sm focus:border-plumPrimaryPurple focus:ring-2 focus:ring-plumPrimaryPurple/20 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                required
              >
                <option value="">Edad</option>
                {CHILD_AGE_OPTIONS.map((age) => (
                  <option key={age} value={age}>
                    {age} {age === 1 ? "año" : "años"}
                  </option>
                ))}
              </select>
              {childrenCount > 1 && (
                <span className="text-xs text-gray-400">#{index + 1}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChildrenAgesFields