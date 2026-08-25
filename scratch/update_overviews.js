const fs = require('fs');
const path = require('path');

const modules = [4, 5, 6, 7, 8, 9, 10];

modules.forEach(modNum => {
  const filePath = path.join(__dirname, `../src/app/(dashboard)/student/modules/${modNum}/overview/page.tsx`);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Insert assessments query and isAdmin check
  const oldNodeCheck = `  // Find first unlocked node (first not mastered)`;
  const newNodeCheck = `  // Fetch assessments and check their scores/states, ordered by newest first
  const { data: assessments } = await supabase
    .from('assessment_submissions')
    .select('*')
    .eq('student_id', user.id)
    .eq('module_id', MODULES.MODULE_${modNum}_ID)
    .order('created_at', { ascending: false });

  // Check if admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'admin';

  const quiz = assessments?.find(a => a.assessment_type === 'module_quiz');
  const bossBattle = assessments?.find(a => a.assessment_type === 'boss_battle');

  const quizUnlocked = isAdmin || masteredNodeIds.size >= MODULE_NODES.length;
  const quizPassed = quiz && quiz.score_numeric >= 80;

  const bossBattleUnlocked = isAdmin || quizPassed;
  const bossBattlePassed = bossBattle && bossBattle.score_numeric >= 4;

  const artifactsUnlocked = isAdmin || bossBattlePassed;

  // Find first unlocked node (first not mastered)`;

  if (!content.includes('const isAdmin = profile?.role === \'admin\';')) {
    content = content.replace(oldNodeCheck, newNodeCheck);
  }

  // Update locked check
  content = content.replace(
    `const locked = !mastered && !isNext && idx > 0 && !masteredNodeIds.has(MODULE_NODES[idx - 1]?.id ?? '');`,
    `const locked = !isAdmin && !mastered && !isNext && idx > 0 && !masteredNodeIds.has(MODULE_NODES[idx - 1]?.id ?? '');`
  );

  // Update assessments section
  const oldAssessmentsRegex = /\{\/\* Assessments \*\/\}[\s\S]*?<\/section>/;
  const newAssessments = `{/* Assessments */}
      <section className="p-6 rounded-xl border" style={{ background: 'var(--space-card)', borderColor: 'var(--neon-purple)' }}>
        <h2 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--neon-purple)' }}>
          Module Assessments
        </h2>
        <div className="flex flex-col gap-3">
          {quizUnlocked ? (
            <Link href="/student/modules/${modNum}/quiz" className="p-4 rounded-lg flex items-center justify-between transition-all group hover:bg-[rgba(0,200,255,0.05)]" style={{ background: 'transparent', border: '1px solid var(--neon-cyan)' }}>
              <span className="text-sm font-mono text-[var(--text-primary)] group-hover:text-[var(--neon-cyan)] transition-colors">Module Quiz — Module ${modNum} Assessment Quiz</span>
              {quizPassed ? (
                <span className="text-xs px-2 py-1 rounded" style={{ border: '1px solid var(--neon-green)', color: 'var(--neon-green)' }}>PASSED ({quiz.score_numeric}%)</span>
              ) : quiz ? (
                <span className="text-xs px-2 py-1 rounded" style={{ border: '1px solid #ef4444', color: '#ef4444' }}>FAILED ({quiz.score_numeric}%) - RETRY</span>
              ) : (
                <span className="text-xs px-2 py-1 rounded" style={{ border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)' }}>START</span>
              )}
            </Link>
          ) : (
            <div className="p-4 rounded-lg opacity-50 cursor-not-allowed" style={{ border: '1px solid var(--glass-border)' }}>
              <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>Module Quiz — Requires {MODULE_NODES.length} Nodes Mastered</span>
            </div>
          )}

          {bossBattleUnlocked ? (
            <Link href="/student/modules/${modNum}/boss-battle" className="p-4 rounded-lg flex items-center justify-between transition-all group hover:bg-[rgba(123,79,206,0.05)]" style={{ background: 'transparent', border: '1px solid var(--neon-purple)' }}>
              <span className="text-sm font-mono text-[var(--text-primary)] group-hover:text-[var(--neon-purple)] transition-colors">Boss Battle — Module ${modNum} Challenge</span>
              {bossBattlePassed ? (
                <span className="text-xs px-2 py-1 rounded" style={{ border: '1px solid var(--neon-green)', color: 'var(--neon-green)' }}>COMPLETED</span>
              ) : (
                <span className="text-xs px-2 py-1 rounded" style={{ border: '1px solid var(--neon-purple)', color: 'var(--neon-purple)' }}>START</span>
              )}
            </Link>
          ) : (
            <div className="p-4 rounded-lg opacity-50 cursor-not-allowed" style={{ border: '1px solid var(--glass-border)' }}>
              <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>Boss Battle — Requires Quiz 80%+</span>
            </div>
          )}

          {artifactsUnlocked ? (
            <Link href="/student/modules/${modNum}/proof-artifacts" className="p-4 rounded-lg flex items-center justify-between transition-all group hover:bg-[rgba(123,79,206,0.05)]" style={{ background: 'transparent', border: '1px solid #7b4fce' }}>
              <span className="text-sm font-mono text-[var(--text-primary)] group-hover:text-[#7b4fce] transition-colors">Proof Artifacts — Submit Artifacts</span>
              <span className="text-xs px-2 py-1 rounded" style={{ border: '1px solid #7b4fce', color: '#7b4fce' }}>OPEN</span>
            </Link>
          ) : (
            <div className="p-4 rounded-lg opacity-50 cursor-not-allowed" style={{ border: '1px solid var(--glass-border)' }}>
              <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>Proof Artifacts — Requires Boss Battle</span>
            </div>
          )}
        </div>
      </section>`;

  content = content.replace(oldAssessmentsRegex, newAssessments);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated module ${modNum} overview`);
});
