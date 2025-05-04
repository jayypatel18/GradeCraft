import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  const scrollToFooter = (e) => {
    e.preventDefault();
    document.getElementById('footer-section').scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-indigo-700 mb-4">About Creator</h1>
          <p className="text-gray-600 mb-6">
            This web application was created by Jay Patel (22BCE251) of ITNU, who is passionate about helping fellow students achieve their academic goals. The creator has a background in software development and a keen interest in educational technology. This project aims to provide a simple and effective tool for students to calculate the marks they need in their final exams to achieve their desired grades.
          </p>
          
          <button
            onClick={scrollToFooter}
            className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            More Info
          </button>
        </div>
      </div>
      <div id="footer-section">
      </div>
    </div>
  );
}