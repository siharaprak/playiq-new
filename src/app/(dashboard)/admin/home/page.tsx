import {
  Users,
  Ticket,
  Activity,
  Filter,
  UserCog,
  FileCheck,
  UserCheck,
  MessageSquare,
  Cpu,
  ShieldAlert,
  Search,
  EyeOff,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getDynamicOpsAlerts } from '@/lib/data/ops-alerts';
import { QuickSendBetaModal, SendBetaEmailButton } from './BetaEmailActions';

function formatAgeBand(band: string | null | undefined): string {
  if (!band) return '—';
  const normalized = band.trim().toLowerCase();
  const map: Record<string, string> = {
    under_10: 'Under 10',
    under_13: 'Under 13',
    '10_12': 'Ages 10–12',
    '13_14': 'Ages 13–14',
    '15_17': 'Ages 15–17',
    over_17: 'Ages 18+',
    '18_plus': 'Ages 18+',
    adult: 'Adult (18+)',
  };
  return map[normalized] || band.replace(/_/g, '–');
}

function formatTrafficSource(source: string | null | undefined): string {
  if (!source || source === 'web_form' || source === 'direct_traffic') return 'Direct';
  if (source === 'test_account') return 'Test Account';
  return source.replace(/_/g, ' ');
}

function isTestApplication(app: {
  parent_full_name?: string | null;
  email?: string | null;
  source?: string | null;
}): boolean {
  const emailLower = (app.email || '').toLowerCase().trim();
  const nameLower = (app.parent_full_name || '').toLowerCase().trim();
  return (
    app.source === 'test_account' ||
    emailLower === 'teamsienvitest@gmail.com' ||
    emailLower === 'jimboyaquino12@gmail.com' ||
    nameLower.includes('test') ||
    emailLower.includes('test@') ||
    emailLower.endsWith('@student.playiq.dev')
  );
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; hideTest?: string }>;
}) {
  const params = await searchParams;
  const activeStatus = params?.status || 'all';
  const searchQuery = (params?.search || '').trim();
  const hideTest = params?.hideTest === '1';

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Enforce Admin Role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect(`/${profile?.role || 'parent'}/home`);
  }

  // Fetch Beta Applications - explicit columns and bounded limit
  let query = supabaseAdmin
    .from('beta_applications')
    .select('id, parent_full_name, email, child_age_band, status, source, created_at')
    .limit(50);

  if (activeStatus && activeStatus !== 'all') {
    query = query.eq('status', activeStatus);
  }

  const { data: applications } = await query.order('created_at', { ascending: false });

  // Fetch status/source summary counts across all applications
  const { data: allApps } = await supabaseAdmin
    .from('beta_applications')
    .select('status, source, email, parent_full_name');
  const allAppsList = allApps || [];
  const totalCount = allAppsList.length;
  const pendingCount = allAppsList.filter((a: any) => a.status === 'pending').length;
  const paidCount = allAppsList.filter((a: any) => a.status === 'paid').length;
  const promoCount = allAppsList.filter((a: any) => a.status === 'fulfilled_promo').length;
  const startedCount = allAppsList.filter((a: any) => a.status === 'checkout_started').length;
  const canceledCount = allAppsList.filter((a: any) => a.status === 'canceled').length;
  const testAppCount = allAppsList.filter((a: any) => isTestApplication(a)).length;
  const realFamilyCount = Math.max(0, totalCount - testAppCount);

  // Calculate source breakdown
  let emailCount = 0;
  let socialCount = 0;
  let otherCount = 0;
  const otherBreakdown: Record<string, number> = {};

  allAppsList.forEach((app: any) => {
    let s = (app.source || 'direct_traffic').toLowerCase();
    if (s === 'web_form') s = 'direct_traffic';

    if (s.includes('email')) {
      emailCount++;
    } else if (s.includes('social') || s === 'facebook' || s === 'instagram') {
      socialCount++;
    } else {
      otherCount++;
      otherBreakdown[s] = (otherBreakdown[s] || 0) + 1;
    }
  });

  // Operational telemetry queries and discussion reports
  const [
    { count: openTicketsCount },
    { count: totalTutorsCount },
    { count: totalAssistantsCount },
    { count: reportsCount },
  ] = await Promise.all([
    supabaseAdmin
      .from('support_issues')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'open'),
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
  for (const p of parentProfiles || []) {
    if (p.email) {
      const cleanEm = p.email.trim().toLowerCase();
      parentIdToEmail[p.id] = cleanEm;
      parentIds.push(p.id);
    }
  }

  const { data: parentChildLinks } =
    parentIds.length > 0
      ? await supabaseAdmin
          .from('parent_child_links')
          .select('parent_id, student_id')
          .in('parent_id', parentIds)
      : { data: [] };

  const studentIds = Array.from(
    new Set((parentChildLinks || []).map((l: any) => l.student_id)),
  );
  const { data: studentProfiles } =
    studentIds.length > 0
      ? await supabaseAdmin
          .from('profiles')
          .select('id, full_name, email')
          .in('id', studentIds)
      : { data: [] };

  const studentMap: Record<string, { id: string; name: string; email: string }> = {};
  for (const s of studentProfiles || []) {
    studentMap[s.id] = {
      id: s.id,
      name: s.full_name || s.email || 'Student',
      email: s.email,
    };
  }

  const emailToStudentsMap: Record<string, { name: string; email: string }[]> = {};
  for (const link of parentChildLinks || []) {
    const parentEmail = parentIdToEmail[link.parent_id];
    if (parentEmail) {
      if (!emailToStudentsMap[parentEmail]) emailToStudentsMap[parentEmail] = [];
      const st = studentMap[link.student_id];
      if (st) emailToStudentsMap[parentEmail].push(st);
    }
  }

  // Filter displayed rows by search query and hideTest toggle
  const filteredApplications = (applications || []).filter((app: any) => {
    const isTest = isTestApplication(app);
    if (hideTest && isTest) return false;

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const linked = emailToStudentsMap[(app.email || '').toLowerCase().trim()] || [];
    const matchesParent =
      (app.parent_full_name || '').toLowerCase().includes(q) ||
      (app.email || '').toLowerCase().includes(q);
    const matchesStudent = linked.some(
      (s) => s.name.toLowerCase().includes(q) || (s.email || '').toLowerCase().includes(q),
    );
    return matchesParent || matchesStudent;
  });

  // Query dynamic derived alerts (no PII or custom prompts returned)
  const dynamicAlerts = await getDynamicOpsAlerts();

  const buildFilterHref = (nextStatus: string, nextHideTest = hideTest) => {
    const sp = new URLSearchParams();
    if (nextStatus && nextStatus !== 'all') sp.set('status', nextStatus);
    if (searchQuery) sp.set('search', searchQuery);
    if (nextHideTest) sp.set('hideTest', '1');
    const qs = sp.toString();
    return qs ? `/admin/home?${qs}` : '/admin/home';
  };

  return (
    <div className="min-h-screen bg-[#020617] star-field text-[var(--text-primary)] pt-28 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Top Command Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-800/90 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-display font-black flex items-center gap-3 tracking-widest uppercase">
                PlayIQ Command Center
              </h1>
              <span className="bg-[#7b4fce] text-white text-[11px] font-mono px-3 py-1 font-bold tracking-widest uppercase shadow-[0_0_12px_rgba(123,79,206,0.6)]">
                SYS.ADMIN
              </span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 uppercase tracking-wider">
                ● 15-Module Release Live
              </span>
            </div>
            <p className="text-[#00c8ff] font-mono text-xs mt-2 tracking-widest uppercase opacity-85">
              &gt; ACTIVE_OPERATOR: {user.email}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <QuickSendBetaModal />
            <Link
              href="/student/home"
              className="px-4 py-2 bg-[#00c8ff] hover:bg-white text-slate-950 font-display text-xs font-bold uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(0,200,255,0.45)] flex items-center gap-2 whitespace-nowrap"
            >
              <span>Enter LMS Simulator</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* HUD Metrics Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Beta Intake Capacity */}
          <div className="glass-card p-5 border-l-[3px] border-l-[#00c8ff] !rounded-none shadow-none flex flex-col justify-between">
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">
                Beta Intake Capacity
              </p>
              <Users className="w-5 h-5 text-[#00c8ff] shrink-0" />
            </div>
            <div>
              <p className="font-display text-3xl font-black text-[var(--text-primary)]">
                {totalCount} <span className="text-sm text-slate-500 font-normal">/ 50</span>
              </p>
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>
                  Real Families: <strong className="text-[#00c8ff]">{realFamilyCount}</strong>
                </span>
                <span>
                  Test: <strong className="text-amber-400">{testAppCount}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Promo & Enrollment Status */}
          <div className="glass-card p-5 border-b-[3px] border-b-amber-400 !rounded-none shadow-none flex flex-col justify-between">
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">
                Activated / Fulfilled
              </p>
              <Ticket className="w-5 h-5 text-amber-400 shrink-0" />
            </div>
            <div>
              <p className="font-display text-3xl font-black text-[var(--text-primary)]">
                {paidCount + promoCount}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>
                  Promo: <strong className="text-[#c4b5fd]">{promoCount}</strong>
                </span>
                <span>
                  Paid: <strong className="text-emerald-400">{paidCount}</strong>
                </span>
                <span>
                  Pending: <strong className="text-amber-300">{pendingCount}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Traffic Sources */}
          <div className="glass-card p-5 border-t-[3px] border-t-emerald-400 !rounded-none shadow-none flex flex-col justify-between">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">
                Acquisition Channels
              </p>
              <Activity className="w-5 h-5 text-emerald-400 shrink-0" />
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">DIRECT / WEB:</span>
                <span className="text-slate-200 font-bold">{otherCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">EMAIL CAMPAIGN:</span>
                <span className="text-emerald-400 font-bold">{emailCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">SOCIAL MEDIA:</span>
                <span className="text-[#00c8ff] font-bold">{socialCount}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Linked Students & Built AI Agents */}
          <div className="glass-card p-5 border-r-[3px] border-r-[#7b4fce] !rounded-none shadow-none flex flex-col justify-between bg-[rgba(123,79,206,0.04)]">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-xs font-mono tracking-widest text-[#c4b5fd] uppercase">
                Active Student Ecosystem
              </p>
              <Cpu className="w-5 h-5 text-[#7b4fce] shrink-0" />
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">LINKED STUDENTS:</span>
                <span className="text-[#39ff14] font-bold">{studentIds.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">AI TUTORS (M09):</span>
                <span className="text-[#00c8ff] font-bold">{totalTutorsCount ?? 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">AI ASSISTANTS (M11/12):</span>
                <span className="text-[#c4b5fd] font-bold">{totalAssistantsCount ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry Alert Bar */}
        {(openTicketsCount ?? 0) > 0 && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
              ⚠ SYSTEM ALERT: {openTicketsCount} OPEN SUPPORT TICKET
              {openTicketsCount === 1 ? '' : 'S'} PENDING REVIEW
            </span>
            <Link href="/admin/support" className="text-[#f5c518] hover:underline font-bold">
              OPEN SUPPORT QUEUE &rarr;
            </Link>
          </div>
        )}

        {/* Dynamic Operational Alerts Banners */}
        {dynamicAlerts.length > 0 && (
          <div className="mb-6 space-y-2.5 font-mono text-xs">
            {dynamicAlerts.map((alert: any) => (
              <div
                key={alert.ruleCode}
                className={`p-3.5 border flex flex-col sm:flex-row sm:items-center justify-between gap-2 !rounded-none ${
                  alert.severity === 'critical'
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : alert.severity === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                }`}
              >
                <span className="font-bold uppercase tracking-wider flex items-center gap-2">
                  {alert.severity === 'critical'
                    ? '🔴'
                    : alert.severity === 'warning'
                    ? '⚠️'
                    : 'ℹ️'}{' '}
                  [{alert.ruleCode}] {alert.title} ({alert.affectedCount} affected)
                </span>
                <span className="text-slate-400 text-[11px]">{alert.description}</span>
              </div>
            ))}
          </div>
        )}

        {/* Quick-Access Console Navigation Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
          <Link
            href="/admin/users"
            className="glass-card p-4 !rounded-none border border-slate-800 hover:border-[#7b4fce]/60 transition-all group flex items-center gap-3.5"
          >
            <div className="w-10 h-10 flex items-center justify-center border border-[#7b4fce]/40 bg-[#7b4fce]/10 text-[#7b4fce] group-hover:shadow-[0_0_15px_rgba(123,79,206,0.4)] transition-all shrink-0">
              <UserCog className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-[var(--text-primary)] tracking-wider uppercase text-xs">
                Student Roster
              </p>
              <p className="font-mono text-[10px] text-slate-400 mt-0.5 truncate">
                M00–M14 progress &amp; controls
              </p>
            </div>
            <span className="ml-auto text-slate-600 group-hover:text-[#7b4fce] transition-colors">
              →
            </span>
          </Link>

          <Link
            href="/admin/artifacts"
            className="glass-card p-4 !rounded-none border border-slate-800 hover:border-[#00c8ff]/60 transition-all group flex items-center gap-3.5"
          >
            <div className="w-10 h-10 flex items-center justify-center border border-[#00c8ff]/40 bg-[#00c8ff]/10 text-[#00c8ff] group-hover:shadow-[0_0_15px_rgba(0,200,255,0.4)] transition-all shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-[var(--text-primary)] tracking-wider uppercase text-xs">
                Artifact Reviews
              </p>
              <p className="font-mono text-[10px] text-slate-400 mt-0.5 truncate">
                Evaluate submitted proof files
              </p>
            </div>
            <span className="ml-auto text-slate-600 group-hover:text-[#00c8ff] transition-colors">
              →
            </span>
          </Link>

          <Link
            href="/admin/enrollments"
            className="glass-card p-4 !rounded-none border border-slate-800 hover:border-[#00c8ff]/60 transition-all group flex items-center gap-3.5"
          >
            <div className="w-10 h-10 flex items-center justify-center border border-[#00c8ff]/40 bg-[#00c8ff]/10 text-[#00c8ff] group-hover:shadow-[0_0_15px_rgba(0,200,255,0.4)] transition-all shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-[var(--text-primary)] tracking-wider uppercase text-xs">
                Enrollment Overrides
              </p>
              <p className="font-mono text-[10px] text-slate-400 mt-0.5 truncate">
                Manual links &amp; access status
              </p>
            </div>
            <span className="ml-auto text-slate-600 group-hover:text-[#00c8ff] transition-colors">
              →
            </span>
          </Link>

          <Link
            href="/admin/agents"
            className="glass-card p-4 !rounded-none border border-slate-800 hover:border-[#7b4fce]/60 transition-all group flex items-center gap-3.5"
          >
            <div className="w-10 h-10 flex items-center justify-center border border-[#7b4fce]/40 bg-[#7b4fce]/10 text-[#7b4fce] group-hover:shadow-[0_0_15px_rgba(123,79,206,0.4)] transition-all shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-[var(--text-primary)] tracking-wider uppercase text-xs">
                Agent Lookup Console
              </p>
              <p className="font-mono text-[10px] text-slate-400 mt-0.5 truncate">
                Audit AI Tutors &amp; Assistants
              </p>
            </div>
            <span className="ml-auto text-slate-600 group-hover:text-[#7b4fce] transition-colors">
              →
            </span>
          </Link>

          <Link
            href="/admin/support"
            className="glass-card p-4 !rounded-none border border-slate-800 hover:border-[#f5c518]/60 transition-all group flex items-center gap-3.5"
          >
            <div className="w-10 h-10 flex items-center justify-center border border-[#f5c518]/45 bg-[#f5c518]/10 text-[#f5c518] group-hover:shadow-[0_0_15px_rgba(245,197,24,0.4)] transition-all shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-[var(--text-primary)] tracking-wider uppercase text-xs flex items-center gap-2">
                <span>Support Tickets</span>
                {(openTicketsCount ?? 0) > 0 && (
                  <span className="bg-[#f5c518] text-slate-950 font-mono text-[9px] font-black px-1.5 py-0.5 rounded">
                    {openTicketsCount}
                  </span>
                )}
              </p>
              <p className="font-mono text-[10px] text-slate-400 mt-0.5 truncate">
                Student issues &amp; queue
              </p>
            </div>
            <span className="ml-auto text-slate-600 group-hover:text-[#f5c518] transition-colors">
              →
            </span>
          </Link>

          <Link
            href="/admin/feedback"
            className="glass-card p-4 !rounded-none border border-slate-800 hover:border-[#00c8ff]/60 transition-all group flex items-center gap-3.5"
          >
            <div className="w-10 h-10 flex items-center justify-center border border-[#00c8ff]/40 bg-[#00c8ff]/10 text-[#00c8ff] group-hover:shadow-[0_0_15px_rgba(0,200,255,0.4)] transition-all shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-[var(--text-primary)] tracking-wider uppercase text-xs">
                Module Feedback
              </p>
              <p className="font-mono text-[10px] text-slate-400 mt-0.5 truncate">
                Student ratings &amp; reflections
              </p>
            </div>
            <span className="ml-auto text-slate-600 group-hover:text-[#00c8ff] transition-colors">
              →
            </span>
          </Link>

          <Link
            href="/admin/moderation"
            className="glass-card p-4 !rounded-none border border-slate-800 hover:border-red-500/60 transition-all group flex items-center gap-3.5"
          >
            <div className="w-10 h-10 flex items-center justify-center border border-red-500/40 bg-red-500/10 text-red-500 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all shrink-0">
              <span className="font-mono text-base font-black">!</span>
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-[var(--text-primary)] tracking-wider uppercase text-xs flex items-center gap-2">
                <span>Moderation</span>
                {reportsCount !== null && reportsCount > 0 ? (
                  <span className="text-[10px] px-1.5 py-0.5 bg-red-500 text-black font-bold font-mono">
                    {reportsCount}
                  </span>
                ) : null}
              </p>
              <p className="font-mono text-[10px] text-slate-400 mt-0.5 truncate">
                Flagged community posts
              </p>
            </div>
            <span className="ml-auto text-slate-600 group-hover:text-red-500 transition-colors">
              →
            </span>
          </Link>

          <Link
            href="/admin/privacy"
            className="glass-card p-4 !rounded-none border border-slate-800 hover:border-red-400/60 transition-all group flex items-center gap-3.5"
          >
            <div className="w-10 h-10 flex items-center justify-center border border-red-400/40 bg-red-400/10 text-red-300 group-hover:shadow-[0_0_15px_rgba(248,113,113,0.4)] transition-all shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-[var(--text-primary)] tracking-wider uppercase text-xs">
                Privacy Requests
              </p>
              <p className="font-mono text-[10px] text-slate-400 mt-0.5 truncate">
                Account deletion workflows
              </p>
            </div>
            <span className="ml-auto text-slate-600 group-hover:text-red-300 transition-colors">
              →
            </span>
          </Link>
        </div>

        {/* Cohort Table Manifest */}
        <div
          id="cohort-table"
          className="glass-card !p-0 !rounded-none overflow-hidden border border-slate-800 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
        >
          {/* Toolbar Row 1: Title + Status Filter Tabs */}
          <div className="px-5 py-4 border-b border-slate-800 bg-[#020617]/90 flex flex-col lg:flex-row justify-between lg:items-center gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-mono text-sm font-bold tracking-widest text-[#00c8ff] uppercase whitespace-nowrap">
                &gt; COHORT_TABLE_MANIFEST
              </h2>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                Showing {filteredApplications.length} of {applications?.length || 0} records
              </span>
            </div>

            <div className="flex flex-wrap bg-black/60 border border-slate-800 p-1 gap-1 text-[11px] font-mono uppercase">
              <Link
                href={buildFilterHref('all')}
                className={`px-3 py-1.5 transition-colors whitespace-nowrap ${
                  activeStatus === 'all'
                    ? 'bg-[#00c8ff] text-black font-bold shadow-[0_0_10px_rgba(0,200,255,0.4)]'
                    : 'text-slate-400 hover:text-[var(--text-primary)]'
                }`}
              >
                All ({totalCount})
              </Link>
              <Link
                href={buildFilterHref('fulfilled_promo')}
                className={`px-3 py-1.5 transition-colors whitespace-nowrap ${
                  activeStatus === 'fulfilled_promo'
                    ? 'bg-[#7b4fce] text-white font-bold shadow-[0_0_10px_rgba(123,79,206,0.4)]'
                    : 'text-slate-400 hover:text-[var(--text-primary)]'
                }`}
              >
                Promo ({promoCount})
              </Link>
              <Link
                href={buildFilterHref('paid')}
                className={`px-3 py-1.5 transition-colors whitespace-nowrap ${
                  activeStatus === 'paid'
                    ? 'bg-emerald-500 text-black font-bold shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                    : 'text-slate-400 hover:text-[var(--text-primary)]'
                }`}
              >
                Paid ({paidCount})
              </Link>
              <Link
                href={buildFilterHref('pending')}
                className={`px-3 py-1.5 transition-colors whitespace-nowrap ${
                  activeStatus === 'pending'
                    ? 'bg-amber-400 text-black font-bold shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                    : 'text-slate-400 hover:text-[var(--text-primary)]'
                }`}
              >
                Pending ({pendingCount})
              </Link>
              <Link
                href={buildFilterHref('checkout_started')}
                className={`px-3 py-1.5 transition-colors whitespace-nowrap ${
                  activeStatus === 'checkout_started'
                    ? 'bg-amber-500 text-black font-bold shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                    : 'text-slate-400 hover:text-[var(--text-primary)]'
                }`}
              >
                Started ({startedCount})
              </Link>
              <Link
                href={buildFilterHref('canceled')}
                className={`px-3 py-1.5 transition-colors whitespace-nowrap ${
                  activeStatus === 'canceled'
                    ? 'bg-red-500 text-white font-bold shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                    : 'text-slate-400 hover:text-[var(--text-primary)]'
                }`}
              >
                Voided ({canceledCount})
              </Link>
            </div>
          </div>

          {/* Toolbar Row 2: Search & Test Account Filter */}
          <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <form method="GET" action="/admin/home" className="flex-1 flex items-center gap-2">
              {activeStatus !== 'all' && (
                <input type="hidden" name="status" value={activeStatus} />
              )}
              {hideTest && <input type="hidden" name="hideTest" value="1" />}
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Search parent name, email, or linked student..."
                  className="w-full bg-black/60 border border-slate-800 focus:border-[#00c8ff] rounded pl-9 pr-3 py-1.5 text-xs font-mono text-slate-100 outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-[#00c8ff]/15 hover:bg-[#00c8ff]/25 text-[#00c8ff] border border-[#00c8ff]/40 rounded text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Filter
              </button>
              {(searchQuery || activeStatus !== 'all' || hideTest) && (
                <Link
                  href="/admin/home"
                  className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-white uppercase tracking-wider"
                >
                  Reset
                </Link>
              )}
            </form>

            <Link
              href={buildFilterHref(activeStatus, !hideTest)}
              className={`px-3.5 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider border transition-colors inline-flex items-center gap-1.5 whitespace-nowrap ${
                hideTest
                  ? 'border-amber-400/60 bg-amber-500/15 text-amber-300'
                  : 'border-slate-800 bg-black/40 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {hideTest ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Showing Real Families Only</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Hide Test Accounts ({testAppCount})</span>
                </>
              )}
            </Link>
          </div>

          {filteredApplications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left font-mono">
                <thead className="text-[10px] text-slate-400 uppercase tracking-widest bg-black/50 border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Sponsor / Parent &amp; Email</th>
                    <th className="px-4 py-3.5">Linked Students</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Age Bracket</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Source</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Registered</th>
                    <th className="px-5 py-3.5 text-right whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredApplications.map((app: any) => {
                    const emailKey = (app.email || '').toLowerCase().trim();
                    const linkedStudents = emailToStudentsMap[emailKey] || [];
                    const firstStudentName = linkedStudents[0]?.name;
                    const isTestAccount = isTestApplication(app);

                    return (
                      <tr
                        key={app.id}
                        className="hover:bg-white/[0.03] transition-colors align-middle"
                      >
                        {/* Sponsor/Parent & Email combined cleanly */}
                        <td className="px-5 py-3.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-sans font-semibold text-sm text-slate-100">
                              {app.parent_full_name || '—'}
                            </span>
                            {isTestAccount && (
                              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded border border-amber-500/40 bg-amber-500/10 text-amber-400 whitespace-nowrap">
                                TEST ACCOUNT
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5 break-all">
                            {app.email}
                          </div>
                        </td>

                        {/* Linked Students stacked cleanly */}
                        <td className="px-4 py-3.5 text-xs">
                          {linkedStudents.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              <span className="text-[#39ff14] font-bold inline-flex items-center gap-1.5 whitespace-nowrap">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] inline-block animate-pulse shrink-0" />
                                {linkedStudents.length}{' '}
                                {linkedStudents.length === 1 ? 'Student' : 'Students'}
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {linkedStudents.map((st, idx) => (
                                  <Link
                                    key={`${st.email}-${idx}`}
                                    href={`/admin/users?search=${encodeURIComponent(st.name)}`}
                                    title={`Inspect ${st.name} (${st.email}) in Student Roster`}
                                    className="text-[11px] font-sans px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:border-[#00c8ff] hover:text-[#00c8ff] transition-colors whitespace-nowrap"
                                  >
                                    {st.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-600 italic whitespace-nowrap">
                              0 enrolled
                            </span>
                          )}
                        </td>

                        {/* Age Bracket */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded text-xs font-mono text-[#00c8ff] bg-[#00c8ff]/10 border border-[#00c8ff]/25">
                            {formatAgeBand(app.child_age_band)}
                          </span>
                        </td>

                        {/* Traffic Source */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded border inline-block ${
                              app.source === 'test_account'
                                ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                                : 'border-slate-700 bg-slate-800/60 text-slate-300'
                            }`}
                          >
                            {formatTrafficSource(app.source)}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded inline-block
                            ${
                              app.status === 'paid'
                                ? 'text-emerald-400 border border-emerald-400/50 bg-emerald-400/10'
                                : ''
                            }
                            ${
                              app.status === 'checkout_started'
                                ? 'text-amber-400 border border-amber-400/50 bg-amber-400/10'
                                : ''
                            }
                            ${
                              app.status === 'canceled'
                                ? 'text-red-400 border border-red-400/50 bg-red-400/10'
                                : ''
                            }
                            ${
                              app.status === 'pending'
                                ? 'text-slate-300 border border-slate-600 bg-slate-800/80'
                                : ''
                            }
                            ${
                              app.status === 'fulfilled'
                                ? 'text-[#00c8ff] border border-[#00c8ff]/50 bg-[#00c8ff]/10'
                                : ''
                            }
                            ${
                              app.status === 'fulfilled_promo'
                                ? 'text-[#c4b5fd] border border-[#7b4fce]/60 bg-[#7b4fce]/15'
                                : ''
                            }
                          `}
                          >
                            {app.status === 'checkout_started'
                              ? 'Processing'
                              : app.status === 'fulfilled_promo'
                              ? 'Promo'
                              : app.status}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                          {app.created_at
                            ? new Date(app.created_at).toISOString().split('T')[0]
                            : '—'}
                        </td>

                        {/* Action */}
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <SendBetaEmailButton
                            email={app.email}
                            parentName={app.parent_full_name}
                            teenName={firstStudentName}
                          />
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
              <p className="uppercase tracking-widest text-xs">
                0 Records Matched Current Filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
