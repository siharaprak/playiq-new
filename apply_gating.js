const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src', 'app', '(dashboard)', 'student', 'modules', '1');

const filesToUpdate = [
  { file: 'nodes/[nodeId]/lesson/page.tsx', hook: "await enforceNodeGating(params.nodeId, 'lesson');", import: "import { enforceNodeGating } from '@/lib/gating';" },
  { file: 'nodes/[nodeId]/activity/page.tsx', hook: "await enforceNodeGating(params.nodeId, 'activity');", import: "import { enforceNodeGating } from '@/lib/gating';" },
  { file: 'nodes/[nodeId]/mini-check/page.tsx', hook: "await enforceNodeGating(params.nodeId, 'mini-check');", import: "import { enforceNodeGating } from '@/lib/gating';" },
  { file: 'nodes/[nodeId]/teach-back/page.tsx', hook: "await enforceNodeGating(params.nodeId, 'teach-back');", import: "import { enforceNodeGating } from '@/lib/gating';" },
  { file: 'nodes/[nodeId]/completion/page.tsx', hook: "await enforceNodeGating(params.nodeId, 'completion');", import: "import { enforceNodeGating } from '@/lib/gating';" },
  { file: 'quiz/page.tsx', hook: "await enforceModuleGating('quiz');", import: "import { enforceModuleGating } from '@/lib/gating';" },
  { file: 'boss-battle/page.tsx', hook: "await enforceModuleGating('boss-battle');", import: "import { enforceModuleGating } from '@/lib/gating';" },
  { file: 'proof-artifacts/page.tsx', hook: "await enforceModuleGating('artifacts');", import: "import { enforceModuleGating } from '@/lib/gating';" },
  { file: 'completion/page.tsx', hook: "await enforceModuleGating('completion');", import: "import { enforceModuleGating } from '@/lib/gating';" }
];

filesToUpdate.forEach(({ file, hook, import: importStr }) => {
  const fullPath = path.join(baseDir, file.replace('[nodeId]', '[nodeId]'));
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes(importStr)) {
      content = content.replace("import Link", "import Link from 'next/link';\n" + importStr);
      // Clean up duplicate if any
      content = content.replace("import Link from 'next/link';\nimport Link from 'next/link';", "import Link from 'next/link';");
    }
    
    // Replace the TODO or just inject at the top of the function
    const regex = /\/\/ TODO: Server-side gating logic\.[^\n]*(?:\n[ \t]*\/\/.*)*/m;
    if (regex.test(content)) {
      content = content.replace(regex, hook);
    } else if (!content.includes(hook)) {
       // injection point
       content = content.replace(/(export default async function[^{]+\{)/, `$1\n  ${hook}`);
    }
    
    fs.writeFileSync(fullPath, content);
    console.log('Updated', file);
  } else {
    console.log('Missing', fullPath);
  }
});
