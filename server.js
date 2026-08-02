import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const GMAIL_USER = process.env.GMAIL_USER || process.env.SMTP_USER || '';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || '';
const OWNER_EMAIL = process.env.OWNER_EMAIL || "mskiranrao@gmail.com";

let transporter = null;

if (GMAIL_USER && GMAIL_APP_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ZasDevLabs Portfolio API' });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ detail: "Missing fields" });
  }

  const html_body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f0f0f0;">
      <div style="background: #1E1E1E; color: white; padding: 30px; border-radius: 16px;">
        <h2 style="color: #A8C7FA; margin: 0 0 24px 0; font-size: 20px;">New Portfolio Contact</h2>

        <div style="background: #282828; padding: 16px 20px; border-radius: 12px; margin-bottom: 12px;">
          <p style="color: #9ca3af; font-size: 11px; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 1.5px;">Name</p>
          <p style="color: #ffffff; font-size: 16px; margin: 0; font-weight: 500;">${name}</p>
        </div>

        <div style="background: #282828; padding: 16px 20px; border-radius: 12px; margin-bottom: 12px;">
          <p style="color: #9ca3af; font-size: 11px; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 1.5px;">Email</p>
          <a href="mailto:${email}" style="color: #A8C7FA; font-size: 15px; margin: 0; text-decoration: none;">${email}</a>
        </div>

        <div style="background: #282828; padding: 16px 20px; border-radius: 12px; margin-bottom: 20px;">
          <p style="color: #9ca3af; font-size: 11px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1.5px;">Message</p>
          <p style="color: #e5e7eb; font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
        </div>

        <p style="color: #4b5563; font-size: 11px; margin: 0; text-align: center;">
          Sent from the ZasDevLabs portfolio contact form &mdash; zasdevlabs.tech
        </p>
      </div>
    </div>
  `;

  try {
    if (!transporter) {
      console.warn("Gmail SMTP credentials (GMAIL_USER, GMAIL_APP_PASSWORD) are not set. Mocking email delivery.");
      return res.json({ status: "success", message: "Message received (mock mode, set GMAIL_USER & GMAIL_APP_PASSWORD in environment to enable live sending)", id: "mock_id" });
    }
    
    const info = await transporter.sendMail({
      from: `"Portfolio Contact Form" <${GMAIL_USER}>`,
      to: OWNER_EMAIL,
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      html: html_body,
    });

    return res.json({ status: "success", message: "Message sent successfully", id: info.messageId });
  } catch (error) {
    console.error("Failed to send email via SMTP:", error);
    return res.status(500).json({ detail: `Failed to send email: ${error.message}` });
  }
});

// Serve frontend
const distPath = path.join(__dirname, 'frontend/build');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
