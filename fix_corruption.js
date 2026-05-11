const fs = require('fs');
const path = require('path');

const files = [
  'src/app/(public)/beta/page.tsx',
  'src/app/(public)/page.tsx',
  'src/app/(public)/data-protection/page.tsx',
  'src/app/(public)/apprentice/page.tsx',
  'src/app/(auth)/login/page.tsx',
  'src/app/(dashboard)/admin/home/page.tsx',
];

const corruptPattern = /bg-\[\s*\n\s*\$m = \$args\[0\]\.Value\s*\n\s*\$m -replace 'rgba\\\\?\(255,\\\\?\\s*0,\\\\?\\s*255,\\\\?\\s*', 'rgba\(123,79,206,'\s*\n\s*\]/g;
const replacement = 'bg-[rgba(123,79,206,0.06)]';

let fixedCount = 0;

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Replace the multi-line PowerShell corruption
  content = content.replace(
    /bg-\[ \r?\n\s*\$m = \$args\[0\]\.Value\r?\n\s*\$m -replace 'rgba\\\\?\(255,\\\\?\s*0,\\\\?\s*255,\\\\?\s*', 'rgba\(123,79,206,'\r?\n\s*\]/g,
    replacement
  );
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed:', filePath);
    fixedCount++;
  } else {
    console.log('No match (manual check needed):', filePath);
  }
});

console.log(`\nFixed ${fixedCount} files.`);
