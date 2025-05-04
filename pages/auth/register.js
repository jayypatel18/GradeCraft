import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/router';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push('/auth/login');
    } else {
      setError(data.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-indigo-700 py-3 sm:py-4 px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Create Account</h2>
          </div>
          <div className="p-4 sm:p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  required
                />
              </div>
              <div className="mb-5 sm:mb-6">
                <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  required
                  minLength="6"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 text-sm sm:text-base"
              >
                Register
              </button>
            </form>
            <div className="mt-4 text-center">
              <span className="text-gray-600 text-sm sm:text-base">Already have an account? </span>
              <Link href="/auth/login" className="text-indigo-600 hover:underline text-sm sm:text-base">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}