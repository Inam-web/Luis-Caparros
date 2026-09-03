import { Resend } from 'resend';
import Stripe from 'stripe';

const resend = new Resend(process.env.RESEND_API_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req, res) {
  // Only handle GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('========================================');
  console.log('📦 ORDER CONFIRMATION STARTED');
  console.log('📦 Full URL:', req.url);
  console.log('📦 Query params:', req.query);
  console.log('📦 Session ID from query:', req.query.session_id);
  console.log('========================================');

  try {
    // ✅ Get session_id from query params
    const { session_id } = req.query;

    console.log('📦 Session ID extracted:', session_id);

    if (!session_id) {
      console.log('❌ ERROR: No session_id provided');
      console.log('❌ Available query params:', Object.keys(req.query));
      return res.status(400).json({ 
        success: false, 
        error: 'Missing session_id',
        query: req.query,
      });
    }

    // 1. Get session from Stripe
    console.log('🔄 Fetching session from Stripe...');
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'customer_details'],
    });

    console.log('✅ Session retrieved:', session.id);
    console.log('✅ Payment status:', session.payment_status);
    console.log('✅ Customer email:', session.customer_details?.email);

    // 2. Build order
    const order = {
      number: `LC-${String(Date.now()).slice(-6)}`,
      date: new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      lines: session.line_items?.data?.map((item) => ({
        title: item.description || 'Book',
        qty: item.quantity || 1,
        price: (item.amount_total / 100) / (item.quantity || 1),
        total: item.amount_total / 100,
      })) || [],
      total: session.amount_total / 100,
      customer: {
        name: session.metadata?.customer_name || session.customer_details?.name || 'Customer',
        surname: '',
        email: session.customer_details?.email || session.metadata?.customer_email || 'inamuafridi300@gmail.com',
        phone: session.metadata?.customer_phone || '',
        address: session.customer_details?.address?.line1 || '',
        city: session.customer_details?.address?.city || '',
        province: session.customer_details?.address?.state || '',
        postcode: session.customer_details?.address?.postal_code || '',
        notes: session.metadata?.customer_notes || '',
      },
      payment: 'card',
    };

    console.log('✅ Order created:', order.number);
    console.log('✅ Total:', order.total);
    console.log('✅ Customer email:', order.customer.email);

    // 3. SEND EMAIL TO CUSTOMER
    console.log('📧 Sending customer email...');
    try {
      const customerEmail = await resend.emails.send({
        from: 'Luis Caparrós Website <onboarding@resend.dev>',
        to: [order.customer.email],
        subject: `✅ Order Confirmation #${order.number}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Order Confirmation</title>
            <style>
              body { margin: 0; padding: 40px 20px; background: #f4f0e3; font-family: Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; background: #faf8f0; border-radius: 8px; border: 1px solid #dcd3b8; overflow: hidden; }
              .header { background: #16211c; padding: 30px; text-align: center; border-bottom: 3px solid #b9973f; }
              .header h1 { margin: 0; color: #e9d8a6; font-size: 24px; }
              .header p { margin: 8px 0 0; color: #93a898; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; }
              .body { padding: 35px; }
              .body h2 { text-align: center; color: #16211c; font-size: 20px; margin: 0 0 10px; }
              .order-number { text-align: center; font-size: 18px; font-weight: bold; color: #b9973f; }
              .divider { border-top: 1px solid #eae4d0; margin: 20px 0; }
              .item { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
              .total { display: flex; justify-content: space-between; padding-top: 15px; font-size: 18px; font-weight: bold; border-top: 2px solid #b9973f; margin-top: 15px; }
              .footer { padding: 20px; background: #f4f0e3; text-align: center; font-size: 12px; color: #55705f; }
              .badge { display: inline-block; background: #b9973f; color: #16211c; padding: 3px 15px; border-radius: 3px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📖 LUIS CAPARRÓS</h1>
                <p>Order Confirmation</p>
              </div>
              <div class="body">
                <div style="text-align: center; font-size: 50px; margin-bottom: 10px;">✅</div>
                <div class="badge">Payment Successful</div>
                <h2>Thank you for your order!</h2>
                <p class="order-number">Order #${order.number}</p>
                <p style="text-align: center; color: #55705f; font-size: 14px;">${order.date}</p>
                <div class="divider"></div>
                ${order.lines.map(item => `
                  <div class="item">
                    <span>${escapeHtml(item.title)} × ${item.qty}</span>
                    <span>${(item.total).toFixed(2)} €</span>
                  </div>
                `).join('')}
                <div class="total">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)} €</span>
                </div>
                <div class="divider"></div>
                <p style="text-align: center; color: #55705f; font-size: 13px;">
                  We'll ship your order soon!
                </p>
              </div>
              <div class="footer">
                <p>Luis Caparrós · <a href="https://luiscaparrosescritor.com" style="color: #b9973f;">luiscaparrosescritor.com</a></p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      console.log('✅ Customer email sent! ID:', customerEmail?.id);
      console.log('✅ Sent to:', order.customer.email);
    } catch (emailError) {
      console.error('❌ CUSTOMER EMAIL ERROR:', emailError);
    }

    // 4. SEND EMAIL TO AUTHOR
    console.log('📧 Sending author email...');
    try {
      const authorEmail = await resend.emails.send({
        from: 'Luis Caparrós Website <onboarding@resend.dev>',
        to: ['inamuafridi300@gmail.com'],
        subject: `📦 New Order #${order.number}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>New Order</title>
            <style>
              body { margin: 0; padding: 40px 20px; background: #f4f0e3; font-family: Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; background: #faf8f0; border-radius: 8px; border: 1px solid #dcd3b8; overflow: hidden; }
              .header { background: #16211c; padding: 30px; text-align: center; border-bottom: 3px solid #b9973f; }
              .header h1 { margin: 0; color: #e9d8a6; font-size: 24px; }
              .header p { margin: 8px 0 0; color: #93a898; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; }
              .body { padding: 35px; }
              .body h2 { color: #16211c; font-size: 18px; margin: 0 0 5px; }
              .order-number { font-size: 16px; font-weight: bold; color: #b9973f; }
              .divider { border-top: 1px solid #eae4d0; margin: 15px 0; }
              .item { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
              .total { display: flex; justify-content: space-between; padding-top: 15px; font-size: 18px; font-weight: bold; border-top: 2px solid #b9973f; margin-top: 15px; }
              .customer-info { background: #f4f0e3; padding: 15px; border-radius: 6px; margin: 15px 0; font-size: 14px; }
              .customer-info p { margin: 4px 0; }
              .footer { padding: 20px; background: #f4f0e3; text-align: center; font-size: 12px; color: #55705f; }
              .badge { display: inline-block; background: #b9973f; color: #16211c; padding: 3px 15px; border-radius: 3px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📦 New Order</h1>
                <p>Luis Caparrós · Bookstore</p>
              </div>
              <div class="body">
                <div class="badge">🆕 New Order</div>
                <h2>Order #${order.number}</h2>
                <p style="color: #55705f; font-size: 13px;">${order.date}</p>
                <div class="divider"></div>
                ${order.lines.map(item => `
                  <div class="item">
                    <span>${escapeHtml(item.title)} × ${item.qty}</span>
                    <span>${(item.total).toFixed(2)} €</span>
                  </div>
                `).join('')}
                <div class="total">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)} €</span>
                </div>
                <div class="divider"></div>
                <div class="customer-info">
                  <h3 style="font-size: 13px; color: #71201f; margin: 0 0 10px;">👤 Customer Details</h3>
                  <p><strong>Name:</strong> ${escapeHtml(order.customer.name)}</p>
                  <p><strong>Email:</strong> ${escapeHtml(order.customer.email)}</p>
                  ${order.customer.phone ? `<p><strong>Phone:</strong> ${escapeHtml(order.customer.phone)}</p>` : ''}
                  <p><strong>Address:</strong> ${escapeHtml(order.customer.address)}</p>
                  ${order.customer.notes ? `<p><strong>Notes:</strong> ${escapeHtml(order.customer.notes)}</p>` : ''}
                </div>
              </div>
              <div class="footer">
                <p>Payment via Stripe · <a href="https://luiscaparrosescritor.com" style="color: #b9973f;">luiscaparrosescritor.com</a></p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      console.log('✅ Author email sent! ID:', authorEmail?.id);
    } catch (emailError) {
      console.error('❌ AUTHOR EMAIL ERROR:', emailError);
    }

    console.log('========================================');
    console.log('✅ ORDER CONFIRMATION COMPLETE');
    console.log('========================================');

    return res.status(200).json({ 
      success: true, 
      order,
      message: 'Order confirmed and emails sent'
    });

  } catch (error) {
    console.error('❌ FATAL ERROR:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}