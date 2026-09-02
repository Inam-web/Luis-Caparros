import "dotenv/config";
import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);
app.use(cors());
app.use(express.json());

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const { data, error } = await resend.emails.send({
      from: 'Luis Caparrós Website <onboarding@resend.dev>',
      to: ['inamuafridi300@gmail.com'],
      subject: `📩 New message from ${name}`,
      reply_to: email,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 0; background: #f4f0e3; font-family: Georgia, serif; }
            .container { max-width: 700px; margin: 0 auto; background: #faf8f0; padding: 40px 50px; border: 1px solid #dcd3b8; }
            .header { border-bottom: 3px solid #b9973f; padding-bottom: 20px; text-align: center; }
            .header h1 { color: #16211c; font-size: 30px; margin: 0; }
            .header p { color: #71201f; font-size: 12px; letter-spacing: 4px; text-transform: uppercase; margin: 5px 0 0; }
            .details { background: #f4f0e3; padding: 20px 25px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #b9973f; }
            .details p { margin: 8px 0; font-size: 16px; }
            .details strong { color: #71201f; }
            .message-box { background: #ffffff; padding: 20px 25px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #b9973f; }
            .message-box p { font-size: 16px; line-height: 1.8; font-style: italic; margin: 0; color: #16211c; }
            .footer { border-top: 2px solid #dcd3b8; padding-top: 20px; text-align: center; color: #55705f; font-size: 13px; }
            .footer a { color: #b9973f; text-decoration: none; }
          </style>
        </head>
        <body>
          <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f0e3">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 700px; background: #faf8f0; border: 1px solid #dcd3b8; border-radius: 6px;">
                  <tr>
                    <td style="padding: 40px 50px;">
                      
                      <div style="border-bottom: 3px solid #b9973f; padding-bottom: 20px; text-align: center;">
                        <h1 style="color: #16211c; font-size: 30px; margin: 0;">LUIS CAPARRÓS</h1>
                        <p style="color: #71201f; font-size: 12px; letter-spacing: 4px; text-transform: uppercase; margin: 5px 0 0;">Writer · New Message</p>
                      </div>

                      <p style="color: #2a3d32; font-size: 17px; line-height: 1.6; margin: 25px 0 20px 0;">
                        You have received a new message from your website:
                      </p>

                      <div style="background: #f4f0e3; padding: 20px 25px; border-radius: 4px; margin: 0 0 20px 0; border-left: 4px solid #b9973f;">
                        <p style="margin: 8px 0; font-size: 16px;"><strong style="color: #71201f;">👤 Name:</strong> ${name}</p>
                        <p style="margin: 8px 0; font-size: 16px;"><strong style="color: #71201f;">📧 Email:</strong> <a href="mailto:${email}" style="color: #b9973f; text-decoration: none;">${email}</a></p>
                        <p style="margin: 8px 0; font-size: 16px;"><strong style="color: #71201f;">📌 Subject:</strong> ${subject || 'No subject'}</p>
                      </div>

                      <div style="background: #ffffff; padding: 20px 25px; border-radius: 4px; margin: 0 0 20px 0; border-left: 4px solid #b9973f;">
                        <p style="font-size: 16px; line-height: 1.8; font-style: italic; margin: 0; color: #16211c; word-wrap: break-word; white-space: pre-wrap;">
                          ${message}
                        </p>
                      </div>

                      <div style="border-top: 2px solid #dcd3b8; padding-top: 20px; text-align: center; color: #55705f; font-size: 13px;">
                        <p style="margin: 0;">This email was sent from your website contact form.</p>
                        <p style="margin: 8px 0 0 0;">
                          <a href="mailto:${email}" style="color: #b9973f; text-decoration: none;">✉️ Reply to ${name}</a>
                        </p>
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
      console.error('❌ Resend Error:', error);
      return res.status(500).json({ error });
    }

    console.log('✅ Email sent to:', 'inamuafridi300@gmail.com');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});