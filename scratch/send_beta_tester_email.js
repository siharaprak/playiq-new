import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

// Load .env.local
const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const sesClient = new SESv2Client({
  region: env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const transporter = nodemailer.createTransport({
  SES: {
    sesClient,
    SendEmailCommand,
  },
});

async function main() {
  const recipient = 'mystiquen21@gmail.com';
  console.log(`Sending WePlayIQ Beta Testing Welcome & Setup Guide to: ${recipient}...`);

  const pdfPath = path.resolve('public/Parent_Setup_Guide.pdf');
  const hasPdf = fs.existsSync(pdfPath);
  console.log('PDF Attachment status:', hasPdf, 'at', pdfPath);

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #0f172a; border-radius: 12px; border: 1px solid #1e293b; padding: 32px; }
    .logo { color: #00c8ff; font-size: 26px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin: 0; text-align: center; }
    .subtitle { color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; text-align: center; margin-top: 4px; }
    .section-card { background-color: #1e293b; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #00c8ff; }
    .cta-btn { background-color: #00c8ff; color: #020617 !important; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 6px; display: inline-block; text-transform: uppercase; letter-spacing: 1px; font-size: 14px; }
    .code-box { background: #020617; border: 1px dashed #00c8ff; padding: 12px; border-radius: 6px; text-align: center; margin: 15px 0; font-family: monospace; font-size: 16px; color: #00c8ff; }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="logo">WePlayIQ</h1>
    <div class="subtitle">Beta Testing Pilot Program</div>

    <p style="font-size: 15px; color: #e2e8f0; margin-top: 24px;">
      Hi <strong>Mystique & Lyric</strong>,
    </p>
    <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
      Welcome to the <strong>WePlayIQ Beta Testing Program</strong>! We've attached the complete <strong>Parent Setup Guide PDF</strong> to this email so you have all the step-by-step instructions right in your inbox.
    </p>

    <div class="section-card">
      <h3 style="color: #ffffff; margin-top: 0; font-size: 15px;">🛡️ Parent Setup Steps (~5 minutes):</h3>
      <ol style="color: #cbd5e1; font-size: 13px; line-height: 1.7; padding-left: 20px; margin: 0;">
        <li>Go to <a href="https://weplayiq.com" style="color: #00c8ff;">weplayiq.com</a> and click <strong>"Apply for Pilot Access"</strong>.</li>
        <li>Enter your details and enter the promo code below to waive all beta setup fees:</li>
      </ol>
      <div class="code-box">PROMO CODE: <strong>PLAYIQ2025</strong></div>
      <ol start="3" style="color: #cbd5e1; font-size: 13px; line-height: 1.7; padding-left: 20px; margin: 0;">
        <li>Create your account and land on your Parent Dashboard.</li>
        <li>Click <strong>"+ Provision New Apprentice"</strong> to create Lyric's login handle and passcode (no email needed for Lyric).</li>
      </ol>
    </div>

    <div class="section-card" style="border-left-color: #7b4fce;">
      <h3 style="color: #ffffff; margin-top: 0; font-size: 15px;">👾 For Lyric:</h3>
      <p style="color: #cbd5e1; font-size: 13px; line-height: 1.6; margin: 0;">
        Once provisioned, Lyric can log in directly at <a href="https://weplayiq.com/login" style="color: #00c8ff;">weplayiq.com/login</a> using the chosen handle and passcode to start their first study mission!
      </p>
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="https://weplayiq.com" class="cta-btn">Get Started at WePlayIQ</a>
    </div>

    <div style="border-top: 1px solid #1e293b; padding-top: 16px; text-align: center; color: #64748b; font-size: 12px;">
      <p style="margin: 0;">📎 Attached: <em>Parent_Setup_Guide.pdf</em></p>
      <p style="margin: 4px 0 0 0;">© 2026 WePlayIQ. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const fromEmail = env.AWS_SES_FROM_EMAIL || 'sender@weplayiq.com';
    const info = await transporter.sendMail({
      from: `"WePlayIQ" <${fromEmail}>`,
      replyTo: 'support@weplayiq.com',
      to: recipient,
      subject: 'Welcome to WePlayIQ Beta Testing, Mystique & Lyric! 🚀',
      html: htmlContent,
      attachments: hasPdf
        ? [
            {
              filename: 'Parent_Setup_Guide.pdf',
              path: pdfPath,
              contentType: 'application/pdf',
            },
          ]
        : [],
    });

    console.log('✅ Email sent successfully via Amazon SES to mystiquen21@gmail.com!');
    console.log('Message ID:', info.messageId);
  } catch (err) {
    console.error('❌ Amazon SES send error:', err);
    process.exit(1);
  }
}

main();
