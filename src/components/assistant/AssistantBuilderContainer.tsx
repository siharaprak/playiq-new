'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  getAssistantProfileWithVersion,
  createAssistantProfile,
  updateAssistantProfile,
  createAssistantVersion,
  getAssistantVersions,
  getAssistantKnowledgeFiles,
} from '@/lib/assistant/actions';
import {
  DEFAULT_PERSONA_CONFIG,
  DEFAULT_TOOLS_CONFIG,
} from '@/lib/assistant/types';
import type {
  AssistantProfile,
  AssistantVersion,
  AssistantPersonaConfig,
  AssistantToolsConfig,
  KnowledgeFile,
} from '@/lib/assistant/types';

import AssistantPersonaForm from './AssistantPersonaForm';
import AssistantInstructionsEditor from './AssistantInstructionsEditor';
import AssistantTestLog from './AssistantTestLog';
import AssistantVersionHistory from './AssistantVersionHistory';

interface AssistantBuilderContainerProps {
  studentId: string;
  moduleId: string;
}

type TabType = 'persona' | 'instructions' | 'testLog' | 'history';

/**
 * AssistantBuilderContainer — Multi-tab workspace for building custom AI Assistants.
 */
export default function AssistantBuilderContainer({
  studentId,
  moduleId,
}: AssistantBuilderContainerProps) {
  // ── Data State ──────────────────────────────────────────────────
  const [profile, setProfile] = useState<AssistantProfile | null>(null);
  const [currentVersion, setCurrentVersion] = useState<AssistantVersion | null>(null);
  const [versions, setVersions] = useState<AssistantVersion[]>([]);
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([]);

  // ── UI State ────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabType>('persona');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creatingVersion, setCreatingVersion] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ── Form State ──────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [personaConfig, setPersonaConfig] = useState<AssistantPersonaConfig>(DEFAULT_PERSONA_CONFIG);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [toolsConfig, setToolsConfig] = useState<AssistantToolsConfig>(DEFAULT_TOOLS_CONFIG);
  const [testLog, setTestLog] = useState<string[]>([]);
  const [changeSummary, setChangeSummary] = useState('');

  // Locked states if active/published
  const isLocked = profile?.status === 'published';

  // ── Auto-dismiss success messages after 3s ──────────────────────
  useEffect(() => {
    if (!successMsg) return;
    const timer = setTimeout(() => setSuccessMsg(null), 3500);
    return () => clearTimeout(timer);
  }, [successMsg]);

  // ── Load Data on Mount ──────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      const profileResult = await getAssistantProfileWithVersion();

      if (!profileResult.ok) {
        setErrorMsg(profileResult.error);
        return;
      }

      if (profileResult.data) {
        const { profile: loadedProfile, currentVersion: loadedVersion } = profileResult.data;

        setProfile(loadedProfile);
        setName(loadedProfile.name);
        setPersonaConfig(loadedProfile.persona_config);
        setTestLog(loadedProfile.metadata?.test_log || []);

        if (loadedVersion) {
          setCurrentVersion(loadedVersion);
          setSystemPrompt(loadedVersion.system_prompt);
          setToolsConfig(loadedVersion.tools_config);
        }

        // Parallel retrieval of files and versions
        const [filesResult, versionsResult] = await Promise.all([
          getAssistantKnowledgeFiles(loadedProfile.id),
          getAssistantVersions(loadedProfile.id),
        ]);

        if (filesResult.ok) setKnowledgeFiles(filesResult.data);
        if (versionsResult.ok) setVersions(versionsResult.data);
      }
    } catch (err: any) {
      console.error('Failed to load assistant data:', err);
      setErrorMsg('Failed to load assistant profile data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Persona Form Change Handler ─────────────────────────────────
  const handlePersonaChange = (updates: {
    name?: string;
    persona_config?: Partial<AssistantPersonaConfig>;
  }) => {
    if (updates.name !== undefined) {
      setName(updates.name);
    }
    if (updates.persona_config) {
      setPersonaConfig((prev) => ({ ...prev, ...updates.persona_config }));
    }
  };

  // ── Sync Test Log Notes ──────────────────────────────────────────
  const handleTestLogChange = async (updatedLog: string[]) => {
    setTestLog(updatedLog);
    if (!profile) return;

    try {
      const updatedMetadata = { ...profile.metadata, test_log: updatedLog };
      const result = await updateAssistantProfile(profile.id, { metadata: updatedMetadata });
      if (!result.ok) throw new Error(result.error);
      setProfile(result.data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to auto-save test scenario.');
    }
  };

  // ── Save Profile (Save Draft) ───────────────────────────────────
  const handleSaveProfile = async () => {
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      if (!name.trim()) {
        setErrorMsg('Assistant name is required.');
        return;
      }

      const profileInput = {
        name: name.trim(),
        persona_config: personaConfig,
        metadata: { ...profile?.metadata, test_log: testLog },
      };

      if (profile) {
        // Update profile
        const result = await updateAssistantProfile(profile.id, profileInput);
        if (!result.ok) throw new Error(result.error);
        setProfile(result.data);
        setSuccessMsg('Assistant profile draft updated successfully.');
      } else {
        // Create profile
        const result = await createAssistantProfile(profileInput);
        if (!result.ok) throw new Error(result.error);
        setProfile(result.data);
        setSuccessMsg('Assistant profile created! You can now write core instructions and upload files.');
        setActiveTab('instructions'); // Jump to instructions tab on create
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save assistant profile.');
    } finally {
      setSaving(false);
    }
  };

  // ── Create Version (Snapshot Save) ──────────────────────────────
  const handleCreateVersion = async () => {
    if (!profile) return;

    setCreatingVersion(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      if (!changeSummary.trim()) {
        setErrorMsg('Change summary is required to snapshot a version.');
        return;
      }
      if (!systemPrompt.trim()) {
        setErrorMsg('Core system instructions are required to snapshot a version.');
        return;
      }

      const versionInput = {
        system_prompt: systemPrompt.trim(),
        tools_config: {
          knowledge_file_ids: knowledgeFiles.map((f) => f.id),
        },
        change_summary: changeSummary.trim(),
      };

      const result = await createAssistantVersion(profile.id, versionInput);
      if (!result.ok) throw new Error(result.error);

      setCurrentVersion(result.data);
      setVersions((prev) => [result.data, ...prev]);
      setChangeSummary('');
      
      // Update local profile status (since the server action sets status to 'active')
      setProfile((prev) => prev ? { ...prev, status: 'active' } : null);
      
      setSuccessMsg(`Version v${result.data.version_number} saved. Assistant profile is now ACTIVE!`);
      setActiveTab('history'); // Switch to history to view snapshot
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to snapshot version.');
    } finally {
      setCreatingVersion(false);
    }
  };

  // Status Badge Generator
  const getStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      draft: { bg: 'bg-[#00c8ff]/15', text: 'text-[#00c8ff]', label: 'DRAFT' },
      active: { bg: 'bg-green-500/15', text: 'text-green-400', label: 'ACTIVE' },
      published: { bg: 'bg-[#f5c518]/15', text: 'text-[#f5c518]', label: 'PUBLISHED' },
    };
    const cfg = map[status] || map.draft;
    return (
      <span className={`${cfg.bg} ${cfg.text} px-2.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-widest`}>
        {cfg.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] font-mono text-[#00c8ff]">
        <div className="w-12 h-12 border-4 border-t-[#00c8ff] border-slate-800 rounded-full animate-spin mb-4" />
        <span className="uppercase tracking-widest text-xs animate-pulse">
          Initializing Assistant Workspace...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-6 py-4 max-w-4xl mx-auto space-y-6">
      
      {/* Notification Banners */}
      {successMsg && (
        <div className="p-3 border border-green-500/20 rounded bg-green-950/20 text-green-400 font-mono text-xs text-center">
          ✔ {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-3 border border-red-500/20 rounded bg-red-950/20 text-red-400 font-mono text-xs text-center">
          ⚠ {errorMsg}
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800 backdrop-blur-md overflow-hidden">
        
        {/* Workspace Title bar */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-black/40">
          <div className="flex items-center gap-2">
            <span className="text-[#7b4fce] text-base">🤖</span>
            <span className="text-slate-100 font-bold uppercase tracking-wider text-xs font-mono">Assistant Builder Studio</span>
          </div>
          {profile && getStatusBadge(profile.status)}
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-black/20 font-mono text-[10px] tracking-wider uppercase">
          <button
            onClick={() => setActiveTab('persona')}
            className={`flex-1 py-3 text-center border-r border-slate-800 transition-colors ${
              activeTab === 'persona' ? 'text-[#00c8ff] bg-slate-800/40 border-b-2 border-b-[#00c8ff]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Persona Configuration
          </button>
          <button
            onClick={() => {
              if (!profile) return alert('Please save your Persona Config draft first.');
              setActiveTab('instructions');
            }}
            className={`flex-1 py-3 text-center border-r border-slate-800 transition-colors ${!profile ? 'opacity-40 cursor-not-allowed' : ''} ${
              activeTab === 'instructions' ? 'text-[#00c8ff] bg-slate-800/40 border-b-2 border-b-[#00c8ff]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Core Instructions &amp; Files
          </button>
          <button
            onClick={() => {
              if (!profile) return alert('Please save your Persona Config draft first.');
              setActiveTab('testLog');
            }}
            className={`flex-1 py-3 text-center border-r border-slate-800 transition-colors ${!profile ? 'opacity-40 cursor-not-allowed' : ''} ${
              activeTab === 'testLog' ? 'text-[#00c8ff] bg-slate-800/40 border-b-2 border-b-[#00c8ff]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Testing Protocol
          </button>
          <button
            onClick={() => {
              if (!profile) return alert('Please save your Persona Config draft first.');
              setActiveTab('history');
            }}
            className={`flex-1 py-3 text-center transition-colors ${!profile ? 'opacity-40 cursor-not-allowed' : ''} ${
              activeTab === 'history' ? 'text-[#00c8ff] bg-slate-800/40 border-b-2 border-b-[#00c8ff]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Revision History
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="p-8">
          
          {/* TAB 1: PERSONA */}
          {activeTab === 'persona' && (
            <div className="space-y-6">
              <AssistantPersonaForm
                name={name}
                personaConfig={personaConfig}
                onChange={handlePersonaChange}
                disabled={isLocked}
              />
              <div className="flex justify-end pt-4 border-t border-slate-800/60">
                <button
                  type="button"
                  disabled={saving || isLocked}
                  onClick={handleSaveProfile}
                  className="btn-neon-filled px-8 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving Draft...' : profile ? 'Save Draft updates' : 'Initiate Assistant Profile'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: INSTRUCTIONS */}
          {activeTab === 'instructions' && profile && (
            <div className="space-y-8">
              <AssistantInstructionsEditor
                systemPrompt={systemPrompt}
                onSystemPromptChange={setSystemPrompt}
                studentId={studentId}
                assistantProfileId={profile.id}
                files={knowledgeFiles}
                onFilesChange={setKnowledgeFiles}
                disabled={isLocked}
              />
              
              <div className="border-t border-slate-800 pt-6 space-y-4">
                <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                  Save Version Snapshot
                </p>
                <input
                  type="text"
                  value={changeSummary}
                  disabled={isLocked}
                  onChange={(e) => setChangeSummary(e.target.value)}
                  placeholder="Describe what changed in this snapshot... e.g. Configured rules for outline boundary"
                  className={`neon-input w-full bg-black/50 border border-slate-800 focus:border-[#7b4fce] rounded p-2.5 text-[var(--text-primary)] text-xs font-mono outline-none transition-colors ${
                    isLocked ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={creatingVersion || isLocked || !changeSummary.trim() || !systemPrompt.trim()}
                    onClick={handleCreateVersion}
                    className="btn-neon-purple px-8 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingVersion ? 'Publishing Snapshot...' : 'Publish Version Snapshot'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEST SCENARIOS */}
          {activeTab === 'testLog' && profile && (
            <div className="space-y-6">
              <AssistantTestLog
                testLog={testLog}
                onChange={handleTestLogChange}
                disabled={isLocked}
              />
            </div>
          )}

          {/* TAB 4: HISTORY */}
          {activeTab === 'history' && profile && (
            <div className="space-y-6">
              <AssistantVersionHistory
                versions={versions}
                currentVersionId={currentVersion?.id ?? null}
              />
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
