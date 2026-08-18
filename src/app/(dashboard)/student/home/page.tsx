import { Layers, HelpCircle, UploadCloud, Lock, CheckCircle2, Settings } from 'lucide-react';
import { createClient, ensureProfileExists } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';
import Link from 'next/link';
import RequestFeedbackButton from './RequestFeedbackButton';
import StudentUsernameSetup from '@/components/profile/StudentUsernameSetup';
import CourseNavigationGuide from '@/components/dashboard/CourseNavigationGuide';
import SupportIssueForm from '@/components/support/SupportIssueForm';
import DashboardTour from '@/components/dashboard/DashboardTour';

// Module definitions
const moduleList = [
  { id: MODULES.MODULE_1_ID, num: 1, title: 'AI Learning Code', desc: 'Master the foundations of interacting with the AI agent.', totalNodes: 4 },
  { id: MODULES.MODULE_2_ID, num: 2, title: 'Digital Smarts & Human Responsibility', desc: 'AI and the internet are amplifiers. Learn how to use technology in a way that keeps you on your highest path.', totalNodes: 6 },
  { id: MODULES.MODULE_3_ID, num: 3, title: 'Pre-Learn System', desc: 'Get a head start on a school topic before class using AI as a coach.', totalNodes: 4 },
  { id: MODULES.MODULE_4_ID, num: 4, title: 'Lesson Rescue Mode', desc: 'Diagnose confusion and fix the missing piece instead of asking AI to explain everything.', totalNodes: 5 },
  { id: MODULES.MODULE_5_ID, num: 5, title: 'Compression Learning', desc: 'Make hard ideas simpler without making them fake.', totalNodes: 4 },
  { id: MODULES.MODULE_6_ID, num: 6, title: 'Self-Testing and Mistake Bank', desc: 'Stop relying on rereading and build a Mistake Bank to measure memory and correction.', totalNodes: 4 },
  { id: MODULES.MODULE_7_ID, num: 7, title: 'Notes and Study Pack Creation', desc: 'Turn learning into a Study Pack that helps you study faster and gives your future AI tutor better fuel.', totalNodes: 4 },
  { id: MODULES.MODULE_8_ID, num: 8, title: 'Writing and Answer Clarity', desc: 'Use AI as a writing coach to make answers clearer, without letting AI ghostwrite.', totalNodes: 4 },
  { id: MODULES.MODULE_9_ID, num: 9, title: 'Build Your AI Tutor', desc: 'Build your own Learning Supercharger using custom instructions and knowledge files.', totalNodes: 6 },
  { id: MODULES.MODULE_10_ID, num: 10, title: 'Build Your AI Assistant', desc: 'Build a helpful AI assistant for yourself and one other person for a real task.', totalNodes: 7 },
  { id: MODULES.CAPSTONE_ID, num: 11, title: 'Capstone: Master Trial', desc: 'Demonstrate independent learning, tutor-building, and assistant-building across the full system.', totalNodes: 1 },
];

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  let { data: profile } = await supabase.from('profiles').select('full_name, email, username, username_change_count, role, status').eq('id', user.id).single();
  
  if (!profile) {
    const healed = await ensureProfileExists(
      user.id,
      user.email || '',
      user.user_metadata?.full_name || 'Student',
      user.email?.endsWith('@student.playiq.dev') ? 'student' : 'parent'
    );
    if (healed) {
      const { data: newProfile } = await supabase.from('profiles').select('full_name, email, username, username_change_count, role, status').eq('id', user.id).single();
      profile = newProfile;
    }
  }

  const isAuthorized = profile?.role === 'student' || profile?.role === 'admin';
  if (!profile || !isAuthorized || profile.status === 'suspended') {
    if (profile?.status === 'suspended') {
      redirect('/login?error=suspended');
    }
    if (profile?.role) {
      redirect(`/${profile.role}/home`);
    } else {
      redirect('/login');
    }
  }
  const name = (profile as any)?.username || profile?.full_name || 'Student';
  const initials = name.substring(0, 2).toUpperCase();
  const currentUsername: string | null = (profile as any)?.username ?? null;
  const usernameChangeCount: number = (profile as any)?.username_change_count ?? 0;
  const canEditUsername = usernameChangeCount < 3;

  // Fetch assessment profile for blueprint display
  const { data: assessmentProfile } = await supabase
    .from('student_assessment_profiles')
    .select('assessment_completed, explanation_style, motivation_driver, ai_literacy_level, rescue_target_subject, advance_target_subject, personal_goal, learning_blueprint')
    .eq('student_id', user.id)
    .maybeSingle();

  if (profile?.role === 'student' && !assessmentProfile?.assessment_completed) {
    redirect('/student/assessment');
  }

  // Fetch all progress at once
  const { data: allProgress } = await supabase
    .from('student_node_progress')
    .select('module_id')
    .eq('student_id', user.id)
    .eq('node_mastered', true);

  // Group progress by module
  const progressMap = (allProgress || []).reduce((acc, row) => {
    acc[row.module_id] = (acc[row.module_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const isAdmin = profile?.role === 'admin';

  // Determine unlock status and progress percentages
  let previousCompleted = true; // Module 1 is always unlocked

  const modulesWithProgress = moduleList.map((mod) => {
    const nodesMastered = progressMap[mod.id] || 0;
    const isCompleted = nodesMastered >= mod.totalNodes;
    const isUnlocked = isAdmin || previousCompleted;
    const percent = Math.round((nodesMastered / mod.totalNodes) * 100);
    
    // The next module is unlocked only if this one is completed
    previousCompleted = isCompleted;

    return { ...mod, nodesMastered, isCompleted, isUnlocked, percent };
  });

  return (
    <div className="min-h-screen p-6 md:p-12" style={{ backgroundColor: 'var(--space-deep)', color: 'var(--text-primary)' }}>
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 pb-6" style={{ borderBottom: '1px solid rgba(123,79,206,0.2)' }}>
          <h1 className="text-2xl font-bold font-display">PlayIQ <span style={{ color: 'var(--neon-cyan)' }}>Guide</span></h1>
          <div className="flex items-center gap-4">
            <button 
              id="replay-tour-button"
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:bg-purple-500/10 cursor-pointer"
              style={{ border: '1px solid var(--neon-purple)', color: 'var(--neon-purple-light)' }}
            >
              🗺️ Tour Dashboard
            </button>
            <Link href="/settings" className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all" style={{ border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)' }}>
              <Settings className="w-3.5 h-3.5" /> 2FA Shield
            </Link>
            <form action="/auth/signout" method="post" className="inline">
              <button type="submit" className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer hover:bg-red-500/10" style={{ border: '1px solid #ef4444', color: '#ef4444' }}>
                Logout
              </button>
            </form>
            <span className="text-sm px-3 py-1 rounded-full" style={{ background: 'var(--space-card)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}>Phase 1: Foundations</span>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'var(--neon-purple)', color: '#fff' }} title={name}>{initials}</div>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <CourseNavigationGuide studentName={name} studentId={user.id} hasProgress={!!(allProgress && allProgress.length > 0)} />

            {modulesWithProgress.map((mod, index) => {
              if (mod.isUnlocked) {
                return (
                  <div key={mod.id} id={mod.id === MODULES.MODULE_1_ID ? "current-challenge-card" : undefined} className="p-8 rounded-2xl transition-all" style={{ background: 'var(--space-card)', border: `1px solid ${mod.isCompleted ? 'var(--neon-purple)' : 'var(--neon-cyan)'}` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold uppercase tracking-wider" style={{ color: mod.isCompleted ? 'var(--neon-purple)' : 'var(--neon-cyan)' }}>
                        {mod.isCompleted ? 'Completed' : 'Current Challenge'}
                      </span>
                      {mod.isCompleted ? (
                        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full" style={{ background: 'transparent', color: 'var(--neon-green)', border: '1px solid var(--neon-green)' }}>
                          <CheckCircle2 className="w-3 h-3" /> COMPLETE
                        </span>
                      ) : (
                        mod.nodesMastered > 0 && <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'transparent', color: 'var(--neon-cyan)', border: '1px solid var(--neon-cyan)' }}>{mod.percent}% Complete</span>
                      )}
                    </div>
                    <h2 className="text-2xl font-extrabold mb-3 font-display" style={{ color: 'var(--text-primary)' }}>Module {mod.num}: {mod.title}</h2>
                    <p className="mb-6 max-w-lg leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>{mod.desc}</p>
                    
                    {(!mod.isCompleted || mod.nodesMastered > 0) && (
                      <div className="w-full rounded-full h-2 mb-6" style={{ background: 'var(--glass-bg)' }}>
                        <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${mod.percent}%`, background: mod.isCompleted ? 'linear-gradient(90deg, var(--neon-purple), var(--neon-cyan))' : 'linear-gradient(90deg, var(--neon-cyan), var(--neon-green))' }} />
                      </div>
                    )}
                    
                    <Link href={`/student/modules/${mod.num}/overview`} className="inline-block px-6 py-3 rounded-lg font-bold transition-colors" style={{ background: mod.isCompleted ? 'transparent' : 'var(--glass-bg)', color: 'var(--neon-cyan)', border: `1px solid var(--neon-cyan)` }}>
                      {mod.nodesMastered > 0 ? `CONTINUE MODULE ${mod.num} →` : `START MODULE ${mod.num} →`}
                    </Link>
                  </div>
                );
              } else {
                return (
                  <div key={mod.id} className="p-8 rounded-2xl opacity-50" style={{ background: 'var(--space-mid)', border: '1px solid var(--glass-border)' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <Lock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      <span className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Locked</span>
                    </div>
                    <h2 className="text-xl font-extrabold mb-2 font-display" style={{ color: 'var(--text-muted)' }}>Module {mod.num}: {mod.title}</h2>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Complete Module {mod.num - 1} to unlock this module.</p>
                  </div>
                );
              }
            })}

          </div>

          <div className="space-y-6">
            {/* Username Setup/Edit */}
            <div id="username-setup-card">
              <StudentUsernameSetup
                currentUsername={currentUsername}
                canEdit={canEditUsername}
                changeCount={usernameChangeCount}
              />
            </div>

            {/* Assessment Blueprint Card */}
            {assessmentProfile?.assessment_completed ? (
              <div className="p-6 rounded-2xl" style={{ background: 'var(--space-card)', border: '1px solid var(--neon-purple)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold" style={{ background: 'var(--glass-bg)', border: '1px solid var(--neon-purple)', color: 'var(--neon-purple)' }}>Ω</div>
                  <h3 className="font-bold text-sm font-display" style={{ color: 'var(--text-primary)' }}>Your Learning Blueprint</h3>
                </div>
                <div className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {assessmentProfile.explanation_style && (
                    <div className="flex justify-between"><span className="font-mono uppercase" style={{ color: 'var(--text-muted)' }}>Style</span><span style={{ color: 'var(--neon-cyan)' }}>{assessmentProfile.explanation_style === 'visual' ? 'Visual / Big-Picture' : assessmentProfile.explanation_style === 'analytical' ? 'Analytical / Step-by-Step' : 'Verbal / Story-Based'}</span></div>
                  )}
                  {assessmentProfile.motivation_driver && (
                    <div className="flex justify-between"><span className="font-mono uppercase" style={{ color: 'var(--text-muted)' }}>Motivation</span><span style={{ color: 'var(--neon-cyan)' }}>{assessmentProfile.motivation_driver === 'mastery' ? 'Improvement' : assessmentProfile.motivation_driver === 'competitive' ? 'Competition' : assessmentProfile.motivation_driver === 'purpose' ? 'Real-world skills' : 'Recognition'}</span></div>
                  )}
                  {assessmentProfile.rescue_target_subject && (
                    <div className="flex justify-between"><span className="font-mono uppercase" style={{ color: 'var(--text-muted)' }}>Rescue</span><span style={{ color: 'var(--neon-gold)' }}>{assessmentProfile.rescue_target_subject}</span></div>
                  )}
                  {assessmentProfile.advance_target_subject && (
                    <div className="flex justify-between"><span className="font-mono uppercase" style={{ color: 'var(--text-muted)' }}>Advance</span><span style={{ color: 'var(--neon-green)' }}>{assessmentProfile.advance_target_subject}</span></div>
                  )}
                </div>
                <p className="text-xs mt-3 italic" style={{ color: 'var(--text-muted)' }}>&ldquo;Orion is calibrated to you.&rdquo;</p>
              </div>
            ) : (
              <div className="p-6 rounded-2xl" style={{ background: 'var(--space-card)', border: '1px solid var(--glass-border)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold" style={{ background: 'var(--glass-bg)', border: '1px solid var(--text-muted)', color: 'var(--text-muted)' }}>Ω</div>
                  <h3 className="font-bold text-sm font-display" style={{ color: 'var(--text-primary)' }}>Module 0: Assessment</h3>
                </div>
                <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Your learning blueprint has not been created yet. You can manually enter the Orion assessment simulator here.
                </p>
                <Link href="/student/assessment" className="inline-block w-full text-center px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors" style={{ background: 'var(--neon-purple)', color: '#fff' }}>
                  Start Assessment
                </Link>
              </div>
            )}

            {/* Parent Oversight & Privacy Notice */}
            <div id="parent-visibility-card" className="p-6 rounded-2xl font-mono shadow-[0_0_15px_rgba(0,200,255,0.02)]" style={{ background: 'var(--space-card)', border: '1px solid var(--neon-cyan)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: 'var(--glass-bg)', border: '1px solid var(--neon-cyan)' }}>🛡️</div>
                <h3 className="font-bold text-sm font-display" style={{ color: 'var(--text-primary)' }}>Parent Visibility Notice</h3>
              </div>
              <div className="space-y-3 font-sans text-xs" style={{ color: 'var(--text-secondary)' }}>
                <p className="leading-relaxed">
                  Your learning focus is fully protected. Parents <strong className="text-white font-bold">cannot</strong> view your raw learning modules, active nodes, or worksheet input screens.
                </p>
                <p className="leading-relaxed">
                  Instead, they see your overall <strong className="text-white font-bold">progress status</strong>, completed modules, time logs, and submitted Proof Packets. Your active work remains private.
                </p>
              </div>
            </div>

            {/* Engagement Board */}
            <Link href="/discussions" id="engagement-board-card" className="block p-6 rounded-2xl transition-all group" style={{ background: 'var(--space-card)', border: '1px solid var(--neon-cyan)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: 'var(--glass-bg)' }}>💬</div>
                <h3 className="font-bold text-sm font-display group-hover:text-[var(--neon-cyan)] transition-colors" style={{ color: 'var(--text-primary)' }}>Engagement Board</h3>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>Ask questions, share your builds, and connect with other learners.</p>
              <span className="inline-block mt-3 text-xs font-bold" style={{ color: 'var(--neon-cyan)' }}>Open Discussions →</span>
            </Link>

            {/* Need Help */}
            <div id="need-help-card" className="p-6 rounded-2xl" style={{ background: 'var(--space-card)', border: '1px solid var(--neon-purple)' }}>
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle style={{ color: 'var(--neon-gold)' }} className="w-6 h-6" />
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Need Help?</h3>
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>The guide requires you to explain your attempted approach before providing secondary hints.</p>
              <RequestFeedbackButton />
              <SupportIssueForm />
            </div>

            {/* Overall Progress */}
            <div className="p-6 rounded-2xl sticky top-24" style={{ background: 'var(--space-card)', border: '1px solid var(--neon-purple)' }}>
              <div className="flex items-center gap-3 mb-4">
                <Layers style={{ color: 'var(--neon-cyan)' }} className="w-6 h-6" />
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Progress</h3>
              </div>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {modulesWithProgress.map(mod => (
                  <div key={`prog-${mod.id}`} className={mod.isUnlocked ? "opacity-100" : "opacity-50"}>
                    <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                      <span className="truncate pr-2">M{mod.num}: {mod.title}</span><span>{mod.percent}%</span>
                    </div>
                    <div className="w-full rounded-full h-1.5" style={{ background: 'var(--glass-bg)' }}>
                      <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${mod.percent}%`, background: mod.isCompleted ? 'var(--neon-purple)' : 'var(--neon-cyan)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <DashboardTour studentId={user.id} hasProgress={!!(allProgress && allProgress.length > 0)} />
    </div>
  );
}
