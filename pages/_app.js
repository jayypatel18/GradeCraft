// pages/_app.js
import { SessionProvider } from 'next-auth/react';
import Footer from '../components/Footer';
import '../styles/globals.css';
import Navbar from '../components/Navbar';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <div className="flex flex-col min-h-screen">
      <Navbar />
        <Component {...pageProps} />

      </div>
      <Footer />
    </SessionProvider>
  );
}

export default MyApp;