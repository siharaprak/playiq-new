import * as fs from 'fs';
import * as path from 'path';

const projectRoot = path.join(__dirname, '..');

function buildTree(dir: string, prefix: string = '', ignore: string[] = ['node_modules', '.git', '.next', '.gemini', 'dist']): string {
  let treeStr = '';
  const files = fs.readdirSync(dir).filter(f => !ignore.includes(f));
  
  files.forEach((file, index) => {
    const isLast = index === files.length - 1;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    treeStr += `${prefix}${isLast ? '└── ' : '├── '}${file}\n`;
    
    if (stat.isDirectory()) {
      treeStr += buildTree(fullPath, prefix + (isLast ? '    ' : '│   '), ignore);
    }
  });
  return treeStr;
}

function getLatestSchema(): string {
  const migrationsDir = path.join(projectRoot, 'supabase', 'migrations');
  if (!fs.existsSync(migrationsDir)) return 'No migrations folder found.';
  
  const files = fs.readdirSync(migrationsDir).sort();
  let tables: Record<string, string> = {};
  
  for (const file of files) {
    if (!file.endsWith('.sql')) continue;
    const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    
    // Very rudimentary regex to find CREATE TABLE blocks
    const regex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)\s*\(([\s\S]*?)\);/gi;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const tableName = match[1];
      const tableBody = match[2].split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('--')).join('\n');
      tables[tableName] = tableBody;
    }
  }
  
  let schemaMd = '';
  for (const [name, body] of Object.entries(tables)) {
    schemaMd += `### Table: ${name}\n\`\`\`sql\n${body}\n\`\`\`\n\n`;
  }
  return schemaMd;
}

function analyzeFramework(): string {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (!fs.existsSync(packageJsonPath)) return 'No package.json found.';
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  return `
- Next.js Version: ${pkg.dependencies.next || 'N/A'}
- React Version: ${pkg.dependencies.react || 'N/A'}
- Tailwind CSS: ${pkg.dependencies.tailwindcss || pkg.devDependencies.tailwindcss || 'N/A'}
- Supabase SDK: ${pkg.dependencies['@supabase/supabase-js'] || 'N/A'}
`;
}

function run() {
  const report = `# PlayIQ Project Analysis

## 1. Latest DB Schema
${getLatestSchema()}

## 2. Current Framework Analysis
${analyzeFramework()}

## 3. Project Directory Structure
\`\`\`text
playiq-new/
${buildTree(projectRoot)}
\`\`\`
`;
  
  fs.writeFileSync(path.join(projectRoot, 'project_analysis.md'), report);
  console.log('Analysis written to project_analysis.md');
}

run();
