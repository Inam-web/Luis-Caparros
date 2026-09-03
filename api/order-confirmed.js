import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function clean(value, maxLength = 500) {
  return String(value ?? "")
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export default async function handler(req, res) {
  // -------------------------------------------------------
  // METHOD CHECK
  // -------------------------------------------------------

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed.",
    });
  }

  // -------------------------------------------------------
  // STRIPE CONFIGURATION CHECK
  // -------------------------------------------------------

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ STRIPE_SECRET_KEY is missing.");

    return res.status(500).json({
      success: false,
      error: "Stripe is not configured.",
    });
  }

  try {
    // -------------------------------------------------------
    // READ REQUEST BODY
    // -------------------------------------------------------

    const { items, shipping, customer } = req.body || {};

    // -------------------------------------------------------
    // BASIC VALIDATION
    // -------------------------------------------------------

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Your cart is empty.",
      });
    }

    if (!customer || typeof customer !== "object") {
      return res.status(400).json({
        success: false,
        error: "Customer information is required.",
      });
    }

    // -------------------------------------------------------
    // CUSTOMER DATA
    // -------------------------------------------------------

    const name = clean(customer.name, 200);
    const email = clean(customer.email, 320);
    const phone = clean(customer.phone, 50);
    const address = clean(customer.address, 300);
    const city = clean(customer.city, 100);
    const province = clean(customer.province, 100);
    const postcode = clean(customer.postcode, 20);
    const notes = clean(customer.notes, 1000);

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Name is required.",
      });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address.",
      });
    }

    if (!address) {
      return res.status(400).json({
        success: false,
        error: "Address is required.",
      });
    }

    if (!city) {
      return res.status(400).json({
        success: false,
        error: "City is required.",
      });
    }

    if (!postcode) {
      return res.status(400).json({
        success: false,
        error: "Postcode is required.",
      });
    }

    // -------------------------------------------------------
    // SHIPPING
    // -------------------------------------------------------

    const shippingAmount = Number(shipping) || 0;

    if (!Number.isFinite(shippingAmount) || shippingAmount < 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid shipping amount.",
      });
    }

    // -------------------------------------------------------
    // BUILD STRIPE LINE ITEMS
    // -------------------------------------------------------

    const lineItems = [];

    for (const item of items) {
      const title = clean(item?.title, 200);

      const price = Number(item?.price);
      const quantity = Number(item?.qty);

      if (!title) {
        return res.status(400).json({
          success: false,
          error: "A product is missing its title.",
        });
      }

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          success: false,
          error: `Invalid price for "${title}".`,
        });
      }

      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 100
      ) {
        return res.status(400).json({
          success: false,
          error: `Invalid quantity for "${title}".`,
        });
      }

      lineItems.push({
        price_data: {
          currency: "eur",

          product_data: {
            name: title,
          },

          unit_amount: Math.round(price * 100),
        },

        quantity,
      });
    }

    // -------------------------------------------------------
    // ADD SHIPPING AS A LINE ITEM
    // -------------------------------------------------------

    if (shippingAmount > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",

          product_data: {
            name: "Shipping",
          },

          unit_amount: Math.round(shippingAmount * 100),
        },

        quantity: 1,
      });
    }

    // -------------------------------------------------------
    // FRONTEND URL
    //
    // IMPORTANT:
    // This project uses React HashRouter.
    // Therefore Stripe MUST redirect to /#/order-confirmed
    // instead of /order-confirmed.
    // -------------------------------------------------------

    const origin =
      process.env.FRONTEND_URL ||
      req.headers.origin ||
      "https://luis-caparros.vercel.app";

    // Remove trailing slash to prevent // in URLs.
    const frontendUrl = origin.replace(/\/+$/, "");

    // -------------------------------------------------------
    // CREATE STRIPE CHECKOUT SESSION
    // -------------------------------------------------------

    console.log("📦 Creating Stripe checkout session...");
    console.log("Customer:", email);
    console.log("Items:", items.length);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: lineItems,

      mode: "payment",

      // IMPORTANT:
      // HashRouter requires /#/order-confirmed
      success_url: `${frontendUrl}/#/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,

      // IMPORTANT:
      // HashRouter requires /#/checkout
      cancel_url: `${frontendUrl}/#/checkout`,

      customer_email: email,

      metadata: {
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        customer_address: address,
        customer_city: city,
        customer_province: province,
        customer_postcode: postcode,
        customer_notes: notes,
      },
    });

    // -------------------------------------------------------
    // SUCCESS
    // -------------------------------------------------------

    console.log("✅ Stripe session created:", session.id);

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    // -------------------------------------------------------
    // ERROR HANDLING
    // -------------------------------------------------------

    console.error("❌ Stripe checkout error:", error);

    return res.status(500).json({
      success: false,
      error:
        error?.message ||
        "Unable to create Stripe checkout session.",
    });
  }
}