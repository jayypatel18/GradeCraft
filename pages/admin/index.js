import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import EditResultModal from '../../components/EditResultModal';
import { formatDateToIST } from '../../utils/dateFormatter';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [allResults, setAllResults] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [userStats, setUserStats] = useState({ total: 0, withCourses: 0 });
  const [selectedUser, setSelectedUser] = useState(null);
  const [userResults, setUserResults] = useState([]);
  const [viewMode, setViewMode] = useState('users'); // 'users' or 'results'
  const router = useRouter();

  // Grade display mapping for showing grade labels
  const gradeDisplayMapping = {
    APlus: 'A+',
    BPlus: 'B+',
    O: 'O',
    A: 'A',
    B: 'B',
    C: 'C',
    P: 'P',
  };
  
  // Function to get color classes for different grades
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
      ans = ((ctVal + (seVal * 0.8) + (asVal * 1.5)) * 0.6);
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

  useEffect(() => {
    // Redirect non-admin users
    if (status === 'authenticated') {
      if (!session.user.isAdmin) {
        router.push('/account');
      } else {
        fetchAllResults();
        fetchAllUsers();
        fetchUserStats();
      }
    } else if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  const fetchUserStats = async () => {
    try {
      const res = await fetch('/api/admin/user-stats');
      const data = await res.json();
      if (data.success) {
        setUserStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setAllUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAllResults = async () => {
    try {
      const res = await fetch('/api/admin/results');
      const data = await res.json();
      if (data.success) {
        setAllResults(data.data);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const fetchUserResults = async (userId) => {
    try {
      const res = await fetch(`/api/admin/results?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setUserResults(data.data);
      }
    } catch (error) {
      console.error('Error fetching user results:', error);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchUserResults(user._id);
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
    setUserResults([]);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/results/delete?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchAllResults();
        if (selectedUser) {
          fetchUserResults(selectedUser._id);
        }
      }
    } catch (error) {
      console.error('Error deleting result:', error);
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
        fetchAllResults();
        if (selectedUser) {
          fetchUserResults(selectedUser._id);
        }
        closeEditModal();
        alert('Result updated successfully!');
      } else {
        alert('Failed to update: ' + data.message);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update: ' + error.message);
    }
  };
  
  const switchView = (mode) => {
    setViewMode(mode);
    setSelectedUser(null);
  };

  if (status === 'loading' || !session) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session.user.isAdmin) {
    return null; // Will redirect via useEffect
  }
  
  // Calculate percentage
  const percentageWithCourses = userStats.total > 0 ? ((userStats.withCourses / userStats.total) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Registered Users</h2>
            <p className="text-3xl font-bold text-indigo-600">{userStats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Users with Courses</h2>
            <p className="text-3xl font-bold text-indigo-600">{userStats.withCourses}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Course Adoption</h2>
            <p className="text-3xl font-bold text-green-600">{percentageWithCourses}%</p>
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="flex mb-6 bg-white p-1 rounded-lg shadow-sm inline-flex">
          <button 
            onClick={() => switchView('users')}
            className={`px-4 py-2 rounded-md ${viewMode === 'users' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            Users
          </button>
          <button 
            onClick={() => switchView('results')}
            className={`px-4 py-2 rounded-md ${viewMode === 'results' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            All Results
          </button>
        </div>
        
        {selectedUser ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">
                  Courses for {selectedUser.name} ({selectedUser.email})
                </h2>
                {selectedUser.createdAt && (
                  <p className="text-sm text-gray-500 mt-1">
                    Registered: {formatDateToIST(selectedUser.createdAt)}
                  </p>
                )}
              </div>
              <button 
                onClick={handleBackToUsers}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Back to {viewMode === 'users' ? 'Users' : 'Results'}
              </button>
            </div>
            
            {userResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userResults.map((result) => {
                  const requiredMarks = calculateRequiredMarks(result);
                  
                  return (
                    <div key={result._id} className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-lg text-indigo-700">{result.courseName}</h3>
                          {result.createdAt && (
                            <span className="text-xs text-gray-500">
                              {formatDateToIST(result.createdAt)}
                            </span>
                          )}
                        </div>
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
                          onClick={() => handleDelete(result._id)}
                          className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">No courses found for this user.</p>
              </div>
            )}
          </div>
        ) : viewMode === 'users' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allUsers.map((user) => {
              // Check if user has courses
              const userCourseCount = allResults.filter(result => 
                result.user && result.user._id === user._id
              ).length;
              
              return (
                <div key={user._id} 
                  className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => handleUserSelect(user)}
                >
                  <div>
                    <h3 className="font-medium text-lg text-indigo-700 mb-2">{user.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                    {user.createdAt && (
                      <p className="text-xs text-gray-500 mb-2">
                        Registered: {formatDateToIST(user.createdAt)}
                      </p>
                    )}
                    <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                      {userCourseCount > 0 ? (
                        <p className="font-medium text-green-600">{userCourseCount} course(s) added</p>
                      ) : (
                        <p className="font-medium text-orange-500">No courses added</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          allResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allResults.map((result) => {
                const requiredMarks = calculateRequiredMarks(result);
                
                return (
                  <div key={result._id} className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-lg text-indigo-700">{result.courseName}</h3>
                        {result.createdAt && (
                          <span className="text-xs text-gray-500">
                            {formatDateToIST(result.createdAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-indigo-600 mb-2">
                        <span
                          onClick={() => handleUserSelect(result.user)}
                          className="cursor-pointer hover:underline"
                        >
                          {result.user?.name || 'Unknown'} ({result.user?.email || 'No email'})
                        </span>
                      </p>
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
                        onClick={() => handleDelete(result._id)}
                        className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">No results found.</p>
            </div>
          )
        )}
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
