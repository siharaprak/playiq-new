const fs = require('fs');
const glob = require('fs');

const dir = 'src/app/(dashboard)/student/modules/1/nodes/[nodeId]';
const phases = ['lesson', 'activity', 'mini-check', 'teach-back', 'completion'];

phases.forEach(p => {
  const file = dir + '/' + p + '/page.tsx';
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace the signature
    content = content.replace(/\{ params \}: \{ params: \{ nodeId: string \} \}/, '{ params }: { params: Promise<{ nodeId: string }> }');
    
    // Inject the unwrapping right after the function block opening
    const regex = /(export default async function[^\{]+\{\s*)/;
    if (content.match(regex) && !content.includes('const { nodeId } = await params;')) {
      content = content.replace(regex, "$1const { nodeId } = await params;\n  ");
    }

    // Replace usage of params.nodeId with nodeId
    content = content.replace(/params\.nodeId/g, 'nodeId');

    fs.writeFileSync(file, content);
    console.log('Fixed params in', file);
  }
});
