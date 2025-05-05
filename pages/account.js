import { useSession, signOut } from 'next-auth/react';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import EditResultModal from '../components/EditResultModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useToast } from '../components/ToastProvider';

export default function Account() {
  const { data: session } = useSession();
  const [savedResults, setSavedResults] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const { addToast } = useToast();
  
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

  const confirmDelete = (id, courseName) => {
    setItemToDelete({ id, courseName });
    setIsDeleteModalOpen(true);
  };
  
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const deleteResult = async () => {
    if (!itemToDelete) return;
    
    try {
      const res = await fetch(`/api/results/delete?id=${itemToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (data.success) {
        fetchResults();
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        addToast(`Course "${itemToDelete.courseName}" deleted successfully!`, 'success');
      } else {
        addToast(`Failed to delete: ${data.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error deleting result:', error);
      addToast(`Error deleting result: ${error.message}`, 'error');
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
        addToast(`Course "${formData.courseName}" updated successfully!`, 'success');
      } else {
        addToast(`Failed to update: ${data.message}`, 'error');
      }
    } catch (error) {
      console.error('Update error:', error);
      addToast(`Failed to update: ${error.message}`, 'error');
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-indigo-700">Welcome back,  {session.user.name.split(' ')[0]}!</h2>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedResults.map((result) => {
                const requiredMarks = calculateRequiredMarks(result);
                
                return (
                  <div key={result._id} className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition">
                    <div>
                      <h3 className="font-medium text-lg text-indigo-700 mb-2">{result.courseName}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">CT:</span> {result.ct} | 
                        <span className="font-semibold"> SE:</span> {result.se} | 
                        <span className="font-semibold"> AS:</span> {result.as}
                        {result.hasLPW && (
                          <>
                            <br />
                            <span className="font-semibold">RU:</span> {result.ru} | 
                            <span className="font-semibold"> LPW:</span> {result.lpw}
                          </>
                        )}
                      </p>
                    </div>
                    
                    <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-semibold mb-2 text-gray-700">Required Final Exam Marks</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Object.entries(requiredMarks).length > 0 ? (
                          Object.entries(requiredMarks).map(([grade, value]) => (
                            <div key={grade} className="flex items-center space-x-1">
                              <span className={`font-medium text-xs ${getGradeColor(grade)}`}>
                                {gradeDisplayMapping[grade]}:
                              </span>
                              <span className="text-xs">{value.toFixed(2)}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-500 col-span-full text-xs">No achievable grades</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => openEditModal(result)}
                        className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(result._id, result.courseName)}
                        className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
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
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={deleteResult}
        itemName={itemToDelete ? `course "${itemToDelete.courseName}"` : 'this course'}
      />
    </div>
  );
}