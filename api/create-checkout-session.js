import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function clean(value, maxLength = 500) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed.",
    });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({
      success: false,
      error: "Stripe is not configured.",
    });
  }

  try {
    const body = req.body || {};

    const items = body.items;
    const customer = body.customer || {};
    const shipping = Number(body.shipping || 0);

    /* -------------------------------------------------------
       Validate cart
       ------------------------------------------------------- */

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Cart is empty.",
      });
    }

    /* -------------------------------------------------------
       Validate customer
       ------------------------------------------------------- */

    const customerName = clean(customer.name);
    const customerEmail = clean(customer.email, 320);
    const customerPhone = clean(customer.phone, 100);
    const customerAddress = clean(customer.address, 500);
    const customerCity = clean(customer.city, 200);
    const customerProvince = clean(customer.province, 200);
    const customerPostcode = clean(customer.postcode, 20);
    const customerNotes = clean(customer.notes, 1000);

    if (customerName.length < 2) {
      return res.status(400).json({
        success: false,
        error: "Customer name is required.",
      });
    }

    if (!isValidEmail(customerEmail)) {
      return res.status(400).json({
        success: false,
        error: "A valid customer email is required.",
      });
    }

    if (customerAddress.length < 5) {
      return res.status(400).json({
        success: false,
        error: "Customer address is required.",
      });
    }

    if (customerCity.length < 2) {
      return res.status(400).json({
        success: false,
        error: "Customer city is required.",
      });
    }

    if (!/^\d{5}$/.test(customerPostcode)) {
      return res.status(400).json({
        success: false,
        error: "A valid 5-digit postcode is required.",
      });
    }

    /* -------------------------------------------------------
       Validate shipping
       ------------------------------------------------------- */

    if (!Number.isFinite(shipping) || shipping < 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid shipping amount.",
      });
    }

    /* -------------------------------------------------------
       Build Stripe line items
       ------------------------------------------------------- */

    const lineItems = [];

    for (let index = 0; index < items.length; index += 1) {
      const item = items[index] || {};

      const title = clean(
        item.title || `Book ${index + 1}`,
        500
      );

      const price = Number(item.price);
      const qty = Number(item.qty);

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          success: false,
          error: `Invalid price for ${title}.`,
        });
      }

      if (!Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({
          success: false,
          error: `Invalid quantity for ${title}.`,
        });
      }

      const unitAmount = Math.round(price * 100);

      if (unitAmount < 0) {
        return res.status(400).json({
          success: false,
          error: `Invalid amount for ${title}.`,
        });
      }

      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: title,
          },
          unit_amount: unitAmount,
        },
        quantity: qty,
      });
    }

    /* -------------------------------------------------------
       Add shipping
       ------------------------------------------------------- */

    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Shipping",
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    /* -------------------------------------------------------
       Frontend URL
       ------------------------------------------------------- */

    const frontendUrl =
      process.env.FRONTEND_URL ||
      req.headers.origin ||
      "http://localhost:5173";

    /* -------------------------------------------------------
       Create Stripe Checkout Session
       ------------------------------------------------------- */

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: lineItems,

      mode: "payment",

      success_url: `${frontendUrl}/#/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/#/checkout`,

      customer_email: customerEmail,

      metadata: {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        customer_city: customerCity,
        customer_province: customerProvince,
        customer_postcode: customerPostcode,
        customer_notes: customerNotes,
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
    console.error("❌ Stripe checkout error:", error);

    return res.status(500).json({
      success: false,
      error:
        error?.message ||
        "Unable to create checkout session.",
    });
  }
}