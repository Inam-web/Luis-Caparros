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
  // Handle GET request (from confirm page)
  if (req.method === 'GET') {
    try {
      const { session_id } = req.query;

      if (!session_id) {
        return res.status(400).json({ error: 'Missing session_id' });
      }

      // Retrieve the checkout session from Stripe
      const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items', 'customer_details'],
      });

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      // Build order object
      const order = {
        number: `LC-${String(Date.now()).slice(-6)}`,
        date: new Date().toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        lines: session.line_items.data.map((item) => ({
          title: item.description || 'Book',
          qty: item.quantity,
          price: (item.amount_total / 100) / item.quantity,
          total: item.amount_total / 100,
        })),
        total: session.amount_total / 100,
        customer: {
          name: session.customer_details?.name || '',
          surname: '',
          email: session.customer_details?.email || '',
          phone: session.metadata?.customer_phone || '',
          address: session.customer_details?.address?.line1 || '',
          city: session.customer_details?.address?.city || '',
          province: session.customer_details?.address?.state || '',
          postcode: session.customer_details?.address?.postal_code || '',
          notes: session.metadata?.customer_notes || '',
        },
        payment: 'card',
      };

      // Send confirmation email to customer
      await sendCustomerEmail(order, order.customer);

      // Send notification to author
      await sendAuthorEmail(order, order.customer);

      return res.status(200).json({ success: true, order });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Handle POST request (for bank transfer orders)
  if (req.method === 'POST') {
    try {
      const { order, customer, payment } = req.body;

      await sendCustomerEmail(order, customer);
      await sendAuthorEmail(order, customer);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Send email to customer
async function sendCustomerEmail(order, customer) {
  await resend.emails.send({
    from: 'Luis Caparrós Website <onboarding@resend.dev>',
    to: [customer.email],
    subject: `✅ Order Confirmation #${order.number}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Order Confirmation</title>
        <style>
          body { margin: 0; padding: 40px 20px; background: #f4f0e3; font-family: 'Archivo', sans-serif; color: #1c2620; }
          .container { max-width: 600px; margin: 0 auto; background: #faf8f0; border-radius: 8px; overflow: hidden; border: 1px solid #dcd3b8; }
          .header { background: #16211c; padding: 30px 35px; border-bottom: 3px solid #b9973f; text-align: center; }
          .header h1 { margin: 0; font-family: 'Fraunces', Georgia, serif; font-size: 24px; color: #e9d8a6; }
          .header p { margin: 8px 0 0; color: #93a898; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; }
          .body { padding: 35px; }
          .body h2 { font-family: 'Fraunces', Georgia, serif; color: #16211c; font-size: 20px; margin: 0 0 20px; text-align: center; }
          .order-number { text-align: center; font-size: 18px; font-weight: 700; color: #b9973f; margin-bottom: 20px; }
          .divider { border-top: 1px solid #eae4d0; margin: 20px 0; }
          .item { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #1c2620; }
          .total { display: flex; justify-content: space-between; padding-top: 15px; font-size: 18px; font-weight: 700; color: #16211c; border-top: 2px solid #b9973f; margin-top: 15px; }
          .footer { padding: 20px 35px; background: #f4f0e3; border-top: 1px solid #eae4d0; text-align: center; }
          .footer p { margin: 0; font-size: 12px; color: #55705f; }
          .footer a { color: #b9973f; text-decoration: none; }
          .badge { display: inline-block; background: #b9973f; color: #16211c; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 3px 15px; border-radius: 3px; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📖 LUIS CAPARRÓS</h1>
            <p>Order Confirmation</p>
          </div>
          <div class="body">
            <div class="badge">✅ Payment Successful</div>
            <h2>Thank you for your order!</h2>
            <p class="order-number">Order #${order.number}</p>
            <p style="text-align: center; color: #55705f; font-size: 14px;">
              ${order.date}
            </p>
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
            <p style="font-size: 13px; color: #55705f; text-align: center;">
              You will receive a shipping confirmation once your order ships.
            </p>
          </div>
          <div class="footer">
            <p>Luis Caparrós · <a href="https://luiscaparrosescritor.com">luiscaparrosescritor.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

// Send email to author
async function sendAuthorEmail(order, customer) {
  await resend.emails.send({
    from: 'Luis Caparrós Website <onboarding@resend.dev>',
    to: ['inamuafridi300@gmail.com'], // Change to contacto@luiscaparrosescritor.com for production
    subject: `📦 New Order #${order.number}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Order</title>
        <style>
          body { margin: 0; padding: 40px 20px; background: #f4f0e3; font-family: 'Archivo', sans-serif; color: #1c2620; }
          .container { max-width: 600px; margin: 0 auto; background: #faf8f0; border-radius: 8px; overflow: hidden; border: 1px solid #dcd3b8; }
          .header { background: #16211c; padding: 30px 35px; border-bottom: 3px solid #b9973f; text-align: center; }
          .header h1 { margin: 0; font-family: 'Fraunces', Georgia, serif; font-size: 24px; color: #e9d8a6; }
          .header p { margin: 8px 0 0; color: #93a898; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; }
          .body { padding: 35px; }
          .body h2 { font-family: 'Fraunces', Georgia, serif; color: #16211c; font-size: 18px; margin: 0 0 5px; }
          .order-number { font-size: 16px; font-weight: 700; color: #b9973f; margin-bottom: 20px; }
          .divider { border-top: 1px solid #eae4d0; margin: 15px 0; }
          .item { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #1c2620; }
          .total { display: flex; justify-content: space-between; padding-top: 15px; font-size: 18px; font-weight: 700; color: #16211c; border-top: 2px solid #b9973f; margin-top: 15px; }
          .customer-info { background: #f4f0e3; padding: 15px; border-radius: 6px; margin: 15px 0; font-size: 14px; }
          .customer-info p { margin: 4px 0; }
          .footer { padding: 20px 35px; background: #f4f0e3; border-top: 1px solid #eae4d0; text-align: center; }
          .footer p { margin: 0; font-size: 12px; color: #55705f; }
          .badge { display: inline-block; background: #b9973f; color: #16211c; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 3px 15px; border-radius: 3px; margin-bottom: 15px; }
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
              <p><strong>Name:</strong> ${escapeHtml(customer.name)} ${escapeHtml(customer.surname || '')}</p>
              <p><strong>Email:</strong> ${escapeHtml(customer.email)}</p>
              ${customer.phone ? `<p><strong>Phone:</strong> ${escapeHtml(customer.phone)}</p>` : ''}
              <p><strong>Address:</strong> ${escapeHtml(customer.address)}</p>
              <p>${escapeHtml(customer.postcode)} ${escapeHtml(customer.city)}${customer.province ? `, ${escapeHtml(customer.province)}` : ''}</p>
              ${customer.notes ? `<p><strong>Notes:</strong> ${escapeHtml(customer.notes)}</p>` : ''}
            </div>
          </div>
          <div class="footer">
            <p>Payment via Stripe · <a href="https://luiscaparrosescritor.com">luiscaparrosescritor.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}