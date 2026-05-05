import { Metadata } from 'next';
import Link from 'next/link';
import { MessageSquare, ArrowLeft, Users } from 'lucide-react';
import { listDiscussionCategories } from '@/lib/data/discussions';
import { requireAuth } from '@/lib/auth/permissions';
import { headers } from 'next/headers';
import { RoleBadge } from '@/components/discussions/UserAvatar';

export const metadata: Metadata = {
  title: 'Discussion Board | PlayIQ',
  description: 'Connect and discuss with the PlayIQ community.',
};

export default async function DiscussionsLayout({ children }: { children: React.ReactNode }) {
  const categories = await listDiscussionCategories();
  
  const req = new Request('http://localhost', { headers: await headers() });
  const user = await requireAuth(req).catch(() => null);
  const userRole = user?.primary_role || 'student';
  
  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#0a0f1e' }}>
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/${userRole}/home`} className="flex items-center gap-1.5 text-xs font-medium transition-colors w-fit mb-4" style={{ color: '#94a3b8' }}
            onMouseOver={e => (e.currentTarget.style.color = '#00c8ff')}
            onMouseOut={e => (e.currentTarget.style.color = '#94a3b8')}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.25)' }}>
                <MessageSquare style={{ color: '#00c8ff' }} className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-tight font-display">PlayIQ Discussions</h1>
                <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>Ask questions, share builds, help others</p>
              </div>
            </div>
            {user && (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs" style={{ color: '#64748b' }}>{user.full_name || 'User'}</span>
                <RoleBadge role={user.primary_role} />
              </div>
            )}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28">
              <div className="rounded-lg overflow-hidden" style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(123,79,206,0.2)' }}>
                <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(123,79,206,0.15)', background: 'rgba(17,24,39,0.9)' }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#7b4fce' }}>Categories</h2>
                </div>
                <nav className="py-1">
                  {categories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`/discussions/${cat.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors group"
                      style={{ color: '#94a3b8' }}
                    >
                      <span className="text-xs font-bold transition-colors" style={{ color: '#00c8ff' }}>#</span>
                      <span className="truncate group-hover:text-white transition-colors">{cat.title}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Community info */}
              <div className="mt-4 rounded-lg p-4" style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(123,79,206,0.2)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4" style={{ color: '#7b4fce' }} />
                  <h3 className="text-sm font-bold">About PlayIQ Community</h3>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>
                  A space for PlayIQ learners, parents, and educators to connect, share wins, ask questions, and grow together.
                </p>
                {user?.primary_role === 'parent' && (
                  <div className="mt-3 px-3 py-2 rounded text-xs" style={{ background: 'rgba(0,200,255,0.08)', border: '1px solid rgba(0,200,255,0.2)', color: '#00c8ff' }}>
                    👁 You have read-only access as a parent.
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Mobile category pills */}
            <div className="lg:hidden mb-4">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <Link href="/discussions" className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors" style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(123,79,206,0.3)', color: '#94a3b8' }}>
                  All
                </Link>
                {categories.map((cat: any) => (
                  <Link key={cat.id} href={`/discussions/${cat.slug}`} className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors" style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(123,79,206,0.3)', color: '#94a3b8' }}>
                    # {cat.title}
                  </Link>
                ))}
              </div>
            </div>

            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
