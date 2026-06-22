import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { module1Nodes } from '../src/data/module1Content';
import { module2Nodes } from '../src/data/module2Content';
import { module3Nodes } from '../src/data/module3Content';

const modules = [
  { num: 1, title: 'AI Learning Code', nodes: module1Nodes },
  { num: 2, title: 'Digital Smarts & Human Responsibility', nodes: module2Nodes },
  { num: 3, title: 'Pre-Learn System', nodes: module3Nodes }
];

let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>PlayIQ Curriculum - Modules 1-3</title>
<style>
  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    line-height: 1.6;
    margin: 0;
    padding: 0;
  }
  .page {
    padding: 2cm;
    page-break-after: always;
  }
  .page:last-child {
    page-break-after: avoid;
  }
  h1 {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 10px;
    margin-top: 0;
    margin-bottom: 25px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  h2 {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    margin-top: 35px;
    margin-bottom: 15px;
    border-left: 4px solid #7b4fce;
    padding-left: 10px;
  }
  h3 {
    font-size: 14px;
    font-weight: 700;
    color: #7b4fce;
    margin-top: 20px;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .big-idea {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #00c8ff;
    padding: 16px;
    margin-bottom: 20px;
  }
  .big-idea-title {
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    color: #0088aa;
    margin-bottom: 6px;
  }
  ul {
    margin: 0;
    padding-left: 20px;
  }
  li {
    margin-bottom: 6px;
    font-size: 13px;
  }
  .section-block {
    margin-bottom: 15px;
  }
  .section-title {
    font-weight: 700;
    font-size: 13px;
    color: #334155;
    margin-bottom: 4px;
  }
  .activity-box {
    background-color: #faf5ff;
    border: 1px solid #f3e8ff;
    border-left: 4px solid #7b4fce;
    padding: 16px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .activity-title {
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    color: #6b21a8;
    margin-bottom: 6px;
  }
  .mini-check-box {
    background-color: #f0fdf4;
    border: 1px solid #dcfce7;
    border-left: 4px solid #39ff14;
    padding: 16px;
    margin-bottom: 20px;
  }
  .mini-check-title {
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    color: #166534;
    margin-bottom: 6px;
  }
  .teachback-box {
    background-color: #fffbeb;
    border: 1px solid #fef3c7;
    border-left: 4px solid #f5c518;
    padding: 16px;
    margin-bottom: 20px;
    font-style: italic;
  }
  .teachback-title {
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    color: #92400e;
    margin-bottom: 6px;
    font-style: normal;
  }
  .divider {
    height: 1px;
    background-color: #e2e8f0;
    margin: 30px 0;
    page-break-inside: avoid;
  }
  .cover {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
    page-break-after: always;
    padding: 2cm;
    box-sizing: border-box;
  }
  .cover-logo {
    font-size: 24px;
    font-weight: 800;
    color: #7b4fce;
    margin-bottom: 30px;
    letter-spacing: 1px;
  }
  .cover-title {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 38px;
    font-weight: 900;
    color: #0f172a;
    line-height: 1.1;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .cover-subtitle {
    font-size: 16px;
    color: #64748b;
    margin-bottom: 70px;
    max-width: 450px;
  }
  .cover-meta {
    font-family: monospace;
    font-size: 10px;
    color: #94a3b8;
    border-top: 1px solid #e2e8f0;
    padding-top: 15px;
    width: 200px;
  }
</style>
</head>
<body>

  <!-- Cover Page -->
  <div class="cover">
    <div class="cover-logo">PLAYIQ ACADEMY</div>
    <div class="cover-title">Course Curriculum</div>
    <div class="cover-subtitle">Foundations of Human-AI Collaboration: Modules 1-3</div>
    <div class="cover-meta">
      SECTOR: PARENT GATEWAY<br>
      DATE: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}<br>
      VERSION: 1.0.0
    </div>
  </div>

`;

modules.forEach((mod) => {
  html += `
  <div class="page">
    <h1>Module ${mod.num}: ${mod.title}</h1>
  `;

  // Sort node keys numerically
  const nodeKeys = Object.keys(mod.nodes).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  nodeKeys.forEach((nodeId) => {
    const node = mod.nodes[nodeId];
    html += `
    <div class="node-block" style="page-break-inside: avoid;">
      <h2>Node ${nodeId}: ${node.title}</h2>
      
      <!-- Big Idea -->
      <div class="big-idea">
        <div class="big-idea-title">The Big Idea</div>
        <ul>
          ${node.bigIdea.map(idea => `<li>${idea}</li>`).join('')}
        </ul>
      </div>

      <!-- Core Content Sections -->
      <div class="sections-container">
        ${node.sections.map(section => `
          <div class="section-block">
            ${section.title ? `<div class="section-title">${section.title}</div>` : ''}
            <ul>
              ${section.content.map(bullet => `<li>${bullet}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <!-- Activity -->
      <div class="activity-box">
        <div class="activity-title">Activity: ${node.activity.title}</div>
        <p style="font-size: 13px; margin: 4px 0;"><strong>Instructions:</strong></p>
        <ul>
          ${node.activity.instructions.map(inst => `<li>${inst}</li>`).join('')}
        </ul>
        ${node.activity.scenarios && node.activity.scenarios.length > 0 ? `
          <p style="font-size: 13px; margin: 6px 0 4px 0;"><strong>Scenarios:</strong></p>
          <ul>
            ${node.activity.scenarios.map(scen => `<li>${scen}</li>`).join('')}
          </ul>
        ` : ''}
        ${node.activity.reflection && node.activity.reflection.length > 0 ? `
          <p style="font-size: 13px; margin: 6px 0 4px 0;"><strong>Reflection Prompts:</strong></p>
          <ul>
            ${node.activity.reflection.map(ref => `<li>${ref}</li>`).join('')}
          </ul>
        ` : ''}
      </div>

      <!-- Mini Check -->
      <div class="mini-check-box">
        <div class="mini-check-title">Mini Check</div>
        <ul>
          ${node.miniCheck.map(check => `<li>${check}</li>`).join('')}
        </ul>
      </div>

      <!-- Teach Back -->
      <div class="teachback-box">
        <div class="teachback-title">Teach Back Prompt</div>
        &ldquo;${node.teachBack}&rdquo;
      </div>
    </div>
    
    <div class="divider"></div>
    `;
  });

  html += `
  </div>
  `;
});

// Clean up trailing dividers before closing the page tag
html = html.replace(/<div class="divider"><\/div>\s*<\/div>/g, '</div>');

const scratchDir = path.join(__dirname);
if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir, { recursive: true });
}

const htmlPath = path.join(scratchDir, 'modules_1_3.html');
fs.writeFileSync(htmlPath, html);
console.log(`Generated HTML at: ${htmlPath}`);

// Let's locate Chrome and render the PDF
const outputPdfPath = path.resolve(__dirname, '../playiq-modules-1-3.pdf');

// Common search locations for Google Chrome on Windows
const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'chrome' // if on path
];

let success = false;
for (const chromePath of chromePaths) {
  try {
    console.log(`Attempting to print PDF using Chrome at: ${chromePath}`);
    const cmd = `"${chromePath}" --headless --disable-gpu --print-to-pdf="${outputPdfPath}" "file:///${htmlPath.replace(/\\/g, '/')}"`;
    execSync(cmd, { stdio: 'inherit' });
    console.log(`PDF successfully generated at: ${outputPdfPath}`);
    success = true;
    break;
  } catch (err) {
    console.warn(`Failed to print with Chrome at ${chromePath}, trying next...`);
  }
}

if (!success) {
  console.error('Error: Headless Google Chrome could not print to PDF. Please ensure Chrome is installed.');
  process.exit(1);
}
