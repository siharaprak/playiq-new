import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { StudentNav } from '@/components/layout/StudentNav';

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single();

  const name = profile?.full_name || profile?.email || 'Student';
  const initials = name.substring(0, 2).toUpperCase();

  return (
    // Offset the root layout's pt-24 (public nav) — student pages use their own nav
    <div className="!pt-0 -mt-24 min-h-screen" style={{ backgroundColor: '#0a0f1e' }}>
      <StudentNav userName={name} initials={initials} />

      {/* Main content — push right on desktop to clear sidebar, add top padding on mobile for the bar */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
