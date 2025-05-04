import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
        GradeCraft
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/" className="hover:bg-indigo-600 px-3 py-2 rounded transition">
            Home
          </Link>
          <Link href="/calculator" className="hover:bg-indigo-600 px-3 py-2 rounded transition">
            Calculator
          </Link>
          {session ? (
            <>
              <Link href="/account" className="hover:bg-indigo-600 px-3 py-2 rounded transition">
                Subjects
              </Link>
              {session.user.isAdmin && (
                <Link href="/admin" className="hover:bg-indigo-600 px-3 py-2 rounded transition">
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="hover:bg-indigo-600 px-3 py-2 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;