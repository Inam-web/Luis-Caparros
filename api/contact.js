import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "RESEND_API_KEY is missing.",
      });
    }

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

    const { name, email, subject, message } = body || {};

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Name, email and message are required.",
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject || "Contact Form");
    const safeMessage = escapeHtml(message);

    const { data, error } = await resend.emails.send({
      from: "Luis Caparrós Website <onboarding@resend.dev>",

      // For your current testing:
      to: ["inamuafridi300@gmail.com"],

      subject: `New message from ${name}: ${subject || "Contact Form"}`,

      replyTo: email,

      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Message - Luis Caparrós</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f3f0e6;
  font-family:Arial, Helvetica, sans-serif;
  color:#101820;
">

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      background:#f3f0e6;
      margin:0;
      padding:24px 0;
    "
  >
    <tr>
      <td align="center">

        <!-- MAIN CARD -->
        <table
          width="700"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width:700px;
            max-width:calc(100% - 32px);
            background:#faf8f1;
            border:1px solid #d8ceb4;
            border-radius:6px;
            overflow:hidden;
          "
        >

          <!-- HEADER -->
          <tr>
            <td
              align="center"
              style="
                padding:44px 35px 24px 35px;
              "
            >

              <div style="
                font-size:31px;
                line-height:1.2;
                font-weight:700;
                letter-spacing:-0.8px;
                color:#071b29;
              ">
                LUIS CAPARRÓS
              </div>

              <div style="
                margin-top:10px;
                font-size:12px;
                line-height:1.4;
                letter-spacing:5px;
                color:#9b3d3d;
                font-weight:500;
              ">
                WRITER&nbsp;&nbsp;·&nbsp;&nbsp;NEW MESSAGE
              </div>

            </td>
          </tr>

          <!-- GOLD LINE -->
          <tr>
            <td style="padding:0 50px;">
              <div style="
                height:3px;
                background:#b8942d;
                width:100%;
              "></div>
            </td>
          </tr>

          <!-- INTRO -->
          <tr>
            <td
              style="
                padding:28px 50px 20px 50px;
                font-size:16px;
                line-height:1.6;
                color:#111c25;
              "
            >
              You have received a new message from your website:
            </td>
          </tr>

          <!-- CONTACT INFORMATION -->
          <tr>
            <td style="padding:0 50px 20px 50px;">

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  background:#f2eee1;
                  border-left:4px solid #c29b31;
                  border-radius:3px;
                "
              >

                <!-- NAME -->
                <tr>
                  <td
                    style="
                      padding:25px 25px 5px 25px;
                      font-size:16px;
                      line-height:1.5;
                    "
                  >
                    <span style="font-size:17px;">👤</span>
                    <strong style="color:#7d1717;">
                      Name:
                    </strong>
                    <span style="color:#111c25;">
                      ${safeName}
                    </span>
                  </td>
                </tr>

                <!-- EMAIL -->
                <tr>
                  <td
                    style="
                      padding:5px 25px;
                      font-size:16px;
                      line-height:1.5;
                    "
                  >
                    <span style="font-size:17px;">✉️</span>
                    <strong style="color:#7d1717;">
                      Email:
                    </strong>
                    <span style="color:#b18428;">
                      ${safeEmail}
                    </span>
                  </td>
                </tr>

                <!-- SUBJECT -->
                <tr>
                  <td
                    style="
                      padding:5px 25px 25px 25px;
                      font-size:16px;
                      line-height:1.5;
                    "
                  >
                    <span style="font-size:17px;">📌</span>
                    <strong style="color:#7d1717;">
                      Subject:
                    </strong>
                    <span style="color:#111c25;">
                      ${safeSubject}
                    </span>
                  </td>
                </tr>

              </table>

            </td>
          </tr>

          <!-- MESSAGE -->
          <tr>
            <td style="padding:0 50px 20px 50px;">

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  background:#ffffff;
                  border-left:4px solid #c29b31;
                  border-radius:3px;
                "
              >
                <tr>
                  <td
                    style="
                      padding:48px 40px;
                      text-align:center;
                      font-size:16px;
                      line-height:1.8;
                      font-style:italic;
                      color:#111c25;
                      white-space:pre-wrap;
                      word-break:break-word;
                    "
                  >
                    ${safeMessage}
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER LINE -->
          <tr>
            <td style="padding:0 50px;">
              <div style="
                height:2px;
                background:#d9cda9;
                width:100%;
              "></div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td
              align="center"
              style="
                padding:22px 30px 35px 30px;
              "
            >

              <div style="
                font-size:13px;
                line-height:1.5;
                color:#6e6e6e;
              ">
                This email was sent from your website contact form.
              </div>

              <div style="
                margin-top:12px;
                font-size:13px;
                color:#b18428;
              ">
                ✉️ Reply to ${safeName}
              </div>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

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


// Escape user input before putting it inside the email HTML
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}