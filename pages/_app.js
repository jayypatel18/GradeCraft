// pages/_app.js
import { SessionProvider } from 'next-auth/react';
import Footer from '../components/Footer';
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import { ToastProvider } from '../components/ToastProvider';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <ToastProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow w-full px-4 sm:px-6 lg:px-8">
            <Component {...pageProps} />
          </main>
        </div>
        <Footer />
      </ToastProvider>
    </SessionProvider>
  );
}

export default MyApp;