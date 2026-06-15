'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';

interface TourStep {
  target: string;
  title: string;
  content: string;
  placement: 'center' | 'bottom' | 'top' | 'left' | 'right';
}

interface DashboardTourProps {
  studentId: string;
  hasProgress: boolean;
}

const steps: TourStep[] = [
  {
    target: 'body',
    title: 'Welcome to PlayIQ!',
    content: 'Welcome, Apprentice! This is your learning command center. Let\'s take a quick 1-minute tour to see how to navigate your training and tools.',
    placement: 'center'
  },
  {
    target: '#current-challenge-card',
    title: 'Your Active Challenge',
    content: 'This is your active module. You progress sequentially. Complete all lessons (Nodes) to unlock the Quiz. Score 80%+ to unlock the Boss Battle, and upload Proof Artifacts to unlock the next module.',
    placement: 'bottom'
  },
  {
    target: '#username-setup-card',
    title: 'Secure Your Pilot Handle',
    content: 'Set your unique username here. It will identify you across discussions and peer boards without revealing your real name.',
    placement: 'left'
  },
  {
    target: '#engagement-board-card',
    title: 'Engagement Board',
    content: 'Collaborate with fellow students. Ask questions, share your custom AI tutor builds, and coordinate project ideas.',
    placement: 'left'
  },
  {
    target: '#orion-floating-button',
    title: 'Meet Orion, Your AI Study Coach',
    content: 'Click this floating companion to open Orion. He can explain confusing concepts, generate practice quizzes, or give hints. Orion will never give you direct answers—he helps you learn!',
    placement: 'left'
  },
  {
    target: '#need-help-card',
    title: 'Support & Feedback Channel',
    content: 'Stuck? Request human feedback or open support tickets here. Remember: before asking for hints, you must outline your attempted approach!',
    placement: 'left'
  }
];

export default function DashboardTour({ studentId, hasProgress }: DashboardTourProps) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number; transform?: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Automatically trigger for brand new student accounts who haven't completed the tour
    const tourCompleted = localStorage.getItem(`playiq_dashboard_tour_completed_${studentId}`);
    if (!tourCompleted && !hasProgress) {
      // Small timeout to let page render
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [studentId, hasProgress]);

  useEffect(() => {
    setMounted(true);
    
    // Listen for manual replay clicks from the header button
    const btn = document.getElementById('replay-tour-button');
    if (btn) {
      const handleReplay = () => {
        setCurrentStepIndex(0);
        setIsActive(true);
      };
      btn.addEventListener('click', handleReplay);
      return () => btn.removeEventListener('click', handleReplay);
    }
  }, []);

  const activeStep = steps[currentStepIndex];

  // Recalculate highlighted bounds
  useEffect(() => {
    if (!isActive || !activeStep) return;

    if (activeStep.target === 'body') {
      setHighlightRect(null);
      return;
    }

    const updateRect = () => {
      const el = document.querySelector(activeStep.target);
      if (el) {
        // Scroll the element into view so the user sees what is highlighted
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Delay boundary retrieval slightly to allow scrolling animation to finish
        setTimeout(() => {
          setHighlightRect(el.getBoundingClientRect());
        }, 300);
      } else {
        // Element not loaded, default to center
        setHighlightRect(null);
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [isActive, currentStepIndex, activeStep]);

  // Position the tooltip based on highlight bounds
  useEffect(() => {
    if (!isActive || !activeStep) return;

    if (!highlightRect || activeStep.target === 'body') {
      setTooltipPos({
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
        transform: 'translate(-50%, -50%)'
      });
      return;
    }

    const tooltipEl = tooltipRef.current;
    const tw = tooltipEl ? tooltipEl.getBoundingClientRect().width : 350;
    const th = tooltipEl ? tooltipEl.getBoundingClientRect().height : 220;

    const pad = 20;
    let top = 0;
    let left = 0;
    const transform = '';

    const placement = activeStep.placement;

    if (placement === 'bottom') {
      top = highlightRect.bottom + pad;
      left = highlightRect.left + highlightRect.width / 2 - tw / 2;
    } else if (placement === 'top') {
      top = highlightRect.top - th - pad;
      left = highlightRect.left + highlightRect.width / 2 - tw / 2;
    } else if (placement === 'left') {
      top = highlightRect.top + highlightRect.height / 2 - th / 2;
      left = highlightRect.left - tw - pad;
    } else if (placement === 'right') {
      top = highlightRect.top + highlightRect.height / 2 - th / 2;
      left = highlightRect.right + pad;
    }

    // Viewport boundaries safeguard (relative to viewport since tooltip is fixed)
    if (left < pad) left = pad;
    if (left + tw > window.innerWidth - pad) left = window.innerWidth - tw - pad;
    if (top < pad) top = pad;
    if (top + th > window.innerHeight - pad) {
      top = window.innerHeight - th - pad;
    }

    setTooltipPos({ top, left, transform });
  }, [isActive, highlightRect, currentStepIndex, activeStep]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    localStorage.setItem(`playiq_dashboard_tour_completed_${studentId}`, 'true');
  };

  const handleSkip = () => {
    setIsActive(false);
    localStorage.setItem(`playiq_dashboard_tour_completed_${studentId}`, 'true');
  };

  if (!mounted || !isActive) return null;

  return (
    <div className="fixed inset-0 z-[1000] pointer-events-none font-mono">
      {/* Dimmed Overlay Mask */}
      <div 
        className="fixed inset-0 bg-slate-950/70 transition-opacity duration-300 pointer-events-auto"
        style={{ mixBlendMode: 'normal' }}
        onClick={handleSkip}
      />

      {/* Highlights Cutout overlay */}
      {highlightRect && (
        <div 
          className="fixed pointer-events-none transition-all duration-300 rounded-xl border border-[var(--neon-cyan)] glow-border-cyan animate-pulse-glow z-[1001]"
          style={{
            top: highlightRect.top - 8,
            left: highlightRect.left - 8,
            width: highlightRect.width + 16,
            height: highlightRect.height + 16,
            boxShadow: '0 0 0 9999px rgba(5, 7, 15, 0.75), 0 0 20px rgba(0, 200, 255, 0.4)'
          }}
        />
      )}

      {/* Centered Overlay (for body step) */}
      {!highlightRect && (
        <div className="fixed inset-0 bg-slate-950/80 pointer-events-auto z-[1001]" />
      )}

      {/* Tooltip Dialog Bubble */}
      {tooltipPos && (
        <div 
          ref={tooltipRef}
          className="fixed z-[1002] pointer-events-auto w-[350px] max-w-[calc(100vw-40px)] p-6 rounded-2xl border transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.6)]"
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
            transform: tooltipPos.transform,
            background: 'var(--space-card)',
            borderColor: 'var(--neon-purple)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Neon Header Corner */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[var(--neon-cyan)] rounded-tl-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[var(--neon-cyan)] rounded-br-2xl pointer-events-none" />

          {/* Close button */}
          <button 
            onClick={handleSkip}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 transition-colors p-1"
            aria-label="Skip Tour"
          >
            <X size={16} />
          </button>

          {/* Title */}
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-[var(--neon-cyan)]" />
            <h4 className="text-sm font-bold uppercase tracking-wider font-display text-[var(--neon-cyan)]">
              {activeStep.title}
            </h4>
          </div>

          {/* Content */}
          <p className="text-xs text-slate-300 leading-relaxed mb-6 font-sans">
            {activeStep.content}
          </p>

          {/* Controls Footer */}
          <div className="flex justify-between items-center text-xs pt-4 border-t border-slate-900">
            {/* Step Counter */}
            <span className="text-[10px] text-slate-500 uppercase">
              Step {currentStepIndex + 1} of {steps.length}
            </span>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSkip}
                className="px-2.5 py-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-wider"
              >
                Skip
              </button>

              {currentStepIndex > 0 && (
                <button
                  onClick={handleBack}
                  className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
                  aria-label="Previous step"
                >
                  <ChevronLeft size={14} />
                </button>
              )}

              <button
                onClick={handleNext}
                className="btn-neon-cyan px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all z-10 pointer-events-auto"
                style={{
                  background: 'var(--neon-cyan)',
                  color: '#0a0f1e',
                  border: '1px solid var(--neon-cyan)',
                  padding: '6px 12px'
                }}
              >
                {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
                {currentStepIndex < steps.length - 1 && <ChevronRight size={14} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
