import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">GradeCalc
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/calculator" className="hover:bg-indigo-600 px-3 py-2 rounded transition">Calculator
            </Link>
            
            {session ? (
              <>
                <Link href="/account" className="hover:bg-indigo-600 px-3 py-2 rounded transition">Account
                </Link>
                <button
                  onClick={() => signOut()}
                  className="hover:bg-indigo-600 px-3 py-2 rounded transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hover:bg-indigo-600 px-3 py-2 rounded transition">Login
                </Link>
                <Link href="/auth/register" className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition">
                    Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;