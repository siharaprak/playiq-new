import fs from 'fs';
import {
  sendBetaSignupNotifications,
  sendApprenticeProvisionedNotifications,
} from '../src/lib/server/notifications.ts';

// Load .env.local
const envFile = fs.readFileSync('.env.local', 'utf-8');
envFile.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    process.env[match[1]] = value;
  }
});

async function runTests() {
  console.log('--- TEST 1: Beta Signup Notifications ---');
  await sendBetaSignupNotifications({
    parentName: 'Test Parent (Iris)',
    email: 'ivllnv.000@gmail.com',
    childAge: '13_14',
    source: 'test_simulation',
    promoCode: 'PLAYIQ2025',
    status: 'fulfilled_promo',
  });
  console.log('✅ Test 1 completed.');

  console.log('\n--- TEST 2: Apprentice Provisioned Notifications ---');
  await sendApprenticeProvisionedNotifications({
    parentName: 'Test Parent (Iris)',
    parentEmail: 'ivllnv.000@gmail.com',
    apprenticeName: 'Test Student (Alex)',
    username: 'alex_test_01',
    learningLevel: 'middle',
  });
  console.log('✅ Test 2 completed.');
}

runTests();
