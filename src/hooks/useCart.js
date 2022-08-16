import { useState } from 'react';
import useLocalStorage from './useLocalStorage';

const useCart = () => {
  const { removeItem, setItem } = useLocalStorage('cart');
  const [cartState, setCartState] = useState({});

  const addToCart = (product) => {
    setCartState((prevState) => {
      const newCart = {
        ...prevState,
        [product.id]: prevState[product.id] ? prevState[product.id] + 1 : 1,
      };
      setItem(newCart);
      return newCart;
    });
  };

  const removeFromCart = (product) => {
    if (cartState[product.id] > 1) {
      setCartState((prevState) => {
        const newCart = {
          ...prevState,
          [product.id]: prevState[product.id] - 1,
        };
        setItem(newCart);
        return newCart;
      });
    } else {
      const cartCopy = { ...cartState };
      // delete the product from cart copy object
      delete cartCopy[product.id];
      setCartState(cartCopy);
      setItem(cartCopy);
    }
  };

  const clearCart = () => {
    setCartState({});
    removeItem();
  };

  return {
    setCartState,
    cartState,
    clearCart,
    addToCart,
    removeFromCart,
  };
};

export default useCart;
