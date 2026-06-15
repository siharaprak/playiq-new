'use client';

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertCircle, 
  UserPlus, 
  LogOut, 
  ArrowRight, 
  ShieldCheck, 
  Layers,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

interface ParentOrientationGuideProps {
  parentId: string;
  hasApprentice: boolean;
  hasProgress: boolean;
  approvedProofs: number;
}

export default function ParentOrientationGuide({
  parentId,
  hasApprentice,
  hasProgress,
  approvedProofs,
}: ParentOrientationGuideProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'checklist' | 'protocol' | 'syllabus'>('checklist');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load preference from localStorage scoped by parentId
    const storageKey = `playiq_parent_guide_expanded_${parentId}`;
    const storedValue = localStorage.getItem(storageKey);
    if (storedValue !== null) {
      setIsExpanded(storedValue === 'true');
    } else {
      // Default to expanded if onboarding steps are not fully completed
      setIsExpanded(!hasApprentice || !hasProgress || approvedProofs === 0);
    }
    setMounted(true);
  }, [parentId, hasApprentice, hasProgress, approvedProofs]);

  const toggleExpand = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    const storageKey = `playiq_parent_guide_expanded_${parentId}`;
    localStorage.setItem(storageKey, String(nextState));
  };

  if (!mounted) {
    // Prevent server-side hydration flicker by rendering a skeleton matching the card shape
    return (
      <div className="p-5 rounded-none border border-slate-800 bg-[#070b19]/60 mb-8 animate-pulse h-20" />
    );
  }

  // Define status details for checklist steps
  const steps = [
    {
      id: 1,
      title: 'Create Parent Account',
      description: 'Account activated and logged in.',
      isDone: true,
    },
    {
      id: 2,
      title: 'Provision Apprentice Profile',
      description: 'Create a student profile to get access credentials.',
      isDone: hasApprentice,
      action: !hasApprentice ? (
        <Link 
          href="/parent/apprentice-setup" 
          className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-[#00c8ff] hover:underline uppercase tracking-wider font-mono"
        >
          <UserPlus size={12} /> Provision Apprentice Now →
        </Link>
      ) : null,
    },
    {
      id: 3,
      title: 'Apprentice Initial Login',
      description: 'Log out and sign in using the student credentials.',
      isDone: hasProgress,
      action: hasApprentice && !hasProgress ? (
        <span className="mt-1 block text-[10px] text-slate-500 font-mono">
          Use the Student tab on the{' '}
          <Link href="/login" className="text-[#00c8ff] hover:underline">login page</Link>.
        </span>
      ) : null,
    },
    {
      id: 4,
      title: 'Complete Module 1',
      description: 'Student must complete "AI Learning Code" lessons.',
      isDone: hasProgress,
    },
    {
      id: 5,
      title: 'Approve Proof Artifacts',
      description: 'Review and approve submitted worksheets.',
      isDone: approvedProofs > 0,
    },
  ];

  return (
    <div 
      id="parent-orientation-guide"
      className="relative overflow-hidden border transition-all duration-300 mb-8 font-mono shadow-[0_0_25px_rgba(123,79,206,0.05)]"
      style={{ 
        background: 'rgba(7, 11, 25, 0.6)', 
        borderColor: isExpanded ? 'var(--neon-purple)' : 'border-slate-800',
        backdropFilter: 'blur(12px)'
      }}
    >
      {/* Visual neon ambient background */}
      <div 
        className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-[#7b4fce]/5 to-transparent pointer-events-none rounded-bl-full transition-opacity duration-300"
        style={{ opacity: isExpanded ? 1 : 0.2 }}
      />

      {/* Header bar / Toggle */}
      <div 
        onClick={toggleExpand}
        className="flex items-center justify-between p-5 cursor-pointer select-none hover:bg-slate-900/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-none flex items-center justify-center border border-[#7b4fce] bg-[#7b4fce]/10">
            <Compass className="w-4 h-4 text-[#7b4fce]" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm md:text-base tracking-widest text-[var(--text-primary)] flex items-center gap-2">
              MISSION CONTROL PROTOCOL
              <span className="bg-[#7b4fce]/20 text-[#7b4fce] text-[9px] px-2 py-0.5 rounded-none font-bold uppercase tracking-wider border border-[#7b4fce]/30">
                ORIENTATION
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 font-sans hidden sm:block mt-0.5">
              {isExpanded ? "Operational guide for setup, apprentice enrollment, and student learning gating." : "Click to view next steps & access protocol guidelines."}
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
          isExpanded ? 'max-h-[1200px] border-t border-slate-800/80 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Main Notice: Critical explanation of the role split */}
          <div className="p-4 bg-red-950/20 border border-red-500/30 text-xs text-red-200 leading-relaxed font-mono flex items-start gap-3 shadow-[0_0_15px_rgba(239,68,68,0.05)]">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <strong className="text-red-400 uppercase tracking-wider block">⚠️ ROLE GATE ACCESS NOTICE:</strong>
              <p className="font-sans">
                Parent accounts function exclusively as **Mission Control** (overseeing progress, approving submitted proofs, and reviewing telemetry). Parents **do not** participate in lesson nodes directly.
              </p>
              <p className="font-sans">
                Only **Student/Apprentice accounts** can run the interactive lesson nodes, complete quizzes, and enter Boss Battles. To start learning, please provision an Apprentice account, log out, and log back in as the student.
              </p>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="space-y-4">
            <div className="flex gap-2 border-b border-slate-800 pb-2">
              <button 
                onClick={() => setActiveTab('checklist')}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border-b-2"
                style={{ 
                  borderColor: activeTab === 'checklist' ? '#7b4fce' : 'transparent',
                  color: activeTab === 'checklist' ? '#fff' : '#64748b'
                }}
              >
                <ShieldCheck size={13} className={activeTab === 'checklist' ? 'text-[#7b4fce]' : 'text-slate-500'} />
                Onboarding Checklist
              </button>

              <button 
                onClick={() => setActiveTab('protocol')}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border-b-2"
                style={{ 
                  borderColor: activeTab === 'protocol' ? '#00c8ff' : 'transparent',
                  color: activeTab === 'protocol' ? '#fff' : '#64748b'
                }}
              >
                <Layers size={13} className={activeTab === 'protocol' ? 'text-[#00c8ff]' : 'text-slate-500'} />
                Console Protocol
              </button>

              <button 
                onClick={() => setActiveTab('syllabus')}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border-b-2"
                style={{ 
                  borderColor: activeTab === 'syllabus' ? '#f5c518' : 'transparent',
                  color: activeTab === 'syllabus' ? '#fff' : '#64748b'
                }}
              >
                <BookOpen size={13} className={activeTab === 'syllabus' ? 'text-[#f5c518]' : 'text-slate-500'} />
                Curriculum syllabus
              </button>
            </div>

            {/* Tab panels */}
            <div className="p-5 border border-slate-800 bg-[#020617]/50 text-xs leading-relaxed">
              
              {/* Checklist Tab */}
              {activeTab === 'checklist' && (
                <div className="space-y-5">
                  <p className="text-slate-400 font-sans mb-2">
                    Follow these sequential protocol steps to initialize your learning cohort:
                  </p>
                  <div className="space-y-4">
                    {steps.map((step) => (
                      <div 
                        key={step.id} 
                        className={`flex gap-3.5 p-3.5 border transition-all ${
                          step.isDone 
                            ? 'bg-[#39ff14]/5 border-[#39ff14]/20 text-slate-300' 
                            : 'bg-black/30 border-slate-800/80 text-slate-500'
                        }`}
                      >
                        <div className="mt-0.5">
                          {step.isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-[#39ff14]" />
                          ) : (
                            <div className="w-5 h-5 rounded-none border border-slate-700 flex items-center justify-center font-mono text-[10px] text-slate-500">
                              {step.id}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className={`font-display font-bold text-xs uppercase tracking-wider ${step.isDone ? 'text-white' : 'text-slate-400'}`}>
                            Step {step.id}: {step.title}
                          </p>
                          <p className="font-sans text-[11px] text-slate-400 mt-1 leading-normal">
                            {step.description}
                          </p>
                          {step.action && <div className="mt-1">{step.action}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Protocol Tab */}
              {activeTab === 'protocol' && (
                <div className="space-y-4 font-sans text-slate-400 text-xs leading-relaxed">
                  <div>
                    <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200 mb-1">
                      1. Mission Control (Parent Account)
                    </h4>
                    <p>
                      Your account acts as the monitoring and validation engine. You cannot complete lessons or test nodes, but you hold the keys to gating. When your apprentice submits code, custom prompt sheets, or capstone files, they appear in your queue. You must review and approve them to unlock the subsequent modules.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200 mb-1">
                      2. Apprentice Workspace (Student Account)
                    </h4>
                    <p>
                      Apprentices log in under a separate dashboard. Their workspace features an interactive node tree representing lessons. They complete coding snippets, answer open-ended questions, take knowledge checkpoints, and engage in simulated Boss Battles.
                    </p>
                  </div>
                  <div className="p-3.5 bg-black/40 border border-slate-800 text-[11px] text-slate-400 font-mono">
                    <strong className="text-[#00c8ff] uppercase tracking-wider block mb-1">💡 LOGOUT PROTOCOL:</strong>
                    When you are ready to pass the console to your child, click the **Logout** button on the parent header, select **Student** on the login screen, and enter their provisioned student handle and passcode.
                  </div>
                </div>
              )}

              {/* Syllabus Tab */}
              {activeTab === 'syllabus' && (
                <div className="space-y-4">
                  <p className="text-slate-400 font-sans mb-3">
                    Curriculum outline for the 10 core instruction modules:
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                    {[
                      { num: 1, title: 'AI Learning Code', desc: 'Active recall mechanics, outlining problem approaches, and validating chatbot statements.' },
                      { num: 2, title: 'Digital Smarts & Human Responsibility', desc: 'Ethical tech usage, digital safety guidelines, and understanding minor privacy structures.' },
                      { num: 3, title: 'Pre-Learn System', desc: 'Preparing for school topics beforehand with AI prompting and active concept maps.' },
                      { num: 4, title: 'Lesson Rescue Mode', desc: 'Overcoming academic confusion using structured Socratic guidance instead of copy-paste answers.' },
                      { num: 5, title: 'Compression Learning', desc: 'Reducing complex schemas to core mental models without losing details.' },
                      { num: 6, title: 'Self-Testing & Mistake Bank', desc: 'Building custom feedback logs to track cognitive error rates and correction patterns.' },
                      { num: 7, title: 'Notes & Study Pack Creation', desc: 'Generating structured study materials to seed customized knowledge databases.' },
                      { num: 8, title: 'Writing & Answer Clarity', desc: 'Using AI as an editor to polish syntax and structure without letting it write.' },
                      { num: 9, title: 'Build Your AI Tutor', desc: 'Writing custom system instructions to create a persistent educational coach.' },
                      { num: 10, title: 'Build Your AI Assistant', desc: 'Building functional automation pipelines for real-world operations.' },
                    ].map((m) => (
                      <div key={m.num} className="p-3 bg-black/30 border border-slate-900 font-sans text-xs">
                        <p className="font-display font-bold uppercase tracking-wider text-[#f5c518] text-[11px]">
                          Module {m.num}: {m.title}
                        </p>
                        <p className="text-slate-400 mt-1 text-[11px] leading-relaxed">
                          {m.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Minimize roadmap bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#7b4fce] animate-pulse" />
              Need help? View parent guides or request support in the panel below.
            </div>
            <button 
              onClick={toggleExpand}
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-4 py-2 border border-[#7b4fce]/30 hover:bg-[#7b4fce]/10 text-white transition-all font-mono"
            >
              Minimize Orientation <ArrowRight size={12} className="ml-1 text-[#7b4fce]" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
