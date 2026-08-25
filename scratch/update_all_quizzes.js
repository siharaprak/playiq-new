const fs = require('fs');
const path = require('path');

const modules = [2, 3, 4, 5, 6, 7, 8, 9, 10];

modules.forEach(modNum => {
  const actionsPath = path.join(__dirname, `../src/app/(dashboard)/student/modules/${modNum}/actions.ts`);
  const quizPagePath = path.join(__dirname, `../src/app/(dashboard)/student/modules/${modNum}/quiz/page.tsx`);
  const quizFormPath = path.join(__dirname, `../src/app/(dashboard)/student/modules/${modNum}/quiz/Module${modNum}QuizForm.tsx`);

  // 1. Update actions.ts
  if (fs.existsSync(actionsPath)) {
    let actionsContent = fs.readFileSync(actionsPath, 'utf8');
    if (!actionsContent.includes('submitQuizAction')) {
      // replace submitQuiz definition with submitQuizAction
      const oldSubmitQuizRegex = /export async function submitQuiz\(formData: FormData\) \{[\s\S]*?if \(passStatus === 'pass'\) \{[\s\S]*?redirect\(`\$\{BASE\}\/boss-battle`\);[\s\S]*?\} else \{[\s\S]*?redirect\(`\$\{BASE\}\/quiz`\);[\s\S]*?\}\s*\}/;
      
      const newSubmitQuizAction = `export async function submitQuizAction(prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Part A answers: q1→B, q2→C, q3→B
  // Part B answers: q4→A, q5→B, q6→B
  const q1 = formData.get('q1') as string;
  const q2 = formData.get('q2') as string;
  const q3 = formData.get('q3') as string;
  const q4 = formData.get('q4') as string;
  const q5 = formData.get('q5') as string;
  const q6 = formData.get('q6') as string;

  let score = 0;
  if (q1?.toLowerCase() === 'b') score += 17;
  if (q2?.toLowerCase() === 'c') score += 17;
  if (q3?.toLowerCase() === 'b') score += 17;
  if (q4?.toLowerCase() === 'a') score += 17;
  if (q5?.toLowerCase() === 'b') score += 16;
  if (q6?.toLowerCase() === 'b') score += 16;

  const passStatus = score >= 80 ? 'pass' : 'revise';

  const { data: quizSub } = await supabase.from('assessment_submissions').insert({
    student_id: user.id,
    module_id: MODULE_ID,
    assessment_type: 'module_quiz',
    submission_payload: { q1, q2, q3, q4, q5, q6 },
    score_numeric: score,
    pass_status: passStatus
  }).select().single();

  if (quizSub) {
    await logAttemptEvent({
      studentId: user.id,
      eventType: 'assessment_submitted',
      submissionId: quizSub.id,
      assessmentType: 'module_quiz',
      metadata: {
        moduleId: MODULE_ID,
        score,
        passStatus,
        source: 'submitQuizAction'
      }
    });
  }

  if (passStatus === 'pass') {
    redirect(\`\${BASE}/boss-battle\`);
  }

  return {
    error: \`You scored \${score}%. An 80%+ score is required to unlock the Boss Battle. Please review your answers.\`,
    score,
    passed: false,
  };
}

export async function submitQuiz(formData: FormData) {
  return submitQuizAction(null, formData);
}`;

      actionsContent = actionsContent.replace(oldSubmitQuizRegex, newSubmitQuizAction);
      fs.writeFileSync(actionsPath, actionsContent, 'utf8');
      console.log(`Updated module ${modNum} actions.ts with submitQuizAction`);
    }
  }

  // 2. Create Module[N]QuizForm.tsx
  if (fs.existsSync(quizPagePath)) {
    const quizPageContent = fs.readFileSync(quizPagePath, 'utf8');
    
    // Extract the form inner JSX
    const formMatch = quizPageContent.match(/<form action=\{submitQuiz\} className="space-y-10">([\s\S]*?)<\/form>/);
    if (formMatch) {
      let formInner = formMatch[1];
      // add name attributes to textareas if missing
      let qNum = 7;
      formInner = formInner.replace(/<textarea required className="neon-input/g, () => {
        const res = `<textarea name="q${qNum}" required className="neon-input`;
        qNum++;
        return res;
      });

      const clientFormComponent = `'use client';

import React, { useActionState } from 'react';
import { submitQuizAction } from '../actions';

export function Module${modNum}QuizForm() {
  const [state, formAction, isPending] = useActionState(submitQuizAction, null);

  return (
    <form action={formAction} className="space-y-10">
      {state?.error && (
        <div className="p-6 bg-red-950/60 border-2 border-red-500 rounded-xl text-red-100 text-sm font-mono break-words leading-relaxed shadow-[0_0_15px_rgba(239,68,68,0.25)] flex items-start gap-4 animate-pulse-subtle">
          <span className="text-2xl shrink-0 mt-0.5 text-red-500">⚠️</span>
          <div className="flex-1">
            <p className="font-extrabold text-red-400 mb-1.5 uppercase tracking-widest text-xs">
              &gt; QUIZ EVALUATION RESULT
            </p>
            <p className="text-red-200/90 font-sans text-sm">
              {state.error}
            </p>
          </div>
        </div>
      )}
${formInner}
    </form>
  );
}
`;
      fs.writeFileSync(quizFormPath, clientFormComponent, 'utf8');
      console.log(`Created Module${modNum}QuizForm.tsx`);

      // Update quiz page.tsx
      const newPageContent = `import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import { Module${modNum}QuizForm } from './Module${modNum}QuizForm';

export default async function Module${modNum}QuizPage() {
  await enforceModuleGating('quiz', ${modNum});

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div className="mb-4 text-sm text-[#00c8ff] font-semibold uppercase tracking-wider">
        Module ${modNum} · Gateway Assessment
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-8 text-[var(--text-primary)] font-display uppercase">
        Module ${modNum} Assessment Quiz
      </h1>

      <p className="text-slate-400 font-mono text-sm leading-relaxed mb-10">
        This quiz evaluates your mastery of digital responsibility and highest-path thinking. Achieve 80%+ to unlock the Boss Battle.
      </p>

      <Module${modNum}QuizForm />
    </div>
  );
}
`;
      fs.writeFileSync(quizPagePath, newPageContent, 'utf8');
      console.log(`Updated Module ${modNum} quiz/page.tsx`);
    }
  }
});
