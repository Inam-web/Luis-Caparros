import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function clean(value, maxLength = 500) {
  return String(value ?? "")
    .trim()
    .slice(0, maxLength);
}

function getOrderNumber(sessionId) {
  const cleanId = String(sessionId)
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();

  return `LC-${cleanId.slice(-8)}`;
}

function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString(
    "es-ES",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
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
    const sessionId = clean(
      req.query?.session_id,
      200
    );

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: "Missing session_id.",
      });
    }

    /* -------------------------------------------------------
       Retrieve Stripe session
       ------------------------------------------------------- */

    const session =
      await stripe.checkout.sessions.retrieve(
        sessionId,
        {
          expand: ["line_items"],
        }
      );

    /* -------------------------------------------------------
       Payment check
       ------------------------------------------------------- */

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        error:
          "This order has not been paid successfully.",
      });
    }

    const metadata = session.metadata || {};

    const stripeCustomer =
      session.customer_details || {};

    /* -------------------------------------------------------
       Build order for confirmation page
       ------------------------------------------------------- */

    const lines =
      session.line_items?.data?.map((item) => {
        const quantity = item.quantity || 1;

        const total =
          (item.amount_total || 0) / 100;

        return {
          title:
            item.description || "Book",

          qty: quantity,

          total,

          price:
            total / quantity,
        };
      }) || [];

    const order = {
      number: getOrderNumber(session.id),

      date: formatDate(session.created),

      lines,

      total:
        (session.amount_total || 0) / 100,

      customer: {
        name:
          metadata.customer_name ||
          stripeCustomer.name ||
          "Customer",

        email:
          metadata.customer_email ||
          stripeCustomer.email ||
          "",

        phone:
          metadata.customer_phone ||
          stripeCustomer.phone ||
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

      payment: "card",
    };

    /* -------------------------------------------------------
       IMPORTANT:
       No Resend call here.

       The Stripe webhook is responsible for emails.
       ------------------------------------------------------- */

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
        error?.message ||
        "Unable to retrieve order confirmation.",
    });
  }
}