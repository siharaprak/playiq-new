const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, '../src/app/(dashboard)/student/modules');

async function main() {
  for (let m = 2; m <= 10; m++) {
    const file = path.join(modulesDir, `${m}/completion/page.tsx`);
    if (!fs.existsSync(file)) {
      console.warn(`File not found: ${file}`);
      continue;
    }

    console.log(`Processing: ${file}`);
    let content = fs.readFileSync(file, 'utf8');

    // 1. Add imports
    if (!content.includes('ModuleFeedbackForm')) {
      content = content.replace(
        "import { enforceModuleGating } from '@/lib/gating';",
        `import { enforceModuleGating } from '@/lib/gating';\nimport { createClient } from '@/utils/supabase/server';\nimport { MODULES } from '@/lib/constants';\nimport ModuleFeedbackForm from '@/components/forms/ModuleFeedbackForm';`
      );
    }

    // 2. Fetch feedback & destructure user from enforceModuleGating
    const gateRegex = new RegExp(`await\\s+enforceModuleGating\\(\\s*'completion'\\s*,\\s*${m}\\s*(,\\s*\\d+\\s*)?\\);`);
    const match = content.match(gateRegex);
    if (match) {
      const gateCall = match[0];
      const newGateCall = `const { user } = ${gateCall}\n  const moduleId = MODULES.MODULE_${m}_ID;\n\n  // Query existing feedback if any\n  const supabase = await createClient();\n  const { data: existingFeedback } = await supabase\n    .from('module_feedback')\n    .select('rating, feedback_text')\n    .eq('student_id', user.id)\n    .eq('module_id', moduleId)\n    .maybeSingle();`;
      
      content = content.replace(gateCall, newGateCall);
    } else {
      console.error(`Could not match enforceModuleGating call in module ${m}`);
      continue;
    }

    // 3. Inject form before the dashboard link
    const linkString = '<Link\n        href="/student/home"';
    if (content.includes(linkString)) {
      content = content.replace(
        linkString,
        `{/* Feedback Form */}\n      <ModuleFeedbackForm moduleId={moduleId} initialFeedback={existingFeedback} />\n\n      ${linkString}`
      );
    } else {
      console.error(`Could not match Link component in module ${m}`);
      continue;
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Successfully updated: ${file}`);
  }
}

main().catch(console.error);
