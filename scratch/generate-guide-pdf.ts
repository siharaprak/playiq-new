import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const mdPath = path.resolve(__dirname, '../docs/orion-portfolio-setup-guide.md');
const mdContent = fs.readFileSync(mdPath, 'utf8');

// Basic markdown-to-HTML parser for our specific setup guide format
function parseMarkdown(md: string): string {
  let html = '';
  const lines = md.split('\n');
  let inList = false;
  let inTable = false;
  let tableHeaders: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Horizontal Rule
    if (line === '---') {
      if (inList) { html += '</ul>\n'; inList = false; }
      if (inTable) { html += '</tbody></table>\n'; inTable = false; }
      html += '<div class="divider"></div>\n';
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      if (inList) { html += '</ul>\n'; inList = false; }
      if (inTable) { html += '</tbody></table>\n'; inTable = false; }
      html += `<h1>${line.substring(2)}</h1>\n`;
      continue;
    }
    if (line.startsWith('## ')) {
      if (inList) { html += '</ul>\n'; inList = false; }
      if (inTable) { html += '</tbody></table>\n'; inTable = false; }
      // Check for Table of Contents, Overview etc.
      const text = line.substring(3);
      html += `<h2>${text}</h2>\n`;
      continue;
    }
    if (line.startsWith('### ')) {
      if (inList) { html += '</ul>\n'; inList = false; }
      if (inTable) { html += '</tbody></table>\n'; inTable = false; }
      html += `<h3>${line.substring(4)}</h3>\n`;
      continue;
    }

    // Bold text headers (e.g. **For:** Jer-ric Martinez)
    if (line.startsWith('**') && line.endsWith('**') && i < lines.length - 1 && lines[i + 1].trim() === '') {
      if (inList) { html += '</ul>\n'; inList = false; }
      html += `<div class="sub-header">${line.replace(/\*\*/g, '')}</div>\n`;
      continue;
    }

    // Table Handling
    if (line.startsWith('|')) {
      if (inList) { html += '</ul>\n'; inList = false; }
      
      const parts = line.split('|').map(p => p.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      
      // Separator line e.g., | :--- | :--- | :--- |
      if (parts.every(p => p.startsWith(':') || p.startsWith('-') || p.endsWith('-') || p.endsWith(':'))) {
        continue;
      }
      
      if (!inTable) {
        inTable = true;
        tableHeaders = parts;
        html += '<table className="info-table">\n<thead>\n<tr>\n';
        tableHeaders.forEach(h => {
          html += `  <th>${h.replace(/\*\*/g, '')}</th>\n`;
        });
        html += '</tr>\n</thead>\n<tbody>\n';
      } else {
        html += '<tr>\n';
        parts.forEach(cell => {
          // parse inline markdown in cells
          let cellHtml = cell
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>');
          html += `  <td>${cellHtml}</td>\n`;
        });
        html += '</tr>\n';
      }
      continue;
    } else {
      if (inTable) {
        html += '</tbody>\n</table>\n';
        inTable = false;
      }
    }

    // Lists (unordered and task lists)
    if (line.startsWith('* ') || line.startsWith('- ')) {
      if (!inList) {
        inList = true;
        html += '<ul>\n';
      }
      
      let itemContent = line.substring(2);
      
      // Checkboxes e.g. - [ ] Step 1
      let isTask = false;
      let checked = false;
      if (itemContent.startsWith('[ ] ')) {
        isTask = true;
        itemContent = itemContent.substring(4);
      } else if (itemContent.startsWith('[x] ')) {
        isTask = true;
        checked = true;
        itemContent = itemContent.substring(4);
      }
      
      // Inline markdown formatting
      let formatted = itemContent
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

      if (isTask) {
        html += `  <li class="task-item"><span class="checkbox ${checked ? 'checked' : ''}"></span> ${formatted}</li>\n`;
      } else {
        html += `  <li>${formatted}</li>\n`;
      }
      continue;
    } else {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
    }

    // Paragraphs or metadata lines
    if (line !== '') {
      // Inline markdown formatting
      let formatted = line
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
      
      html += `<p>${formatted}</p>\n`;
    }
  }

  if (inList) html += '</ul>\n';
  if (inTable) html += '</tbody></table>\n';

  return html;
}

const parsedHtmlContent = parseMarkdown(mdContent);

const htmlWrapper = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Orion Portfolio Guide - Jerric Martinez</title>
<style>
  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    color: #0f172a;
    background-color: #ffffff;
    line-height: 1.6;
    margin: 0;
    padding: 0;
  }
  .page {
    padding: 2.2cm;
    page-break-after: always;
  }
  .page:last-child {
    page-break-after: avoid;
  }
  h1 {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 26px;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 12px;
    margin-top: 0;
    margin-bottom: 25px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  h2 {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #7b4fce;
    margin-top: 30px;
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-left: 4px solid #7b4fce;
    padding-left: 10px;
  }
  h3 {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    margin-top: 20px;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  p {
    font-size: 13px;
    margin-top: 0;
    margin-bottom: 12px;
    color: #334155;
  }
  .sub-header {
    font-size: 14px;
    font-weight: bold;
    color: #475569;
    margin-top: 5px;
    margin-bottom: 15px;
  }
  ul {
    margin-top: 0;
    margin-bottom: 15px;
    padding-left: 20px;
  }
  li {
    margin-bottom: 6px;
    font-size: 13px;
    color: #334155;
  }
  .task-item {
    list-style-type: none;
    position: relative;
    padding-left: 24px;
    margin-bottom: 8px;
  }
  .checkbox {
    position: absolute;
    left: 0;
    top: 3px;
    width: 14px;
    height: 14px;
    border: 1px solid #7b4fce;
    background: #faf5ff;
    border-radius: 3px;
  }
  .checkbox.checked::after {
    content: "✓";
    position: absolute;
    left: 2.5px;
    top: -2px;
    font-size: 10px;
    font-weight: bold;
    color: #7b4fce;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
    margin-bottom: 25px;
    font-size: 12px;
    page-break-inside: avoid;
  }
  th {
    background-color: #faf5ff;
    color: #7b4fce;
    font-weight: 700;
    text-align: left;
    padding: 10px;
    border-bottom: 2px solid #e9d5ff;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  td {
    padding: 10px;
    border-bottom: 1px solid #f3e8ff;
    color: #334155;
  }
  tr:nth-child(even) td {
    background-color: #fafafa;
  }
  code {
    font-family: monospace;
    background-color: #f1f5f9;
    padding: 2px 4px;
    border-radius: 3px;
    font-size: 12px;
    color: #0f172a;
  }
  a {
    color: #7b4fce;
    text-decoration: none;
    font-weight: 600;
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
    font-size: 20px;
    font-weight: 800;
    color: #7b4fce;
    margin-bottom: 40px;
    letter-spacing: 2px;
  }
  .cover-title {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 32px;
    font-weight: 900;
    color: #0f172a;
    line-height: 1.2;
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .cover-subtitle {
    font-size: 14px;
    color: #475569;
    margin-bottom: 100px;
    max-width: 480px;
  }
  .cover-meta {
    font-family: monospace;
    font-size: 10px;
    color: #94a3b8;
    border-top: 1px solid #e2e8f0;
    padding-top: 20px;
    width: 250px;
  }
</style>
</head>
<body>

  <!-- Cover Page -->
  <div class="cover">
    <div class="cover-logo">PLAYIQ ACADEMY</div>
    <div class="cover-title">Orion Portfolio Package<br>Setup Guide</div>
    <div class="cover-subtitle">Implementation guide for creating school partnerships decks & one-pagers.</div>
    <div class="cover-meta">
      PREPARED FOR: Jer-ric Martinez<br>
      DATE: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}<br>
      VERSION: 1.0.0
    </div>
  </div>

  <div class="page">
    ${parsedHtmlContent}
  </div>

</body>
</html>
`;

const scratchDir = path.join(__dirname);
const htmlPath = path.join(scratchDir, 'guide.html');
fs.writeFileSync(htmlPath, htmlWrapper);
console.log(`Generated Guide HTML at: ${htmlPath}`);

const outputPdfPath = path.resolve(__dirname, '../docs/orion-portfolio-setup-guide.pdf');

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'chrome'
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
  console.error('Error: Headless Google Chrome could not print to PDF.');
  process.exit(1);
}
