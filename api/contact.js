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
      to: ["inamuafridi300@gmail.com"],
      subject: `New message from ${name}: ${subject || "Contact Form"}`,
      replyTo: email,

      html: `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>New Contact Form Submission</title>
    </head>

    <body style="
      margin: 0;
      padding: 40px 20px;
      background: #f4f4f4;
      font-family: Arial, Helvetica, sans-serif;
      color: #222;
    ">
      <div style="
        max-width: 650px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      ">

        <div style="
          background: #111111;
          padding: 28px 30px;
          color: #ffffff;
        ">
          <h1 style="
            margin: 0;
            font-size: 24px;
          ">
            New Contact Form Submission
          </h1>

          <p style="
            margin: 8px 0 0;
            color: #cccccc;
            font-size: 14px;
          ">
            Luis Caparrós Website
          </p>
        </div>

        <div style="padding: 30px;">

          <div style="margin-bottom: 22px;">
            <p style="
              margin: 0 0 6px;
              font-size: 12px;
              color: #888888;
              text-transform: uppercase;
              letter-spacing: 1px;
            ">
              Name
            </p>

            <p style="
              margin: 0;
              font-size: 16px;
              font-weight: 600;
            ">
              ${escapeHtml(name)}
            </p>
          </div>

          <div style="margin-bottom: 22px;">
            <p style="
              margin: 0 0 6px;
              font-size: 12px;
              color: #888888;
              text-transform: uppercase;
              letter-spacing: 1px;
            ">
              Email
            </p>

            <p style="
              margin: 0;
              font-size: 16px;
            ">
              ${escapeHtml(email)}
            </p>
          </div>

          <div style="margin-bottom: 22px;">
            <p style="
              margin: 0 0 6px;
              font-size: 12px;
              color: #888888;
              text-transform: uppercase;
              letter-spacing: 1px;
            ">
              Subject
            </p>

            <p style="
              margin: 0;
              font-size: 16px;
              font-weight: 600;
            ">
              ${escapeHtml(subject || "No subject")}
            </p>
          </div>

          <div style="
            border-top: 1px solid #eeeeee;
            padding-top: 24px;
          ">
            <p style="
              margin: 0 0 10px;
              font-size: 12px;
              color: #888888;
              text-transform: uppercase;
              letter-spacing: 1px;
            ">
              Message
            </p>

            <div style="
              background: #f8f8f8;
              padding: 18px;
              border-radius: 8px;
              font-size: 15px;
              line-height: 1.7;
              white-space: pre-wrap;
            ">
              ${escapeHtml(message)}
            </div>
          </div>

        </div>

        <div style="
          padding: 18px 30px;
          background: #fafafa;
          border-top: 1px solid #eeeeee;
          text-align: center;
        ">
          <p style="
            margin: 0;
            font-size: 12px;
            color: #999999;
          ">
            Sent from the Luis Caparrós website contact form
          </p>
        </div>

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