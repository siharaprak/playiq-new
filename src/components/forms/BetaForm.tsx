'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitBetaApplication } from '@/app/(public)/beta/actions';
import { BetaApplicationSchema, type BetaApplicationData } from '@/app/(public)/beta/schema';

export function BetaForm({ source, initialPromo }: { source?: string; initialPromo?: string }) {
  const [serverState, setServerState] = useState<{ type: 'idle' | 'success' | 'error', message?: string }>({ type: 'idle' });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BetaApplicationData>({
    resolver: zodResolver(BetaApplicationSchema),
    defaultValues: {
      promoCode: initialPromo || '',
    },
  });

  const onSubmit = async (data: BetaApplicationData) => {
    setServerState({ type: 'idle' });
    try {
      const result = await submitBetaApplication(data);
      if (result.success) {
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
          return;
        }
        setServerState({ type: 'success', message: result.message });
      } else {
        setServerState({ type: 'error', message: result.message });
      }
    } catch (error) {
      setServerState({ type: 'error', message: "An unexpected network error occurred." });
    }
  };

  if (serverState.type === 'success') {
    return (
      <div className="p-6 sm:p-8 bg-black/60 border-2 border-[#00c8ff] text-center space-y-4 shadow-[0_0_25px_rgba(0,200,255,0.25)]">
        <CheckCircle2 className="w-14 h-14 text-[#00c8ff] mx-auto animate-pulse" />
        <div className="inline-block bg-[rgba(0,200,255,0.15)] border border-[#00c8ff] px-3 py-1 font-mono text-[10px] text-[#00c8ff] uppercase tracking-widest font-bold">
          100% FREE PILOT RESERVED
        </div>
        <h3 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wider text-white">
          Application Confirmed
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
          {serverState.message || "Your spot in the Founding Cohort has been confirmed at zero cost. We've sent your Parent Setup Guide PDF to your inbox."}
        </p>
        <div className="pt-2">
          <a
            href="/signup?beta=success&promo=PLAYIQ2025"
            className="btn-neon-filled w-full font-display uppercase font-bold text-sm tracking-[0.15em] py-3.5 inline-flex items-center justify-center gap-2"
          >
            PROCEED TO ACCOUNT SETUP →
          </a>
        </div>
        <button 
           onClick={() => setServerState({type: 'idle'})}
           className="mt-4 text-xs font-mono text-slate-400 hover:text-white underline block mx-auto transition-colors"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 form-cyberpunk" noValidate>
      {serverState.type === 'error' && (
        <div className="p-4 bg-[rgba(255,0,0,0.1)] border border-red-500/50 rounded-none flex gap-3 text-red-400 font-mono text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{serverState.message}</p>
        </div>
      )}

      {/* Free badge callout inside form */}
      <div className="p-3 bg-[rgba(0,200,255,0.08)] border-l-4 border-[#00c8ff] flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#00c8ff]">
        <span className="font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#00c8ff]" /> FOUNDING COHORT: FREE ($0)
        </span>
        <span className="text-slate-400 text-[10px]">NO CC REQUIRED</span>
      </div>

      <input type="hidden" {...register('source')} value={source} />

      <div>
        <label htmlFor="parentFullName" className="block font-mono text-xs text-[#00c8ff] uppercase tracking-wider sm:tracking-widest mb-1.5 sm:mb-2 opacity-80">Parent's Full Name</label>
        <input 
          id="parentFullName"
          {...register('parentFullName')}
          className={`neon-input min-h-[44px] ${errors.parentFullName ? 'border-[rgba(255,0,0,0.5)] bg-[rgba(255,0,0,0.05)]' : ''}`}
          placeholder="Jane Doe" 
          aria-invalid={!!errors.parentFullName}
        />
        {errors.parentFullName && <p className="mt-1 text-xs font-mono text-red-400">{errors.parentFullName.message}</p>}
      </div>

      <div>
        <label htmlFor="emailAddress" className="block font-mono text-xs text-[#00c8ff] uppercase tracking-wider sm:tracking-widest mb-1.5 sm:mb-2 opacity-80">Email Address (For Parent Setup Guide)</label>
        <input 
          id="emailAddress"
          type="email"
          {...register('emailAddress')}
          className={`neon-input min-h-[44px] ${errors.emailAddress ? 'border-[rgba(255,0,0,0.5)] bg-[rgba(255,0,0,0.05)]' : ''}`}
          placeholder="jane@example.com" 
          aria-invalid={!!errors.emailAddress}
        />
        {errors.emailAddress && <p className="mt-1 text-xs font-mono text-red-400">{errors.emailAddress.message}</p>}
      </div>

      <div>
        <label htmlFor="childAge" className="block font-mono text-xs text-[#00c8ff] uppercase tracking-wider sm:tracking-widest mb-1.5 sm:mb-2 opacity-80">Teen's Target Age Group</label>
        <select 
          id="childAge"
          {...register('childAge')}
          className={`neon-input min-h-[44px] ${errors.childAge ? 'border-[rgba(255,0,0,0.5)] bg-[rgba(255,0,0,0.05)]' : ''}`}
        >
          <option value="" className="bg-[#020617] text-slate-400">Select an age group</option>
          <option value="under_13" className="bg-[#020617] text-[#e2e8f0]">Under 13</option>
          <option value="13_14" className="bg-[#020617] text-[#e2e8f0]">13 - 14</option>
          <option value="15_17" className="bg-[#020617] text-[#e2e8f0]">15 - 17</option>
          <option value="over_17" className="bg-[#020617] text-[#e2e8f0]">18+</option>
        </select>
        {errors.childAge && <p className="mt-1 text-xs font-mono text-red-400">{errors.childAge.message}</p>}
      </div>

      <div>
        <label htmlFor="promoCode" className="block font-mono text-xs text-[#00c8ff] uppercase tracking-wider sm:tracking-widest mb-1.5 sm:mb-2 opacity-80">
          Invite / Partner Code <span className="text-slate-400 lowercase">(optional — beta is 100% free)</span>
        </label>
        <input 
          id="promoCode"
          {...register('promoCode')}
          className={`neon-input min-h-[44px] ${errors.promoCode ? 'border-[rgba(255,0,0,0.5)] bg-[rgba(255,0,0,0.05)]' : ''}`}
          placeholder="Enter invite code or leave blank" 
        />
        {errors.promoCode && <p className="mt-1 text-xs font-mono text-red-400">{errors.promoCode.message}</p>}
      </div>

      <div className="pt-2">
         <button 
          type="submit" 
          disabled={isSubmitting}
          className="btn-neon-filled w-full font-display text-sm sm:text-base py-3.5 sm:py-4 min-h-[48px] gap-2 !rounded-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
         >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-3 inline-block" /> : null}
            {isSubmitting ? "RESERVING YOUR FREE SPOT..." : "CLAIM 100% FREE PILOT SPOT →"}
         </button>
         <p className="font-mono text-[9px] sm:text-[10px] text-center text-slate-400 mt-3 uppercase tracking-wider sm:tracking-[0.15em]">
           100% Free for founding cohort families. Instant setup upon submission.
         </p>
      </div>
    </form>
  );
}
