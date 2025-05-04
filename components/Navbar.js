import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl sm:text-2xl font-bold">
            GradeCraft
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/" className="hover:bg-indigo-600 px-3 py-2 rounded transition">
              Home
            </Link>
            {session ? (
              <>
                <Link href="/calculator" className="hover:bg-indigo-600 px-3 py-2 rounded transition">
                  Calculator
                </Link>
                <Link href="/account" className="hover:bg-indigo-600 px-3 py-2 rounded transition">
                  Subjects
                </Link>
                <Link href="/about" className="hover:bg-indigo-600 px-3 py-2 rounded transition">
                  Creator
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
                <Link href="/about" className="hover:bg-indigo-600 px-3 py-2 rounded transition">
                  Creator
                </Link>
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
        
        {/* Mobile menu, toggle based on menu state */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden mt-3 border-t border-indigo-600 pt-3`}>
          <div className="flex flex-col space-y-2">
            <Link 
              href="/"
              className="block px-3 py-2 rounded hover:bg-indigo-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {session ? (
              <>
                <Link 
                  href="/calculator"
                  className="block px-3 py-2 rounded hover:bg-indigo-600 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Calculator
                </Link>
                <Link 
                  href="/account"
                  className="block px-3 py-2 rounded hover:bg-indigo-600 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Subjects
                </Link>
                <Link 
                  href="/about"
                  className="block px-3 py-2 rounded hover:bg-indigo-600 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Creator
                </Link>
                {session.user.isAdmin && (
                  <Link 
                    href="/admin"
                    className="block px-3 py-2 rounded hover:bg-indigo-600 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="text-left block px-3 py-2 rounded hover:bg-indigo-600 transition w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/about"
                  className="block px-3 py-2 rounded hover:bg-indigo-600 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Creator
                </Link>
                <Link
                  href="/auth/login"
                  className="block px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
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