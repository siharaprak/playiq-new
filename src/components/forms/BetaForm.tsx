'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitBetaApplication } from '@/app/(public)/beta/actions';
import { BetaApplicationSchema, type BetaApplicationData } from '@/app/(public)/beta/schema';

export function BetaForm() {
  const [serverState, setServerState] = useState<{ type: 'idle' | 'success' | 'error', message?: string }>({ type: 'idle' });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BetaApplicationData>({
    resolver: zodResolver(BetaApplicationSchema),
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
          {serverState.message} We will be in touch shortly with hardware shipping details.
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {serverState.type === 'error' && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex gap-3 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{serverState.message}</p>
        </div>
      )}

      <div>
        <label htmlFor="parentFullName" className="block text-sm font-medium text-gray-700 mb-1">Parent's Full Name</label>
        <input 
          id="parentFullName"
          {...register('parentFullName')}
          className={`w-full rounded-md shadow-sm p-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${errors.parentFullName ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
          placeholder="Jane Doe" 
          aria-invalid={!!errors.parentFullName}
        />
        {errors.parentFullName && <p className="mt-1 text-sm text-red-500">{errors.parentFullName.message}</p>}
      </div>

      <div>
        <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input 
          id="emailAddress"
          type="email"
          {...register('emailAddress')}
          className={`w-full rounded-md shadow-sm p-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${errors.emailAddress ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
          placeholder="jane@example.com" 
          aria-invalid={!!errors.emailAddress}
        />
        {errors.emailAddress && <p className="mt-1 text-sm text-red-500">{errors.emailAddress.message}</p>}
      </div>

      <div>
        <label htmlFor="childAge" className="block text-sm font-medium text-gray-700 mb-1">Teen's Target Age Group</label>
        <select 
          id="childAge"
          {...register('childAge')}
          className={`w-full rounded-md shadow-sm p-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${errors.childAge ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
        >
          <option value="">Select an age group</option>
          <option value="under_13">Under 13</option>
          <option value="13_14">13 - 14</option>
          <option value="15_17">15 - 17</option>
          <option value="over_17">18+</option>
        </select>
        {errors.childAge && <p className="mt-1 text-sm text-red-500">{errors.childAge.message}</p>}
      </div>

      <div>
        <label htmlFor="shippingZipCode" className="block text-sm font-medium text-gray-700 mb-1">Shipping Zip Code</label>
        <input 
          id="shippingZipCode"
          {...register('shippingZipCode')}
          className={`w-full rounded-md shadow-sm p-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${errors.shippingZipCode ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
          placeholder="e.g. 90210" 
        />
        {errors.shippingZipCode && <p className="mt-1 text-sm text-red-500">{errors.shippingZipCode.message}</p>}
      </div>

      <div className="pt-4">
         <button 
          type="submit" 
          disabled={isSubmitting}
          className="btn-neon-filled w-full gap-2 !rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
         >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isSubmitting ? "Processing Application..." : "Proceed to Registration"}
         </button>
         <p className="text-xs text-center text-gray-500 mt-3">By applying, you acknowledge this is an early access pilot program.</p>
      </div>
    </form>
  );
}
