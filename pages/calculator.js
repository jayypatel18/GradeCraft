import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import GradeCalculator from '../components/GradeCalculator';
import Navbar from '../components/Navbar';

export default function Calculator() {
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

  const handleSave = async (resultData) => {
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
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
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