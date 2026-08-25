const fs = require('fs');
const path = require('path');

for (let mod = 1; mod <= 10; mod++) {
  const filePath = path.join(__dirname, `../src/app/(dashboard)/student/modules/${mod}/nodes/[nodeId]/lesson/page.tsx`);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Add import for LessonContentRenderer if not present
    if (!content.includes('LessonContentRenderer')) {
      content = content.replace(
        `import { module${mod}Nodes } from '@/data/module${mod}Content';`,
        `import { module${mod}Nodes } from '@/data/module${mod}Content';\nimport LessonContentRenderer from '@/components/modules/LessonContentRenderer';`
      );
    }

    // 2. Replace the sections.map block with <LessonContentRenderer sections={lessonData.sections} />
    const oldSectionBlockRegex = /\{lessonData\.sections\.map\(\(section, idx\) => \([\s\S]*?<\/div>\s*\)\)\}/;
    if (oldSectionBlockRegex.test(content)) {
      content = content.replace(oldSectionBlockRegex, `<LessonContentRenderer sections={lessonData.sections} />`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated Module ${mod} lesson page with LessonContentRenderer`);
  }
}
