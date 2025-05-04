import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import EditResultModal from '../../components/EditResultModal';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [allResults, setAllResults] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Redirect non-admin users
    if (status === 'authenticated') {
      if (!session.user.isAdmin) {
        router.push('/account');
      } else {
        fetchAllResults();
      }
    } else if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [session, status, router]);

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

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/results/delete?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchAllResults();
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

  if (status === 'loading' || !session) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session.user.isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <Navbar /> */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        {allResults.length > 0 ? (
          <div className="space-y-3">
            {allResults.map((result) => (
              <div key={result._id} className="p-4 border rounded-lg bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{result.courseName}</h4>
                    <p className="text-sm font-medium text-indigo-600 mt-1">
                      User: {result.user?.name || 'Unknown'} ({result.user?.email || 'No email'})
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      CT: {result.ct} | SE: {result.se} | AS: {result.as}
                      {result.hasLPW && ` | RU: ${result.ru} | LPW: ${result.lpw}`}
                    </p>
                  </div>
                  <div className="flex space-x-2">
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
              </div>
            ))}
          </div>
        ) : (
          <p>No results found.</p>
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