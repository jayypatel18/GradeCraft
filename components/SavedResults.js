import { useState } from 'react';

const SavedResults = ({ results, onLoad, onDelete }) => {
  const [selectedId, setSelectedId] = useState(null);

  if (!results || results.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Saved Results</h3>
      <div className="space-y-3">
        {results.map((result) => (
          <div
            key={result._id}
            className={`p-4 border rounded-lg ${selectedId === result._id ? 'bg-indigo-50 border-indigo-300' : 'bg-white'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{result.courseName}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  CT: {result.ct} | SE: {result.se} | AS: {result.as} | RU: ${result.ru} | LPW: ${result.lpw}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    onLoad(result);
                    setSelectedId(result._id);
                  }}
                  className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200"
                >
                  Load
                </button>
                <button
                  onClick={() => onDelete(result._id)}
                  className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedResults;
