import Stripe from "stripe";
import { Resend } from "resend";

/*
 * IMPORTANT:
 * Stripe webhook signature verification requires
 * the original raw request body.
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ||
  "Luis Caparrós Website <onboarding@resend.dev>";

const TEST_EMAIL =
  process.env.RESEND_TO_EMAIL ||
  "inamuafridi300@gmail.com";

const TEST_MODE =
  String(process.env.EMAIL_TEST_MODE || "").toLowerCase() ===
  "true";

/* =========================================================
   HELPERS
   ========================================================= */

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getOrderNumber(sessionId) {
  const cleanId = String(sessionId)
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();

  return `LC-${cleanId.slice(-8)}`;
}

function formatDate() {
  return new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* =========================================================
   RAW BODY
   ========================================================= */

async function readRawBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(
      Buffer.isBuffer(chunk)
        ? chunk
        : Buffer.from(chunk)
    );
  }

  return Buffer.concat(chunks);
}

/* =========================================================
   CUSTOMER EMAIL
   ========================================================= */

function customerEmailHtml(order) {
  const lines = order.lines
    .map(
      (item) => `
        <tr>
          <td style="
            padding:12px;
            border-bottom:1px solid #ddd5c0;
          ">
            ${escapeHtml(item.title)}
          </td>

          <td style="
            padding:12px;
            text-align:center;
            border-bottom:1px solid #ddd5c0;
          ">
            ${item.qty}
          </td>

          <td style="
            padding:12px;
            text-align:right;
            border-bottom:1px solid #ddd5c0;
          ">
            €${item.total.toFixed(2)}
          </td>
        </tr>
      `
    )
    .join("");

  return `
<!doctype html>
<html>
<body style="
margin:0;
padding:30px;
background:#f4f0e3;
font-family:Georgia,serif;
color:#16211c;
">

<div style="
max-width:700px;
margin:auto;
background:#faf8f0;
border:1px solid #dcd3b8;
">

<div style="
padding:35px;
text-align:center;
border-bottom:1px solid #dcd3b8;
">

<p style="
font-family:Arial,sans-serif;
font-size:11px;
letter-spacing:3px;
color:#8b7651;
font-weight:bold;
">
ORDER CONFIRMATION
</p>

<h1 style="
margin:0;
font-size:34px;
letter-spacing:3px;
">
LUIS CAPARRÓS
</h1>

</div>

<div style="padding:35px;">

<h2>Order Confirmed</h2>

<p style="
font-size:17px;
line-height:1.7;
">
Thank you for your order,
<strong>${escapeHtml(order.customer.name)}</strong>.
</p>

<div style="
background:#f3eee1;
padding:20px;
border:1px solid #ddd5c0;
font-family:Arial,sans-serif;
font-size:13px;
line-height:1.8;
">

<strong>Order:</strong>
${escapeHtml(order.number)}

<br>

<strong>Date:</strong>
${escapeHtml(order.date)}

</div>

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="
border-collapse:collapse;
margin-top:25px;
font-family:Arial,sans-serif;
"
>

<thead>
<tr>

<th style="
background:#16211c;
color:#fff;
padding:12px;
text-align:left;
">
Book
</th>

<th style="
background:#16211c;
color:#fff;
padding:12px;
text-align:center;
">
Qty
</th>

<th style="
background:#16211c;
color:#fff;
padding:12px;
text-align:right;
">
Total
</th>

</tr>
</thead>

<tbody>
${lines}
</tbody>

</table>

<div style="
text-align:right;
padding:25px 10px;
font-family:Arial,sans-serif;
font-size:18px;
">

<strong>
Total: €${order.total.toFixed(2)}
</strong>

</div>

<div style="
margin-top:20px;
padding-top:20px;
border-top:1px solid #ddd5c0;
font-family:Arial,sans-serif;
font-size:13px;
line-height:1.8;
">

<strong>Shipping address</strong>

<br>

${escapeHtml(order.customer.address)}

<br>

${escapeHtml(order.customer.city)}
${order.customer.province
  ? `, ${escapeHtml(order.customer.province)}`
  : ""}
${order.customer.postcode
  ? `, ${escapeHtml(order.customer.postcode)}`
  : ""}

</div>

</div>

</div>

</body>
</html>
`;
}

/* =========================================================
   AUTHOR EMAIL
   ========================================================= */

function authorEmailHtml(order) {
  const lines = order.lines
    .map(
      (item) => `
        <tr>
          <td style="
            padding:12px;
            border-bottom:1px solid #ddd5c0;
          ">
            ${escapeHtml(item.title)}
          </td>

          <td style="
            padding:12px;
            text-align:center;
            border-bottom:1px solid #ddd5c0;
          ">
            ${item.qty}
          </td>

          <td style="
            padding:12px;
            text-align:right;
            border-bottom:1px solid #ddd5c0;
          ">
            €${item.total.toFixed(2)}
          </td>
        </tr>
      `
    )
    .join("");

  const customer = order.customer;

  return `
<!doctype html>
<html>
<body style="
margin:0;
padding:30px;
background:#f4f0e3;
font-family:Georgia,serif;
color:#16211c;
">

<div style="
max-width:700px;
margin:auto;
background:#faf8f0;
border:1px solid #dcd3b8;
">

<div style="
padding:35px;
text-align:center;
border-bottom:1px solid #dcd3b8;
">

<p style="
font-family:Arial,sans-serif;
font-size:11px;
letter-spacing:3px;
color:#8b7651;
font-weight:bold;
">
NEW ORDER
</p>

<h1 style="
margin:0;
font-size:34px;
letter-spacing:3px;
">
LUIS CAPARRÓS
</h1>

</div>

<div style="padding:35px;">

<h2>New Order Received</h2>

<div style="
background:#f3eee1;
padding:20px;
border:1px solid #ddd5c0;
font-family:Arial,sans-serif;
font-size:13px;
line-height:1.8;
">

<strong>Order:</strong>
${escapeHtml(order.number)}

<br>

<strong>Date:</strong>
${escapeHtml(order.date)}

<br>

<strong>Total:</strong>
€${order.total.toFixed(2)}

<br>

<strong>Payment:</strong>
Stripe / Card

</div>

<h3>Customer Details</h3>

<p style="
font-family:Arial,sans-serif;
font-size:14px;
line-height:1.9;
">

<strong>Name:</strong>
${escapeHtml(customer.name)}

<br>

<strong>Email:</strong>
${escapeHtml(customer.email)}

<br>

<strong>Phone:</strong>
${escapeHtml(customer.phone || "N/A")}

<br>

<strong>Address:</strong>
${escapeHtml(customer.address || "N/A")}

<br>

<strong>City:</strong>
${escapeHtml(customer.city || "N/A")}

<br>

<strong>Province:</strong>
${escapeHtml(customer.province || "N/A")}

<br>

<strong>Postcode:</strong>
${escapeHtml(customer.postcode || "N/A")}

<br>

<strong>Notes:</strong>
${escapeHtml(customer.notes || "None")}

</p>

<h3>Ordered Books</h3>

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="
border-collapse:collapse;
font-family:Arial,sans-serif;
font-size:14px;
"
>

<thead>
<tr>

<th style="
background:#16211c;
color:#fff;
padding:12px;
text-align:left;
">
Book
</th>

<th style="
background:#16211c;
color:#fff;
padding:12px;
text-align:center;
">
Qty
</th>

<th style="
background:#16211c;
color:#fff;
padding:12px;
text-align:right;
">
Total
</th>

</tr>
</thead>

<tbody>
${lines}
</tbody>

</table>

</div>

</div>

</body>
</html>
`;
}

/* =========================================================
   BUILD ORDER
   ========================================================= */

async function buildOrder(session) {
  const fullSession =
    await stripe.checkout.sessions.retrieve(
      session.id,
      {
        expand: ["line_items"],
      }
    );

  if (fullSession.payment_status !== "paid") {
    return null;
  }

  const metadata = fullSession.metadata || {};

  const lines =
    fullSession.line_items?.data?.map((item) => ({
      title: item.description || "Book",
      qty: item.quantity || 1,
      total: (item.amount_total || 0) / 100,
      price:
        (item.amount_total || 0) /
        100 /
        (item.quantity || 1),
    })) || [];

  return {
    number: getOrderNumber(fullSession.id),

    date: formatDate(),

    lines,

    total: (fullSession.amount_total || 0) / 100,

    customer: {
      name:
        metadata.customer_name ||
        "Customer",

      email:
        metadata.customer_email ||
        fullSession.customer_details?.email ||
        "",

      phone:
        metadata.customer_phone ||
        fullSession.customer_details?.phone ||
        "",

      address:
        metadata.customer_address ||
        "",

      city:
        metadata.customer_city ||
        "",

      province:
        metadata.customer_province ||
        "",

      postcode:
        metadata.customer_postcode ||
        "",

      notes:
        metadata.customer_notes ||
        "",
    },
  };
}

/* =========================================================
   WEBHOOK HANDLER
   ========================================================= */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed.",
    });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({
      error: "STRIPE_SECRET_KEY is not configured.",
    });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({
      error: "RESEND_API_KEY is not configured.",
    });
  }

  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(500).json({
      error:
        "STRIPE_WEBHOOK_SECRET is not configured.",
    });
  }

  const signature =
    req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).json({
      error: "Missing Stripe signature.",
    });
  }

  /* -------------------------------------------------------
     Read RAW body
     ------------------------------------------------------- */

  let rawBody;

  try {
    rawBody = await readRawBody(req);
  } catch (error) {
    console.error(
      "❌ Failed to read webhook body:",
      error
    );

    return res.status(400).json({
      error: "Unable to read webhook body.",
    });
  }

  /* -------------------------------------------------------
     Verify Stripe signature
     ------------------------------------------------------- */

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error(
      "❌ Webhook signature verification failed:",
      error.message
    );

    return res.status(400).json({
      error: "Invalid webhook signature.",
    });
  }

  console.log(
    "✅ Stripe webhook received:",
    event.type,
    event.id
  );

  /* -------------------------------------------------------
     Only process completed Checkout sessions
     ------------------------------------------------------- */

  if (
    event.type !==
    "checkout.session.completed"
  ) {
    return res.status(200).json({
      received: true,
      ignored: true,
    });
  }

  try {
    const session = event.data.object;

    if (session.payment_status !== "paid") {
      console.log(
        "⚠️ Checkout completed but payment is not paid:",
        session.id
      );

      return res.status(200).json({
        received: true,
        skipped: true,
      });
    }

    const order = await buildOrder(session);

    if (!order) {
      return res.status(200).json({
        received: true,
        skipped: true,
      });
    }

    /* -------------------------------------------------------
       TEST MODE

       During testing BOTH emails go to your Gmail.
       Later set EMAIL_TEST_MODE=false and the customer
       email will go to the real customer.
       ------------------------------------------------------- */

    const customerRecipient = TEST_MODE
      ? TEST_EMAIL
      : order.customer.email || TEST_EMAIL;

    /* -------------------------------------------------------
       Customer email

       Stripe may retry the webhook. The same Resend
       idempotency key prevents duplicate sends.
       ------------------------------------------------------- */

    const customerResult =
      await resend.emails.send(
        {
          from: FROM_EMAIL,

          to: [customerRecipient],

          subject:
            `Order Confirmation #${order.number}`,

          html: customerEmailHtml(order),
        },
        {
          idempotencyKey:
            `stripe-customer-${event.id}`,
        }
      );

    if (customerResult?.error) {
      throw new Error(
        customerResult.error.message ||
          "Customer email failed."
      );
    }

    /* -------------------------------------------------------
       Author/admin email
       ------------------------------------------------------- */

    const authorResult =
      await resend.emails.send(
        {
          from: FROM_EMAIL,

          to: [TEST_EMAIL],

          subject:
            `New Order #${order.number}`,

          html: authorEmailHtml(order),
        },
        {
          idempotencyKey:
            `stripe-author-${event.id}`,
        }
      );

    if (authorResult?.error) {
      throw new Error(
        authorResult.error.message ||
          "Author email failed."
      );
    }

    console.log(
      `✅ Order ${order.number} processed successfully.`
    );

    return res.status(200).json({
      received: true,
      success: true,
      orderNumber: order.number,
    });
  } catch (error) {
    console.error(
      "❌ Webhook processing failed:",
      error
    );

    return res.status(500).json({
      error:
        error?.message ||
        "Webhook processing failed.",
    });
  }
}