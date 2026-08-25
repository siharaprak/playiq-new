import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { getBetaWelcomeEmailHtml } from '../src/lib/server/email-templates/beta-welcome.ts';

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
  SES: { sesClient, SendEmailCommand },
});

async function sendToMystique() {
  const recipient = 'mystiquen21@gmail.com';
  console.log(`Sending WePlayIQ Beta Testing email to: ${recipient}...`);

  const pdfPath = path.resolve('public/Parent_Setup_Guide.pdf');
  const hasPdf = fs.existsSync(pdfPath);
  console.log('PDF Attachment exists:', hasPdf, 'at', pdfPath);

  const html = getBetaWelcomeEmailHtml({
    parentName: 'Mystique',
    teenName: 'Lyric',
    email: recipient,
    promoCode: 'PLAYIQ2025',
  });

  try {
    const info = await transporter.sendMail({
      from: `"WePlayIQ" <${env.AWS_SES_FROM_EMAIL || 'sender@weplayiq.com'}>`,
      replyTo: 'support@weplayiq.com',
      to: recipient,
      subject: 'Welcome to WePlayIQ Beta Testing, Mystique & Lyric! 🚀',
      html,
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

    console.log('✅ Email successfully delivered to Mystique & Lyric via Amazon SES!');
    console.log('Message ID:', info.messageId);
  } catch (err) {
    console.error('❌ Error sending to Mystique:', err);
  }
}

sendToMystique();
