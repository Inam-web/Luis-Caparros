import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { session_id } = req.body;

    // Here you would:
    // 1. Verify the payment with Stripe
    // 2. Save the order to your database
    // 3. Send confirmation emails

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}