'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { provisionApprenticeAction } from '../actions';
import { CheckCircle2, AlertCircle, Eye, EyeOff, Copy, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function ApprenticeSetupPage() {
  const [state, formAction] = useActionState(provisionApprenticeAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const loginHandle = username.includes('@') ? username : (username ? `${username}@student.playiq.dev` : '');

  return (
    <div className="min-h-screen bg-[#020617] star-field text-[var(--text-primary)] px-6 py-12">
      <div className="max-w-lg mx-auto relative z-10">

        <Link href="/parent/home" className="flex items-center gap-2 text-slate-500 hover:text-[#00c8ff] font-mono text-xs uppercase tracking-widest transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>

        <div className="mb-8">
          <p className="font-mono text-[#7b4fce] text-[0.6rem] uppercase tracking-[0.3em] mb-2">&gt; PARENT GATEWAY</p>
          <h1 className="text-3xl font-display font-black text-[var(--text-primary)] uppercase tracking-widest">Provision Apprentice</h1>
          <p className="text-slate-400 font-mono text-xs mt-3 leading-relaxed">
            Create a student account for your child. They will log in with these credentials and land directly on their module dashboard.
          </p>
        </div>

        {/* Error banner */}
        {state?.error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/40 flex gap-3 items-start text-red-300 font-mono text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{state.error}</p>
          </div>
        )}

        <div className="glass-card p-8 !rounded-none border border-slate-800">
          <form action={formAction} className="space-y-6">
            <div>
              <label className="block font-mono text-xs text-[#00c8ff] uppercase tracking-widest mb-2">&gt; Apprentice Name</label>
              <input
                required
                type="text"
                name="name"
                className="neon-input w-full"
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-[#00c8ff] uppercase tracking-widest mb-2">&gt; Login Handle / Email</label>
              <input
                required
                type="text"
                name="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="neon-input w-full"
                placeholder="e.g. johnny_plays  OR  child@email.com"
              />
              {username && !username.includes('@') && (
                <p className="font-mono text-[10px] text-slate-500 mt-1.5">
                  Login email will be: <span className="text-[#00c8ff]">{loginHandle}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block font-mono text-xs text-[#00c8ff] uppercase tracking-widest mb-2">&gt; Passcode</label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  minLength={6}
                  className="neon-input w-full pr-10"
                  placeholder="Minimum 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#00c8ff] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Credential Preview Box */}
            {username && password && (
              <div className="p-4 bg-black/40 border border-[#00c8ff]/20 space-y-3">
                <p className="font-mono text-[10px] text-[#00c8ff] uppercase tracking-widest mb-2">&gt; Credential Preview — Save These</p>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-mono text-[10px] text-slate-500 uppercase">Email</p>
                    <p className="font-mono text-xs text-[var(--text-primary)]">{loginHandle}</p>
                  </div>
                  <button type="button" onClick={() => copyToClipboard(loginHandle, 'email')}
                    className="text-slate-500 hover:text-[#00c8ff] transition-colors flex-shrink-0">
                    {copied === 'email' ? <CheckCircle2 className="w-4 h-4 text-[#39ff14]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-mono text-[10px] text-slate-500 uppercase">Password</p>
                    <p className="font-mono text-xs text-[var(--text-primary)]">{showPassword ? password : '••••••••'}</p>
                  </div>
                  <button type="button" onClick={() => copyToClipboard(password, 'pass')}
                    className="text-slate-500 hover:text-[#00c8ff] transition-colors flex-shrink-0">
                    {copied === 'pass' ? <CheckCircle2 className="w-4 h-4 text-[#39ff14]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800">
              <button
                type="submit"
                className="btn-neon-filled w-full py-4 !rounded-none font-display font-bold uppercase tracking-widest"
              >
                Generate Apprentice Profile →
              </button>
              <p className="font-mono text-[10px] text-center text-slate-600 mt-3 uppercase tracking-widest">
                Student will log in at weplayiq.com/login using these credentials.
              </p>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
