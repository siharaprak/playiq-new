import { Layers, HelpCircle, Lock, CheckCircle2, Settings } from 'lucide-react';
import { createClient, ensureProfileExists } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MODULES, COURSE_15_MODULES, isNodeKeyForCourseModule } from '@/lib/constants';
import Link from 'next/link';
import RequestFeedbackButton from './RequestFeedbackButton';
import StudentUsernameSetup from '@/components/profile/StudentUsernameSetup';
import CourseNavigationGuide from '@/components/dashboard/CourseNavigationGuide';
import SupportIssueForm from '@/components/support/SupportIssueForm';
import DashboardTour from '@/components/dashboard/DashboardTour';

// Module definitions (Modules 1-14 in the main progression list; Module 00 is featured at top + Blueprint sidebar)
const moduleList = COURSE_15_MODULES.filter((m) => m.num >= 1);

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Select * so this works whether or not the optional profiles.status column exists
  // (the weekend-release staging DB has no status column; selecting it fails the query).
  let { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  
  if (!profile) {
    const healed = await ensureProfileExists(
      user.id,
      user.email || '',
      user.user_metadata?.full_name || 'Student',
      user.email?.endsWith('@student.playiq.dev') ? 'student' : 'parent'
    );
    if (healed) {
      const { data: newProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
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
  const initials = (name || 'Student').trim().substring(0, 2).toUpperCase() || 'ST';
  const currentUsername: string | null = (profile as any)?.username ?? null;
  const usernameChangeCount: number = (profile as any)?.username_change_count ?? 0;
  const canEditUsername = usernameChangeCount < 3;

  // Fetch assessment profile for blueprint display with safe fallback
  let assessmentProfile: any = null;
  try {
    const { data: ap } = await supabase
      .from('student_assessment_profiles')
      .select('assessment_completed, explanation_style, motivation_driver, ai_literacy_level, rescue_target_subject, advance_target_subject, personal_goal, learning_blueprint')
      .eq('student_id', user.id)
      .maybeSingle();
    assessmentProfile = ap;
  } catch (err) {
    console.error('Error fetching student assessment profile:', err);
  }

  if (profile?.role === 'student' && !assessmentProfile?.assessment_completed) {
    redirect('/student/assessment');
  }

  // Fetch all progress at once with safe fallback
  let allProgress: any[] | null = null;
  try {
    const { data: prog } = await supabase
      .from('student_node_progress')
      .select('module_id, node_id')
      .eq('student_id', user.id)
      .eq('node_mastered', true);
    allProgress = prog;
  } catch (err) {
    console.error('Error fetching student node progress:', err);
  }

  // Also fetch course_release_learning_records completion state for 15-module tracking
  let learningRecordCompletedMap: Record<number, boolean> = {};
  try {
    const { data: lrRows } = await supabase
      .from('course_release_learning_records')
      .select('module_number, completed')
      .eq('student_id', user.id);
    if (lrRows) {
      for (const row of lrRows) {
        if (row.completed) {
          learningRecordCompletedMap[row.module_number] = true;
        }
      }
    }
  } catch {
    // Non-fatal if table is not yet migrated in a local test environment
  }

  // Group progress by 15-module course number (isolating New Modules 10-14 from legacy 12-module rows)
  const progressByModuleNum: Record<number, number> = {};
  for (const mod of moduleList) {
    progressByModuleNum[mod.num] = (allProgress || []).filter((row) =>
      isNodeKeyForCourseModule(mod.num, row.module_id, row.node_id)
    ).length;
  }

  const isAdmin = profile?.role === 'admin';
  const module0Meta = COURSE_15_MODULES[0];
  const isModule0Completed = Boolean(assessmentProfile?.assessment_completed || learningRecordCompletedMap[0]);

  // Determine unlock status and progress percentages across Modules 1-14
  // Sequential chain: Module N is unlocked ONLY if Modules 1..(N-1) are all unlocked AND completed.
  let previousUnlockedAndCompleted = true; // Module 1 is unlocked once Module 00 assessment is completed

  const modulesWithProgress = moduleList.map((mod) => {
    const rawNodesMastered = progressByModuleNum[mod.num] || 0;
    const recordCompleted = mod.num >= 13 && Boolean(learningRecordCompletedMap[mod.num]);
    const isUnlocked = isAdmin || previousUnlockedAndCompleted;
    const nodesMastered = recordCompleted
      ? Math.max(rawNodesMastered, mod.totalNodes)
      : rawNodesMastered;
    const rawCompleted = nodesMastered >= mod.totalNodes || recordCompleted;
    // A module in the sequential student progression cannot be marked completed if an earlier module is incomplete
    const isCompleted = isUnlocked && rawCompleted;
    const displayNodesMastered = isUnlocked ? nodesMastered : 0;
    const percent = isUnlocked
      ? Math.min(100, Math.round((displayNodesMastered / mod.totalNodes) * 100))
      : 0;

    // The next module is unlocked ONLY if this module is unlocked AND completed
    previousUnlockedAndCompleted = isUnlocked && isCompleted;

    return {
      ...mod,
      nodesMastered: displayNodesMastered,
      isCompleted,
      isUnlocked,
      percent,
    };
  });

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-12 pt-24 pb-12" style={{ backgroundColor: 'var(--space-deep)', color: 'var(--text-primary)' }}>
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-12 pb-4 sm:pb-6" style={{ borderBottom: '1px solid rgba(123,79,206,0.2)' }}>
          <div className="flex items-center justify-between w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl font-bold font-display">PlayIQ <span style={{ color: 'var(--neon-cyan)' }}>Guide</span></h1>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex sm:hidden items-center justify-center font-bold text-xs sm:text-sm" style={{ background: 'var(--neon-purple)', color: '#fff' }} title={name}>{initials}</div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <button 
              id="replay-tour-button"
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 min-h-[38px] rounded-lg transition-all hover:bg-purple-500/10 cursor-pointer"
              style={{ border: '1px solid var(--neon-purple)', color: 'var(--neon-purple-light)' }}
            >
              🗺️ Tour Dashboard
            </button>
            <Link href="/settings" className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 min-h-[38px] rounded-lg transition-all" style={{ border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)' }}>
              <Settings className="w-3.5 h-3.5" /> 2FA Shield
            </Link>
            <form action="/auth/signout" method="post" className="inline">
              <button type="submit" className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 min-h-[38px] rounded-lg transition-all cursor-pointer hover:bg-red-500/10" style={{ border: '1px solid #ef4444', color: '#ef4444' }}>
                Logout
              </button>
            </form>
            <span className="hidden sm:inline-block text-sm px-3 py-1 rounded-full" style={{ background: 'var(--space-card)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}>Phase 1: Foundations</span>
            <div className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center font-bold text-sm" style={{ background: 'var(--neon-purple)', color: '#fff' }} title={name}>{initials}</div>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          <div className="md:col-span-2 space-y-4 sm:space-y-6">
            <CourseNavigationGuide studentName={name} studentId={user.id} hasProgress={!!(allProgress && allProgress.length > 0)} />

            {/* Module 00 Card */}
            <div className="p-5 sm:p-8 rounded-2xl transition-all" style={{ background: 'var(--space-card)', border: `1px solid ${isModule0Completed ? 'var(--neon-purple)' : 'var(--neon-cyan)'}` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider" style={{ color: isModule0Completed ? 'var(--neon-purple)' : 'var(--neon-cyan)' }}>
                  {isModule0Completed ? 'Completed' : 'Orientation & Calibration'}
                </span>
                {isModule0Completed ? (
                  <span className="flex items-center gap-1 text-[11px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full" style={{ background: 'transparent', color: 'var(--neon-green)', border: '1px solid var(--neon-green)' }}>
                    <CheckCircle2 className="w-3 h-3" /> COMPLETE
                  </span>
                ) : (
                  <span className="text-[11px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full" style={{ background: 'transparent', color: 'var(--neon-cyan)', border: '1px solid var(--neon-cyan)' }}>Start Here</span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold mb-2 sm:mb-3 font-display" style={{ color: 'var(--text-primary)' }}>Module 00: {module0Meta.title}</h2>
              <p className="mb-4 sm:mb-6 max-w-lg leading-relaxed text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>{module0Meta.desc}</p>
              <Link href={isModule0Completed ? '/student/assessment?view=true' : '/student/assessment'} className="w-full sm:w-auto text-center inline-flex items-center justify-center px-6 py-3 min-h-[44px] rounded-lg font-bold transition-colors active:scale-[0.98]" style={{ background: isModule0Completed ? 'transparent' : 'var(--glass-bg)', color: 'var(--neon-cyan)', border: '1px solid var(--neon-cyan)' }}>
                {isModule0Completed ? 'REVIEW MODULE 00 & AI WORKSPACE →' : 'START MODULE 00 →'}
              </Link>
            </div>

            {modulesWithProgress.map((mod, index) => {
              if (mod.isUnlocked) {
                return (
                  <div key={mod.id} id={mod.id === MODULES.MODULE_1_ID ? "current-challenge-card" : undefined} className="p-5 sm:p-8 rounded-2xl transition-all" style={{ background: 'var(--space-card)', border: `1px solid ${mod.isCompleted ? 'var(--neon-purple)' : 'var(--neon-cyan)'}` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider" style={{ color: mod.isCompleted ? 'var(--neon-purple)' : 'var(--neon-cyan)' }}>
                        {mod.isCompleted ? 'Completed' : 'Current Challenge'}
                      </span>
                      <div className="flex items-center gap-2">
                        {!mod.requiresArtifact && (
                          <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: 'rgba(245,197,24,0.1)', color: 'var(--neon-gold)', border: '1px solid rgba(245,197,24,0.4)' }}>
                            Horizon Module · No Artifact Required
                          </span>
                        )}
                        {mod.isCompleted ? (
                          <span className="flex items-center gap-1 text-[11px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full" style={{ background: 'transparent', color: 'var(--neon-green)', border: '1px solid var(--neon-green)' }}>
                            <CheckCircle2 className="w-3 h-3" /> COMPLETE
                          </span>
                        ) : (
                          mod.nodesMastered > 0 && <span className="text-[11px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full" style={{ background: 'transparent', color: 'var(--neon-cyan)', border: '1px solid var(--neon-cyan)' }}>{mod.percent}% Complete</span>
                        )}
                      </div>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold mb-2 sm:mb-3 font-display" style={{ color: 'var(--text-primary)' }}>Module {mod.num}: {mod.title}</h2>
                    <p className="mb-4 sm:mb-6 max-w-lg leading-relaxed text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>{mod.desc}</p>
                    
                    {(!mod.isCompleted || mod.nodesMastered > 0) && (
                      <div className="w-full rounded-full h-2 mb-4 sm:mb-6" style={{ background: 'var(--glass-bg)' }}>
                        <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${mod.percent}%`, background: mod.isCompleted ? 'linear-gradient(90deg, var(--neon-purple), var(--neon-cyan))' : 'linear-gradient(90deg, var(--neon-cyan), var(--neon-green))' }} />
                      </div>
                    )}
                    
                    <Link href={`/student/modules/${mod.num}/overview`} className="w-full sm:w-auto text-center inline-flex items-center justify-center px-6 py-3 min-h-[44px] rounded-lg font-bold transition-colors active:scale-[0.98]" style={{ background: mod.isCompleted ? 'transparent' : 'var(--glass-bg)', color: 'var(--neon-cyan)', border: `1px solid var(--neon-cyan)` }}>
                      {mod.nodesMastered > 0 ? `CONTINUE MODULE ${mod.num} →` : `START MODULE ${mod.num} →`}
                    </Link>
                  </div>
                );
              } else {
                return (
                  <div key={mod.id} className="p-5 sm:p-8 rounded-2xl opacity-50" style={{ background: 'var(--space-mid)', border: '1px solid var(--glass-border)' }}>
                    <div className="flex items-center justify-between gap-3 mb-2 sm:mb-3">
                      <div className="flex items-center gap-3">
                        <Lock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Locked</span>
                      </div>
                      {!mod.requiresArtifact && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono" style={{ color: 'var(--text-muted)', border: '1px solid var(--glass-border)' }}>
                          No Artifact Required
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold mb-1 sm:mb-2 font-display" style={{ color: 'var(--text-muted)' }}>Module {mod.num}: {mod.title}</h2>
                    <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>Complete Module {mod.num - 1} to unlock this module.</p>
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
                <p className="text-xs mt-3 mb-4 italic" style={{ color: 'var(--text-muted)' }}>&ldquo;Starting hypotheses to test &amp; refine across modules.&rdquo;</p>
                <Link
                  href="/student/assessment?view=true"
                  className="inline-flex items-center justify-center w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border border-[var(--neon-purple)] text-[var(--neon-purple-light)] hover:bg-[var(--neon-purple)]/10 hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]"
                >
                  View Module 00 &amp; AI Workshop →
                </Link>
              </div>
            ) : (
              <div className="p-6 rounded-2xl" style={{ background: 'var(--space-card)', border: '1px solid var(--glass-border)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold" style={{ background: 'var(--glass-bg)', border: '1px solid var(--text-muted)', color: 'var(--text-muted)' }}>Ω</div>
                  <h3 className="font-bold text-sm font-display" style={{ color: 'var(--text-primary)' }}>Module 00: Assessment</h3>
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

            {/* Beta Support & Bug Reporting */}
            <div id="need-help-card" className="p-6 rounded-2xl" style={{ background: 'var(--space-card)', border: '1px solid var(--neon-purple)' }}>
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle style={{ color: 'var(--neon-gold)' }} className="w-6 h-6" />
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Beta Feedback & Bug Report</h3>
              </div>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Encountered a platform glitch or have ideas to improve PlayIQ? Share your beta feedback or log technical issues directly to our engineering team.
              </p>
              <RequestFeedbackButton />
              <SupportIssueForm />
            </div>

            {/* Overall Progress */}
            <div className="p-6 rounded-2xl sticky top-24" style={{ background: 'var(--space-card)', border: '1px solid var(--neon-purple)' }}>
              <div className="flex items-center gap-3 mb-4">
                <Layers style={{ color: 'var(--neon-cyan)' }} className="w-6 h-6" />
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>15-Module Progress</h3>
              </div>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="opacity-100">
                  <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                    <span className="truncate pr-2">M00: {module0Meta.title}</span><span>{isModule0Completed ? '100%' : '0%'}</span>
                  </div>
                  <div className="w-full rounded-full h-1.5" style={{ background: 'var(--glass-bg)' }}>
                    <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: isModule0Completed ? '100%' : '0%', background: isModule0Completed ? 'var(--neon-purple)' : 'var(--neon-cyan)' }} />
                  </div>
                </div>
                {modulesWithProgress.map(mod => (
                  <div key={`prog-${mod.id}`} className={mod.isUnlocked ? "opacity-100" : "opacity-50"}>
                    <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                      <span className="truncate pr-2">M{mod.code}: {mod.title}</span><span>{mod.percent}%</span>
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
