'use client';

import React from 'react';
import type { AssistantPersonaConfig } from '@/lib/assistant/types';

interface AssistantPersonaFormProps {
  name: string;
  personaConfig: AssistantPersonaConfig;
  onChange: (updates: { name?: string; persona_config?: Partial<AssistantPersonaConfig> }) => void;
  disabled?: boolean;
}

/**
 * AssistantPersonaForm — Form to edit assistant name & persona (purpose, user target, boundaries).
 */
export default function AssistantPersonaForm({
  name,
  personaConfig,
  onChange,
  disabled = false,
}: AssistantPersonaFormProps) {
  const inputCls = `neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-[var(--text-primary)] text-xs font-mono outline-none transition-colors ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  }`;

  const labelCls = 'block font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-1.5';

  const handleLoadStarterPersona = () => {
    if (disabled) return;
    onChange({
      name: name.trim() || 'My Personal Organizer',
      persona_config: {
        purpose:
          'Help me turn safe everyday project ideas, practice sessions, or messy notes into a clear 3-step checklist while asking 1–2 clarifying questions whenever a detail is missing.',
        user_target: 'Myself (with parent/guardian review)',
        boundaries:
          'Never complete school homework or essays; never ask for or store passwords or private personal data; never claim a chat reply scheduled a real device alarm or permanent memory; keep all final decisions with me.',
      },
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2 p-3 rounded-lg border border-slate-800 bg-black/30">
        <p className="text-xs text-slate-300">
          Define one focused everyday workflow for your separate Personal Assistant—or load the PlayIQ starter template
          and customize it.
        </p>
        {!disabled && (
          <button
            type="button"
            onClick={handleLoadStarterPersona}
            className="px-3 py-1.5 rounded border border-[#00c8ff] text-[#00c8ff] hover:bg-[#00c8ff]/15 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
          >
            + Pre-Fill Starter Persona
          </button>
        )}
      </div>

      {/* Assistant Name */}
      <div>
        <label className={labelCls}>Assistant Name</label>
        <input
          type="text"
          value={name}
          disabled={disabled}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g., TaskBuddy, ScheduleCo, StudyPal..."
          className={inputCls}
        />
      </div>

      {/* Purpose */}
      <div>
        <label className={labelCls}>Purpose</label>
        <textarea
          rows={3}
          value={personaConfig.purpose}
          disabled={disabled}
          onChange={(e) => onChange({ persona_config: { purpose: e.target.value } })}
          placeholder="What is this assistant's main purpose? e.g., Organize homework tasks and create weekly schedules..."
          className={inputCls + ' resize-none'}
        />
      </div>

      {/* Target User */}
      <div>
        <label className={labelCls}>Target User</label>
        <input
          type="text"
          value={personaConfig.user_target}
          disabled={disabled}
          onChange={(e) => onChange({ persona_config: { user_target: e.target.value } })}
          placeholder="Who is this assistant for? e.g., Myself and my peer study partner..."
          className={inputCls}
        />
      </div>

      {/* Boundaries */}
      <div>
        <label className={labelCls}>Boundaries & Rules</label>
        <textarea
          rows={4}
          value={personaConfig.boundaries}
          disabled={disabled}
          onChange={(e) =>
            onChange({ persona_config: { boundaries: e.target.value } })
          }
          placeholder="What are the rules and safety boundaries of what the assistant can and cannot do? e.g., Never write the actual homework essays; only outline and suggest edits..."
          className={inputCls + ' resize-none'}
        />
      </div>
    </div>
  );
}
