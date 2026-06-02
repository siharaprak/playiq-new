'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, MessageSquare, LayoutDashboard, BookOpen, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { PlayIQLogo } from './PlayIQLogo';

const publicNavLinks = [
  { href: '/', label: 'HOME' },
  { href: '/apprentice', label: 'THE APPRENTICE' },
  { href: '/how-it-works', label: 'HOW IT WORKS' },
  { href: '/parents', label: 'PARENTS' },
  { href: '/proof', label: 'OUR PROOF' },
];

const studentModuleLinks = [
  { href: '/student/modules/1/overview', label: 'Module 1', sub: 'AI Learning Code' },
  { href: '/student/modules/2/overview', label: 'Module 2', sub: 'Digital Smarts & Human Responsibility' },
  { href: '/student/modules/3/overview', label: 'Module 3', sub: 'Pre-Learn System' },
  { href: '/student/modules/4/overview', label: 'Module 4', sub: 'Lesson Rescue Mode' },
  { href: '/student/modules/5/overview', label: 'Module 5', sub: 'Compression Learning' },
  { href: '/student/modules/6/overview', label: 'Module 6', sub: 'Self-Testing and Mistake Bank' },
  { href: '/student/modules/7/overview', label: 'Module 7', sub: 'Notes and Study Pack Creation' },
  { href: '/student/modules/8/overview', label: 'Module 8', sub: 'Writing and Answer Clarity' },
  { href: '/student/modules/9/overview', label: 'Module 9', sub: 'Build Your AI Tutor' },
  { href: '/student/modules/10/overview', label: 'Module 10', sub: 'Build Your AI Assistant' },
  { href: '/student/modules/capstone/overview', label: 'Capstone', sub: 'Master Trial' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { createClient } = await import('@/utils/supabase/client');
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
          setUserRole(profile?.role || 'student');
        } else {
          setUserRole(null);
        }
      } catch {
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [pathname]);



  const isStudentLoggedIn = !isLoading && (userRole === 'student' || userRole === 'admin');
  const baseLinkClass = "outline-none font-display text-[0.65rem] xl:text-[0.75rem] font-bold uppercase tracking-[0.15em] xl:tracking-[0.2em] transition-colors duration-300 before:content-['['] before:mr-1 before:text-[#00c8ff] after:content-[']'] after:ml-1 after:text-[#00c8ff] whitespace-nowrap";
  const inactiveLinkClass = "text-[#94a3b8] hover:text-[#7b4fce] hover:text-glow-magenta focus-visible:text-[#7b4fce]";
  const activeLinkClass = "text-[#00c8ff] text-glow-cyan";

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[98%] max-w-[1400px]">
      <div className="glass-card flex items-center justify-between px-8 py-4 rounded-none border-t-[3px] border-t-[#00c8ff]">

        {/* Logo */}
        <Link href={isStudentLoggedIn ? '/student/home' : '/'} className="flex items-center gap-2 flex-shrink-0 group" aria-label="PlayIQ Home">
          <PlayIQLogo variant="navbar" className="group-hover:brightness-125 transition-all duration-300" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-4 flex-shrink-0">
          {/* Public links */}
          {publicNavLinks.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} className={`${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                {link.label}
              </Link>
            );
          })}

          {/* Authenticated user nav */}
          {!isLoading && userRole && (
            <>
              {(userRole === 'student' || userRole === 'admin') && (
                <Link href="/student/home" className={`${baseLinkClass} ${pathname.startsWith('/student/home') || pathname.startsWith('/student/modules') ? activeLinkClass : inactiveLinkClass}`}>
                  MODULES
                </Link>
              )}
              <Link href="/discussions" className={`${baseLinkClass} ${pathname.startsWith('/discussions') ? activeLinkClass : inactiveLinkClass}`}>
                DISCUSSIONS
              </Link>
              <Link href="/settings" className={`${baseLinkClass} ${pathname.startsWith('/settings') ? activeLinkClass : inactiveLinkClass}`}>
                SETTINGS
              </Link>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 xl:gap-6 flex-shrink-0 min-w-[80px] justify-end ml-4">
          <ThemeToggle />

          {!isLoading && (
            <div className="hidden sm:flex items-center gap-4">
              <Link
                href={userRole ? `/${userRole}/home` : '/login'}
                className={`font-display text-[0.65rem] xl:text-[0.7rem] font-bold uppercase tracking-[0.15em] hover:text-[#00c8ff] transition-colors whitespace-nowrap ${userRole ? 'text-[#7b4fce]' : 'text-slate-400'}`}
              >
                &gt; {userRole ? 'DASHBOARD' : 'LOG IN'}
              </Link>
              {userRole && (
                <Link
                  href="/auth/signout"
                  className="font-display text-[0.65rem] xl:text-[0.7rem] font-bold uppercase tracking-[0.15em] hover:text-red-400 text-slate-400 transition-colors whitespace-nowrap"
                >
                  &gt; LOG OUT
                </Link>
              )}
            </div>
          )}

          <button
            className="lg:hidden text-[#00c8ff] p-1 ml-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="glass-card mt-2 p-4 lg:hidden border-l-[3px] border-l-[#7b4fce] border-r-0 border-b-0 border-t-0 rounded-none overflow-y-auto max-h-[80vh]">
          <div className="flex flex-col gap-1">
            {isStudentLoggedIn && (
              // Student mobile nav
              <>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600 px-3 py-2">My Learning</p>
                <Link href="/student/home" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-slate-300 hover:text-[#00c8ff] transition-colors py-2 px-3 hover:bg-[rgba(0,200,255,0.08)] rounded-lg">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                </Link>
                {studentModuleLinks.map((mod) => (
                  <Link key={mod.href} href={mod.href} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-slate-300 hover:text-[#00c8ff] transition-colors py-2 px-3 hover:bg-[rgba(0,200,255,0.08)] rounded-lg">
                    <BookOpen className="w-3.5 h-3.5" /> {mod.label}
                    <span className="text-[9px] text-slate-600 normal-case tracking-normal font-normal ml-1 truncate max-w-[150px]">— {mod.sub}</span>
                  </Link>
                ))}
                <Link href="/discussions" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-slate-300 hover:text-[#00c8ff] transition-colors py-2 px-3 hover:bg-[rgba(0,200,255,0.08)] rounded-lg mb-2">
                  <MessageSquare className="w-3.5 h-3.5" /> Discussions
                </Link>
              </>
            )}

            {!isLoading && userRole && (
              <Link href="/settings" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-slate-300 hover:text-[#00c8ff] transition-colors py-2 px-3 hover:bg-[rgba(0,200,255,0.08)] rounded-lg mb-2">
                <Settings className="w-3.5 h-3.5" /> Settings
              </Link>
            )}

            {/* Public mobile nav always shown */}
            {publicNavLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className="font-display text-xs font-bold uppercase tracking-[0.2em] text-slate-300 hover:text-[#00c8ff] transition-colors py-2 px-3 hover:bg-[rgba(0,200,255,0.1)] border-l-2 border-transparent hover:border-[#00c8ff]">
                &gt; {link.label}
              </Link>
            ))}

            {!isLoading && (
              <>
                <Link href={userRole ? `/${userRole}/home` : '/login'} onClick={() => setMobileOpen(false)}
                  className={`font-display text-xs font-bold uppercase tracking-[0.2em] py-2 px-3 border-t border-[rgba(123,79,206,0.2)] mt-2 ${userRole ? 'text-[#00c8ff]' : 'text-[#7b4fce]'}`}>
                  &gt; {userRole ? 'DASHBOARD' : 'LOG IN'}
                </Link>
                {userRole && (
                  <Link href="/auth/signout" onClick={() => setMobileOpen(false)}
                    className="font-display text-xs font-bold uppercase tracking-[0.2em] py-2 px-3 text-red-400 hover:text-white transition-colors">
                    &gt; LOG OUT
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
