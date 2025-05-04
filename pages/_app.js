// pages/_app.js
import { SessionProvider } from 'next-auth/react';
import Footer from '../components/Footer';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <div className="flex flex-col min-h-screen">
        <Component {...pageProps} />
        <Footer />
      </div>
    </SessionProvider>
  );
}

export default MyApp;