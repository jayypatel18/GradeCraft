import { useSession, signOut } from 'next-auth/react';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import EditResultModal from '../components/EditResultModal';

export default function Account() {
  const { data: session } = useSession();
  const [savedResults, setSavedResults] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  
  const gradeDisplayMapping = {
    APlus: 'A+',
    BPlus: 'B+',
    O: 'O',
    A: 'A',
    B: 'B',
    C: 'C',
    P: 'P',
  };
  
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

  useEffect(() => {
    if (session) {
      fetchResults();
    }
  }, [session]);

  const fetchResults = async () => {
    const res = await fetch('/api/results/get');
    const data = await res.json();
    if (data.success) {
      setSavedResults(data.data);
    }
  };

  const deleteResult = async (id) => {
    const res = await fetch(`/api/results/delete?id=${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success) {
      fetchResults();
    }
  };
  
  const openEditModal = (result) => {
    setCurrentResult(result);
    setIsEditModalOpen(true);
  };
  
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentResult(null);
  };
  
  const handleEditSave = async (formData) => {
    try {
      const res = await fetch('/api/results/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (data.success) {
        fetchResults();
        closeEditModal();
      } else {
        alert('Failed to update: ' + data.message);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update: ' + error.message);
    }
  };
  
  // Function to calculate required grades for a result
  const calculateRequiredMarks = (result) => {
    const ctVal = parseFloat(result.ct) || 0;
    const seVal = parseFloat(result.se) || 0;
    const asVal = parseFloat(result.as) || 0;
    const ruVal = parseFloat(result.ru) || 0;
    const lpwVal = parseFloat(result.lpw) || 0;

    let ans;
    if (result.hasLPW) {
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
    return Object.fromEntries(
      Object.entries(gradeResults).filter(([_, value]) => value >= 0 && value <= 100)
    );
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Please sign in to view your account</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-6 md:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-indigo-700">Your Account</h2>
          <div className="mb-4">
            <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold">Name:</span> {session.user.name}</p>
            <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold">Email:</span> {session.user.email}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white text-sm sm:text-base rounded-lg hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-indigo-700">Saved Results</h2>
          {savedResults.length === 0 ? (
            <p className="text-gray-600 text-sm sm:text-base">No saved results yet.</p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {savedResults.map((result) => {
                // Calculate required marks for each saved result
                const requiredMarks = calculateRequiredMarks(result);
                
                return (
                  <div key={result._id} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div className="w-full mb-3 sm:mb-0">
                        <h3 className="font-semibold text-base sm:text-lg">{result.courseName}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          ClassTest: {result.ct} | SessionalExaminations: {result.se} | Assignment: {result.as}
                          {result.hasLPW && ` | Rubrics: ${result.ru} | LPW: ${result.lpw}`}
                        </p>
                        
                        {/* Required Final Exam Marks section */}
                        <div className="mt-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                          <h4 className="text-sm sm:text-md font-semibold mb-2 text-gray-700">Required Final Exam Marks</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                            {Object.entries(requiredMarks).length > 0 ? (
                              Object.entries(requiredMarks).map(([grade, value]) => (
                                <div key={grade} className="flex items-center space-x-1 sm:space-x-2">
                                  <span className={`font-medium text-xs sm:text-sm ${getGradeColor(grade)}`}>
                                    {gradeDisplayMapping[grade]}:
                                  </span>
                                  <span className="text-xs sm:text-sm">{value.toFixed(2)}</span>
                                </div>
                              ))
                            ) : (
                              <span className="text-gray-500 col-span-full text-xs sm:text-sm">No achievable grades</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 sm:space-x-3 mt-2 sm:mt-0 sm:ml-4">
                        <button
                          onClick={() => openEditModal(result)}
                          className="text-blue-600 hover:text-blue-800 text-sm sm:text-base"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteResult(result._id)}
                          className="text-red-600 hover:text-red-800 text-sm sm:text-base"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Edit Modal */}
      <EditResultModal
        result={currentResult}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSave={handleEditSave}
      />
    </div>
  );
}