const fs = require('fs');
const path = require('path');

const modules = [3, 4, 5, 6, 7, 8, 9, 10];

modules.forEach(modNum => {
  const actionsPath = path.join(__dirname, `../src/app/(dashboard)/student/modules/${modNum}/actions.ts`);
  const pagePath = path.join(__dirname, `../src/app/(dashboard)/student/modules/${modNum}/boss-battle/page.tsx`);

  if (fs.existsSync(actionsPath)) {
    let actionsContent = fs.readFileSync(actionsPath, 'utf8');
    if (!actionsContent.includes('submitBossBattleDirectAction')) {
      actionsContent = actionsContent.replace(
        'export async function submitBossBattleAction(',
        'export async function submitBossBattleDirectAction(formData: FormData) {\n  await submitBossBattleAction(null, formData);\n}\n\nexport async function submitBossBattleAction('
      );
      fs.writeFileSync(actionsPath, actionsContent, 'utf8');
      console.log(`Updated module ${modNum} actions.ts`);
    }
  }

  if (fs.existsSync(pagePath)) {
    let pageContent = fs.readFileSync(pagePath, 'utf8');
    pageContent = pageContent.replace(
      `import { submitBossBattleAction } from '../actions';`,
      `import { submitBossBattleDirectAction } from '../actions';`
    );
    pageContent = pageContent.replace(
      `const submitAction = submitBossBattleAction.bind(null, null);`,
      ``
    );
    pageContent = pageContent.replace(
      `<form action={submitAction} className="space-y-8">`,
      `<form action={submitBossBattleDirectAction} className="space-y-8">`
    );
    fs.writeFileSync(pagePath, pageContent, 'utf8');
    console.log(`Updated module ${modNum} boss-battle/page.tsx`);
  }
});
