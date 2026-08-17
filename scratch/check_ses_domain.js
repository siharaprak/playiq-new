import fs from 'fs';
import nodemailer from 'nodemailer';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

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

async function test(senderEmail) {
  try {
    console.log(`Testing sender: ${senderEmail}...`);
    const res = await transporter.sendMail({
      from: `"WePlayIQ" <${senderEmail}>`,
      to: 'ivllnv.000@gmail.com',
      subject: `SES Verification Test for ${senderEmail}`,
      text: 'Testing domain verification in Amazon SES.',
    });
    console.log(`✅ SUCCESS for ${senderEmail}! MessageId: ${res.messageId}`);
    return true;
  } catch (err) {
    console.log(`❌ NOT YET VERIFIED for ${senderEmail}: ${err.message}`);
    return false;
  }
}

async function run() {
  await test('sender@weplayiq.com');
  await test('sender@playiq.app');
}

run();
