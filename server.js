import "dotenv/config";
import express from "express";
import cors from "cors";
import { Resend } from "resend";
import Stripe from "stripe";

const app = express();

/* =========================================================
   ENVIRONMENT
========================================================= */

const PORT = process.env.PORT || 5000;

const RESEND_API_KEY = process.env.RESEND_API_KEY;

const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ||
  "Luis Caparrós Website <onboarding@resend.dev>";

const RESEND_TO_EMAIL =
  process.env.RESEND_TO_EMAIL || "inamuafridi300@gmail.com";

const EMAIL_TEST_MODE =
  String(process.env.EMAIL_TEST_MODE).toLowerCase() === "true";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!RESEND_API_KEY) {
  console.warn("⚠️ RESEND_API_KEY is missing.");
}

if (!STRIPE_SECRET_KEY) {
  console.warn("⚠️ STRIPE_SECRET_KEY is missing.");
}

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;


/* =========================================================
   CORS
========================================================= */

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);


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


function isValidEmail(email = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}


function getEmailRecipient(realRecipient) {
  if (EMAIL_TEST_MODE) {
    return RESEND_TO_EMAIL;
  }

  return realRecipient;
}


function getOrderNumber(sessionId) {
  if (!sessionId) {
    return `LC-${Date.now().toString().slice(-8)}`;
  }

  return `LC-${sessionId.replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase()}`;
}


async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}) {
  if (!resend) {
    throw new Error("Resend is not configured. Missing RESEND_API_KEY.");
  }

  const recipient = getEmailRecipient(to);

  const payload = {
    from: RESEND_FROM_EMAIL,
    to: [recipient],
    subject,
    html,
  };

  if (replyTo && isValidEmail(replyTo)) {
    payload.replyTo = replyTo;
  }

  console.log("📧 Sending email:", {
    to: recipient,
    subject,
    testMode: EMAIL_TEST_MODE,
  });

  const { data, error } = await resend.emails.send(payload);

  if (error) {
    console.error("❌ Resend API Error:", error);

    throw new Error(
      error.message || "Resend failed to send the email."
    );
  }

  console.log("✅ Email sent:", data?.id || "success");

  return data;
}


/* =========================================================
   BEAUTIFUL CONTACT EMAIL
========================================================= */

function contactEmailTemplate({
  name,
  email,
  subject,
  message,
}) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject || "No subject");
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  return `
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Website Contact</title>
</head>

<body
  style="
    margin:0;
    padding:30px;
    background:#f4f0e3;
    font-family:Georgia,'Times New Roman',serif;
    color:#16211c;
  "
>

  <div
    style="
      max-width:700px;
      margin:0 auto;
      background:#faf8f0;
      border:1px solid #dcd3b8;
      padding:0;
    "
  >

    <!-- HEADER -->
    <div
      style="
        padding:35px 35px 28px;
        border-bottom:1px solid #dcd3b8;
        text-align:center;
      "
    >

      <div
        style="
          font-size:12px;
          letter-spacing:4px;
          color:#8b7651;
          margin-bottom:12px;
          font-family:Arial,sans-serif;
          font-weight:bold;
        "
      >
        WEBSITE CONTACT
      </div>

      <h1
        style="
          margin:0;
          font-size:34px;
          line-height:1.1;
          letter-spacing:3px;
          color:#16211c;
        "
      >
        LUIS CAPARRÓS
      </h1>

      <p
        style="
          margin:12px 0 0;
          font-family:Arial,sans-serif;
          font-size:12px;
          letter-spacing:2px;
          text-transform:uppercase;
          color:#8b7651;
        "
      >
        New Message Received
      </p>

    </div>


    <!-- INTRO -->
    <div
      style="
        padding:30px 35px 15px;
      "
    >

      <p
        style="
          margin:0;
          font-size:18px;
          line-height:1.7;
        "
      >
        A new message has been submitted through the
        <strong>Luis Caparrós</strong> website.
      </p>

    </div>


    <!-- DETAILS -->
    <div
      style="
        margin:20px 35px;
        border:1px solid #ddd5c0;
        background:#f6f2e7;
      "
    >

      <div
        style="
          padding:18px 20px;
          border-bottom:1px solid #ddd5c0;
        "
      >
        <div
          style="
            font-family:Arial,sans-serif;
            font-size:10px;
            text-transform:uppercase;
            letter-spacing:2px;
            color:#8b7651;
            margin-bottom:7px;
            font-weight:bold;
          "
        >
          Name
        </div>

        <div
          style="
            font-size:18px;
            color:#16211c;
          "
        >
          ${safeName}
        </div>
      </div>


      <div
        style="
          padding:18px 20px;
          border-bottom:1px solid #ddd5c0;
        "
      >
        <div
          style="
            font-family:Arial,sans-serif;
            font-size:10px;
            text-transform:uppercase;
            letter-spacing:2px;
            color:#8b7651;
            margin-bottom:7px;
            font-weight:bold;
          "
        >
          Email
        </div>

        <div
          style="
            font-family:Arial,sans-serif;
            font-size:15px;
            color:#16211c;
          "
        >
          ${safeEmail}
        </div>
      </div>


      <div
        style="
          padding:18px 20px;
        "
      >
        <div
          style="
            font-family:Arial,sans-serif;
            font-size:10px;
            text-transform:uppercase;
            letter-spacing:2px;
            color:#8b7651;
            margin-bottom:7px;
            font-weight:bold;
          "
        >
          Subject
        </div>

        <div
          style="
            font-size:17px;
            color:#16211c;
          "
        >
          ${safeSubject}
        </div>
      </div>

    </div>


    <!-- MESSAGE -->
    <div
      style="
        padding:10px 35px 35px;
      "
    >

      <div
        style="
          font-family:Arial,sans-serif;
          font-size:10px;
          text-transform:uppercase;
          letter-spacing:2px;
          color:#8b7651;
          margin-bottom:12px;
          font-weight:bold;
        "
      >
        Message
      </div>

      <div
        style="
          background:#ffffff;
          border-left:4px solid #8b7651;
          padding:22px;
          font-size:17px;
          line-height:1.8;
          color:#26332c;
        "
      >
        ${safeMessage}
      </div>

    </div>


    <!-- FOOTER -->
    <div
      style="
        padding:25px 35px;
        border-top:1px solid #dcd3b8;
        text-align:center;
        background:#f2eee2;
      "
    >

      <p
        style="
          margin:0;
          font-family:Arial,sans-serif;
          font-size:11px;
          line-height:1.6;
          color:#827b6c;
        "
      >
        This email was automatically generated by the
        Luis Caparrós website contact form.
      </p>

    </div>

  </div>

</body>
</html>
`;
}


/* =========================================================
   ORDER EMAIL TEMPLATES
========================================================= */

function orderCustomerEmailTemplate(order) {
  const customer = order.customer;

  const linesHtml = order.lines
    .map(
      (item) => `
        <tr>
          <td
            style="
              padding:14px 10px;
              border-bottom:1px solid #e3ddce;
              font-size:15px;
            "
          >
            ${escapeHtml(item.title)}
          </td>

          <td
            style="
              padding:14px 10px;
              border-bottom:1px solid #e3ddce;
              text-align:center;
              font-family:Arial,sans-serif;
            "
          >
            ${item.qty}
          </td>

          <td
            style="
              padding:14px 10px;
              border-bottom:1px solid #e3ddce;
              text-align:right;
              font-family:Arial,sans-serif;
              font-weight:bold;
            "
          >
            €${item.total.toFixed(2)}
          </td>
        </tr>
      `
    )
    .join("");

  return `
<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Order Confirmation</title>
</head>

<body
style="
margin:0;
padding:30px;
background:#f4f0e3;
font-family:Georgia,'Times New Roman',serif;
color:#16211c;
"
>

<div
style="
max-width:700px;
margin:0 auto;
background:#faf8f0;
border:1px solid #dcd3b8;
"
>

<div
style="
padding:35px;
text-align:center;
border-bottom:1px solid #dcd3b8;
"
>

<div
style="
font-family:Arial,sans-serif;
font-size:11px;
letter-spacing:3px;
color:#8b7651;
font-weight:bold;
margin-bottom:10px;
"
>
ORDER CONFIRMATION
</div>

<h1
style="
margin:0;
font-size:34px;
letter-spacing:3px;
"
>
LUIS CAPARRÓS
</h1>

<p
style="
margin:12px 0 0;
font-family:Arial,sans-serif;
font-size:12px;
color:#8b7651;
letter-spacing:2px;
"
>
THANK YOU FOR YOUR ORDER
</p>

</div>


<div style="padding:35px;">

<p
style="
font-size:18px;
line-height:1.7;
margin-top:0;
"
>
Dear ${escapeHtml(customer.name || "Customer")},
</p>

<p
style="
font-size:17px;
line-height:1.7;
"
>
Your order has been successfully received and your payment has been confirmed.
</p>


<div
style="
background:#f3eee1;
border:1px solid #ddd5c0;
padding:20px;
margin:25px 0;
"
>

<p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:13px;">
<strong>Order number:</strong> ${escapeHtml(order.number)}
</p>

<p style="margin:0;font-family:Arial,sans-serif;font-size:13px;">
<strong>Date:</strong> ${escapeHtml(order.date)}
</p>

</div>


<table
width="100%"
cellpadding="0"
cellspacing="0"
style="
border-collapse:collapse;
margin-top:25px;
"
>

<thead>
<tr>

<th
style="
padding:12px 10px;
background:#16211c;
color:#fff;
text-align:left;
font-family:Arial,sans-serif;
font-size:11px;
letter-spacing:1px;
text-transform:uppercase;
"
>
Book
</th>

<th
style="
padding:12px 10px;
background:#16211c;
color:#fff;
text-align:center;
font-family:Arial,sans-serif;
font-size:11px;
letter-spacing:1px;
text-transform:uppercase;
"
>
Qty
</th>

<th
style="
padding:12px 10px;
background:#16211c;
color:#fff;
text-align:right;
font-family:Arial,sans-serif;
font-size:11px;
letter-spacing:1px;
text-transform:uppercase;
"
>
Total
</th>

</tr>
</thead>

<tbody>
${linesHtml}
</tbody>

</table>


<div
style="
text-align:right;
padding:25px 10px;
font-family:Arial,sans-serif;
font-size:18px;
"
>
<strong>Total: €${order.total.toFixed(2)}</strong>
</div>


<p
style="
font-size:16px;
line-height:1.7;
"
>
Thank you for supporting Luis Caparrós directly.
</p>

</div>


<div
style="
padding:25px;
text-align:center;
background:#f2eee2;
border-top:1px solid #dcd3b8;
font-family:Arial,sans-serif;
font-size:11px;
color:#827b6c;
"
>
Luis Caparrós Website
</div>

</div>

</body>
</html>
`;
}


function orderAuthorEmailTemplate(order) {
  const customer = order.customer;

  const linesHtml = order.lines
    .map(
      (item) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #ddd5c0;">
            ${escapeHtml(item.title)}
          </td>

          <td
            style="
              padding:12px;
              text-align:center;
              border-bottom:1px solid #ddd5c0;
              font-family:Arial,sans-serif;
            "
          >
            ${item.qty}
          </td>

          <td
            style="
              padding:12px;
              text-align:right;
              border-bottom:1px solid #ddd5c0;
              font-family:Arial,sans-serif;
              font-weight:bold;
            "
          >
            €${item.total.toFixed(2)}
          </td>
        </tr>
      `
    )
    .join("");

  return `
<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>New Order</title>
</head>

<body
style="
margin:0;
padding:30px;
background:#f4f0e3;
font-family:Georgia,'Times New Roman',serif;
color:#16211c;
"
>

<div
style="
max-width:700px;
margin:0 auto;
background:#faf8f0;
border:1px solid #dcd3b8;
"
>

<div
style="
padding:35px;
text-align:center;
border-bottom:1px solid #dcd3b8;
"
>

<div
style="
font-family:Arial,sans-serif;
font-size:11px;
letter-spacing:3px;
color:#8b7651;
font-weight:bold;
margin-bottom:10px;
"
>
NEW ORDER
</div>

<h1
style="
margin:0;
font-size:34px;
letter-spacing:3px;
"
>
LUIS CAPARRÓS
</h1>

</div>


<div style="padding:35px;">

<h2
style="
font-size:25px;
margin-top:0;
"
>
A new order has been received.
</h2>


<div
style="
background:#f3eee1;
border:1px solid #ddd5c0;
padding:20px;
margin:25px 0;
font-family:Arial,sans-serif;
font-size:13px;
line-height:1.8;
"
>

<strong>Order:</strong> ${escapeHtml(order.number)}<br>
<strong>Date:</strong> ${escapeHtml(order.date)}<br>
<strong>Payment:</strong> Card / Stripe<br>
<strong>Total:</strong> €${order.total.toFixed(2)}

</div>


<h3
style="
font-size:18px;
border-bottom:1px solid #dcd3b8;
padding-bottom:10px;
"
>
Customer Details
</h3>

<div
style="
font-family:Arial,sans-serif;
font-size:14px;
line-height:1.9;
"
>

<strong>Name:</strong> ${escapeHtml(customer.name)}<br>

<strong>Email:</strong> ${escapeHtml(customer.email)}<br>

<strong>Phone:</strong>
${escapeHtml(customer.phone || "N/A")}<br>

<strong>Address:</strong>
${escapeHtml(customer.address || "N/A")}<br>

<strong>City:</strong>
${escapeHtml(customer.city || "N/A")}<br>

<strong>Postcode:</strong>
${escapeHtml(customer.postcode || "N/A")}<br>

<strong>Notes:</strong>
${escapeHtml(customer.notes || "None")}

</div>


<h3
style="
font-size:18px;
margin-top:30px;
border-bottom:1px solid #dcd3b8;
padding-bottom:10px;
"
>
Ordered Books
</h3>


<table
width="100%"
cellpadding="0"
cellspacing="0"
style="
border-collapse:collapse;
font-size:14px;
"
>

<thead>
<tr>

<th
style="
padding:12px;
background:#16211c;
color:#fff;
text-align:left;
font-family:Arial,sans-serif;
"
>
Book
</th>

<th
style="
padding:12px;
background:#16211c;
color:#fff;
text-align:center;
font-family:Arial,sans-serif;
"
>
Qty
</th>

<th
style="
padding:12px;
background:#16211c;
color:#fff;
text-align:right;
font-family:Arial,sans-serif;
"
>
Total
</th>

</tr>
</thead>

<tbody>
${linesHtml}
</tbody>

</table>

</div>


<div
style="
padding:25px;
text-align:center;
background:#f2eee2;
border-top:1px solid #dcd3b8;
font-family:Arial,sans-serif;
font-size:11px;
color:#827b6c;
"
>
Automatic order notification
</div>

</div>

</body>
</html>
`;
}


/* =========================================================
   BUILD ORDER FROM STRIPE SESSION
========================================================= */

async function buildOrderFromSession(sessionId) {
  if (!stripe) {
    throw new Error("Stripe is not configured.");
  }

  if (!sessionId) {
    throw new Error("Missing Stripe session ID.");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "customer_details"],
  });

  if (!session) {
    throw new Error("Stripe checkout session not found.");
  }

  if (session.payment_status !== "paid") {
    throw new Error(
      `Payment has not been completed. Current status: ${session.payment_status}`
    );
  }

  const customerDetails = session.customer_details || {};

  const lines =
    session.line_items?.data?.map((item) => ({
      title: item.description || "Book",
      qty: item.quantity || 1,
      price:
        item.quantity > 0
          ? (item.amount_total / 100) / item.quantity
          : 0,
      total: (item.amount_total || 0) / 100,
    })) || [];

  const order = {
    number: getOrderNumber(session.id),

    date: new Date().toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),

    lines,

    total: (session.amount_total || 0) / 100,

    customer: {
      name:
        session.metadata?.customer_name ||
        customerDetails.name ||
        "Customer",

      email:
        session.metadata?.customer_email ||
        customerDetails.email ||
        "",

      phone:
        session.metadata?.customer_phone ||
        customerDetails.phone ||
        "",

      address:
        customerDetails.address?.line1 ||
        "",

      city:
        customerDetails.address?.city ||
        "",

      postcode:
        customerDetails.address?.postal_code ||
        "",

      notes:
        session.metadata?.customer_notes ||
        "",
    },

    payment: "card",

    stripeSessionId: session.id,
  };

  return order;
}


/* =========================================================
   SEND ORDER EMAILS
========================================================= */

async function sendOrderEmails(order) {
  const customerEmail = order.customer.email;

  if (!customerEmail && !EMAIL_TEST_MODE) {
    throw new Error("Customer email is missing.");
  }

  /*
   * TEST MODE:
   *
   * Customer email -> inamuafridi300@gmail.com
   * Author email   -> inamuafridi300@gmail.com
   *
   * Production:
   * Customer email -> actual customer
   * Author email   -> RESEND_TO_EMAIL
   */

  await sendEmail({
    to: customerEmail || RESEND_TO_EMAIL,

    subject: `Order Confirmation #${order.number}`,

    html: orderCustomerEmailTemplate(order),
  });


  await sendEmail({
    to: RESEND_TO_EMAIL,

    subject: `New Order #${order.number}`,

    html: orderAuthorEmailTemplate(order),
  });

  console.log(
    `✅ Order emails completed for ${order.number}`
  );
}


/* =========================================================
   STRIPE WEBHOOK
   IMPORTANT:
   This route MUST receive the raw Stripe request body.
========================================================= */

app.post(
  "/api/stripe-webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    if (!stripe) {
      return res.status(500).json({
        error: "Stripe is not configured.",
      });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error(
        "❌ STRIPE_WEBHOOK_SECRET is missing."
      );

      return res.status(500).json({
        error: "Stripe webhook secret is not configured.",
      });
    }

    const signature = req.headers["stripe-signature"];

    if (!signature) {
      return res.status(400).json({
        error: "Missing Stripe signature.",
      });
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (error) {
      console.error(
        "❌ Stripe webhook signature verification failed:",
        error.message
      );

      return res.status(400).json({
        error: "Invalid Stripe webhook signature.",
      });
    }

    try {
      console.log(
        `🔔 Stripe event received: ${event.type}`
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        /*
         * Only process paid orders.
         */
        if (session.payment_status === "paid") {
          const order = await buildOrderFromSession(
            session.id
          );

          await sendOrderEmails(order);

          console.log(
            `✅ Webhook processed order ${order.number}`
          );
        } else {
          console.log(
            `ℹ️ Checkout completed but payment status is ${session.payment_status}`
          );
        }
      }

      return res.status(200).json({
        received: true,
      });
    } catch (error) {
      console.error(
        "❌ Webhook order processing error:",
        error
      );

      return res.status(500).json({
        error: error.message || "Webhook processing failed.",
      });
    }
  }
);


/* =========================================================
   JSON BODY PARSER
   Must come AFTER the webhook route.
========================================================= */

app.use(express.json({ limit: "1mb" }));


/* =========================================================
   1. CONTACT FORM
========================================================= */

app.post("/api/contact", async (req, res) => {
  try {
    const {
      name,
      email,
      subject,
      message,
    } = req.body || {};

    /* ---------- VALIDATION ---------- */

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid name.",
      });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address.",
      });
    }

    if (!message || message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: "Message must contain at least 10 characters.",
      });
    }


    /* ---------- SEND EMAIL ---------- */

    const emailData = await sendEmail({
      to: RESEND_TO_EMAIL,

      subject: `New message from ${name.trim()}`,

      replyTo: email.trim(),

      html: contactEmailTemplate({
        name: name.trim(),
        email: email.trim(),
        subject: subject?.trim() || "",
        message: message.trim(),
      }),
    });


    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
      id: emailData?.id || null,
    });
  } catch (error) {
    console.error(
      "❌ Contact form error:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error.message ||
        "Unable to send your message right now.",
    });
  }
});


/* =========================================================
   2. CREATE STRIPE CHECKOUT SESSION
========================================================= */

app.post(
  "/api/create-checkout-session",
  async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({
          success: false,
          error: "Stripe is not configured.",
        });
      }

      const {
        items,
        shipping = 0,
        customer,
      } = req.body || {};


      /* ---------- VALIDATION ---------- */

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Cart is empty.",
        });
      }

      if (!customer || typeof customer !== "object") {
        return res.status(400).json({
          success: false,
          error: "Customer information is missing.",
        });
      }

      if (!customer.email || !isValidEmail(customer.email)) {
        return res.status(400).json({
          success: false,
          error: "A valid customer email is required.",
        });
      }


      /* ---------- BUILD LINE ITEMS ---------- */

      const lineItems = items.map((item, index) => {
        const title =
          typeof item.title === "string" &&
          item.title.trim()
            ? item.title.trim()
            : `Book ${index + 1}`;

        const price = Number(item.price);
        const qty = Number(item.qty);

        if (!Number.isFinite(price) || price < 0) {
          throw new Error(
            `Invalid price for "${title}".`
          );
        }

        if (!Number.isInteger(qty) || qty < 1) {
          throw new Error(
            `Invalid quantity for "${title}".`
          );
        }

        return {
          price_data: {
            currency: "eur",

            product_data: {
              name: title,
            },

            unit_amount: Math.round(
              price * 100
            ),
          },

          quantity: qty,
        };
      });


      /* ---------- SHIPPING ---------- */

      const shippingAmount = Number(shipping);

      if (
        Number.isFinite(shippingAmount) &&
        shippingAmount > 0
      ) {
        lineItems.push({
          price_data: {
            currency: "eur",

            product_data: {
              name: "Shipping",
            },

            unit_amount: Math.round(
              shippingAmount * 100
            ),
          },

          quantity: 1,
        });
      }


      /* ---------- TRUSTED ORIGIN ---------- */

      const origin =
        req.headers.origin ||
        process.env.FRONTEND_URL ||
        "http://localhost:5173";

      /*
       * Do not allow an arbitrary Origin to become a
       * redirect target in production.
       */

      const allowedOrigins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        process.env.FRONTEND_URL,
        process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : null,
      ].filter(Boolean);

      const safeOrigin = allowedOrigins.includes(origin)
        ? origin
        : process.env.FRONTEND_URL ||
          "http://localhost:5173";


      /* ---------- CREATE SESSION ---------- */

      const session =
        await stripe.checkout.sessions.create({
          payment_method_types: ["card"],

          line_items: lineItems,

          mode: "payment",

          success_url:
            `${safeOrigin}/order-confirmed` +
            `?session_id={CHECKOUT_SESSION_ID}`,

          cancel_url:
            `${safeOrigin}/checkout`,

          customer_email:
            customer.email.trim(),

          metadata: {
            customer_name:
              String(customer.name || "").slice(0, 500),

            customer_phone:
              String(customer.phone || "").slice(0, 100),

            customer_notes:
              String(customer.notes || "").slice(0, 1000),

            customer_email:
              customer.email.trim(),
          },
        });


      console.log(
        "✅ Stripe checkout session created:",
        session.id
      );


      return res.status(200).json({
        success: true,
        sessionId: session.id,
        url: session.url,
      });
    } catch (error) {
      console.error(
        "❌ Stripe checkout error:",
        error
      );

      return res.status(500).json({
        success: false,
        error:
          error.message ||
          "Unable to create checkout session.",
      });
    }
  }
);


/* =========================================================
   3. ORDER CONFIRMATION
   This remains as a fallback/display endpoint.
========================================================= */

app.get(
  "/api/order-confirmed",
  async (req, res) => {
    try {
      const { session_id } =
        req.query || {};

      if (!session_id) {
        return res.status(400).json({
          success: false,
          error: "Missing session_id.",
        });
      }

      const order =
        await buildOrderFromSession(
          session_id
        );


      /*
       * IMPORTANT:
       *
       * The Stripe webhook is the primary order processor.
       *
       * We still send emails here because your existing
       * order-confirmed page already depends on this endpoint.
       *
       * Once the webhook is configured and tested, you can
       * remove this sendOrderEmails() call and make this endpoint
       * display-only.
       */

      await sendOrderEmails(order);


      return res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      console.error(
        "❌ Order confirmation error:",
        error
      );

      return res.status(500).json({
        success: false,
        error:
          error.message ||
          "Unable to confirm order.",
      });
    }
  }
);


/* =========================================================
   4. TEST EMAIL
========================================================= */

app.get(
  "/api/test-email",
  async (req, res) => {
    try {
      const data = await sendEmail({
        to: RESEND_TO_EMAIL,

        subject:
          "Luis Caparrós Website — Test Email",

        html: `
          <!doctype html>
          <html>
          <body
          style="
          margin:0;
          padding:40px;
          background:#f4f0e3;
          font-family:Georgia,serif;
          color:#16211c;
          "
          >

          <div
          style="
          max-width:600px;
          margin:auto;
          padding:40px;
          background:#faf8f0;
          border:1px solid #dcd3b8;
          text-align:center;
          "
          >

          <p
          style="
          font-family:Arial,sans-serif;
          font-size:11px;
          letter-spacing:3px;
          color:#8b7651;
          "
          >
          TEST EMAIL
          </p>

          <h1
          style="
          font-size:32px;
          letter-spacing:3px;
          "
          >
          LUIS CAPARRÓS
          </h1>

          <p
          style="
          font-size:17px;
          line-height:1.7;
          "
          >
          Your Resend integration is working correctly.
          </p>

          <p
          style="
          font-family:Arial,sans-serif;
          font-size:13px;
          color:#777;
          "
          >
          This email was sent to your testing address.
          </p>

          </div>

          </body>
          </html>
        `,
      });


      return res.status(200).json({
        success: true,
        message: "Test email sent successfully.",
        id: data?.id || null,
      });
    } catch (error) {
      console.error(
        "❌ Test email error:",
        error
      );

      return res.status(500).json({
        success: false,
        error:
          error.message ||
          "Test email failed.",
      });
    }
  }
);


/* =========================================================
   HEALTH CHECK
========================================================= */

app.get(
  "/api/health",
  (req, res) => {
    return res.status(200).json({
      success: true,
      server: "online",
      resendConfigured: Boolean(
        RESEND_API_KEY
      ),
      stripeConfigured: Boolean(
        STRIPE_SECRET_KEY
      ),
      emailTestMode: EMAIL_TEST_MODE,
      timestamp: new Date().toISOString(),
    });
  }
);


/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use(
  (error, req, res, next) => {
    console.error(
      "❌ Unhandled server error:",
      error
    );

    if (res.headersSent) {
      return next(error);
    }

    return res.status(500).json({
      success: false,
      error:
        error.message ||
        "Internal server error.",
    });
  }
);


/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, () => {
  console.log("");
  console.log("============================================");
  console.log("🚀 Luis Caparrós backend");
  console.log("============================================");
  console.log(
    `🌐 Server: http://localhost:${PORT}`
  );
  console.log(
    `📧 Resend: ${
      RESEND_API_KEY ? "configured" : "MISSING"
    }`
  );
  console.log(
    `💳 Stripe: ${
      STRIPE_SECRET_KEY ? "configured" : "MISSING"
    }`
  );
  console.log(
    `🧪 Email test mode: ${EMAIL_TEST_MODE}`
  );
  console.log(
    `📨 Test recipient: ${RESEND_TO_EMAIL}`
  );
  console.log("============================================");
  console.log("");
});