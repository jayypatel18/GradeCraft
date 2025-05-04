const GradeResults = ({ results }) => {
    if (!results) return null;
  
    return (
      <div className="bg-gray-50 p-4 rounded-lg mt-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Required Final Exam Marks</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-red-600">For O Grade (90+):</span>
            <span className="font-mono">{results.O.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-green-600">For A+ Grade (80+):</span>
            <span className="font-mono">{results.APlus.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-yellow-600">For A Grade (70+):</span>
            <span className="font-mono">{results.A.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-blue-600">For B+ Grade (60+):</span>
            <span className="font-mono">{results.BPlus.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };
  
  export default GradeResults;