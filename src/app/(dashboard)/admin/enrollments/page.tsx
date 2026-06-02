import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Award, UserCheck, ShieldAlert, Plus, CheckCircle, Ban } from 'lucide-react';
import EnrollForm from './EnrollForm';
import { suspendEnrollmentFormAction, reactivateEnrollmentFormAction } from './actions';

export default async function AdminEnrollmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/student/home');

  // 1. Fetch all enrollments with student & course profiles joined
  const { data: enrollmentsData } = await supabase
    .from('enrollments')
    .select(`
      id,
      enrolled_at,
      status,
      student_id,
      course_id
    `)
    .order('enrolled_at', { ascending: false });

  // Manually fetch student profiles and courses to resolve joins cleanly
  const studentIds = Array.from(new Set((enrollmentsData || []).map((e) => e.student_id).filter(Boolean)));
  const courseIds = Array.from(new Set((enrollmentsData || []).map((e) => e.course_id).filter(Boolean)));

  const [{ data: studentProfiles }, { data: coursesList }] = await Promise.all([
    supabase.from('profiles').select('id, full_name, email').in('id', studentIds),
    supabase.from('courses').select('id, title').in('id', courseIds),
  ]);

  const studentMap = (studentProfiles || []).reduce((acc, p) => {
    acc[p.id] = p;
    return acc;
  }, {} as Record<string, any>);

  const courseMap = (coursesList || []).reduce((acc, c) => {
    acc[c.id] = c;
    return acc;
  }, {} as Record<string, any>);

  const enrollments = (enrollmentsData || []).map((enrollment) => ({
    ...enrollment,
    profiles: studentMap[enrollment.student_id] || null,
    courses: courseMap[enrollment.course_id] || null,
  }));

  // 2. Fetch all courses
  const { data: courses } = await supabase.from('courses').select('id, title');

  return (
    <div className="min-h-screen bg-[#020617] star-field text-[var(--text-primary)]">
      <div className="max-w-screen-2xl mx-auto px-6 py-10 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/admin/home" className="text-slate-500 hover:text-[#00c8ff] font-mono text-xs uppercase tracking-widest transition-colors">
                ← Dashboard
              </Link>
              <span className="text-slate-700">/</span>
              <span className="text-[#00c8ff] font-mono text-xs uppercase tracking-widest">Enrollments</span>
            </div>
            <h1 className="text-3xl font-display font-black tracking-widest uppercase flex items-center gap-4">
              <UserCheck className="w-7 h-7 text-[#00c8ff]" />
              Enrollment override console
              <span className="bg-[#00c8ff] text-[#020617] text-xs px-3 py-1 font-bold shadow-[0_0_10px_#00c8ff]">MANUAL</span>
            </h1>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* List of current links */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-mono text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">
              Enrolled Users Audit Log ({enrollments.length})
            </h2>

            {enrollments.length > 0 ? (
              <div className="space-y-4">
                {enrollments.map((e) => {
                  const studentName = e.profiles?.full_name || 'Apprentice';
                  const studentEmail = e.profiles?.email || '—';
                  const courseTitle = e.courses?.title || 'System Core Course';
                  const isActive = e.status === 'active';

                  return (
                    <div key={e.id} className={`glass-card !rounded-none border p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                      isActive ? 'border-slate-850' : 'border-amber-500/20 bg-amber-955/5'
                    }`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <p className="font-display font-bold text-sm tracking-wide text-slate-200">
                            {studentName}
                          </p>
                          <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-wider ${
                            isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {e.status}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-500">{studentEmail}</p>
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/40">
                          <Award className="w-3.5 h-3.5 text-[#7b4fce]" />
                          <span className="font-mono text-[10px] text-slate-450 uppercase">{courseTitle}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <div className="text-right font-mono text-[9px] text-slate-650 hidden md:block">
                          Link Active since<br/>
                          {new Date(e.enrolled_at).toLocaleDateString()}
                        </div>
                        
                        {isActive ? (
                          <form action={suspendEnrollmentFormAction}>
                            <input type="hidden" name="enrollmentId" value={e.id} />
                            <button
                              type="submit"
                              className="px-3 py-1.5 border border-amber-500/40 text-amber-450 hover:bg-amber-400/10 rounded font-mono text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Ban className="w-3.5 h-3.5" /> Suspend
                            </button>
                          </form>
                        ) : (
                          <form action={reactivateEnrollmentFormAction}>
                            <input type="hidden" name="enrollmentId" value={e.id} />
                            <button
                              type="submit"
                              className="px-3 py-1.5 border border-green-500/40 text-green-405 hover:bg-green-400/10 rounded font-mono text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Reactivate
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="glass-card !rounded-none p-12 text-center text-slate-500 font-mono text-xs">
                No custom link records found.
              </div>
            )}
          </div>

          {/* Enroll manual override panel */}
          <div className="space-y-6">
            <div className="glass-card !rounded-none border border-slate-800 p-6 space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#00c8ff] font-black border-b border-slate-800 pb-3 flex items-center gap-2">
                <span>➕</span> Enroll Apprentice Override
              </h3>
              <EnrollForm courses={courses || []} />
            </div>

            <div className="glass-card !rounded-none border border-amber-500/20 bg-amber-950/5 p-5 space-y-2 font-mono">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" /> Warning
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Manual overrides bypass the standard onboarding Stripe sequence. Use only for manual pilot linkings, debugging student link errors, or operational administrative overrides.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
