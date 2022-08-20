import { supabase } from '../serverUtils/serverSupabaseClient';
import loadStripe from 'stripe';

const stripe = loadStripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

// https://vercel.com/support/articles/how-do-i-get-the-raw-body-of-a-serverless-function
async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function fullFillOrder(eventData) {
  await supabase
    .from('order')
    .update({
      status: 'SUCCESS',
    })
    .eq('id', eventData.metadata.order_id);
  return;
}

export default async function webhookHandler(req, res) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const rawBody = buf.toString('utf8');
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'charge.succeeded': {
        await fullFillOrder(event.data.object);
      }
    }

    return res.status(200).json({ message: 'success' });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
