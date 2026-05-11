const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src/app/(dashboard)/student/modules/2');
const destDir = path.join(__dirname, '../src/app/(dashboard)/student/modules/1');

function copyAndReplace(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const files = fs.readdirSync(src);
    for (const file of files) {
      copyAndReplace(path.join(src, file), path.join(dest, file));
    }
  } else {
    // Read file, replace strings, write to dest
    let content = fs.readFileSync(src, 'utf-8');
    
    // Replacements
    content = content.replace(/module2Content/g, 'module1Content');
    content = content.replace(/module2Nodes/g, 'module1Nodes');
    content = content.replace(/MODULE_2_ID/g, 'MODULE_1_ID');
    content = content.replace(/Module 2/g, 'Module 1');
    content = content.replace(/\/modules\/2\//g, '/modules/1/');
    content = content.replace(/Digital Smarts & Human Responsibility/g, 'AI Learning Code');
    
    // For the overview page specific text
    content = content.replace(/Digital Smarts &amp; Human Responsibility/g, 'AI Learning Code');
    content = content.replace(/Skill Tree: Highest Path/g, 'Skill Tree: Foundation');
    
    // For layout or other specific files
    if (src.includes('page.tsx') && src.includes('overview')) {
      content = content.replace(/AI and the internet are amplifiers.*?highest path\./g, 'Master the foundation of using AI as a coach, not a shortcut.');
    }
    
    fs.writeFileSync(dest, content, 'utf-8');
  }
}

// Ensure destDir exists, though it already does
copyAndReplace(srcDir, destDir);
console.log("Successfully cloned Module 2 to Module 1 and replaced placeholders.");
