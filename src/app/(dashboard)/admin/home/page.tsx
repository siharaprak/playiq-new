import { Users, Truck, Activity, Filter, UserCog, FileCheck, UserCheck, MessageSquare, Cpu } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getDynamicOpsAlerts } from '@/lib/data/ops-alerts';

export default async function AdminDashboard({ searchParams }: { searchParams: { status?: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Enforce Admin Role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  
  if (profile?.role !== 'admin') {
    // If a parent or student tries to access, bounce them to their respective home
    redirect(`/${profile?.role || 'parent'}/home`);
  }

  // Fetch Beta Applications - optimize with limit and explicit fields
  let query = supabaseAdmin.from('beta_applications').select('id, parent_full_name, email, child_age_band, shipping_zip_code, status, created_at').limit(50);
  
  if (searchParams?.status && searchParams.status !== 'all') {
    query = query.eq('status', searchParams.status);
  }

  const { data: applications, error } = await query.order('created_at', { ascending: false });

  // For metrics, fetch raw total pending status only
  const { data: allApps } = await supabaseAdmin.from('beta_applications').select('status');
  const pendingCount = (allApps || []).filter((a: any) => a.status === 'pending').length;
  const totalCount = allApps?.length || 0;

  // Operational telemetry queries and discussion reports - optimize select fields for head counts
  const [
    { count: openTicketsCount },
    { count: totalTutorsCount },
    { count: totalAssistantsCount },
    { count: reportsCount }
  ] = await Promise.all([
    supabaseAdmin.from('support_issues').select('id', { count: 'exact', head: true }).eq('status', 'open'),
    supabaseAdmin.from('tutor_profiles').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('assistant_profiles').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('discussion_reports').select('id', { count: 'exact', head: true }),
  ]);

  // Fetch linked student accounts for applications (case-insensitive)
  const { data: parentProfiles } = await supabaseAdmin
    .from('profiles')
    .select('id, email')
    .eq('role', 'parent');

  const parentIdToEmail: Record<string, string> = {};
  const parentIds: string[] = [];
  for (const p of (parentProfiles || [])) {
    if (p.email) {
      const cleanEm = p.email.trim().toLowerCase();
      parentIdToEmail[p.id] = cleanEm;
      parentIds.push(p.id);
    }
  }

  const { data: parentChildLinks } = parentIds.length > 0 ? await supabaseAdmin
    .from('parent_child_links')
    .select('parent_id, student_id')
    .in('parent_id', parentIds) : { data: [] };

  const studentIds = Array.from(new Set((parentChildLinks || []).map((l: any) => l.student_id)));
  const { data: studentProfiles } = studentIds.length > 0 ? await supabaseAdmin
    .from('profiles')
    .select('id, full_name, email')
    .in('id', studentIds) : { data: [] };

  const studentMap: Record<string, { id: string; name: string; email: string }> = {};
  for (const s of (studentProfiles || [])) {
    studentMap[s.id] = { id: s.id, name: s.full_name || s.email || 'Student', email: s.email };
  }

  const emailToStudentsMap: Record<string, { name: string; email: string }[]> = {};
  for (const link of (parentChildLinks || [])) {
    const parentEmail = parentIdToEmail[link.parent_id];
    if (parentEmail) {
      if (!emailToStudentsMap[parentEmail]) emailToStudentsMap[parentEmail] = [];
      const st = studentMap[link.student_id];
      if (st) emailToStudentsMap[parentEmail].push(st);
    }
  }

  // Query dynamic derived alerts (no PII or custom prompts returned)
  const dynamicAlerts = await getDynamicOpsAlerts();

  return (
    <div className="min-h-screen bg-[#020617] star-field text-[var(--text-primary)] p-6 md:p-12">
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-display font-black flex items-center gap-4 tracking-widest uppercase">
              PlayIQ <span className="bg-[#7b4fce] text-[#020617] text-xs px-3 py-1 font-bold shadow-[0_0_10px_#7b4fce]">SYS.ADMIN</span>
            </h1>
            <p className="text-[#00c8ff] font-mono text-xs mt-2 tracking-widest uppercase opacity-80">&gt; CURRENT_SESSION_BETA_2.0.4: {user.email}</p>
          </div>
          <form action="/auth/signout" method="post">
            <button className="text-xs font-mono tracking-widest uppercase border border-slate-600 bg-transparent text-slate-300 px-4 py-2 hover:bg-slate-800 hover:text-[var(--text-primary)] transition-colors">
              [ LOGOUT ]
            </button>
          </form>
        </header>

        {/* HUD Modules */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
           <div className="glass-card p-6 border-l-[3px] border-l-[#00c8ff] !rounded-none shadow-none flex flex-col justify-between h-full">
             <div className="flex items-center gap-4 mb-4">
               <div className="text-[#00c8ff]"><Users className="w-6 h-6" /></div>
               <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">Beta Intake Capacity</p>
             </div>
             <div>
               <p className="font-display text-4xl font-black text-[var(--text-primary)]">{totalCount} <span className="text-sm text-slate-500">/ 50</span></p>
             </div>
           </div>
           
           <div className="glass-card p-6 border-b-[3px] border-b-amber-400 !rounded-none shadow-none flex flex-col justify-between h-full">
             <div className="flex items-center gap-4 mb-4">
               <div className="text-amber-400"><Truck className="w-6 h-6" /></div>
               <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">Orders Pending Dispatch</p>
             </div>
             <div>
               <p className="font-display text-4xl font-black text-[var(--text-primary)]">{(allApps || []).filter((a: any) => a.status === 'paid').length}</p>
             </div>
           </div>

           <div className="glass-card p-6 border-r-[3px] border-r-[#7b4fce] !rounded-none shadow-none flex flex-col justify-between h-full bg-[rgba(123,79,206,0.03)]">
             <div className="flex items-start justify-between gap-4 mb-2">
               <div className="flex items-center gap-4">
                 <div className="text-[#7b4fce]"><Activity className="w-6 h-6 animate-pulse" /></div>
                 <div>
                   <p className="text-xs font-mono tracking-widest text-[#7b4fce] uppercase">LMS Simulator Console</p>
                 </div>
               </div>
             </div>
             <div className="mt-4">
                <Link href="/student/home" className="block text-center w-full bg-[#00c8ff] hover:bg-white text-black py-3 font-display font-bold uppercase tracking-[0.2em] transition-colors shadow-[0_0_15px_rgba(0,200,255,0.6)]">
                  ENTER LMS &rarr;
                </Link>
             </div>
           </div>
        </div>

        {/* Telemetry Alert Bar */}
        {((openTicketsCount ?? 0) > 0) && (
          <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded flex items-center justify-between text-xs font-mono">
            <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
              ⚠ SYSTEM ALERT: {openTicketsCount} OPEN SUPPORT TICKETS PENDING REVIEW
            </span>
            <Link href="/admin/support" className="text-[#f5c518] hover:underline font-bold">
              OPEN SUPPORT QUEUE &rarr;
            </Link>
          </div>
        )}

        {/* Dynamic Operational Alerts Banners (Safe, no PII, no prompt text, read-only) */}
        {dynamicAlerts.length > 0 && (
          <div className="mb-8 space-y-3 font-mono text-xs">
            {dynamicAlerts.map((alert: any) => (
              <div
                key={alert.ruleCode}
                className={`p-4 border flex items-center justify-between !rounded-none ${
                  alert.severity === 'critical'
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : alert.severity === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                }`}
              >
                <span className="font-bold uppercase tracking-wider flex items-center gap-2">
                  {alert.severity === 'critical' ? '🔴' : alert.severity === 'warning' ? '⚠️' : 'ℹ️'}{' '}
                  [{alert.ruleCode}] {alert.title} ({alert.affectedCount} affected)
                </span>
                <span className="text-slate-500">{alert.description}</span>
              </div>
            ))}
          </div>
        )}

        {/* Navigation Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          <Link href="/admin/users" className="glass-card p-6 !rounded-none border border-slate-800 hover:border-[#7b4fce]/60 transition-all group flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center border border-[#7b4fce]/40 bg-[#7b4fce]/10 text-[#7b4fce] group-hover:shadow-[0_0_15px_rgba(123,79,206,0.4)] transition-all flex-shrink-0">
              <UserCog className="w-6 h-6" />
            </div>
            <div>
              <p className="font-display font-bold text-[var(--text-primary)] tracking-wider uppercase text-sm">Student Roster</p>
              <p className="font-mono text-[10px] text-slate-500 mt-1">Check progress and edit student account authorizations</p>
            </div>
            <span className="ml-auto text-slate-600 group-hover:text-[#7b4fce] transition-colors">→</span>
          </Link>

          {/* Card 2: Artifact Reviews */}
          <Link href="/admin/artifacts" className="glass-card p-6 !rounded-none border border-slate-800 hover:border-[#00c8ff]/60 transition-all group flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center border border-[#00c8ff]/40 bg-[#00c8ff]/10 text-[#00c8ff] group-hover:shadow-[0_0_15px_rgba(0,200,255,0.4)] transition-all flex-shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-display font-bold text-[var(--text-primary)] tracking-wider uppercase text-sm">Artifact Reviews</p>
              <p className="font-mono text-[10px] text-slate-500 mt-1">Evaluate student codes, boundaries plans, and files</p>
            </div>
            <span className="ml-auto text-slate-600 group-hover:text-[#00c8ff] transition-colors">→</span>
          </Link>

          {/* Card 3: Enrollment Overrides */}
          <Link href="/admin/enrollments" className="glass-card p-6 !rounded-none border border-slate-800 hover:border-[#00c8ff]/60 transition-all group flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center border border-[#00c8ff]/40 bg-[#00c8ff]/10 text-[#00c8ff] group-hover:shadow-[0_0_15px_rgba(0,200,255,0.4)] transition-all flex-shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-display font-bold text-[var(--text-primary)] tracking-wider uppercase text-sm">Enrollment Manual Overrides</p>
              <p className="font-mono text-[10px] text-slate-500 mt-1">Manually enroll students, suspend links, or reactivate course access</p>
            </div>
            <span className="ml-auto text-slate-600 group-hover:text-[#00c8ff] transition-colors">→</span>
          </Link>

          {/* Card 4: AI Agents Lookup */}
          <Link href="/admin/agents" className="glass-card p-6 !rounded-none border border-slate-800 hover:border-[#7b4fce]/60 transition-all group flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center border border-[#7b4fce]/40 bg-[#7b4fce]/10 text-[#7b4fce] group-hover:shadow-[0_0_15px_rgba(123,79,206,0.4)] transition-all flex-shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <p className="font-display font-bold text-[var(--text-primary)] tracking-wider uppercase text-sm">Agent Lookup Console</p>
              <p className="font-mono text-[10px] text-slate-500 mt-1">Audit student AI Tutors (M9) and AI Assistants (M10)</p>
            </div>
            <span className="ml-auto text-slate-600 group-hover:text-[#7b4fce] transition-colors">→</span>
          </Link>

          {/* Card 5: Support Tickets */}
          <Link href="/admin/support" className="glass-card p-6 !rounded-none border border-slate-800 hover:border-[#f5c518]/60 transition-all group flex items-center gap-4 relative">
            <div className="w-12 h-12 flex items-center justify-center border border-[#f5c518]/45 bg-[#f5c518]/10 text-[#f5c518] group-hover:shadow-[0_0_15px_rgba(245,197,24,0.4)] transition-all flex-shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="font-display font-bold text-[var(--text-primary)] tracking-wider uppercase text-sm flex items-center gap-2">
                Support Tickets
                {((openTicketsCount ?? 0) > 0) && (
                  <span className="bg-[#f5c518] text-slate-950 font-mono text-[9px] font-black px-1.5 py-0.5 rounded animate-pulse">
                    {openTicketsCount}
                  </span>
                )}
              </p>
              <p className="font-mono text-[10px] text-slate-500 mt-1">Review student issues, resolve questions, and clear queues</p>
            </div>
            <span className="ml-auto text-slate-600 group-hover:text-[#f5c518] transition-colors">→</span>
          </Link>

          {/* Card 6: Moderation */}
          <Link href="/admin/moderation" className="glass-card p-6 !rounded-none border border-slate-800 hover:border-red-500/60 transition-all group flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center border border-red-500/40 bg-red-500/10 text-red-500 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all">
              <span className="font-bold font-mono text-lg font-black">!</span>
            </div>
            <div>
              <p className="font-display font-bold text-[var(--text-primary)] tracking-wider uppercase text-sm flex items-center gap-2">
                Moderation
                {reportsCount !== null && reportsCount > 0 ? (
                  <span className="text-[10px] px-1.5 py-0.5 bg-red-500 text-black font-bold animate-pulse shadow-[0_0_8px_#ef4444] font-mono">{reportsCount}</span>
                ) : null}
              </p>
              <p className="font-mono text-[10px] text-slate-500 mt-1">Review flagged topics and comments reported by community members</p>
            </div>
            <span className="ml-auto text-slate-600 group-hover:text-red-500 transition-colors">→</span>
          </Link>
          <Link href="/admin/home" className="glass-card p-6 !rounded-none border border-slate-800 hover:border-[#7b4fce]/60 transition-all group flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center border border-[#7b4fce]/40 bg-[#7b4fce]/10 text-[#7b4fce] group-hover:shadow-[0_0_15px_rgba(123,79,206,0.4)] transition-all flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="font-display font-bold text-[var(--text-primary)] tracking-wider uppercase text-sm">Beta Intake Roster</p>
              <p className="font-mono text-[10px] text-slate-500 mt-1">View beta applicants, payment status, and registration logs</p>
            </div>
            <span className="ml-auto text-slate-600 group-hover:text-[#7b4fce] transition-colors">→</span>
          </Link>
        </div>

        {/* Database Table view */}
        <div className="glass-card !p-0 !rounded-none overflow-hidden border border-slate-800">
          <div className="px-6 py-4 border-b border-slate-800 bg-[#020617] flex justify-between items-center overflow-x-auto">
            <h2 className="font-mono text-sm tracking-widest text-[#00c8ff] uppercase mr-4">&gt; COHORT_TABLE_MANIFEST</h2>
            <div className="flex bg-black/50 border border-slate-800 p-1 gap-1 text-xs font-mono uppercase">
               <Link href="/admin/home" className={`px-4 py-2 transition-colors ${!searchParams?.status || searchParams.status === 'all' ? 'bg-[#00c8ff] text-black font-bold shadow-[0_0_10px_rgba(0,200,255,0.4)]' : 'text-slate-400 hover:text-[var(--text-primary)]'}`}>All</Link>
               <Link href="/admin/home?status=paid" className={`px-4 py-2 transition-colors ${searchParams?.status === 'paid' ? 'bg-emerald-500 text-black font-bold shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'text-slate-400 hover:text-[var(--text-primary)]'}`}>Paid</Link>
               <Link href="/admin/home?status=checkout_started" className={`px-4 py-2 transition-colors ${searchParams?.status === 'checkout_started' ? 'bg-amber-400 text-black font-bold shadow-[0_0_10px_rgba(251,191,36,0.4)]' : 'text-slate-400 hover:text-[var(--text-primary)]'}`}>Started</Link>
               <Link href="/admin/home?status=canceled" className={`px-4 py-2 transition-colors ${searchParams?.status === 'canceled' ? 'bg-red-500 text-[var(--text-primary)] font-bold shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'text-slate-400 hover:text-[var(--text-primary)]'}`}>VOIDED</Link>
               <Link href="/admin/home?status=fulfilled_promo" className={`px-4 py-2 transition-colors ${searchParams?.status === 'fulfilled_promo' ? 'bg-[#7b4fce] text-white font-bold shadow-[0_0_10px_rgba(123,79,206,0.4)]' : 'text-slate-400 hover:text-[var(--text-primary)]'}`}>Promo</Link>
            </div>
          </div>
          
          {applications && applications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left font-mono">
                <thead className="text-[10px] text-slate-500 uppercase tracking-widest bg-black/40 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Sponsor/Parent</th>
                    <th className="px-6 py-4">Target Email</th>
                    <th className="px-6 py-4">Linked Students</th>
                    <th className="px-6 py-4">Age Bracket</th>
                    <th className="px-6 py-4">Geo_Zip</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {(applications || []).map((app: any) => {
                    const linkedStudents = emailToStudentsMap[app.email.toLowerCase()] || [];
                    return (
                      <tr key={app.id} className="border-b border-slate-800 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-slate-200">{app.parent_full_name}</td>
                        <td className="px-6 py-4 text-slate-400 text-xs">{app.email}</td>
                        <td className="px-6 py-4 text-xs font-mono">
                          {linkedStudents.length > 0 ? (
                            <span className="text-[#39ff14] font-bold flex items-center gap-1.5" title={linkedStudents.map(s => s.name).join(', ')}>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] inline-block animate-pulse" />
                              {linkedStudents.length} {linkedStudents.length === 1 ? 'Student' : 'Students'}
                              <span className="text-slate-400 text-[10px] font-normal font-sans ml-1">
                                ({linkedStudents.map(s => s.name).join(', ')})
                              </span>
                            </span>
                          ) : (
                            <span className="text-slate-600 italic">0 enrolled</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-[#00c8ff]">{app.child_age_band}</td>
                        <td className="px-6 py-4 text-slate-400">{app.shipping_zip_code}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-widest 
                            ${app.status === 'paid' ? 'text-emerald-400 border border-emerald-400 bg-emerald-400/10' : ''}
                            ${app.status === 'checkout_started' ? 'text-amber-400 border border-amber-400 bg-amber-400/10' : ''}
                            ${app.status === 'canceled' ? 'text-red-400 border border-red-400 bg-red-400/10' : ''}
                            ${app.status === 'pending' ? 'text-slate-400 border border-slate-600 bg-slate-800' : ''}
                            ${app.status === 'fulfilled' ? 'text-[#00c8ff] border border-[#00c8ff] bg-[#00c8ff]/10' : ''}
                            ${app.status === 'fulfilled_promo' ? 'text-[#7b4fce] border border-[#7b4fce] bg-[#7b4fce]/10' : ''}
                          `}>
                            {app.status === 'checkout_started' ? 'Processing' : app.status === 'fulfilled_promo' ? 'promo' : app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs tracking-wider">
                          {new Date(app.created_at).toISOString().split('T')[0]}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center text-slate-500 flex flex-col items-center justify-center font-mono">
              <Filter className="w-8 h-8 text-[#7b4fce] mb-4 opacity-50" />
              <p className="uppercase tracking-widest text-xs">0 Records Retrieved.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
