import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Navbar from '../components/Navbar';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100 pt-4 sm:pt-8 md:pt-12">
      <div className="px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
        <div className="w-full mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-700 mb-3 md:mb-4">Welcome to GradeCraft</h1>
          <p className="text-gray-600 text-sm sm:text-base mb-5 md:mb-6">
            Calculate the marks you need in your final exam to achieve your desired grade. (Only for ITNU students)
          </p>
          
          {/* Responsive button */}
          {!session ? (<Link
            href="/auth/register"
            className="inline-block w-full sm:w-auto text-center px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Get Started
          </Link>):(
            <Link
              href="/calculator"
              className="inline-block w-full sm:w-auto text-center px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}