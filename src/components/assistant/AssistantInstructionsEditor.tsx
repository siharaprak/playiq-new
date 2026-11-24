'use client';

import React from 'react';
import KnowledgeFileUpload from './KnowledgeFileUpload';
import type { KnowledgeFile } from '@/lib/assistant/types';
import {
  STARTER_ASSISTANT_SYSTEM_INSTRUCTIONS,
  STARTER_COMPASS_TEMPLATE,
  ASSISTANT_WORKFLOW_KNOWLEDGE_FILE,
  ASSISTANT_TEST_PROTOCOL_KNOWLEDGE_FILE,
} from '@/lib/assistant/starter-kit';

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

  const labelCls = 'block font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]';

  const handleLoadStarterInstructions = () => {
    if (disabled) return;
    if (
      systemPrompt.trim() &&
      systemPrompt.trim() !== STARTER_ASSISTANT_SYSTEM_INSTRUCTIONS.trim() &&
      !window.confirm('Replace your current Core Instructions draft with PlayIQ’s Locked-Spine Master Instructions?')
    ) {
      return;
    }
    onSystemPromptChange(STARTER_ASSISTANT_SYSTEM_INSTRUCTIONS);
  };

  const handleDownloadReferenceFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* System Prompt / Core Instructions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className={labelCls}>Core Instructions (00_MASTER_ASSISTANT_INSTRUCTIONS.md)</label>
          {!disabled && (
            <button
              type="button"
              onClick={handleLoadStarterInstructions}
              className="px-3 py-1 rounded border border-[#00c8ff] text-[#00c8ff] hover:bg-[#00c8ff]/15 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              + Load 8-Section Locked-Spine Instructions
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400">
          Paste your personalized <code className="text-[#39ff14]">00_MASTER_ASSISTANT_INSTRUCTIONS.md</code> compiled
          by Module 12 Prompt 5 (or customize the pre-loaded Locked Spine below), then publish a Version Snapshot.
        </p>
        <textarea
          rows={14}
          value={systemPrompt}
          disabled={disabled}
          onChange={(e) => onSystemPromptChange(e.target.value)}
          placeholder="Paste your 00_MASTER_ASSISTANT_INSTRUCTIONS.md or click '+ Load 8-Section Locked-Spine Instructions' above..."
          className={inputCls + ' resize-y min-h-[260px]'}
        />
      </div>

      {/* Knowledge Base Files */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className={labelCls}>Knowledge Files (Local Memory &amp; Reference Files)</label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleDownloadReferenceFile('00_MY_COMPASS.md', STARTER_COMPASS_TEMPLATE)}
              className="px-2.5 py-1 rounded border border-[#00c8ff]/80 text-[#00c8ff] hover:bg-[#00c8ff]/15 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              ⬇ 00_MY_COMPASS (.md)
            </button>
            <button
              type="button"
              onClick={() =>
                handleDownloadReferenceFile(
                  'assistant_workflow_and_capabilities_guide.md',
                  ASSISTANT_WORKFLOW_KNOWLEDGE_FILE,
                )
              }
              className="px-2.5 py-1 rounded border border-[#39ff14]/70 text-[#39ff14] hover:bg-[#39ff14]/15 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              ⬇ Local Memory Guide (.md)
            </button>
            <button
              type="button"
              onClick={() =>
                handleDownloadReferenceFile(
                  'assistant_3_scenario_test_protocol.md',
                  ASSISTANT_TEST_PROTOCOL_KNOWLEDGE_FILE,
                )
              }
              className="px-2.5 py-1 rounded border border-[#7b4fce] text-[#c4b5fd] hover:bg-[#7b4fce]/20 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              ⬇ 4-Test Protocol (.md)
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Upload the personalized <code>.md</code> files from your local{' '}
          <code className="text-[#39ff14]">My_Personal_Assistant/</code> folder (<code>00_MY_COMPASS.md</code> and{' '}
          <code>01–04</code>), or download any starter reference file above and upload it below.
        </p>
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
