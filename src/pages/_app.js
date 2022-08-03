import { Toaster } from 'react-hot-toast';
import AuthContextProvider from '../state/AuthContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <Toaster />
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default MyApp;
