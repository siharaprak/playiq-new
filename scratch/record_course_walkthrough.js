const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

const FRAMES_DIR = path.join(__dirname, 'frames');
const OUTPUT_MP4 = path.join(__dirname, '../course_walkthrough_2x.mp4');

// Clean and create frames dir
if (fs.existsSync(FRAMES_DIR)) {
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
}
fs.mkdirSync(FRAMES_DIR, { recursive: true });

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function smoothScroll(page, durationMs = 1200) {
  const steps = 12;
  const delay = durationMs / steps;
  for (let i = 0; i < steps; i++) {
    await page.evaluate(() => window.scrollBy(0, 150));
    await sleep(delay);
  }
}

async function smoothScrollTop(page, durationMs = 600) {
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

async function run() {
  console.log('🚀 Step 1: Resetting database for futurefaker01@gmail.com...');
  execSync('node scratch/reset_futurefaker_full.js', { stdio: 'inherit' });

  // Set role to admin so all pages and phases are directly accessible and unlocked for the walkthrough
  await setRole('admin');

  console.log('🎬 Step 2: Launching Chrome...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  let frameIndex = 0;
  let isRecording = true;

  // Frame capture loop (approx 10 fps)
  const recordInterval = setInterval(async () => {
    if (!isRecording) return;
    try {
      const framePath = path.join(FRAMES_DIR, `frame_${String(frameIndex++).padStart(5, '0')}.jpg`);
      await page.screenshot({ path: framePath, type: 'jpeg', quality: 80 });
    } catch (e) {
      // Ignore transient errors
    }
  }, 100);

  try {
    console.log('🔑 Step 3: Logging in as futurefaker01@gmail.com...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    await sleep(1000);

    // Enter email & password
    const emailInput = await page.$('input[type="email"], input[name="email"], input[placeholder*="email" i], input[type="text"]');
    if (emailInput) {
      await emailInput.type('futurefaker01@gmail.com', { delay: 30 });
    }
    const passwordInput = await page.$('input[type="password"]');
    if (passwordInput) {
      await passwordInput.type('12345678', { delay: 30 });
    }
    await sleep(500);

    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) await submitBtn.click();
    await sleep(3000);

    console.log('🧭 Step 4: Testing Module 0 (Orion Assessment)...');
    await page.goto('http://localhost:3000/student/assessment', { waitUntil: 'networkidle2' });
    await sleep(1500);
    await smoothScroll(page, 1200);

    // Click Skip or Start Assessment
    await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, a, div, span'));
      const target = elements.find(el => {
        const t = el.textContent || '';
        return t.includes('Skip') || t.includes('Tap anywhere') || t.includes('Continue') || t.includes('Start');
      });
      if (target) target.click();
    });
    await sleep(1500);

    // Enter Nickname if input exists
    const nameInput = await page.$('input[type="text"]');
    if (nameInput) {
      await nameInput.type('FutureFaker', { delay: 30 });
      await sleep(500);
    }

    // Select grade if buttons exist
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const gradeBtn = btns.find(b => b.textContent && (b.textContent.includes('Middle') || b.textContent.includes('High') || b.textContent.includes('Grade')));
      if (gradeBtn) gradeBtn.click();
    });
    await sleep(600);

    // Click Continue
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const contBtn = btns.find(b => b.textContent && (b.textContent.includes('Continue') || b.textContent.includes('Next') || b.textContent.includes('Lock')));
      if (contBtn) contBtn.click();
    });
    await sleep(1500);

    // Step through questions
    for (let q = 0; q < 5; q++) {
      await page.evaluate(() => {
        const options = Array.from(document.querySelectorAll('button, label, [role="button"]'));
        const opt = options.find(o => o.textContent && (o.textContent.includes('B.') || o.textContent.includes('C.') || o.textContent.includes('Sometimes') || o.textContent.includes('Often')));
        if (opt) opt.click();
      });
      await sleep(600);
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const next = btns.find(b => b.textContent && (b.textContent.includes('Next') || b.textContent.includes('Continue') || b.textContent.includes('Lock')));
        if (next) next.click();
      });
      await sleep(800);
    }

    console.log('🏠 Step 5: Checking Student Dashboard...');
    await page.goto('http://localhost:3000/student/home', { waitUntil: 'networkidle2' });
    await sleep(1500);
    await smoothScroll(page, 2000);
    await smoothScrollTop(page);

    console.log('📚 Step 6: Walking through all Course Modules (1 to 10 + Capstone)...');

    for (let m = 1; m <= 10; m++) {
      console.log(`--- Module ${m} ---`);
      
      // 1. Module Overview
      await page.goto(`http://localhost:3000/student/modules/${m}/overview`, { waitUntil: 'networkidle2' });
      await sleep(1200);
      await smoothScroll(page, 1500);
      await smoothScrollTop(page, 500);

      // 2. Node 1 Lesson with new LessonContentRenderer
      await page.goto(`http://localhost:3000/student/modules/${m}/nodes/1/lesson`, { waitUntil: 'networkidle2' });
      await sleep(1200);
      await smoothScroll(page, 2000);
      await smoothScrollTop(page, 500);

      // 3. Node 1 Activity
      await page.goto(`http://localhost:3000/student/modules/${m}/nodes/1/activity`, { waitUntil: 'networkidle2' });
      await sleep(1000);
      await smoothScroll(page, 1000);

      // 4. Node 1 Mini-Check
      await page.goto(`http://localhost:3000/student/modules/${m}/nodes/1/mini-check`, { waitUntil: 'networkidle2' });
      await sleep(1000);
      await smoothScroll(page, 1000);

      // 5. Node 1 Teach-Back
      await page.goto(`http://localhost:3000/student/modules/${m}/nodes/1/teach-back`, { waitUntil: 'networkidle2' });
      await sleep(1000);
      await smoothScroll(page, 1000);

      // 6. Node 2 Lesson (preview next node)
      await page.goto(`http://localhost:3000/student/modules/${m}/nodes/2/lesson`, { waitUntil: 'networkidle2' });
      await sleep(1000);
      await smoothScroll(page, 1500);

      // 7. Quiz page
      await page.goto(`http://localhost:3000/student/modules/${m}/quiz`, { waitUntil: 'networkidle2' });
      await sleep(1000);
      await smoothScroll(page, 1000);

      // 8. Proof Artifacts
      await page.goto(`http://localhost:3000/student/modules/${m}/proof-artifacts`, { waitUntil: 'networkidle2' });
      await sleep(1000);
      await smoothScroll(page, 1000);
    }

    // Module 11 / Capstone
    console.log('--- Capstone / Master Trial ---');
    await page.goto('http://localhost:3000/student/modules/11/overview', { waitUntil: 'networkidle2' });
    await sleep(2000);
    await smoothScroll(page, 2000);
    await smoothScrollTop(page, 600);

    console.log('🏁 Walkthrough complete! Finalizing recording...');
    await sleep(1500);

  } catch (err) {
    console.error('Walkthrough error:', err);
  } finally {
    isRecording = false;
    clearInterval(recordInterval);
    await browser.close();
    
    // Reset futurefaker back to student and clean progress
    await setRole('student');
    execSync('node scratch/reset_futurefaker_full.js', { stdio: 'inherit' });
  }

  // Compile frames to MP4 at 2x speed using ffmpeg
  console.log(`\n🎞️ Step 7: Encoding ${frameIndex} frames to MP4 at 2x speed with ffmpeg...`);
  try {
    // 10 fps input, sped up 2x (effective 20 fps playback)
    const cmd = `ffmpeg -y -framerate 10 -i "${path.join(FRAMES_DIR, 'frame_%05d.jpg')}" -filter:v "setpts=0.5*PTS" -c:v libx264 -pix_fmt yuv420p "${OUTPUT_MP4}"`;
    execSync(cmd, { stdio: 'inherit' });
    console.log(`\n🎉 Success! Video saved to: ${OUTPUT_MP4}`);
  } catch (e) {
    console.error('Error encoding video with ffmpeg:', e.message);
  }
}

run().catch(console.error);
