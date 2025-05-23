import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from './ToastProvider';


const GradeCalculator = ({ onCalculate, onSave, isLoggedIn, savedResults }) => {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [courseName, setCourseName] = useState('');
  const [ct, setCt] = useState('');
  const [se, setSe] = useState('');
  const [as, setAs] = useState('');
  const [ru, setRu] = useState('');
  const [lpw, setLpw] = useState('');
  const [hasLPW, setHasLPW] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);

  const gradeDisplayMapping = {
    APlus: 'A+',
    BPlus: 'B+',
    O: 'O',
    A: 'A',
    B: 'B',
    C: 'C',
    P: 'P',
  };

  const calculateGrades = () => {
    const ctVal = parseFloat(ct) || 0;
    const seVal = parseFloat(se) || 0;
    const asVal = parseFloat(as) || 0;
    const ruVal = parseFloat(ru) || 0;
    const lpwVal = parseFloat(lpw) || 0;

    let ans;
    if (hasLPW) {
      ans = ((ctVal + (seVal * 1.2) + asVal) * 0.3) + (((ruVal * 0.6) + lpwVal) * 0.3);
    } else {
      ans = ((ctVal + (seVal * 1.2) + asVal) * 0.6);
    }

    const gradeResults = {
      O: ((91 - ans) / 0.4),
      APlus: ((81 - ans) / 0.4),
      A: ((71 - ans) / 0.4),
      BPlus: ((61 - ans) / 0.4),
      B: ((51 - ans) / 0.4),
      C: ((46 - ans) / 0.4),
      P: ((40 - ans) / 0.4),
    };

    // Filter the results to only include those between 0 and 100
    const validGradeResults = Object.fromEntries(
      Object.entries(gradeResults).filter(([grade, value]) => value >= 0 && value <= 100)
    );

    setResults(validGradeResults);
    onCalculate(validGradeResults);
    addToast('Grades calculated successfully!', 'info');
  };

  const handleSave = async (resultData) => {
    try {
      // Validate required fields
      if (!resultData.courseName || resultData.courseName.trim() === '') {
        addToast('Course name is required', 'error');
        return;
      }

      // Create a clean, serializable object with proper number conversions
      const saveData = {
        courseName: resultData.courseName.trim(),
        ct: parseFloat(resultData.ct) || 0, // Use 0 instead of NaN
        se: parseFloat(resultData.se) || 0,
        as: parseFloat(resultData.as) || 0,
        ru: resultData.ru ? parseFloat(resultData.ru) || 0 : null,
        lpw: resultData.lpw ? parseFloat(resultData.lpw) || 0 : null,
        hasLPW: Boolean(resultData.hasLPW),
      };

      const res = await fetch('/api/results/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData),
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      if (data.success) {
        // Call the prop function to refresh results
        onSave();
        addToast(`${saveData.courseName} is calculated and saved successfully!`, 'success');
        
        // Clear form fields after successful save
        setCourseName('');
        setCt('');
        setSe('');
        setAs('');
        setRu('');
        setLpw('');
        setHasLPW(false);
        // setResults(null);
      }
    } catch (error) {
      console.error('Save error:', error);
      addToast(`Failed to save: ${error.message}`, 'error');
    }
  };

  const loadSavedResult = (result) => {
    setSelectedResult(result._id);
    setCourseName(result.courseName);
    setCt(result.ct.toString());
    setSe(result.se.toString());
    setAs(result.as.toString());
    setRu(result.ru?.toString() || '');
    setLpw(result.lpw?.toString() || '');
    setHasLPW(result.hasLPW);
    
    addToast(`Loaded ${result.courseName}`, 'info');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-indigo-700">Grade Calculator</h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Course Name</label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
          placeholder="Enter course name"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Class Test Marks</label>
          <input
            type="number"
            value={ct}
            onChange={(e) => setCt(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            placeholder="Out of 20"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Sessional Exam Marks</label>
          <input
            type="number"
            value={se}
            onChange={(e) => setSe(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            placeholder="Out of 50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Assignment Marks</label>
          <input
            type="number"
            value={as}
            onChange={(e) => setAs(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            placeholder="Out of 20"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasLPW"
            checked={hasLPW}
            onChange={(e) => setHasLPW(e.target.checked)}
            className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-indigo-600"
          />
          <label htmlFor="hasLPW" className="text-gray-700 text-sm sm:text-base">Has LPW Component</label>
        </div>
      </div>

      {hasLPW && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">RU Marks</label>
            <input
              type="number"
              value={ru}
              onChange={(e) => setRu(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              placeholder="Out of 100"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">LPW Marks</label>
            <input
              type="number"
              value={lpw}
              onChange={(e) => setLpw(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              placeholder="Out of 40"
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 sm:gap-4 mb-5 sm:mb-6">
        {isLoggedIn && (
          <button
            onClick={() => 
              {calculateGrades();
              handleSave({
              courseName,
              ct,
              se,
              as,
              ru,
              lpw,
              hasLPW
            })}}
            className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 text-sm sm:text-base"
            disabled={!courseName}
          >
            Calculate & Save
          </button>
        )}
      </div>

      {results && (
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Required Final Exam Marks</h3>
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-2 sm:gap-3">
            {Object.entries(results).map(([grade, value]) => (
              <div className="flex justify-between items-center" key={grade}>
                <span className={`font-medium text-sm sm:text-base ${getGradeColor(grade)}`}>
                  For {gradeDisplayMapping[grade]} Grade:
                </span>
                <span className="text-sm sm:text-base">{value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

{isLoggedIn && savedResults.length > 0 && (
        <div className="mb-5 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Saved Results</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {savedResults.map((result) => (
              <div
                key={result._id}
                // onClick={() => loadSavedResult(result)}
                className={`p-2 sm:p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedResult === result._id ? 'bg-indigo-50 border-indigo-300' : ''}`}
              >
                <div className="font-medium text-sm sm:text-base">{result.courseName}</div>
                <div className="text-xs sm:text-sm text-gray-500">
                  CT: {result.ct}, SE: {result.se}, AS: {result.as}
                  {result.hasLPW && `, RU: ${result.ru}, LPW: ${result.lpw}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get grade color
const getGradeColor = (grade) => {
  switch (grade) {
    case 'O': return 'text-red-600';
    case 'APlus': return 'text-green-600';
    case 'A': return 'text-orange-600';
    case 'BPlus': return 'text-blue-600';
    case 'B': return 'text-purple-600';
    case 'C': return 'text-rose-600';
    case 'P': return 'text-pink-600';
    default: return 'text-black-600';
  }
};

export default GradeCalculator;