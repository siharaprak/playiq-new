const { execFile, execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const binary = fs.existsSync(chromePath) ? chromePath : edgePath;

const inputHtml = path.resolve(__dirname, 'admin_feature_update_guide.html');
const outputPdf = path.resolve(__dirname, '..', 'PlayIQ_Admin_Feature_Update_Reset_Student_Accounts.pdf');

console.log('Generating PDF using:', binary);
console.log('Input:', inputHtml);
console.log('Output:', outputPdf);

const args = [
  '--headless',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${outputPdf}`,
  inputHtml
];

try {
  execFileSync(binary, args, { stdio: 'inherit' });
  if (fs.existsSync(outputPdf)) {
    const stats = fs.statSync(outputPdf);
    console.log(`✅ Successfully generated PDF: ${outputPdf} (${stats.size} bytes)`);
  } else {
    console.error('❌ PDF file was not created');
  }
} catch (err) {
  console.error('Error running browser:', err);
}
