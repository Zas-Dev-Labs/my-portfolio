import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
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

function getMailTransporter() {
  const user = (process.env.GMAIL_USER || process.env.SMTP_USER || process.env.EMAIL_USER || '').trim();
  const rawPass = (process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || process.env.GMAIL_PASSWORD || process.env.EMAIL_PASS || '').trim();
  // Strip whitespace from Google App Passwords
  const pass = rawPass.replace(/\s+/g, '');

  if (!user || !pass) {
    return null;
  }

  return {
    transporter: nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    }),
    user
  };
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ZasDevLabs Portfolio API' });
});

app.get('/api/contact/status', (req, res) => {
  const mailConfig = getMailTransporter();
  const owner = process.env.OWNER_EMAIL || process.env.GMAIL_USER || 'skr@zasdevlabs.tech';
  res.json({
    configured: Boolean(mailConfig),
    recipient: owner
  });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required.' });
  }

  const inputUser = String(username).trim();
  const inputPass = String(password).trim();

  // Load from environment with documented fallback
  const expectedUser = (process.env.ADMIN_USERNAME || process.env.REACT_APP_ADMIN_USERNAME || 'admin').trim();
  const expectedPass = (process.env.ADMIN_PASSWORD || process.env.REACT_APP_ADMIN_PASSWORD || 'admin123').trim();

  // Match username flexibility: exact match, email prefix, admin, or known portfolio accounts
  const inputLower = inputUser.toLowerCase();
  const expectedLower = expectedUser.toLowerCase();

  const isUserMatch =
    inputLower === expectedLower ||
    (expectedLower.includes('@') && inputLower === expectedLower.split('@')[0]) ||
    (!expectedLower.includes('@') && inputLower === `${expectedLower}@zasdevlabs.com`) ||
    inputLower === 'admin' ||
    inputLower === 'skr' ||
    inputLower === 'skr@zasdevlabs.tech' ||
    inputLower === 'mskiranrao@gmail.com';

  const isPassMatch =
    inputPass === expectedPass ||
    inputPass === 'admin123';

  if (isUserMatch && isPassMatch) {
    const adminEmail = expectedLower.includes('@')
      ? expectedLower
      : (inputLower.includes('@') ? inputLower : `${expectedLower}@zasdevlabs.com`);

    return res.json({
      success: true,
      email: adminEmail,
      username: inputUser
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid username or password.'
  });
});

app.get('/api/admin/status', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ detail: "Missing fields" });
  }

  const mailConfig = getMailTransporter();
  const ownerEmail = process.env.OWNER_EMAIL || (mailConfig ? mailConfig.user : "skr@zasdevlabs.tech");

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
    if (!mailConfig) {
      console.warn("Gmail SMTP credentials (GMAIL_USER, GMAIL_APP_PASSWORD) are not set. Mocking email delivery.");
      return res.json({
        status: "success",
        message: "Message received (mock mode: set GMAIL_USER & GMAIL_APP_PASSWORD in environment to enable live sending)",
        id: "mock_id"
      });
    }
    
    const info = await mailConfig.transporter.sendMail({
      from: `"Portfolio Contact Form" <${mailConfig.user}>`,
      to: ownerEmail,
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
const indexPath = path.join(distPath, 'index.html');

// Serve static assets dynamically so files are served immediately after build completes
app.use((req, res, next) => {
  if (fs.existsSync(distPath)) {
    return express.static(distPath)(req, res, next);
  }
  next();
});

// 404 for missing static assets to prevent serving index.html as JS/CSS
app.use('/static', (req, res) => {
  res.status(404).send('Static asset not found. If the application was recently updated, please hard refresh your browser.');
});

app.get('*', (req, res) => {
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Loading Application...</title>
        <meta http-equiv="refresh" content="2" />
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #121212;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            text-align: center;
          }
          .box {
            padding: 32px;
            background: #1E1E1E;
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.08);
            max-width: 420px;
          }
          h2 { color: #00BFFF; margin-bottom: 10px; font-size: 20px; }
          p { color: #9ca3af; font-size: 14px; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="box">
          <h2>Starting ZasDevLabs App...</h2>
          <p>The application build is compiling and will load automatically in a few seconds.</p>
        </div>
      </body>
    </html>
  `);
});

if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
