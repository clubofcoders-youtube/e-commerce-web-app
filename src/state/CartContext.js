import { createContext, useContext, useEffect, useMemo } from 'react';
import useCart from '../hooks/useCart';
import useLocalStorage from '../hooks/useLocalStorage';
import { ProductsContext } from './ProductsContext';

export const CartContext = createContext({
  cartState: {},
  removeFromCart: () => {},
  addToCart: () => {},
  clearCart: () => {},
  totalCartItems: 0,
  cartWithQuantity: [],
  totalPrice: 0,
});

const CartContextProvider = ({ children }) => {
  const { products } = useContext(ProductsContext);

  const { cartState, removeFromCart, addToCart, clearCart, fetchCurrentCart } =
    useCart();

  // when the application run the first time
  // we will check if the cart is empty or not
  // if not empty we will get the cart from server and update the state
  useEffect(() => {
    (async () => {
      await fetchCurrentCart();
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalCartItems = useMemo(() => {
    return Object.values(cartState).reduce((prev, curr) => prev + curr, 0);
  }, [cartState]);

  const { cartWithQuantity, totalPrice } = useMemo(() => {
    if (!products) return [];
    const cartWithQuantity = Object.keys(cartState).map((productId) => {
      // we have to parseInt the productId because it is a string as it gets stored in localstorage
      return {
        ...products.find((product) => product.id === +productId),
        quantity: cartState[productId],
      };
    });

    const totalPrice = cartWithQuantity.reduce((prev, curr) => {
      return prev + +curr.price * +curr.quantity;
    }, 0);

    return {
      cartWithQuantity,
      totalPrice,
    };
  }, [products, cartState]);

  return (
    <CartContext.Provider
      value={{
        cartState,
        removeFromCart,
        addToCart,
        clearCart,
        totalCartItems,
        cartWithQuantity,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
