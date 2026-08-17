import nodemailer from 'nodemailer';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  fromName?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer | string;
    contentType?: string;
  }>;
}

// Initialize AWS SESv2 Client
const sesClient = new SESv2Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// Initialize Nodemailer with SESv2 transport
const transporter = nodemailer.createTransport({
  SES: {
    sesClient,
    SendEmailCommand,
  },
});

/**
 * Sends an email via Amazon SES with HTML and attachment support.
 */
export async function sendEmail(options: SendEmailOptions) {
  const fromEmail = process.env.AWS_SES_FROM_EMAIL || 'sender@sienvi.com';
  const fromName = options.fromName || 'WePlayIQ';
  const from = `"${fromName}" <${fromEmail}>`;

  const mailOptions = {
    from,
    to: options.to,
    replyTo: options.replyTo || 'support@weplayiq.com',
    subject: options.subject,
    html: options.html,
    text: options.text,
    attachments: options.attachments,
    ...(process.env.AWS_SES_CONFIGURATION_SET
      ? {
          headers: {
            'X-SES-CONFIGURATION-SET': process.env.AWS_SES_CONFIGURATION_SET,
          },
        }
      : {}),
  };

  return transporter.sendMail(mailOptions);
}
