import { Resend } from "resend";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed. Use POST /api/contact.",
    });
  }

  try {
    // Make sure the Resend key exists
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY is missing");

      return res.status(500).json({
        success: false,
        error: "Email service is not configured.",
      });
    }

    // Get form data
    const {
      name,
      email,
      subject,
      message,
    } = req.body || {};

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Name, email and message are required.",
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(String(email).trim())) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address.",
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email
    const { data, error } = await resend.emails.send({
      from: "Luis Caparrós Website <onboarding@resend.dev>",
      to: ["inamuafridi300@gmail.com"],
      replyTo: String(email).trim(),

      subject: `📩 New message from ${String(name).trim()}`,

      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>New Contact Message</title>
        </head>

        <body
          style="
            margin:0;
            padding:40px 20px;
            background:#f4f0e3;
            font-family:Georgia, 'Times New Roman', serif;
          "
        >
          <div
            style="
              max-width:700px;
              margin:0 auto;
              background:#faf8f0;
              border:1px solid #dcd3b8;
              padding:40px;
            "
          >
            <div
              style="
                border-bottom:3px solid #b9973f;
                padding-bottom:20px;
                text-align:center;
              "
            >
              <h1
                style="
                  margin:0;
                  color:#16211c;
                  font-size:30px;
                "
              >
                LUIS CAPARRÓS
              </h1>

              <p
                style="
                  margin:10px 0 0;
                  color:#71201f;
                  font-size:12px;
                  letter-spacing:4px;
                  text-transform:uppercase;
                "
              >
                Writer · New Message
              </p>
            </div>

            <p
              style="
                color:#2a3d32;
                font-size:17px;
                line-height:1.6;
                margin-top:30px;
              "
            >
              You have received a new message from your website contact form.
            </p>

            <div
              style="
                background:#f4f0e3;
                padding:20px;
                border-left:4px solid #b9973f;
                margin-top:25px;
              "
            >
              <p style="margin:0 0 12px;">
                <strong style="color:#71201f;">Name:</strong>
                ${escapeHtml(name)}
              </p>

              <p style="margin:0 0 12px;">
                <strong style="color:#71201f;">Email:</strong>
                <a
                  href="mailto:${escapeHtml(email)}"
                  style="color:#16211c;"
                >
                  ${escapeHtml(email)}
                </a>
              </p>

              <p style="margin:0;">
                <strong style="color:#71201f;">Subject:</strong>
                ${escapeHtml(subject || "No subject")}
              </p>
            </div>

            <div
              style="
                background:#ffffff;
                padding:20px;
                border-left:4px solid #b9973f;
                margin-top:20px;
              "
            >
              <p
                style="
                  margin:0;
                  font-size:16px;
                  line-height:1.8;
                  white-space:pre-wrap;
                  color:#16211c;
                "
              >
                ${escapeHtml(message)}
              </p>
            </div>

            <div
              style="
                margin-top:30px;
                padding-top:20px;
                border-top:2px solid #dcd3b8;
                text-align:center;
                color:#55705f;
                font-size:13px;
              "
            >
              <p style="margin:0 0 8px;">
                This email was sent from the Luis Caparrós website.
              </p>

              <a
                href="mailto:${escapeHtml(email)}"
                style="color:#71201f;"
              >
                Reply to ${escapeHtml(name)}
              </a>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Resend returned an error
    if (error) {
      console.error("❌ Resend Error:", error);

      return res.status(500).json({
        success: false,
        error: error.message || "Failed to send email.",
      });
    }

    console.log("✅ Email sent successfully:", data?.id);

    return res.status(200).json({
      success: true,
      message: "Email sent successfully.",
      id: data?.id || null,
    });

  } catch (error) {
    console.error("❌ Contact API Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error.",
    });
  }
}