import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, shipping, customer } = req.body;

    // Map cart items to Stripe line items
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.title,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    // Add shipping if not free
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Shipping',
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    // ✅ THIS IS WHERE THE SUCCESS_URL IS DEFINED
    const origin = req.headers.origin || 'https://luis-caparros.vercel.app';
    const successUrl = `${origin}/order-confirmed?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/checkout`;

    console.log('✅ Origin:', origin);
    console.log('✅ Success URL:', successUrl);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,  // ← THIS IS WHERE IT'S USED
      cancel_url: cancelUrl,    // ← THIS IS WHERE IT'S USED
      customer_email: customer.email,
      metadata: {
        customer_name: customer.name,
        customer_phone: customer.phone || '',
        customer_notes: customer.notes || '',
        customer_email: customer.email,
      },
    });

    console.log('✅ Session created:', session.id);
    console.log('✅ Session URL:', session.url);

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('❌ Stripe Error:', error);
    res.status(500).json({ error: error.message });
  }
}