'use client';

import React from 'react';
import KnowledgeFileUpload from './KnowledgeFileUpload';
import type { KnowledgeFile } from '@/lib/assistant/types';

interface AssistantInstructionsEditorProps {
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
  studentId: string;
  assistantProfileId: string;
  files: KnowledgeFile[];
  onFilesChange: (files: KnowledgeFile[]) => void;
  disabled?: boolean;
}

/**
 * AssistantInstructionsEditor — Edit the system prompt & manage knowledge base uploads.
 */
export default function AssistantInstructionsEditor({
  systemPrompt,
  onSystemPromptChange,
  studentId,
  assistantProfileId,
  files,
  onFilesChange,
  disabled = false,
}: AssistantInstructionsEditorProps) {
  const inputCls = `neon-input w-full bg-black/50 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-[var(--text-primary)] text-xs font-mono outline-none transition-colors ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  }`;

  const labelCls = 'block font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-1.5';

  return (
    <div className="space-y-6">
      {/* System Prompt / Core Instructions */}
      <div>
        <label className={labelCls}>Core Instructions (System Prompt)</label>
        <textarea
          rows={10}
          value={systemPrompt}
          disabled={disabled}
          onChange={(e) => onSystemPromptChange(e.target.value)}
          placeholder="Write the core instructions for your AI Assistant. Outline what tasks it performs, how it interacts with the user, and how it respects boundaries..."
          className={inputCls + ' resize-y min-h-[220px]'}
        />
      </div>

      {/* Knowledge Base Files */}
      <div>
        <label className={labelCls + ' mb-3'}>Knowledge Files (Reference Material)</label>
        <KnowledgeFileUpload
          studentId={studentId}
          assistantProfileId={assistantProfileId}
          files={files}
          onFilesChange={onFilesChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
