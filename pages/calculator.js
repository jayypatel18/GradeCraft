import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import GradeCalculator from '../components/GradeCalculator';
import Navbar from '../components/Navbar';

export default function Calculator() {
  const { data: session, status } = useSession();
  const [savedResults, setSavedResults] = useState([]);
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchResults();
    }
  }, [session]);

  const fetchResults = async () => {
    try {
      const res = await fetch('/api/results/get');
      const data = await res.json();
      if (data.success) {
        setSavedResults(data.data);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const handleSave = async (resultData) => {
    try {
      const res = await fetch('/api/results/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultData),
      });

      const data = await res.json();
      if (data.success) {
        fetchResults();
      }
    } catch (error) {
      console.error('Error saving result:', error);
      alert('Failed to save result');
    }
  };

  // Show loading state while checking authentication
  if (status === 'loading') {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-xl font-semibold mb-2">Loading...</div>
        <div className="text-gray-500">Please wait</div>
      </div>
    </div>;
  }

  // Don't render anything if not authenticated (will redirect)
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <GradeCalculator 
            onCalculate={() => {}} 
            onSave={handleSave} 
            isLoggedIn={!!session} 
            savedResults={savedResults} 
          />
        </div>
      </div>
    </div>
  );
}