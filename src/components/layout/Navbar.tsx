'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, MessageSquare, LayoutDashboard, BookOpen, Settings, ChevronDown } from 'lucide-react';
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
  { href: '/student/modules/11/overview', label: 'Capstone', sub: 'Master Trial' },
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

  // Hide entire navbar during the assessment for a fully immersive Orion experience
  if (pathname?.startsWith('/student/assessment')) return null;

  const homeHref = !isLoading && userRole 
    ? (userRole === 'admin' ? '/admin/home' : userRole === 'parent' ? '/parent/home' : '/student/home') 
    : '/';

  const baseLinkClass = "outline-none font-display text-[0.65rem] xl:text-[0.75rem] font-bold uppercase tracking-[0.15em] xl:tracking-[0.2em] transition-colors duration-300 before:content-['['] before:mr-1 before:text-[#00c8ff] after:content-[']'] after:ml-1 after:text-[#00c8ff] whitespace-nowrap";
  const inactiveLinkClass = "text-[#94a3b8] hover:text-[#7b4fce] hover:text-glow-magenta focus-visible:text-[#7b4fce]";
  const activeLinkClass = "text-[#00c8ff] text-glow-cyan";

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[98%] max-w-[1400px]">
      <div className="glass-card flex items-center justify-between px-8 py-4 rounded-none border-t-[3px] border-t-[#00c8ff]">

        {/* Logo */}
        <Link href={homeHref} className="flex items-center gap-2 flex-shrink-0 group" aria-label="PlayIQ Home">
          <PlayIQLogo variant="navbar" className="group-hover:brightness-125 transition-all duration-300" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-4 flex-shrink-0">
          {/* Public links (only shown for guest users) */}
          {!userRole && publicNavLinks.map((link) => {
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
              <Link href={userRole === 'parent' ? '/parent/home' : userRole === 'admin' ? '/admin/home' : '/student/home'} className={`${baseLinkClass} ${pathname.startsWith('/parent/home') || pathname.startsWith('/admin/home') || pathname.startsWith('/student/home') || pathname.startsWith('/student/modules') ? activeLinkClass : inactiveLinkClass}`}>
                {userRole === 'parent' || userRole === 'admin' ? 'DASHBOARD' : 'MODULES'}
              </Link>
              <Link href="/discussions" className={`${baseLinkClass} ${pathname.startsWith('/discussions') ? activeLinkClass : inactiveLinkClass}`}>
                DISCUSSIONS
              </Link>
              <Link href="/settings" className={`${baseLinkClass} ${pathname.startsWith('/settings') ? activeLinkClass : inactiveLinkClass}`}>
                SETTINGS
              </Link>

              {/* Hover dropdown for marketing pages when logged in */}
              <div className="relative group/more inline-block">
                <button className={`flex items-center gap-1 cursor-pointer bg-transparent border-none ${baseLinkClass} ${inactiveLinkClass}`}>
                  MORE <ChevronDown size={10} className="w-2.5 h-2.5 group-hover/more:rotate-180 transition-transform duration-300 text-[#00c8ff]" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 opacity-0 invisible group-hover/more:opacity-100 group-hover/more:visible transition-all duration-300 translate-y-2 group-hover/more:translate-y-0 z-50">
                  <div className="glass-card border border-[var(--space-card-border)] p-2 rounded shadow-2xl flex flex-col gap-1.5 backdrop-blur-md" style={{ backgroundColor: 'var(--space-card)' }}>
                    {publicNavLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2 text-[0.65rem] font-bold tracking-[0.1em] text-[var(--text-secondary)] hover:text-[#00c8ff] hover:bg-[rgba(0,200,255,0.06)] transition-all duration-200 uppercase font-display border-l-2 border-transparent hover:border-[#00c8ff]"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
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
                <form action="/auth/signout" method="post" className="inline">
                  <button type="submit" className="font-display text-[0.65rem] xl:text-[0.7rem] font-bold uppercase tracking-[0.15em] hover:text-red-400 text-slate-400 transition-colors whitespace-nowrap cursor-pointer">
                    &gt; LOG OUT
                  </button>
                </form>
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
            {/* Authenticated user mobile menu */}
            {!isLoading && userRole && (
              <>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600 px-3 py-2">My Learning</p>
                <Link href={userRole === 'parent' ? '/parent/home' : userRole === 'admin' ? '/admin/home' : '/student/home'} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-slate-300 hover:text-[#00c8ff] transition-colors py-2 px-3 hover:bg-[rgba(0,200,255,0.08)] rounded-lg">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                </Link>
                {(userRole === 'student' || userRole === 'admin') && studentModuleLinks.map((mod) => (
                  <Link key={mod.href} href={mod.href} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-slate-300 hover:text-[#00c8ff] transition-colors py-2 px-3 hover:bg-[rgba(0,200,255,0.08)] rounded-lg">
                    <BookOpen className="w-3.5 h-3.5" /> {mod.label}
                    <span className="text-[9px] text-slate-600 normal-case tracking-normal font-normal ml-1 truncate max-w-[150px]">— {mod.sub}</span>
                  </Link>
                ))}
                <Link href="/discussions" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-slate-300 hover:text-[#00c8ff] transition-colors py-2 px-3 hover:bg-[rgba(0,200,255,0.08)] rounded-lg">
                  <MessageSquare className="w-3.5 h-3.5" /> Discussions
                </Link>
                <Link href="/settings" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-slate-300 hover:text-[#00c8ff] transition-colors py-2 px-3 hover:bg-[rgba(0,200,255,0.08)] rounded-lg mb-2">
                  <Settings className="w-3.5 h-3.5" /> Settings
                </Link>

                {/* Secondary Site Links section for logged in mobile users */}
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600 px-3 py-2 border-t border-[rgba(123,79,206,0.15)] mt-2">Explore Site</p>
                {publicNavLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                    className="font-display text-xs font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-[#00c8ff] transition-colors py-2 px-3 hover:bg-[rgba(0,200,255,0.08)] border-l-2 border-transparent hover:border-[#00c8ff]">
                    &gt; {link.label}
                  </Link>
                ))}
              </>
            )}

            {/* Public mobile nav only shown for guests */}
            {!userRole && publicNavLinks.map((link) => (
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
                  <form action="/auth/signout" method="post">
                    <button type="submit" className="font-display text-xs font-bold uppercase tracking-[0.2em] py-2 px-3 text-red-400 hover:text-white transition-colors cursor-pointer w-full text-left">
                      &gt; LOG OUT
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
