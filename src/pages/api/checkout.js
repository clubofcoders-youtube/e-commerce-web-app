import { supabase } from '../serverUtils/serverSupabaseClient';
import loadStripe from 'stripe';

const stripe = loadStripe(process.env.STRIPE_SECRET_KEY);

export default async function checkoutHandler(req, res) {
  if (req.method === 'POST') {
    const { customer_email, customer_id } = req.body;

    if (!customer_email || !customer_id) {
      return res.status(400).json({
        message: 'Missing customer email or customer id',
      });
    }

    const { data: cartItems, error: cartItemsFetchError } = await supabase
      .from('cart')
      .select(
        `
            quantity,
            product (
                id,
                name,
                description,
                price,
                stock,
                image
            )
        `
      )
      .eq('user_id', customer_id);

    if (cartItemsFetchError) {
      return res.status(500).json({
        message: cartItemsFetchError.message,
      });
    }

    const { data: order, error: orderCreationError } = await supabase
      .from('order')
      .insert([
        {
          user_id: customer_id,
        },
      ]);

    if (orderCreationError) {
      return res.status(500).json({
        message: orderCreationError.message,
      });
    }

    const order_id = order[0].id;

    const orderItemsFromCartitems = cartItems.map((cartItem) => ({
      order_id: order_id,
      product_id: cartItem.product.id,
      quantity: cartItem.quantity,
      user_id: customer_id,
    }));

    const { data: order_items, error: orderItemsInsertionError } =
      await supabase.from('order_item').insert(orderItemsFromCartitems);

    if (orderItemsInsertionError) {
      return res.status(500).json({
        message: 'Error inserting order items',
      });
    }

    const line_items = cartItems.map((cartItem) => ({
      price_data: {
        currency: 'USD',
        product_data: {
          name: cartItem.product.name,
          images: [cartItem.product.image],
          description: cartItem.product.description,
        },
        unit_amount: cartItem.product.price * 100,
      },
      quantity: cartItem.quantity,
    }));

    try {
      const session = await stripe.checkout.sessions.create({
        customer_email,
        line_items,
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_URL}/cart/?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart/?cancel=true`,
        payment_intent_data: {
          metadata: {
            order_id,
          },
        },
      });
      return res.status(200).json({
        session_url: session.url,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: error.message,
      });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
