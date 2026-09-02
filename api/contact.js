import { Resend } from "resend";

export default async function handler(req, res) {
  console.log("CONTACT API CALLED");
  console.log("METHOD:", req.method);

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    // Check Resend API key
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is missing");

      return res.status(500).json({
        success: false,
        error: "Email service is not configured.",
      });
    }

    // Vercel normally gives us req.body as an object.
    // This also handles a string body safely.
    let body = req.body;

    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({
          success: false,
          error: "Invalid JSON body.",
        });
      }
    }

    const {
      name,
      email,
      subject,
      message,
    } = body || {};

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Name, email and message are required.",
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: "Luis Caparrós Website <onboarding@resend.dev>",

      to: ["contacto@luiscaparrosescritor.com"],

      subject: `New message from ${name}: ${
        subject || "Contact Form"
      }`,

      replyTo: email,

      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>New Contact Form Submission</title>
          </head>

          <body
            style="
              margin: 0;
              padding: 30px;
              font-family: Arial, sans-serif;
              background: #f5f5f5;
              color: #222;
            "
          >
            <div
              style="
                max-width: 650px;
                margin: 0 auto;
                background: #ffffff;
                padding: 30px;
                border-radius: 8px;
              "
            >
              <h2 style="margin-top: 0;">
                New Contact Form Submission
              </h2>

              <p>
                <strong>Name:</strong>
                ${escapeHtml(name)}
              </p>

              <p>
                <strong>Email:</strong>
                ${escapeHtml(email)}
              </p>

              <p>
                <strong>Subject:</strong>
                ${escapeHtml(subject || "No subject")}
              </p>

              <hr />

              <p>
                <strong>Message:</strong>
              </p>

              <p style="white-space: pre-wrap;">
                ${escapeHtml(message)}
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);

      return res.status(500).json({
        success: false,
        error: error.message || "Failed to send email.",
      });
    }

    console.log("EMAIL SENT:", data);

    return res.status(200).json({
      success: true,
      message: "Email sent successfully.",
      data,
    });
  } catch (error) {
    console.error("CONTACT API ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error.",
    });
  }
}


// Prevent HTML injection in the email
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}