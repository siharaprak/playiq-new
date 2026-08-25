const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
];

let chromePath = '';
for (const p of CHROME_PATHS) {
  if (fs.existsSync(p)) {
    chromePath = p;
    break;
  }
}

const OUTPUT_MP4 = path.join(__dirname, '../course_walkthrough_2x.mp4');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function smoothScroll(page, totalDistance = 800, durationMs = 2000) {
  const steps = 20;
  const stepDist = totalDistance / steps;
  const delay = durationMs / steps;
  for (let i = 0; i < steps; i++) {
    await page.evaluate((d) => window.scrollBy(0, d), stepDist);
    await sleep(delay);
  }
}

async function smoothScrollTop(page, durationMs = 800) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await sleep(durationMs);
}

async function setRole(role) {
  const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      env[match[1]] = value.trim();
    }
  });
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  await supabase.from('profiles').update({ role }).eq('email', 'futurefaker01@gmail.com');
  console.log(`Updated futurefaker01 role to: ${role}`);
}

async function main() {
  console.log('🚀 Step 1: Clean reset for futurefaker01@gmail.com...');
  execSync('node scratch/reset_futurefaker_full.js', { stdio: 'inherit' });
  await setRole('admin');

  console.log('🎬 Step 2: Launching Chrome with CDP Screencast...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const client = await page.target().createCDPSession();

  // Spawn ffmpeg to read raw jpeg stream from stdin at 20 fps and output at 2x speed (40 fps playback or setpts)
  // Input: 20 fps, setpts=0.5*PTS -> 2x speed MP4
  const ffmpegProcess = spawn('ffmpeg', [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-framerate', '20',
    '-i', '-',
    '-filter:v', 'setpts=0.5*PTS',
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '22',
    '-pix_fmt', 'yuv420p',
    OUTPUT_MP4
  ]);

  ffmpegProcess.stderr.on('data', (data) => {
    // console.log(`ffmpeg: ${data.toString()}`);
  });

  let isRecording = true;

  client.on('Page.screencastFrame', async ({ data, sessionId }) => {
    try {
      if (isRecording && ffmpegProcess.stdin.writable) {
        const buffer = Buffer.from(data, 'base64');
        ffmpegProcess.stdin.write(buffer);
      }
      await client.send('Page.screencastFrameAck', { sessionId });
    } catch (e) {
      // Ignore
    }
  });

  await client.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 85,
    maxWidth: 1280,
    maxHeight: 720,
    everyNthFrame: 1
  });

  console.log('📹 Screencast started at high density.');

  try {
    // 1. LOGIN
    console.log('\n--- 1. Login Flow ---');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    await sleep(2000);

    const emailInput = await page.$('input[type="email"], input[name="email"], input[type="text"]');
    if (emailInput) await emailInput.type('futurefaker01@gmail.com', { delay: 40 });
    const passwordInput = await page.$('input[type="password"]');
    if (passwordInput) await passwordInput.type('12345678', { delay: 40 });
    await sleep(1000);

    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) await submitBtn.click();
    await sleep(3500);

    // 2. MODULE 0 (ORION ASSESSMENT)
    console.log('\n--- 2. Module 0: Orion Assessment ---');
    await page.goto('http://localhost:3000/student/assessment', { waitUntil: 'networkidle2' });
    await sleep(2500);
    await smoothScroll(page, 500, 1500);
    await smoothScrollTop(page, 800);

    // Click Start / Continue
    await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, a, div, span'));
      const target = elements.find(el => {
        const t = el.textContent || '';
        return t.includes('Continue to Orion') || t.includes('Start') || t.includes('Skip') || t.includes('Tap anywhere');
      });
      if (target) target.click();
    });
    await sleep(2000);

    // Nickname & Grade
    const nameInput = await page.$('input[type="text"]');
    if (nameInput) {
      await nameInput.type('FutureFaker', { delay: 40 });
      await sleep(1000);
    }
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const grade = btns.find(b => b.textContent && (b.textContent.includes('Middle') || b.textContent.includes('High') || b.textContent.includes('Grade')));
      if (grade) grade.click();
    });
    await sleep(1000);

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const cont = btns.find(b => b.textContent && (b.textContent.includes('Continue') || b.textContent.includes('Next')));
      if (cont) cont.click();
    });
    await sleep(2500);

    // Answer questions with visible pauses
    for (let q = 0; q < 5; q++) {
      await page.evaluate(() => {
        const options = Array.from(document.querySelectorAll('button, label, [role="button"]'));
        const opt = options.find(o => o.textContent && (o.textContent.includes('B.') || o.textContent.includes('C.') || o.textContent.includes('Sometimes') || o.textContent.includes('Often') || o.textContent.includes('Mostly')));
        if (opt) opt.click();
      });
      await sleep(1200);

      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const next = btns.find(b => b.textContent && (b.textContent.includes('Next') || b.textContent.includes('Continue') || b.textContent.includes('Lock')));
        if (next) next.click();
      });
      await sleep(1500);
    }
    await sleep(2000);

    // 3. DASHBOARD
    console.log('\n--- 3. Student Dashboard ---');
    await page.goto('http://localhost:3000/student/home', { waitUntil: 'networkidle2' });
    await sleep(2500);
    await smoothScroll(page, 1400, 3000);
    await sleep(1000);
    await smoothScrollTop(page, 1200);

    // 4. MODULES 1 THROUGH 10
    for (let m = 1; m <= 10; m++) {
      console.log(`\n--- Module ${m} ---`);

      // A. Module Overview (show header, hook, skill tree)
      await page.goto(`http://localhost:3000/student/modules/${m}/overview`, { waitUntil: 'networkidle2' });
      await sleep(2000);
      await smoothScroll(page, 1200, 2500);
      await sleep(1000);
      await smoothScrollTop(page, 1000);

      // B. Node 1 Lesson (show new rich LessonContentRenderer in detail!)
      await page.goto(`http://localhost:3000/student/modules/${m}/nodes/1/lesson`, { waitUntil: 'networkidle2' });
      await sleep(2500);
      await smoothScroll(page, 1600, 4500); // 4.5s smooth scroll through all cards
      await sleep(1500);
      await smoothScrollTop(page, 1000);

      // C. Node 1 Activity
      await page.goto(`http://localhost:3000/student/modules/${m}/nodes/1/activity`, { waitUntil: 'networkidle2' });
      await sleep(2000);
      await smoothScroll(page, 800, 2000);
      await sleep(800);

      // D. Node 1 Mini-Check
      await page.goto(`http://localhost:3000/student/modules/${m}/nodes/1/mini-check`, { waitUntil: 'networkidle2' });
      await sleep(1800);
      await smoothScroll(page, 700, 1500);
      await sleep(800);

      // E. Node 1 Teach-Back
      await page.goto(`http://localhost:3000/student/modules/${m}/nodes/1/teach-back`, { waitUntil: 'networkidle2' });
      await sleep(1800);
      await smoothScroll(page, 700, 1500);
      await sleep(800);

      // F. Node 2 Lesson (show second node)
      await page.goto(`http://localhost:3000/student/modules/${m}/nodes/2/lesson`, { waitUntil: 'networkidle2' });
      await sleep(2000);
      await smoothScroll(page, 1200, 3000);
      await sleep(1000);

      // G. Module Quiz
      await page.goto(`http://localhost:3000/student/modules/${m}/quiz`, { waitUntil: 'networkidle2' });
      await sleep(2000);
      await smoothScroll(page, 1000, 2500);
      await sleep(1000);

      // H. Boss Battle (if exists)
      await page.goto(`http://localhost:3000/student/modules/${m}/boss-battle`, { waitUntil: 'networkidle2' });
      await sleep(1500);
      await smoothScroll(page, 600, 1500);

      // I. Proof Artifacts
      await page.goto(`http://localhost:3000/student/modules/${m}/proof-artifacts`, { waitUntil: 'networkidle2' });
      await sleep(1800);
      await smoothScroll(page, 800, 1800);
    }

    // 5. CAPSTONE / MODULE 11
    console.log('\n--- 5. Capstone / Master Trial ---');
    await page.goto('http://localhost:3000/student/modules/11/overview', { waitUntil: 'networkidle2' });
    await sleep(3000);
    await smoothScroll(page, 1500, 4000);
    await sleep(1500);
    await smoothScrollTop(page, 1200);

    console.log('\n🏁 Complete walkthrough finished successfully!');
    await sleep(2000);

  } catch (err) {
    console.error('Recording error:', err);
  } finally {
    isRecording = false;
    await client.send('Page.stopScreencast');
    await browser.close();

    // Close ffmpeg stdin to finish encoding
    ffmpegProcess.stdin.end();

    // Reset role back to student and clean state
    await setRole('student');
    execSync('node scratch/reset_futurefaker_full.js', { stdio: 'inherit' });
  }

  // Wait for ffmpeg to finish
  await new Promise((resolve) => {
    ffmpegProcess.on('close', (code) => {
      console.log(`\n🎉 FFmpeg process finished with code ${code}! Video saved to: ${OUTPUT_MP4}`);
      resolve();
    });
  });
}

main().catch(console.error);
