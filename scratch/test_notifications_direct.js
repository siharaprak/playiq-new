import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import {
  ADMIN_NOTIFICATION_EMAILS,
  getBetaSignupAdminNotificationHtml,
  getApprenticeCreatedAdminNotificationHtml,
  getApprenticeCreatedParentEmailHtml,
} from '../src/lib/server/email-templates/notifications.ts';
import { getBetaWelcomeEmailHtml } from '../src/lib/server/email-templates/beta-welcome.ts';

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
  SES: { sesClient, SendEmailCommand },
});

async function runDirectTest() {
  console.log('--- 1. Testing User Beta Welcome with PDF ---');
  const pdfPath = path.resolve('public/Parent_Setup_Guide.pdf');
  const hasPdf = fs.existsSync(pdfPath);

  await transporter.sendMail({
    from: `"WePlayIQ" <${env.AWS_SES_FROM_EMAIL || 'sender@weplayiq.com'}>`,
    replyTo: 'support@weplayiq.com',
    to: 'ivllnv.000@gmail.com',
    subject: 'Welcome to WePlayIQ Beta Testing, Test Parent! 🚀',
    html: getBetaWelcomeEmailHtml({
      parentName: 'Test Parent',
      email: 'ivllnv.000@gmail.com',
      promoCode: 'PLAYIQ2025',
    }),
    attachments: hasPdf ? [{ filename: 'Parent_Setup_Guide.pdf', path: pdfPath, contentType: 'application/pdf' }] : [],
  });
  console.log('✅ User Beta Welcome sent.');

  console.log('--- 2. Testing Admin Beta Signup Alert to Team ---');
  await transporter.sendMail({
    from: `"WePlayIQ Alerts" <${env.AWS_SES_FROM_EMAIL || 'sender@weplayiq.com'}>`,
    to: ADMIN_NOTIFICATION_EMAILS,
    subject: '🔔 [Admin Alert] New Beta Signup: Test Parent (Iris)',
    html: getBetaSignupAdminNotificationHtml({
      parentName: 'Test Parent (Iris)',
      email: 'ivllnv.000@gmail.com',
      childAge: '13_14',
      source: 'test_run',
      status: 'fulfilled_promo',
      promoCode: 'PLAYIQ2025',
    }),
  });
  console.log(`✅ Admin Alert sent to: ${ADMIN_NOTIFICATION_EMAILS.join(', ')}`);

  console.log('--- 3. Testing Parent Apprentice Confirmation ---');
  await transporter.sendMail({
    from: `"WePlayIQ" <${env.AWS_SES_FROM_EMAIL || 'sender@weplayiq.com'}>`,
    replyTo: 'support@weplayiq.com',
    to: 'ivllnv.000@gmail.com',
    subject: '🎉 Apprentice Profile Created for Alex!',
    html: getApprenticeCreatedParentEmailHtml({
      parentName: 'Test Parent (Iris)',
      apprenticeName: 'Alex',
      username: 'alex_test_01',
    }),
  });
  console.log('✅ Parent Apprentice confirmation sent.');

  console.log('--- 4. Testing Admin Apprentice Provision Alert to Team ---');
  await transporter.sendMail({
    from: `"WePlayIQ Alerts" <${env.AWS_SES_FROM_EMAIL || 'sender@weplayiq.com'}>`,
    to: ADMIN_NOTIFICATION_EMAILS,
    subject: '🚀 [Admin Alert] New Apprentice: Alex (by Test Parent)',
    html: getApprenticeCreatedAdminNotificationHtml({
      parentName: 'Test Parent (Iris)',
      parentEmail: 'ivllnv.000@gmail.com',
      apprenticeName: 'Alex',
      username: 'alex_test_01',
      learningLevel: 'middle',
    }),
  });
  console.log(`✅ Admin Apprentice alert sent to: ${ADMIN_NOTIFICATION_EMAILS.join(', ')}`);
}

runDirectTest();
