import { useContext } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { AuthContext } from '../state/AuthContext';
import { CartContext } from '../state/CartContext';
import { supabase } from '../utils/supabaseClient';

const CartPage = () => {
  const { cartWithQuantity, totalPrice } = useContext(CartContext);

  const { dispatch } = useContext(AuthContext);

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
    console.log(supabase.auth.session().user);
    const { data, error } = await supabase.from('order').insert([
      {
        status: 'PENDING',
        user_id: supabase.auth.session().user.id,
      },
    ]);
  };

  return (
    <Layout>
      <section className="p-4">
        <h1 className="my-4 text-4xl text-light">Cart</h1>
        {cartWithQuantity && (
          <div className="flex flex-col gap-y-4">
            {cartWithQuantity.map((product, idx) => (
              <div key={product.id + idx} className="flex flex-col gap-y-4">
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
