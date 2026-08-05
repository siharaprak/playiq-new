const puppeteer = require('puppeteer-core');
const fs = require('fs');

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
];
let chromePath = '';
for (const p of chromePaths) {
  if (fs.existsSync(p)) {
    chromePath = p;
    break;
  }
}

console.log('Using chromePath:', chromePath);

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  console.log('Browser launched!');
  const page = await browser.newPage();
  console.log('Page created, navigating...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  console.log('Navigated! Taking screenshot...');
  await page.screenshot({ path: 'scratch/test-screenshot.png' });
  console.log('Screenshot taken!');
  await browser.close();
  console.log('Browser closed!');
}

run().catch(console.error);
