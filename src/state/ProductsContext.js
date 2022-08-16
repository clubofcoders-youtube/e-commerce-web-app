import { createContext, useEffect, useState } from 'react';
import { showErrorToast } from '../utils';
import { supabase } from '../utils/supabaseClient';

export const ProductsContext = createContext({
  products: [],
  loading: false,
});

const ProductsContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase.from('product').select('*');
      if (error) {
        return showErrorToast(error.message, setLoading);
      }
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsContextProvider;
