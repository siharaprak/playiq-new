'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Root error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full p-8 rounded-2xl border border-red-500/30 bg-[#0a0f1e] shadow-2xl space-y-5">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold font-display text-white">Something Went Wrong</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {error?.message || 'An unexpected error occurred while loading this page.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#00c8ff] text-[#0a0f1e] hover:brightness-110 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all"
          >
            <Home className="w-4 h-4" /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
