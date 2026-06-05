'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  getTutorProfileWithVersion,
  createTutorProfile,
  updateTutorProfile,
  createTutorVersion,
  getTutorVersions,
  getKnowledgeFiles,
  activateTutorProfile,
  publishTutorProfile,
} from '@/lib/tutor/actions';
import {
  DEFAULT_DOCTRINE_CONFIG,
  DEFAULT_INSTRUCTIONS,
} from '@/lib/tutor/types';
import type {
  TutorProfile,
  TutorVersion,
  TutorDoctrineConfig,
  TutorInstructions,
  KnowledgeFile,
} from '@/lib/tutor/types';

import TutorProfileForm from './TutorProfileForm';
import TutorInstructionsEditor from './TutorInstructionsEditor';
import KnowledgeFileUpload from './KnowledgeFileUpload';
import TutorVersionHistory from './TutorVersionHistory';
import TutorTestSandbox from './TutorTestSandbox';
import { Play, Sparkles } from 'lucide-react';

interface TutorBuilderContainerProps {
  studentId: string;
  moduleId: string;
  fingerprintSnapshot?: {
    learning_style?: string;
    strengths?: string[];
    struggles?: string[];
    captured_at?: string;
  };
}

/**
 * TutorBuilderContainer — Full orchestrator for the AI tutor builder.
 * Manages profile creation/edit, instruction versioning, knowledge file uploads,
 * and version history display.
 */
export default function TutorBuilderContainer({
  studentId,
  moduleId,
  fingerprintSnapshot,
}: TutorBuilderContainerProps) {
  // ── Data State ──────────────────────────────────────────────────
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [currentVersion, setCurrentVersion] = useState<TutorVersion | null>(null);
  const [versions, setVersions] = useState<TutorVersion[]>([]);
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([]);

  // ── UI State ────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creatingVersion, setCreatingVersion] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ── Form State ──────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [doctrineConfig, setDoctrineConfig] = useState<TutorDoctrineConfig>(DEFAULT_DOCTRINE_CONFIG);
  const [instructions, setInstructions] = useState<TutorInstructions>(DEFAULT_INSTRUCTIONS);
  const [changeSummary, setChangeSummary] = useState('');
  const [showSandbox, setShowSandbox] = useState(false);

  // Gating criteria computations
  const hasName = !!name.trim();
  const hasPurpose = !!doctrineConfig.purpose.trim();
  const hasVersion = versions.length > 0;
  const hasInstructions = !!instructions.instruction_set.trim();
  const isActivationReady = hasName && hasPurpose && hasVersion && hasInstructions;

  const isPublishReady = profile?.status === 'active' && knowledgeFiles.length > 0;

  // Locked when active or published — fields become read-only
  const isLocked = profile?.status === 'active' || profile?.status === 'published';

  // ── Auto-dismiss success messages after 3s ──────────────────────
  useEffect(() => {
    if (!successMsg) return;
    const timer = setTimeout(() => setSuccessMsg(null), 3000);
    return () => clearTimeout(timer);
  }, [successMsg]);

  // ── Load Data on Mount ──────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      const profileResult = await getTutorProfileWithVersion();

      if (!profileResult.ok) {
        setErrorMsg(profileResult.error);
        return;
      }

      if (profileResult.data) {
        const { profile: loadedProfile, currentVersion: loadedVersion } = profileResult.data;

        setProfile(loadedProfile);
        setName(loadedProfile.name);
        setDoctrineConfig(loadedProfile.doctrine_config);

        if (loadedVersion) {
          setCurrentVersion(loadedVersion);
          setInstructions(loadedVersion.instructions);
        }

        // Load knowledge files and version history in parallel
        const [filesResult, versionsResult] = await Promise.all([
          getKnowledgeFiles(loadedProfile.id),
          getTutorVersions(loadedProfile.id),
        ]);

        if (filesResult.ok) setKnowledgeFiles(filesResult.data);
        if (versionsResult.ok) setVersions(versionsResult.data);
      }
    } catch (err: any) {
      console.error('Failed to load tutor data:', err);
      setErrorMsg('Failed to load tutor profile data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Profile Form onChange ───────────────────────────────────────
  const handleProfileFormChange = (updates: {
    name?: string;
    doctrine_config?: Partial<TutorDoctrineConfig>;
  }) => {
    if (updates.name !== undefined) {
      setName(updates.name);
    }
    if (updates.doctrine_config) {
      setDoctrineConfig((prev) => ({ ...prev, ...updates.doctrine_config }));
    }
  };

  // ── Save / Create Profile ───────────────────────────────────────
  const handleSaveProfile = async () => {
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      if (!name.trim()) {
        setErrorMsg('Tutor name is required.');
        return;
      }

      const profileInput = { name: name.trim(), doctrine_config: doctrineConfig };

      if (profile) {
        // Update existing profile
        const result = await updateTutorProfile(profile.id, profileInput);
        if (!result.ok) throw new Error(result.error);
        setProfile(result.data);
        setSuccessMsg('Tutor profile updated successfully.');
      } else {
        // Create new profile
        const result = await createTutorProfile(profileInput);
        if (!result.ok) throw new Error(result.error);
        setProfile(result.data);
        setSuccessMsg('Tutor profile created! You can now add instructions and knowledge files.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save tutor profile.');
    } finally {
      setSaving(false);
    }
  };

  // ── Create Version ──────────────────────────────────────────────
  const handleCreateVersion = async () => {
    if (!profile) return;

    setCreatingVersion(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      if (!changeSummary.trim()) {
        setErrorMsg('Change summary is required to create a version.');
        return;
      }

      const versionInput = {
        instructions,
        knowledge_file_ids: knowledgeFiles.map((f) => f.id),
        change_summary: changeSummary.trim(),
      };

      const result = await createTutorVersion(profile.id, versionInput);
      if (!result.ok) throw new Error(result.error);

      setCurrentVersion(result.data);
      setVersions((prev) => [result.data, ...prev]);
      setChangeSummary('');
      setSuccessMsg(`Version v${result.data.version_number} created successfully.`);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to create version.');
    } finally {
      setCreatingVersion(false);
    }
  };

  // ── Activate Tutor Profile ──────────────────────────────────────
  const handleActivate = async () => {
    if (!profile) return;

    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const result = await activateTutorProfile(profile.id);
      if (!result.ok) throw new Error(result.error);

      setProfile((prev) => prev ? { ...prev, status: 'active' } : null);
      setSuccessMsg('AI Tutor activated! It is now ready for testing and final deployment.');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to activate tutor.');
    } finally {
      setSaving(false);
    }
  };

  // ── Publish Tutor Profile ───────────────────────────────────────
  const handlePublish = async () => {
    if (!profile) return;

    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const result = await publishTutorProfile(profile.id);
      if (!result.ok) throw new Error(result.error);

      setProfile((prev) => prev ? { ...prev, status: 'published' } : null);
      setSuccessMsg('AI Tutor published! Deploy complete.');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to publish tutor.');
    } finally {
      setSaving(false);
    }
  };

  // ── Status Badge Helper ─────────────────────────────────────────
  const getStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      draft: { bg: 'bg-[#00c8ff]/15', text: 'text-[#00c8ff]', label: 'DRAFT' },
      active: { bg: 'bg-green-500/15', text: 'text-green-400', label: 'ACTIVE' },
      published: { bg: 'bg-[#f5c518]/15', text: 'text-[#f5c518]', label: 'PUBLISHED' },
    };
    const cfg = map[status] || map.draft;
    return (
      <span
        className={`${cfg.bg} ${cfg.text} px-2.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-widest`}
      >
        {cfg.label}
      </span>
    );
  };

  // ── Loading State ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] font-mono text-[#00c8ff]">
        <div className="w-12 h-12 border-4 border-t-[#00c8ff] border-slate-800 rounded-full animate-spin mb-4" />
        <span className="uppercase tracking-widest text-xs animate-pulse">
          Initializing Tutor Builder...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-4xl mx-auto space-y-8">
      {/* ── Notification Banners ──────────────────────────────── */}
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

      {/* ── Fingerprint Snapshot ── */}
      {fingerprintSnapshot && (
        <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 backdrop-blur-md space-y-4">
          <h3 className="text-[#00c8ff] font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <span>🧠</span>
            <span>Learner Fingerprint Connected</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-black/30 border border-slate-800 p-3">
              <p className="text-[#7b4fce] font-bold uppercase tracking-widest mb-1">Learning Style</p>
              <p className="text-slate-300">{fingerprintSnapshot.learning_style || 'Balanced Approach'}</p>
            </div>
            <div className="bg-black/30 border border-slate-800 p-3">
              <p className="text-[#39ff14] font-bold uppercase tracking-widest mb-1">Key Strengths</p>
              <ul className="list-disc pl-4 text-slate-400 space-y-0.5">
                {fingerprintSnapshot.strengths && fingerprintSnapshot.strengths.length > 0 ? (
                  fingerprintSnapshot.strengths.slice(0, 3).map((s: string, idx: number) => (
                    <li key={idx}>{s}</li>
                  ))
                ) : (
                  <li>Explanation Preference: Socratic</li>
                )}
              </ul>
            </div>
            <div className="bg-black/30 border border-slate-800 p-3">
              <p className="text-[#f5c518] font-bold uppercase tracking-widest mb-1">Key Struggles</p>
              <ul className="list-disc pl-4 text-slate-400 space-y-0.5">
                {fingerprintSnapshot.struggles && fingerprintSnapshot.struggles.length > 0 ? (
                  fingerprintSnapshot.struggles.slice(0, 3).map((s: string, idx: number) => (
                    <li key={idx}>{s}</li>
                  ))
                ) : (
                  <li>Shortcut Tendency: Low</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: TUTOR PROFILE CONFIGURATION
          ═══════════════════════════════════════════════════════ */}
      <div className="bg-slate-900/60 p-8 rounded-xl border border-slate-800 backdrop-blur-md space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-[#00c8ff]/20 pb-3">
          <h3 className="text-[#00c8ff] font-bold uppercase tracking-widest text-sm flex items-center gap-2">
            <span>⚡</span>
            <span>Tutor Profile</span>
          </h3>
          {profile && getStatusBadge(profile.status)}
        </div>

        {/* Profile Form */}
        <TutorProfileForm
          name={name}
          doctrineConfig={doctrineConfig}
          onChange={handleProfileFormChange}
          disabled={isLocked}
        />

        {/* Save Profile Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={saving || isLocked}
            onClick={handleSaveProfile}
            className="btn-neon-filled px-8 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving
              ? 'Saving...'
              : profile
              ? 'Update Profile'
              : 'Create Profile'}
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: INSTRUCTIONS & KNOWLEDGE
          Only visible once a profile exists.
          ═══════════════════════════════════════════════════════ */}
      {profile && (
        <div className="bg-slate-900/60 p-8 rounded-xl border border-slate-800 backdrop-blur-md space-y-8">
          {/* Section Header */}
          <h3 className="text-[#00c8ff] font-bold uppercase tracking-widest text-sm border-b border-[#00c8ff]/20 pb-3 flex items-center gap-2">
            <span>📝</span>
            <span>Instructions &amp; Knowledge</span>
          </h3>

          {/* Instructions Editor */}
          <TutorInstructionsEditor
            instructions={instructions}
            onChange={setInstructions}
            disabled={isLocked}
          />

          {/* Divider */}
          <div className="border-t border-slate-800" />

          {/* Knowledge File Upload */}
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-3">
              Knowledge Files
            </p>
            <KnowledgeFileUpload
              studentId={studentId}
              tutorProfileId={profile.id}
              files={knowledgeFiles}
              onFilesChange={setKnowledgeFiles}
              disabled={isLocked}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800" />

          {/* Create Version Section */}
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
              Create Version
            </p>

            <input
              type="text"
              value={changeSummary}
              disabled={isLocked}
              onChange={(e) => setChangeSummary(e.target.value)}
              placeholder="Describe what changed in this version..."
              className={`neon-input w-full bg-black/50 border border-slate-800 focus:border-[#7b4fce] rounded p-2.5 text-[var(--text-primary)] text-xs font-mono outline-none transition-colors ${
                isLocked ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />

            <div className="flex justify-end">
              <button
                type="button"
                disabled={creatingVersion || isLocked || !changeSummary.trim()}
                onClick={handleCreateVersion}
                className="btn-neon-purple px-8 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingVersion ? 'Creating Version...' : 'Create Version'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: VERIFICATION PROTOCOL (CHECKLIST) & SANDBOX
          Only visible when profile exists.
          ═══════════════════════════════════════════════════════ */}
      {profile && (
        <div className="bg-slate-900/60 p-8 rounded-xl border border-slate-800 backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-[#00c8ff]/20 pb-3">
            <h3 className="text-[#00c8ff] font-bold uppercase tracking-widest text-sm flex items-center gap-2">
              <span>🛡</span>
              <span>Verification &amp; Deployment</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">STATUS: {profile.status.toUpperCase()}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Checklist */}
            <div className="space-y-4">
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                Deployment Checklist
              </p>
              
              <div className="space-y-2.5 font-mono text-xs">
                {/* 1. Name & Doctrine */}
                <div className="flex items-center gap-2">
                  <span className={hasName && hasPurpose ? 'text-[#39ff14]' : 'text-slate-600'}>
                    {hasName && hasPurpose ? '✔' : '☐'}
                  </span>
                  <span className={hasName && hasPurpose ? 'text-slate-300' : 'text-slate-500'}>
                    Profile Details Set (Name &amp; Purpose)
                  </span>
                </div>

                {/* 2. Instructions */}
                <div className="flex items-center gap-2">
                  <span className={hasInstructions ? 'text-[#39ff14]' : 'text-slate-600'}>
                    {hasInstructions ? '✔' : '☐'}
                  </span>
                  <span className={hasInstructions ? 'text-slate-300' : 'text-slate-500'}>
                    Core Instructions Defined
                  </span>
                </div>

                {/* 3. Saved Version */}
                <div className="flex items-center gap-2">
                  <span className={hasVersion ? 'text-[#39ff14]' : 'text-slate-600'}>
                    {hasVersion ? '✔' : '☐'}
                  </span>
                  <span className={hasVersion ? 'text-slate-300' : 'text-slate-500'}>
                    Saved Version Snapshot Created
                  </span>
                </div>

                {/* 4. Active Profile */}
                <div className="flex items-center gap-2">
                  <span className={profile.status === 'active' || profile.status === 'published' ? 'text-[#39ff14]' : 'text-slate-600'}>
                    {profile.status === 'active' || profile.status === 'published' ? '✔' : '☐'}
                  </span>
                  <span className={profile.status === 'active' || profile.status === 'published' ? 'text-slate-300' : 'text-slate-500'}>
                    Tutor Profile Activated
                  </span>
                </div>

                {/* 5. Knowledge File */}
                <div className="flex items-center gap-2">
                  <span className={knowledgeFiles.length > 0 ? 'text-[#39ff14]' : 'text-slate-600'}>
                    {knowledgeFiles.length > 0 ? '✔' : '☐'}
                  </span>
                  <span className={knowledgeFiles.length > 0 ? 'text-slate-300' : 'text-slate-500'}>
                    At least 1 Knowledge File Attached
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3">
                {profile.status === 'draft' && (
                  <button
                    type="button"
                    disabled={saving || !isActivationReady}
                    onClick={handleActivate}
                    className="btn-neon-filled px-6 py-2 rounded font-mono text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Activate Tutor
                  </button>
                )}

                {profile.status === 'active' && (
                  <button
                    type="button"
                    disabled={saving || !isPublishReady}
                    onClick={handlePublish}
                    className="bg-[#f5c518] hover:bg-[#f5c518]/80 text-black px-6 py-2 rounded font-mono text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Publish Tutor
                  </button>
                )}
              </div>
            </div>

            {/* Sandbox Toggle */}
            <div className="border border-slate-800 bg-black/20 p-5 rounded flex flex-col justify-between">
              <div>
                <h4 className="font-mono text-xs uppercase tracking-widest text-[#00c8ff] font-bold mb-2 flex items-center gap-1.5">
                  <Sparkles size={12} /> Test Your Tutor Style
                </h4>
                <p className="font-mono text-[10px] text-slate-400 leading-relaxed mb-4">
                  Run a live simulation to test your tutor&apos;s custom instructions and teaching rules before deploying it for daily learning.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSandbox(!showSandbox)}
                className="w-full bg-[#7b4fce]/15 hover:bg-[#7b4fce]/25 border border-[#7b4fce]/40 text-[#7b4fce] py-2.5 rounded font-mono text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <Play size={10} /> {showSandbox ? 'Close Sandbox' : 'Test Your Tutor Style'}
              </button>
            </div>
          </div>

          {/* Inline Sandbox panel */}
          {showSandbox && (
            <div className="pt-4 border-t border-slate-800">
              <TutorTestSandbox
                profileId={profile.id}
                tutorName={name || 'My PlayIQ Tutor'}
              />
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: VERSION HISTORY
          Only visible once a profile exists.
          ═══════════════════════════════════════════════════════ */}
      {profile && (
        <div className="bg-slate-900/60 p-8 rounded-xl border border-slate-800 backdrop-blur-md space-y-6">
          {/* Section Header */}
          <h3 className="text-[#00c8ff] font-bold uppercase tracking-widest text-sm border-b border-[#00c8ff]/20 pb-3 flex items-center gap-2">
            <span>🕐</span>
            <span>Version History</span>
          </h3>

          <TutorVersionHistory
            versions={versions}
            currentVersionId={currentVersion?.id ?? null}
          />
        </div>
      )}
    </div>
  );
}
