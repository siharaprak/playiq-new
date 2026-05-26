import * as fs from 'fs';
import * as path from 'path';

function walkDir(dir: string, callback: (filePath: string) => void) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

async function run() {
  console.log("=== RUNTIME SOURCE UNCHANGED VERIFIER ===");
  let errors = 0;
  let filesChecked = 0;

  const searchDirs = [
    path.join(__dirname, '../src/app'),
    path.join(__dirname, '../src/components'),
    path.join(__dirname, '../src/lib/gating.ts'),
  ];

  const skillNodeRegex = /['"\`]skill_nodes['"\`]/g;
  const staticImportRegex = /from\s+['"\`].*module.*Content['"\`]/g;
  let staticImportsFound = 0;

  for (const dirOrFile of searchDirs) {
    if (!fs.existsSync(dirOrFile)) continue;

    if (fs.statSync(dirOrFile).isDirectory()) {
      walkDir(dirOrFile, (filePath) => {
        if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;
        filesChecked++;
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 1. Ensure no direct query to skill_nodes
        if (skillNodeRegex.test(content)) {
          console.error(`❌ Found unexpected skill_nodes reference in ${filePath}`);
          errors++;
        }

        // Count static imports
        if (staticImportRegex.test(content)) {
          staticImportsFound++;
        }
      });
    } else {
      // It's a file
      filesChecked++;
      const content = fs.readFileSync(dirOrFile, 'utf8');
      if (skillNodeRegex.test(content)) {
        console.error(`❌ Found unexpected skill_nodes reference in ${dirOrFile}`);
        errors++;
      }
    }
  }

  // 2. Check enforcement_mode in courses
  // Wait, I can do DB check here but this is runtime source analysis.
  
  console.log(`Checked ${filesChecked} files.`);
  console.log(`Found ${staticImportsFound} static content imports.`);

  if (staticImportsFound === 0) {
    console.warn("⚠️ Warning: Found 0 static imports. This might mean the scan is incorrect, or we removed them all.");
  }

  if (errors > 0) {
    console.error(`\n❌ Validation FAILED with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log("\n✅ Runtime source unchanged verifier passed.");
  }
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
