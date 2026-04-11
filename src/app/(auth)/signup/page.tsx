'use client';

import Link from 'next/link';
import { ArrowLeft, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';
import { signupAction } from '@/app/(auth)/actions';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-md shadow hover:bg-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
      {pending ? "Creating Account..." : "Create Account"}
    </button>
  );
}

function SignupContent() {
  const [state, formAction] = useFormState(signupAction, null);
  const searchParams = useSearchParams();
  const isBetaSuccess = searchParams.get('beta') === 'success';

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        
        {isBetaSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-sm flex gap-3">
             <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
             <p><strong>Payment Successful!</strong> Your pilot hardware kit is secured. Please create your parent account below to access your Proof Dashboard.</p>
          </div>
        )}

        <div className="mb-8 text-center">
           <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <UserPlus className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
          <p className="text-gray-500 mt-2 text-sm">Please note: Pilot hardware must be purchased prior to creating a platform account.</p>
        </div>

        <form action={formAction} className="space-y-5">
          {state?.error && (
             <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-100 flex gap-2 items-center">
               <AlertCircle className="w-4 h-4" /> {state.error}
             </div>
          )}
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" name="name" required className="w-full rounded-md shadow-sm p-3 border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" required className="w-full rounded-md shadow-sm p-3 border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="you@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" required className="w-full rounded-md shadow-sm p-3 border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" />
          </div>
          <SubmitButton />
        </form>

        <div className="mt-8 text-center text-sm text-gray-600 border-t border-gray-100 pt-6">
          <Link href="/beta" className="text-indigo-600 font-semibold hover:underline block mb-2">Need hardware? Join the Pilot</Link>
          Already have an account? <Link href="/login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
        </div>
      </div>
    </main>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">Loading form...</div>}>
      <SignupContent />
    </Suspense>
  );
}
