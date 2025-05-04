import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-indigo-700 mb-4">Welcome to GradeCalc</h1>
          <p className="text-gray-600 mb-6">
            Calculate the marks you need in your final exam to achieve your desired grade.
          </p>
          
          {/* Correct modern Link usage */}
          <Link
            href="/calculator"
            className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}