'use client';

import React from 'react';
import type { LearningBlueprintData } from '@/lib/assessment/assessment-reveal';

interface LearningBlueprintProps {
  blueprint: LearningBlueprintData;
  studentName: string;
}

/**
 * The Personal Learning Blueprint display card.
 * Shown at the end of Phase 5. This is the first artifact the apprentice owns.
 * Visible to parents from Day 1.
 */
export default function LearningBlueprint({ blueprint, studentName }: LearningBlueprintProps) {
  const rows = [
    { label: 'Explanation Opening (Hypothesis)', value: blueprint.explanationStyleLabel, icon: '🧠' },
    { label: 'Primary Motivation Signal', value: blueprint.primaryMotivationLabel, icon: '🎯' },
    { label: 'Current AI Use Signal', value: blueprint.currentAIUseLabel, icon: '🤖' },
    { label: 'Rescue Target', value: blueprint.rescueTarget, icon: '🛟' },
    { label: 'Advance Target', value: blueprint.advanceTarget, icon: '🚀' },
    { label: 'Baseline Prompt Signal (PDI)', value: blueprint.baselinePDI, icon: '📊' },
    { label: 'Your Goal', value: `"${blueprint.personalGoal}"`, icon: '💡' },
  ];

  return (
    <div className="assessment-blueprint-card w-full mx-auto" style={{ maxWidth: '100%', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div className="assessment-blueprint-header">
        <div className="assessment-blueprint-orion-badge flex-shrink-0">Ω</div>
        <div>
          <h3 className="text-lg font-display font-bold tracking-wider" style={{ color: 'var(--text-primary)' }}>
            Your Provisional Learning Blueprint
          </h3>
          <p className="text-xs font-mono uppercase tracking-widest mt-0.5" style={{ color: 'var(--neon-cyan)' }}>
            Starting Hypotheses to Test — {studentName}
          </p>
        </div>
      </div>

      {/* Blueprint rows */}
      <div className="flex flex-col gap-1">
        {rows.map((row) => (
          <div key={row.label} className="assessment-blueprint-row gap-4 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-base flex-shrink-0">{row.icon}</span>
              <span className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {row.label}:
              </span>
            </div>
            <span className="text-sm font-semibold text-right sm:whitespace-nowrap" style={{ color: 'var(--neon-cyan-pale)' }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(0,200,255,0.15)' }}>
        <p className="text-xs text-center font-mono" style={{ color: 'var(--text-muted)' }}>
          &ldquo;These are starting hypotheses to test in real learning labs — not a fixed diagnosis. Orion is calibrated to start here.&rdquo;
        </p>
      </div>
    </div>
  );
}
