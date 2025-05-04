import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-indigo-700 text-white py-6 sm:py-8 mt-auto">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:justify-between md:items-start">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg sm:text-xl font-bold mb-2">GradeCraft</h3>
            <p className="text-indigo-200 text-sm sm:text-base">
              A tool to calculate the grades you need for your exams. (Only for ITNU students)
            </p>
          </div>
          
          <div className="mb-4 md:mb-0">
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Contact</h4>
            <p className="text-indigo-200 text-sm sm:text-base">
              <a 
                href="mailto:22bce251@nirmauni.ac.in" 
                className="hover:text-white transition"
              >
                22bce251@nirmauni.ac.in
              </a>
            </p>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Links</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <a 
                  href="https://github.com/jayypatel18/grade-calculator" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-200 hover:text-white transition flex items-center text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Source Code
                </a>
              </li>
              <li>
                <a 
                  href="https://forms.gle/hxUvxGATwJZjdttq7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-200 hover:text-white transition flex items-center text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Suggest Changes
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 pt-4 sm:pt-6 border-t border-indigo-600 text-center">
          <p className="text-indigo-200 text-xs sm:text-sm">
            Made with <span className="text-red-500">❤️</span> by Jay Patel (22BCE251)
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;