'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Zap, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  Cpu,
  Trophy,
  Compass,
  ArrowRight
} from 'lucide-react';

interface CourseNavigationGuideProps {
  studentName: string;
  studentId: string;
  hasProgress?: boolean;
}

export default function CourseNavigationGuide({ studentName, studentId, hasProgress = false }: CourseNavigationGuideProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(!hasProgress);
  const [activeTab, setActiveTab] = useState<'nodes' | 'assessments' | 'artifacts' | 'builders'>('nodes');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load preference from localStorage if it exists, scoped by studentId
    const storageKey = `playiq_course_guide_expanded_${studentId}`;
    const storedValue = localStorage.getItem(storageKey);
    if (storedValue !== null) {
      setIsExpanded(storedValue === 'true');
    } else {
      setIsExpanded(!hasProgress);
    }
    setMounted(true);
  }, [hasProgress, studentId]);

  const toggleExpand = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    const storageKey = `playiq_course_guide_expanded_${studentId}`;
    localStorage.setItem(storageKey, String(nextState));
  };

  if (!mounted) {
    // Prevent server-side hydration flicker by rendering a skeleton or placeholder
    return (
      <div className="p-4 rounded-2xl border border-[var(--space-card-border)] bg-[var(--space-card)] mb-6 animate-pulse">
        <div className="h-8 bg-slate-800 rounded w-1/4"></div>
      </div>
    );
  }

  return (
    <div 
      className="relative overflow-hidden rounded-2xl border transition-all duration-300 mb-8 font-mono shadow-[0_0_20px_rgba(0,200,255,0.05)]"
      style={{ 
        background: 'var(--space-card)', 
        borderColor: isExpanded ? 'var(--neon-cyan)' : 'var(--glass-border)'
      }}
    >
      {/* Background ambient light */}
      <div 
        className="absolute right-0 top-0 w-48 h-48 bg-gradient-to-br from-[#00c8ff]/5 to-transparent pointer-events-none rounded-bl-full transition-opacity duration-300"
        style={{ opacity: isExpanded ? 1 : 0.2 }}
      />

      {/* Header bar / Toggle button */}
      <div 
        onClick={toggleExpand}
        className="flex items-center justify-between p-5 cursor-pointer select-none hover:bg-slate-900/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--glass-bg)', border: '1px solid var(--neon-cyan)' }}>
            <Compass className="w-4 h-4 text-[var(--neon-cyan)]" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm md:text-base font-display flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              Course Navigation Protocol
              <span className="bg-[#00c8ff]/20 text-[#00c8ff] text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-[#00c8ff]/30">
                ACTIVE
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 font-sans hidden sm:block">
              {isExpanded ? "Review the roadmap for mastering AI and completing training modules." : "Click to view the course roadmap & assessment steps."}
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-200 transition-colors">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Expanded Content */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[1200px] border-t border-[var(--glass-border)] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Welcome Message */}
          <div className="space-y-2">
            <h4 className="text-base font-bold uppercase text-slate-200">
              Welcome back, Apprentice <span style={{ color: 'var(--neon-cyan)' }}>{studentName}</span>.
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl font-sans">
              PlayIQ is a rigorous program designed to take you from a basic prompter to an advanced AI builder. 
              Below is the operational loop for unlocking, mastering, and completing each module.
            </p>
          </div>

          {/* Telemetry & Parent Oversight Notice */}
          <div className="p-4 bg-slate-900/50 border-l-2 border-[#00c8ff] text-xs font-mono flex items-start gap-3 rounded-r-lg">
            <div className="text-sm shrink-0">📡</div>
            <div className="space-y-1.5 font-sans text-slate-300 text-xs">
              <strong className="text-[#00c8ff] uppercase tracking-wider block font-mono text-[11px]">Telemetry & Parent Oversight Protocol:</strong>
              <p className="leading-relaxed">
                Parent accounts function as <strong className="text-white font-bold">Mission Control</strong>. To preserve your learning focus, parents <strong className="text-white font-bold">cannot</strong> view the raw lesson content, active nodes, or active input screens directly.
              </p>
              <p className="leading-relaxed">
                Instead, they see your <strong className="text-white font-bold">progress dashboards</strong>, completions, time logs, and submitted Proof Packets. Your active worksheets remain private, but they will review and approve your capstone proof deliverables to unlock subsequent milestones.
              </p>
            </div>
          </div>

          {/* Stepper Timeline Visualizer */}
          <div className="relative p-6 rounded-xl border bg-black/30 border-slate-900">
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none rounded-xl" />
            <h5 className="text-xs font-bold uppercase tracking-widest mb-6 text-slate-400">
              Operational Loop (Per Module)
            </h5>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {/* Stepper Node 1 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors mb-3"
                  style={{ 
                    background: activeTab === 'nodes' ? 'var(--neon-cyan)' : 'var(--glass-bg)', 
                    color: activeTab === 'nodes' ? '#0a0f1e' : 'var(--neon-cyan)',
                    border: '1px solid var(--neon-cyan)'
                  }}>
                  01
                </div>
                <h6 className="text-xs font-bold uppercase mb-1" style={{ color: 'var(--text-primary)' }}>1. Nodes Tree</h6>
                <p className="text-[10px] text-slate-500 max-w-[150px] font-sans">Complete interactive nodes and lessons sequentially.</p>
              </div>

              {/* Stepper Node 2 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors mb-3"
                  style={{ 
                    background: activeTab === 'assessments' ? 'var(--neon-purple)' : 'var(--glass-bg)', 
                    color: activeTab === 'assessments' ? '#fff' : 'var(--neon-purple)',
                    border: '1px solid var(--neon-purple)'
                  }}>
                  02
                </div>
                <h6 className="text-xs font-bold uppercase mb-1" style={{ color: 'var(--text-primary)' }}>2. Quiz (80%+)</h6>
                <p className="text-[10px] text-slate-500 max-w-[150px] font-sans">Test your concept knowledge to unlock the Boss.</p>
              </div>

              {/* Stepper Node 3 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors mb-3"
                  style={{ 
                    background: activeTab === 'assessments' ? 'var(--neon-purple)' : 'var(--glass-bg)', 
                    color: activeTab === 'assessments' ? '#fff' : 'var(--neon-purple)',
                    border: '1px solid var(--neon-purple)'
                  }}>
                  03
                </div>
                <h6 className="text-xs font-bold uppercase mb-1" style={{ color: 'var(--text-primary)' }}>3. Boss Battle</h6>
                <p className="text-[10px] text-slate-500 max-w-[150px] font-sans">Deploy capabilities in live challenges.</p>
              </div>

              {/* Stepper Node 4 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors mb-3"
                  style={{ 
                    background: activeTab === 'artifacts' ? 'var(--neon-green)' : 'var(--glass-bg)', 
                    color: activeTab === 'artifacts' ? '#0a0f1e' : 'var(--neon-green)',
                    border: '1px solid var(--neon-green)'
                  }}>
                  04
                </div>
                <h6 className="text-xs font-bold uppercase mb-1" style={{ color: 'var(--text-primary)' }}>4. Submit Proof</h6>
                <p className="text-[10px] text-slate-500 max-w-[150px] font-sans">Upload your artifact to unlock the next module.</p>
              </div>

              {/* Connector Lines (only visible on md screens and above) */}
              <div className="hidden md:block absolute top-5 left-[12.5%] right-[12.5%] h-0.5 bg-slate-800 -z-0">
                <div className="h-full bg-gradient-to-r from-var(--neon-cyan) via-var(--neon-purple) to-var(--neon-green) opacity-50" />
              </div>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="space-y-4">
            {/* Tabs Trigger Headers */}
            <div className="flex flex-wrap gap-2 border-b border-slate-900 pb-2">
              <button 
                onClick={() => setActiveTab('nodes')}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-all flex items-center gap-1.5 border-b-2"
                style={{ 
                  borderColor: activeTab === 'nodes' ? 'var(--neon-cyan)' : 'transparent',
                  color: activeTab === 'nodes' ? 'var(--neon-cyan)' : 'var(--text-secondary)'
                }}
              >
                <BookOpen size={13} />
                Node Lessons
              </button>

              <button 
                onClick={() => setActiveTab('assessments')}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-all flex items-center gap-1.5 border-b-2"
                style={{ 
                  borderColor: activeTab === 'assessments' ? 'var(--neon-purple)' : 'transparent',
                  color: activeTab === 'assessments' ? 'var(--neon-purple)' : 'var(--text-secondary)'
                }}
              >
                <Zap size={13} />
                Quizzes & Bosses
              </button>

              <button 
                onClick={() => setActiveTab('artifacts')}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-all flex items-center gap-1.5 border-b-2"
                style={{ 
                  borderColor: activeTab === 'artifacts' ? 'var(--neon-green)' : 'transparent',
                  color: activeTab === 'artifacts' ? 'var(--neon-green)' : 'var(--text-secondary)'
                }}
              >
                <ShieldCheck size={13} />
                Proof Artifacts
              </button>

              <button 
                onClick={() => setActiveTab('builders')}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-all flex items-center gap-1.5 border-b-2"
                style={{ 
                  borderColor: activeTab === 'builders' ? 'var(--neon-gold)' : 'transparent',
                  color: activeTab === 'builders' ? 'var(--neon-gold)' : 'var(--text-secondary)'
                }}
              >
                <Cpu size={13} />
                AI Builders
              </button>
            </div>

            {/* Tab Panels */}
            <div className="p-5 rounded-xl border border-slate-900 bg-slate-950/40 text-xs leading-relaxed space-y-4">
              {activeTab === 'nodes' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00c8ff]" />
                    <span className="font-bold text-slate-200">How Node Lessons Work:</span>
                  </div>
                  <p className="text-slate-400 font-sans">
                    Each module features sequential interactive learning lessons called nodes. You must complete them one by one.
                  </p>
                  <div className="p-3.5 rounded bg-black/40 border border-slate-800 text-[11px] text-slate-400">
                    <strong className="text-[var(--neon-cyan)] block mb-1">💡 Anti-Ghostwriting Rule:</strong>
                    When an AI node asks a question, you are expected to outline your attempted solution/approach first. The system will detect simple copy-pasting or empty questions and block hints until you demonstrate authentic work.
                  </div>
                </div>
              )}

              {activeTab === 'assessments' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7b4fce]" />
                    <span className="font-bold text-slate-200">Understanding Quizzes & Boss Battles:</span>
                  </div>
                  <p className="text-slate-400 font-sans">
                    Once you master all lesson nodes, the **Module Quiz** unlocks. 
                    You must score a minimum of <strong className="text-[var(--neon-purple-light)]">80%</strong> to pass the quiz.
                  </p>
                  <p className="text-slate-400 font-sans">
                    Passing the quiz unlocks the **Boss Battle**. This is an advanced simulator challenge where you will interact directly with an AI agent to solve a complex coding, debugging, or formatting objective.
                  </p>
                </div>
              )}

              {activeTab === 'artifacts' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14]" />
                    <span className="font-bold text-slate-200">Submitting Proof Artifacts:</span>
                  </div>
                  <p className="text-slate-400 font-sans">
                    The final step of any module is submitting your **Proof Artifacts**. 
                    This represents the concrete output (code, study guides, custom prompts) created during your lessons.
                  </p>
                  <p className="text-slate-400 font-sans">
                    Once uploaded and verified, the module is marked as fully completed, and the next sequential module in your tree will unlock.
                  </p>
                </div>
              )}

              {activeTab === 'builders' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f5c518]" />
                    <span className="font-bold text-slate-200">AI Builders & Master Capstone:</span>
                  </div>
                  <p className="text-slate-400 font-sans">
                    In the final tiers of the curriculum, you move from consumer to architect:
                  </p>
                  <ul className="space-y-2 list-none pl-2 text-slate-400">
                    <li className="flex items-start gap-1.5">
                      <span className="text-[var(--neon-gold)] mt-0.5">•</span>
                      <span><strong>Module 9 (AI Tutor):</strong> Build a persistent customized learning tutor by writing structured custom system instructions.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[var(--neon-gold)] mt-0.5">•</span>
                      <span><strong>Module 10 (AI Assistant):</strong> Build a utility assistant resolving real tasks with custom tools and knowledge files.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[var(--neon-gold)] mt-0.5">•</span>
                      <span><strong>Module 11 (Capstone):</strong> Complete the Master Trial to earn full validation and complete the course.</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats/Tips */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-900">
            <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--neon-cyan)] animate-pulse" />
              Tip: Access the Discussions tab on the right sidebar if you get stuck!
            </div>
            <button 
              onClick={toggleExpand}
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all"
              style={{ border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)' }}
            >
              Minimize Roadmap <ArrowRight size={12} className="ml-1" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
