'use client';

import { useState, useEffect, useTransition } from 'react';
import { Shield, ShieldAlert, KeyRound, Copy, Check, RefreshCw } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function SecuritySettings() {
  const [factors, setFactors] = useState<any[]>([]);
  const [mfaQr, setMfaQr] = useState<string | null>(null);
  const [mfaSecret, setMfaSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  useEffect(() => {
    const sync = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          await supabase.auth.refreshSession();
        }
      } catch (e) {
        console.error('Settings session sync error:', e);
      }
      await loadFactors();
    };
    sync();
  }, [supabase]);

  const loadFactors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      setFactors(data.totp.filter(f => f.status === 'verified'));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to list auth factors');
    } finally {
      setIsLoading(false);
    }
  };

  const startEnrollment = async () => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        issuer: 'PlayIQ',
        friendlyName: 'PlayIQ Shield'
      });

      if (error) throw error;

      setFactorId(data.id);
      setMfaQr(data.totp.qr_code);
      setMfaSecret(data.totp.secret);
    } catch (err: any) {
      setError(err.message || 'Failed to initiate 2FA enrollment.');
    }
  };

  const confirmEnrollment = async () => {
    setError(null);
    if (!factorId) return;

    startTransition(async () => {
      try {
        const { data, error } = await supabase.auth.mfa.challengeAndVerify({
          factorId,
          code: verifyCode
        });

        if (error) throw error;

        // Reset enrollment screen and reload active factors
        setMfaQr(null);
        setMfaSecret(null);
        setFactorId(null);
        setVerifyCode('');
        await loadFactors();
      } catch (err: any) {
        setError(err.message || 'Verification failed. Check the code and try again.');
      }
    });
  };

  const disableMfa = async (fId: string) => {
    if (!confirm('Are you sure you want to disable Two-Factor Authentication? This decreases your account security.')) return;
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId: fId });
      if (error) throw error;
      await loadFactors();
    } catch (err: any) {
      setError(err.message || 'Failed to disable 2FA.');
      setIsLoading(false);
    }
  };

  const copySecret = () => {
    if (!mfaSecret) return;
    navigator.clipboard.writeText(mfaSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <RefreshCw className="animate-spin text-[#00c8ff] w-8 h-8" />
      </div>
    );
  }

  const isEnrolled = factors.length > 0;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 sm:p-6 md:p-12 star-field pt-24 sm:pt-36">
      <div className="max-w-3xl mx-auto relative z-10">
        <header className="mb-6 sm:mb-12 border-b border-slate-800 pb-4 sm:pb-6">
          <p className="font-mono text-[#00c8ff] text-[0.6rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-1">&gt; USER SECURITY SETTINGS</p>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-wider sm:tracking-widest">
            Security Shield
          </h1>
        </header>

        {error && (
          <div className="mb-6 p-3.5 sm:p-4 bg-red-950/40 border border-red-500/30 text-red-400 font-mono text-xs uppercase tracking-wider">
            &gt; ERROR: {error}
          </div>
        )}

        <div className="glass-card p-5 sm:p-8 border border-slate-800 !rounded-none">
          <div className="flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className={`p-2.5 sm:p-3 rounded-none border flex-shrink-0 ${isEnrolled ? 'bg-[#00c8ff]/10 border-[#00c8ff]' : 'bg-slate-900 border-slate-700'}`}>
              <Shield className={`w-6 h-6 sm:w-8 sm:h-8 ${isEnrolled ? 'text-[#00c8ff]' : 'text-slate-500'}`} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-display font-bold uppercase tracking-wider text-white">
                Two-Factor Authentication (2FA)
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Protect your apprentice link keys and parent configurations. Two-Factor Authentication requires a temporary cryptographic passcode in addition to your master credentials.
              </p>
            </div>
          </div>

          {!isEnrolled && !mfaQr && (
            <div className="bg-black/30 border border-slate-800 p-5 sm:p-6 text-center">
              <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="font-mono text-xs uppercase tracking-wider text-slate-400 mb-5 sm:mb-6">
                Two-Factor Shield is currently offline
              </p>
              <button
                onClick={startEnrollment}
                className="w-full sm:w-auto bg-transparent border border-[#00c8ff] hover:bg-[#00c8ff]/10 text-[#00c8ff] font-display font-bold px-6 py-3.5 min-h-[48px] text-xs transition-all uppercase tracking-widest shadow-[0_0_10px_rgba(0,200,255,0.1)] cursor-pointer active:scale-[0.98]"
              >
                Configure 2FA Shield
              </button>
            </div>
          )}

          {mfaQr && (
            <div className="space-y-6 sm:space-y-8 border-t border-slate-800 pt-6 sm:pt-8">
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                <div className="flex justify-center bg-white p-3 sm:p-4 border-4 border-[#00c8ff] max-w-[220px] sm:max-w-[240px] mx-auto">
                  {/* Render base64 image QR directly from Supabase */}
                  <img src={mfaQr} alt="Scan QR Code" className="w-full h-auto" />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <h3 className="font-display font-bold uppercase tracking-wider text-white text-xs sm:text-sm">
                    Step 1: Scan Security QR Code
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-mono">
                    Scan the QR code with Google Authenticator, Microsoft Authenticator, or Authy.
                  </p>
                  
                  {mfaSecret && (
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-500 uppercase tracking-widest font-mono">Or input secret key manually:</label>
                      <div className="flex gap-2 bg-black/60 p-2 border border-slate-800 items-center">
                        <span className="font-mono text-xs text-slate-300 select-all break-all flex-1">{mfaSecret}</span>
                        <button onClick={copySecret} className="text-[#00c8ff] hover:text-white transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center">
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-800/60 pt-4 sm:pt-6">
                <h3 className="font-display font-bold uppercase tracking-wider text-white text-xs sm:text-sm mb-3 sm:mb-4">
                  Step 2: Enter Verification Code
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end">
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      maxLength={6}
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000 000"
                      className="neon-input !rounded-none !border-b-2 !border-b-slate-700 !bg-black/40 text-center font-mono text-lg tracking-[0.2em] text-white focus:!border-b-[#00c8ff] w-full min-h-[48px]"
                    />
                  </div>
                  <button
                    onClick={confirmEnrollment}
                    disabled={isPending || verifyCode.length !== 6}
                    className="btn-neon-filled whitespace-nowrap !py-3.5 !px-6 min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto cursor-pointer active:scale-[0.98]"
                  >
                    {isPending ? 'Verifying...' : 'Enable 2FA Shield'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {isEnrolled && (
            <div className="border-t border-slate-800 pt-8 space-y-6">
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <p className="font-display font-bold text-emerald-400 uppercase tracking-widest text-xs">
                      Two-Factor Shield Enabled
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      ACTIVE FACTOR ID: {factors[0].id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => disableMfa(factors[0].id)}
                  className="text-xs uppercase text-slate-500 hover:text-red-400 transition-colors font-mono tracking-wider cursor-pointer"
                >
                  [Deactivate Shield]
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
