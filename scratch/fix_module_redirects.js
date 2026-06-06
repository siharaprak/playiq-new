// scratch/fix_module_redirects.js
// Automated sweep to fix hardcoded Module 2 navigation redirect bugs across all 10 modules.

const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'src', 'app', '(dashboard)', 'student', 'modules');

for (let m = 1; m <= 10; m++) {
  // 1. Fix actions.ts MODULE_NUM
  const actionsPath = path.join(baseDir, String(m), 'actions.ts');
  if (fs.existsSync(actionsPath)) {
    let content = fs.readFileSync(actionsPath, 'utf8');
    
    // Replace hardcoded const MODULE_NUM = 2; with correct module number
    const target = 'const MODULE_NUM = 2;';
    const replacement = `const MODULE_NUM = ${m};`;
    
    if (content.includes(target)) {
      content = content.replace(target, replacement);
      fs.writeFileSync(actionsPath, content, 'utf8');
      console.log(`✅ Fixed actions.ts for Module ${m}: set MODULE_NUM to ${m}`);
    } else {
      console.log(`ℹ️ actions.ts for Module ${m} already modified or target not found.`);
    }
  }

  // 2. Fix page.tsx index redirects
  const pagePath = path.join(baseDir, String(m), 'page.tsx');
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8');
    
    const target = `redirect('/student/modules/2/overview');`;
    const replacement = `redirect('/student/modules/${m}/overview');`;
    
    if (content.includes(target)) {
      content = content.replace(target, replacement);
      fs.writeFileSync(pagePath, content, 'utf8');
      console.log(`✅ Fixed page.tsx for Module ${m}: redirecting to /student/modules/${m}/overview`);
    } else {
      console.log(`ℹ️ page.tsx for Module ${m} already modified or target not found.`);
    }
  }
}

console.log('🎉 Automated module redirect sweep completed successfully!');
