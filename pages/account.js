import { useSession, signOut } from 'next-auth/react';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';

export default function Account() {
  const { data: session } = useSession();
  const [savedResults, setSavedResults] = useState([]);

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

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
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
      <Navbar />
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
                {savedResults.map((result) => (
                  <div key={result._id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{result.courseName}</h3>
                        <p className="text-gray-600 text-sm">
                          CT: {result.ct} | SE: {result.se} | AS: {result.as}
                          {result.hasLPW && ` | RU: ${result.ru} | LPW: ${result.lpw}`}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteResult(result._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}