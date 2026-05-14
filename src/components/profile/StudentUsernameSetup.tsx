'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { User, Check, X, AlertCircle, Loader2, Pencil } from 'lucide-react';

interface StudentUsernameSetupProps {
  currentUsername: string | null;
  canEdit: boolean;
  changeCount: number;
}

export default function StudentUsernameSetup({ currentUsername, canEdit, changeCount }: StudentUsernameSetupProps) {
  const [isEditing, setIsEditing] = useState(!currentUsername);
  const [input, setInput] = useState(currentUsername || '');
  const [status, setStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid' | 'saving' | 'saved'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [savedUsername, setSavedUsername] = useState(currentUsername);

  // Debounced availability check
  useEffect(() => {
    if (!input || input.length < 3) {
      setStatus('idle');
      setError(input && input.length < 3 ? 'Username must be at least 3 characters.' : null);
      return;
    }

    // Basic client-side format validation
    if (!/^[a-z0-9_]+$/.test(input.toLowerCase())) {
      setStatus('invalid');
      setError('Only lowercase letters, numbers, and underscores allowed.');
      return;
    }

    if (input.length > 24) {
      setStatus('invalid');
      setError('Username must be 24 characters or fewer.');
      return;
    }

    const timer = setTimeout(async () => {
      setStatus('checking');
      setError(null);

      try {
        const res = await fetch(`/api/profile/username/check?username=${encodeURIComponent(input)}`);
        const json = await res.json();

        if (json.ok && json.data.valid && json.data.available) {
          setStatus('valid');
          setError(null);
        } else {
          setStatus('invalid');
          setError(json.data?.error || 'This username is not available.');
        }
      } catch {
        setStatus('invalid');
        setError('Could not check username. Try again.');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [input]);

  const handleSave = useCallback(async () => {
    if (status !== 'valid') return;

    setStatus('saving');
    try {
      const res = await fetch('/api/profile/username', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: input.toLowerCase() }),
      });
      const json = await res.json();

      if (json.ok) {
        setSavedUsername(json.data.username);
        setStatus('saved');
        setIsEditing(false);
      } else {
        setStatus('invalid');
        setError(json.error || 'Failed to save username.');
      }
    } catch {
      setStatus('invalid');
      setError('Failed to save username. Try again.');
    }
  }, [input, status]);

  // Already has username and not editing
  if (savedUsername && !isEditing) {
    return (
      <div className="p-6 rounded-2xl" style={{ background: 'var(--space-card)', border: '1px solid var(--neon-purple)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--glass-bg)' }}>
              <User className="w-4 h-4" style={{ color: 'var(--neon-cyan)' }} />
            </div>
            <h3 className="font-bold text-sm font-display" style={{ color: 'var(--text-primary)' }}>Your Username</h3>
          </div>
          {canEdit && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--neon-cyan)', border: '1px solid var(--neon-cyan)', background: 'transparent' }}
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
          )}
        </div>
        <p className="font-mono text-lg font-bold" style={{ color: 'var(--neon-cyan)' }}>@{savedUsername}</p>
        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
          This is how you appear in discussions.
        </p>
        {!canEdit && (
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            You&apos;ve reached the edit limit for beta. Contact support to reset.
          </p>
        )}
      </div>
    );
  }

  // Setup or edit mode
  return (
    <div className="p-6 rounded-2xl" style={{ background: 'var(--space-card)', border: '1px solid var(--neon-cyan)' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--glass-bg)' }}>
          <User className="w-4 h-4" style={{ color: 'var(--neon-cyan)' }} />
        </div>
        <h3 className="font-bold text-sm font-display" style={{ color: 'var(--text-primary)' }}>
          {savedUsername ? 'Edit Your Username' : 'Choose Your PlayIQ Username'}
        </h3>
      </div>

      <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        This is how you appear in discussions. Do not use your full name, email, school, or phone number.
      </p>

      <div className="relative mb-3">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>@</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
          placeholder="your_username"
          maxLength={24}
          className="w-full pl-8 pr-10 py-3 rounded-lg font-mono text-sm transition-all outline-none"
          style={{
            background: 'var(--glass-bg)',
            border: `1px solid ${status === 'valid' ? 'var(--neon-green)' : status === 'invalid' ? '#ef4444' : 'var(--glass-border)'}`,
            color: 'var(--text-primary)',
          }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {status === 'checking' && <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--neon-cyan)' }} />}
          {status === 'valid' && <Check className="w-4 h-4" style={{ color: 'var(--neon-green)' }} />}
          {status === 'invalid' && <X className="w-4 h-4" style={{ color: '#ef4444' }} />}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 mb-3 text-xs" style={{ color: '#ef4444' }}>
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={status !== 'valid'}
          className="px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-40"
          style={{
            background: status === 'valid' ? 'var(--neon-cyan)' : 'var(--glass-bg)',
            color: status === 'valid' ? '#020617' : 'var(--text-muted)',
            border: `1px solid ${status === 'valid' ? 'var(--neon-cyan)' : 'var(--glass-border)'}`,
          }}
        >
          {status === 'saving' ? 'Saving...' : 'Save Username'}
        </button>

        {savedUsername && (
          <button
            onClick={() => { setIsEditing(false); setInput(savedUsername); setStatus('idle'); setError(null); }}
            className="px-4 py-2.5 rounded-lg text-sm transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            Cancel
          </button>
        )}
      </div>

      <p className="text-[10px] mt-3 font-mono" style={{ color: 'var(--text-muted)' }}>
        3–24 characters • lowercase letters, numbers, underscores only
        {changeCount > 0 && ` • ${3 - changeCount} changes remaining`}
      </p>
    </div>
  );
}
