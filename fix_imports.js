const fs = require('fs');
const dir = 'src/app/(dashboard)/student/modules/1/nodes/[nodeId]';
const phases = ['lesson', 'activity', 'mini-check', 'teach-back'];

phases.forEach(p => {
  const file = dir + '/' + p + '/page.tsx';
  if(fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/from '\.\.\/actions'/g, "from '../../../actions'");
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  } else {
    console.log('Not found', file);
  }
});
