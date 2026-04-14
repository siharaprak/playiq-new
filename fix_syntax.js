const fs = require('fs');
const dir = 'src/app/(dashboard)/student/modules/1/nodes/[nodeId]';
const phases = ['lesson', 'activity', 'mini-check', 'teach-back', 'completion'];

phases.forEach(p => {
  const file = dir + '/' + p + '/page.tsx';
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // The broken signature looks like:
    // export default async function NodeLessonPage({ const { nodeId } = await params;
    //   params }: { params: Promise<{ nodeId: string }> }) {
    
    // We just brutally pull it out and replace it with the clean version
    const regexBrokenSignature = /export default async function\s+(\w+)\s*\(\s*\{\s*const\s*\{\s*nodeId\s*\}\s*=\s*await\s*params;\s*params\s*\}\s*:\s*\{\s*params\s*:\s*Promise\s*<\s*\{\s*nodeId\s*:\s*string\s*\}\s*>\s*\}\s*\)\s*\{/g;
    
    content = content.replace(regexBrokenSignature, (match, funcName) => {
      return `export default async function ${funcName}({ params }: { params: Promise<{ nodeId: string }> }) {\n  const { nodeId } = await params;`;
    });

    fs.writeFileSync(file, content);
    console.log('Repaired syntax in', file);
  }
});
