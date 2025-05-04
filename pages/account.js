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
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Please sign in to view your account</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">Your Account</h2>
            <div className="mb-4">
              <p className="text-gray-700"><span className="font-semibold">Name:</span> {session.user.name}</p>
              <p className="text-gray-700"><span className="font-semibold">Email:</span> {session.user.email}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">Saved Results</h2>
            {savedResults.length === 0 ? (
              <p className="text-gray-600">No saved results yet.</p>
            ) : (
              <div className="space-y-4">
                {savedResults.map((result) => {
                  // Calculate required marks for each saved result
                  const requiredMarks = calculateRequiredMarks(result);
                  
                  return (
                    <div key={result._id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="w-full">
                          <h3 className="font-semibold text-lg">{result.courseName}</h3>
                          <p className="text-gray-600 text-sm">
                            ClassTest: {result.ct} | SessionalExaminations: {result.se} | Assignment: {result.as}
                            {result.hasLPW && ` | Rubrics: ${result.ru} | LPW: ${result.lpw}`}
                          </p>
                          
                          {/* Required Final Exam Marks section */}
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <h4 className="text-md font-semibold mb-2 text-gray-700">Required Final Exam Marks</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {Object.entries(requiredMarks).length > 0 ? (
                                Object.entries(requiredMarks).map(([grade, value]) => (
                                  <div key={grade} className="flex items-center space-x-2">
                                    <span className={`font-medium ${getGradeColor(grade)}`}>
                                      {gradeDisplayMapping[grade]}:
                                    </span>
                                    <span>{value.toFixed(2)}</span>
                                  </div>
                                ))
                              ) : (
                                <span className="text-gray-500 col-span-full">No achievable grades</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(result)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteResult(result._id)}
                            className="text-red-600 hover:text-red-800"
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