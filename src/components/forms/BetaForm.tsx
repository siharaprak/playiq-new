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
      <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl text-center">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-emerald-900 mb-2">Application Received</h3>
        <p className="text-emerald-700">
          {serverState.message}
        </p>
        <button 
           onClick={() => setServerState({type: 'idle'})}
           className="mt-6 text-sm text-emerald-600 font-semibold hover:underline"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 form-cyberpunk" noValidate>
      {serverState.type === 'error' && (
        <div className="p-4 bg-[rgba(255,0,0,0.1)] border border-red-500/50 rounded-none flex gap-3 text-red-400 font-mono text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{serverState.message}</p>
        </div>
      )}

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
        <label htmlFor="emailAddress" className="block font-mono text-xs text-[#00c8ff] uppercase tracking-wider sm:tracking-widest mb-1.5 sm:mb-2 opacity-80">Email Address</label>
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
        <label htmlFor="promoCode" className="block font-mono text-xs text-[#00c8ff] uppercase tracking-wider sm:tracking-widest mb-1.5 sm:mb-2 opacity-80">Promo / Access Code (Optional)</label>
        <input 
          id="promoCode"
          {...register('promoCode')}
          className={`neon-input min-h-[44px] ${errors.promoCode ? 'border-[rgba(255,0,0,0.5)] bg-[rgba(255,0,0,0.05)]' : ''}`}
          placeholder="Enter code to bypass payment" 
        />
        {errors.promoCode && <p className="mt-1 text-xs font-mono text-red-400">{errors.promoCode.message}</p>}
      </div>

      <div className="pt-4 sm:pt-6">
         <button 
          type="submit" 
          disabled={isSubmitting}
          className="btn-neon-filled w-full font-display text-base sm:text-lg py-3.5 sm:py-4 min-h-[48px] gap-2 !rounded-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
         >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-3 inline-block" /> : null}
            {isSubmitting ? "PROCESSING..." : "PROCEED TO ENTRY"}
         </button>
         <p className="font-mono text-[9px] sm:text-[10px] text-center text-slate-500 mt-3 sm:mt-4 uppercase tracking-wider sm:tracking-[0.2em]">By applying, you acknowledge this is an early access pilot program.</p>
      </div>
    </form>
  );
}
