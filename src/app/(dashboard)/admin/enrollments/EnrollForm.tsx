'use client';

import React, { useState } from 'react';
import { manuallyEnrollStudent } from './actions';
import { Loader2, Plus, AlertCircle, Check } from 'lucide-react';

interface CourseOption {
  id: string;
  title: string;
}

interface EnrollFormProps {
  courses: CourseOption[];
}

/**
 * EnrollForm — Manual student course link override form.
 */
export default function EnrollForm({ courses }: EnrollFormProps) {
  const [email, setEmail] = useState('');
  const [courseId, setCourseId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !courseId) return;

    setIsSubmitting(true);
    setStatus('idle');
    setMsg('');

    try {
      const result = await manuallyEnrollStudent(email, courseId);
      if (result.ok) {
        setStatus('success');
        setMsg('Enrollment override active!');
        setEmail('');
        setCourseId('');
      } else {
        setStatus('error');
        setMsg(result.error);
      }
    } catch (err) {
      setStatus('error');
      setMsg('Enrollment action failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = 'neon-input w-full bg-black/60 border border-slate-800 focus:border-[#00c8ff] rounded p-2.5 text-slate-100 text-xs font-mono outline-none transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Student Email */}
      <div className="space-y-1">
        <label className="block font-mono text-[10px] uppercase tracking-widest text-slate-400 font-bold">
          Student Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="apprentice@domain.com"
          className={inputCls}
        />
      </div>

      {/* Target Course */}
      <div className="space-y-1">
        <label className="block font-mono text-[10px] uppercase tracking-widest text-slate-400 font-bold">
          Target Course
        </label>
        <select
          required
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className={inputCls + ' appearance-none cursor-pointer'}
        >
          <option value="">— Select Course —</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Feedback message */}
      {status === 'error' && (
        <div className="flex items-start gap-2 p-3 border border-red-500/20 bg-red-950/20 text-red-400 rounded font-mono text-[10px]">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>{msg}</span>
        </div>
      )}

      {status === 'success' && (
        <div className="flex items-start gap-2 p-3 border border-green-500/20 bg-green-950/20 text-green-400 rounded font-mono text-[10px]">
          <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>{msg}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !email.trim() || !courseId}
        className="w-full bg-[#00c8ff] hover:bg-[#00c8ff]/90 disabled:opacity-40 transition-colors text-slate-950 font-bold font-mono text-xs uppercase tracking-wider rounded py-2.5 flex items-center justify-center gap-1.5 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Creating Link Override...
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5" /> Enroll Apprentice
          </>
        )}
      </button>
    </form>
  );
}
