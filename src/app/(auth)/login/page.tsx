'use client';

import Link from 'next/link';
import { ArrowLeft, Lock, AlertCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { loginAction } from '@/app/(auth)/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-md shadow hover:bg-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-center">
      {pending ? "Signing in..." : "Sign In"}
    </button>
  );
}

export default function Login() {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <Lock className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sign in to PlayIQ</h1>
          <p className="text-gray-500 mt-2 text-sm">Access your Parent Proof Packet or Student Guide</p>
        </div>

        <form action={formAction} className="space-y-5">
          {state?.error && (
             <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-100 flex gap-2 items-center">
               <AlertCircle className="w-4 h-4" /> {state.error}
             </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" required className="w-full rounded-md shadow-sm p-3 border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="you@example.com" />
          </div>
          <div>
             <div className="flex justify-between items-center mb-1">
               <label className="block text-sm font-medium text-gray-700">Password</label>
               <Link href="#" className="text-xs text-indigo-600 hover:underline">Forgot password?</Link>
             </div>
             <input type="password" name="password" required className="w-full rounded-md shadow-sm p-3 border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" />
          </div>
          <SubmitButton />
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Not enrolled in the Pilot yet? <Link href="/beta" className="text-indigo-600 font-semibold hover:underline">Apply here</Link>
        </div>
      </div>
    </main>
  );
}
