import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../utils/supabaseClient';

const useCart = () => {
  const [cartState, setCartState] = useState({});

  const fetchCurrentCart = async () => {
    const { data: cart, error: cartError } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', supabase.auth.session().user.id);
    if (cartError) {
      toast.error(cartError.message);
      return;
    }
    setCartState(
      cart.reduce(
        (prev, curr) => ({
          ...prev,
          [curr.product_id]: curr.quantity,
        }),
        {}
      )
    );
  };

  const addToCart = async (product) => {
    let error;
    if (cartState[product.id]) {
      const { error: updateError } = await supabase
        .from('cart')
        .update({
          quantity: cartState[product.id] + 1,
        })
        .eq('user_id', supabase.auth.session().user.id)
        .eq('product_id', product.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('cart').insert([
        {
          product_id: product.id,
          quantity: cartState[product.id] || 0 + 1,
          user_id: supabase.auth.session().user.id,
        },
      ]);
      error = insertError;
    }
    if (error) {
      return toast.error(error.message);
    }
    await fetchCurrentCart();
  };

  const removeFromCart = async (product) => {
    let error;
    if (cartState[product.id] > 1) {
      const { error: updateError } = await supabase
        .from('cart')
        .update({
          quantity: cartState[product.id] - 1,
        })
        .eq('product_id', product.id)
        .eq('user_id', supabase.auth.session().user.id);
      error = updateError;
    } else {
      const { error: deleteError } = await supabase
        .from('cart')
        .delete()
        .eq('product_id', product.id)
        .eq('user_id', supabase.auth.session().user.id);
      error = deleteError;
    }
    if (error) {
      return toast.error(error.message);
    }
    await fetchCurrentCart();
  };

  const clearCart = async () => {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', supabase.auth.session().user.id);
    setCartState({});
    if (error) return toast.error(error.message);
  };

  return {
    setCartState,
    cartState,
    clearCart,
    addToCart,
    removeFromCart,
    fetchCurrentCart,
  };
};

export default useCart;
