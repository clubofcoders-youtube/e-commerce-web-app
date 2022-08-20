import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { AuthContext } from '../state/AuthContext';
import { CartContext } from '../state/CartContext';
import { supabase } from '../utils/supabaseClient';

const CartPage = () => {
  const { cartWithQuantity, totalPrice, clearCart } = useContext(CartContext);

  const { dispatch } = useContext(AuthContext);

  const router = useRouter();

  const handleCheckout = async () => {
    // now we will insert all the product items into the database order item table
    // before doing so we will need the orderId
    // so first we will create an order
    // then we will update order_item table with corresponding orderId
    if (!supabase.auth.session()) {
      dispatch({
        type: 'OPEN_AUTH_MODAL',
        formType: 'login',
      });
      return toast.error('You must be logged in to checkout');
    }

    // we will call the endpoint `/checkout` to create order

    try {
      const { data } = await axios.post('api/checkout', {
        customer_id: supabase.auth.session().user.id,
        customer_email: supabase.auth.session().user.email,
      });
      if (!data) return toast.error('Error creating order');
      router.push(data.session_url);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const queries = router.query;
    if (queries.success) {
      clearCart();
      toast.success('Order created successfully');
    }

    if (queries.cancel) {
      toast.error('Error creating order, try again');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  return (
    <Layout>
      <section className="p-4">
        <h1 className="my-4 text-4xl text-light">Cart</h1>
        {cartWithQuantity && (
          <div className="flex flex-col gap-y-4">
            {cartWithQuantity.map((product) => (
              <div key={product.name} className="flex flex-col gap-y-4">
                <p>
                  {product.name} x{product.quantity} = $
                  {product.quantity * product.price || 0}
                </p>
              </div>
            ))}
            <p>Total: ${totalPrice || 0}</p>
            <button
              className="py-0.5 h-full text-lg w-full bg-black hover:text-black hover:bg-white border-black border text-white rounded"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default CartPage;
