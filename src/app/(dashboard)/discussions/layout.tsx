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
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/${userRole}/home`} className="text-slate-500 hover:text-slate-300 flex items-center gap-1.5 text-xs font-medium transition-colors w-fit mb-4">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-indigo-400 w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-tight">PlayIQ Discussions</h1>
                <p className="text-slate-500 text-xs">Ask questions, share builds, help others</p>
              </div>
            </div>
            {user && (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs text-slate-500">{user.full_name || 'User'}</span>
                <RoleBadge role={user.primary_role} />
              </div>
            )}
          </div>
        </div>
        
        {/* Two-column layout */}
        <div className="flex gap-6">
          {/* Sidebar — categories */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28">
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-800/80">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Categories</h2>
                </div>
                <nav className="py-1">
                  {categories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`/discussions/${cat.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/40 hover:text-white transition-colors group"
                    >
                      <span className="text-indigo-400 text-xs font-bold group-hover:text-indigo-300">#</span>
                      <span className="truncate">{cat.title}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Community info */}
              <div className="mt-4 bg-slate-800/60 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold">About PlayIQ Community</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  This is a space for PlayIQ learners, parents, and educators to connect, share wins, ask questions, and grow together.
                </p>
                {user?.primary_role === 'parent' && (
                  <div className="mt-3 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs text-emerald-400">
                    👁 You have read-only access as a parent.
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Mobile category selector */}
            <div className="lg:hidden mb-4">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <Link
                  href="/discussions"
                  className="shrink-0 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-xs font-medium text-slate-300 hover:border-indigo-500/50 hover:text-indigo-300 transition-colors"
                >
                  All
                </Link>
                {categories.map((cat: any) => (
                  <Link
                    key={cat.id}
                    href={`/discussions/${cat.slug}`}
                    className="shrink-0 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-xs font-medium text-slate-300 hover:border-indigo-500/50 hover:text-indigo-300 transition-colors"
                  >
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
