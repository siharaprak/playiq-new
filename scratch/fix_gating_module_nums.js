// scratch/fix_gating_module_nums.js
const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'src', 'app', '(dashboard)', 'student', 'modules');

const phases = ['lesson', 'activity', 'mini-check', 'teach-back', 'completion'];

for (let m = 1; m <= 10; m++) {
  phases.forEach(phase => {
    const pagePath = path.join(baseDir, String(m), 'nodes', '[nodeId]', phase, 'page.tsx');
    if (fs.existsSync(pagePath)) {
      let content = fs.readFileSync(pagePath, 'utf8');
      
      // Regex to match enforceNodeGating(nodeId, 'phase', 2) or any number, and replace with correct module m
      const regex = /enforceNodeGating\((nodeId,\s*['"][a-zA-Z0-9_-]+['"],\s*)\d+\)/g;
      
      if (regex.test(content)) {
        content = content.replace(regex, (match, prefix) => `enforceNodeGating(${prefix}${m})`);
        fs.writeFileSync(pagePath, content, 'utf8');
        console.log(`✅ Fixed enforceNodeGating call in Module ${m} (${phase}): set module number to ${m}`);
      } else {
        console.log(`ℹ️ Module ${m} (${phase}) does not contain match or already fixed.`);
      }
    } else {
      console.log(`⚠️ Path does not exist: ${pagePath}`);
    }
  });
}

console.log('🎉 Gating module number repair completed successfully!');
