'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Home,
  Layers,
  MessageSquare,
  LogOut,
  ChevronRight,
  Menu,
  X,
  BookOpen,
  Lock,
} from 'lucide-react';
import { PlayIQLogo } from '@/components/layout/PlayIQLogo';

const navItems = [
  {
    href: '/student/home',
    label: 'Dashboard',
    icon: Home,
    match: (p: string) => p === '/student/home',
  },
  {
    href: '/student/modules/1/overview',
    label: 'Module 1',
    sublabel: 'AI Learning Code',
    icon: Layers,
    match: (p: string) => p.startsWith('/student/modules/1'),
  },
  {
    href: '/student/modules/2/overview',
    label: 'Module 2',
    sublabel: 'Digital Smarts',
    icon: BookOpen,
    match: (p: string) => p.startsWith('/student/modules/2'),
  },
  {
    href: '/discussions',
    label: 'Discussions',
    sublabel: 'Engagement Board',
    icon: MessageSquare,
    match: (p: string) => p.startsWith('/discussions'),
  },
];

async function handleSignOut() {
  const { createClient } = await import('@/utils/supabase/client');
  const supabase = createClient();
  await supabase.auth.signOut();
  window.location.href = '/';
}

export function StudentNav({ userName, initials }: { userName: string; initials: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── DESKTOP SIDEBAR ─────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 z-40"
        style={{
          background: 'rgba(10,15,30,0.97)',
          borderRight: '1px solid rgba(123,79,206,0.2)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b" style={{ borderColor: 'rgba(123,79,206,0.15)' }}>
          <Link href="/student/home" aria-label="Student Home">
            <PlayIQLogo variant="navbar" className="hover:brightness-125 transition-all duration-300" />
          </Link>
        </div>

        {/* User badge */}
        <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(123,79,206,0.12)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #7b4fce, #00c8ff)', color: '#fff' }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{userName}</p>
              <p className="text-[10px] uppercase tracking-widest" style={{ color: '#7b4fce' }}>Student</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <p
            className="text-[9px] font-bold uppercase tracking-[0.2em] px-3 mb-3"
            style={{ color: '#475569' }}
          >
            Learning Path
          </p>
          {navItems.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative"
                style={{
                  background: active ? 'rgba(123,79,206,0.15)' : 'transparent',
                  border: active ? '1px solid rgba(123,79,206,0.35)' : '1px solid transparent',
                }}
              >
                {active && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                    style={{ background: '#00c8ff' }}
                  />
                )}
                <Icon
                  className="w-4 h-4 flex-shrink-0 transition-colors"
                  style={{ color: active ? '#00c8ff' : '#64748b' }}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-semibold leading-tight"
                    style={{ color: active ? '#fff' : '#94a3b8' }}
                  >
                    {item.label}
                  </p>
                  {item.sublabel && (
                    <p className="text-[10px] leading-tight mt-0.5" style={{ color: active ? '#7b4fce' : '#475569' }}>
                      {item.sublabel}
                    </p>
                  )}
                </div>
                <ChevronRight
                  className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: '#00c8ff' }}
                />
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(123,79,206,0.15)' }}>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all group"
            style={{ color: '#64748b' }}
          >
            <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" />
            <span className="text-sm font-medium group-hover:text-red-400 transition-colors">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ──────────────────────────────────── */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{
          background: 'rgba(10,15,30,0.97)',
          borderBottom: '1px solid rgba(123,79,206,0.2)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Link href="/student/home">
          <PlayIQLogo variant="navbar" className="scale-90 hover:brightness-125 transition-all" />
        </Link>

        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
            style={{ background: 'linear-gradient(135deg, #7b4fce, #00c8ff)', color: '#fff' }}
          >
            {initials}
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: '#00c8ff' }}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 pt-16"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute top-16 left-0 right-0 shadow-2xl"
            style={{ background: 'rgba(10,15,30,0.99)', borderBottom: '1px solid rgba(123,79,206,0.25)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 space-y-1">
              {navItems.map((item) => {
                const active = item.match(pathname);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                    style={{
                      background: active ? 'rgba(123,79,206,0.15)' : 'transparent',
                      border: active ? '1px solid rgba(123,79,206,0.3)' : '1px solid transparent',
                    }}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: active ? '#00c8ff' : '#64748b' }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: active ? '#fff' : '#94a3b8' }}>{item.label}</p>
                      {item.sublabel && <p className="text-[10px]" style={{ color: '#475569' }}>{item.sublabel}</p>}
                    </div>
                  </Link>
                );
              })}
              <div className="border-t pt-3 mt-3" style={{ borderColor: 'rgba(123,79,206,0.15)' }}>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg w-full"
                  style={{ color: '#64748b' }}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
