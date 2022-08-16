import { Toaster } from 'react-hot-toast';
import AuthContextProvider from '../state/AuthContext';
import CartContextProvider from '../state/CartContext';
import ProductsContextProvider from '../state/ProductsContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <ProductsContextProvider>
        <CartContextProvider>
          <Toaster />
          <Component {...pageProps} />
        </CartContextProvider>
      </ProductsContextProvider>
    </AuthContextProvider>
  );
}

export default MyApp;
