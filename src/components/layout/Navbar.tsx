'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/apprentice', label: 'THE APPRENTICE' },
  { href: '/how-it-works', label: 'HOW IT WORKS' },
  { href: '/parents', label: 'PARENTS' },
  { href: '/proof', label: 'OUR PROOF' },
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
      } catch (err) {
        console.error("Auth check failed", err);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [pathname]);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[98%] max-w-[1400px]">
      <div className="glass-card flex items-center justify-between px-8 py-4 rounded-none border-t-[3px] border-t-[#00f2ff]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <span className="font-display font-black text-2xl tracking-[0.2em] text-[#e2e8f0] group-hover:text-[#00f2ff] transition-colors drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]">
            PLAY<span className="text-[#ff00ff]">IQ</span>_
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-5 flex-shrink-0">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-[0.65rem] xl:text-[0.75rem] font-bold uppercase tracking-[0.15em] xl:tracking-[0.2em] text-[#94a3b8] hover:text-[#ff00ff] hover:text-glow-magenta transition-colors duration-300 before:content-['['] before:mr-1 before:text-[#00f2ff] after:content-[']'] after:ml-1 after:text-[#00f2ff] whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 xl:gap-4 flex-shrink-0 min-w-[100px] justify-end">
          {!isLoading && (
            <Link
              href={userRole ? `/${userRole}/home` : "/login"}
              className={`hidden sm:block font-display text-[0.65rem] xl:text-[0.7rem] font-bold uppercase tracking-[0.15em] hover:text-[#00f2ff] transition-colors whitespace-nowrap ml-4 ${userRole ? 'text-[#ff00ff]' : 'text-slate-400'}`}
            >
              &gt; {userRole ? "DASHBOARD" : "LOG IN"}
            </Link>
          )}

          <button
            className="lg:hidden text-[#00f2ff] p-1 ml-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="glass-card mt-2 p-4 lg:hidden border-l-[3px] border-l-[#ff00ff] border-r-0 border-b-0 border-t-0 rounded-none">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-xs font-bold uppercase tracking-[0.2em] text-slate-300 hover:text-[#00f2ff] transition-colors py-2 px-3 hover:bg-[rgba(0,242,255,0.1)] border-l-2 border-transparent hover:border-[#00f2ff]"
              >
                &gt; {link.label}
              </Link>
            ))}
            {!isLoading && (
              <Link
                href={userRole ? `/${userRole}/home` : "/login"}
                onClick={() => setMobileOpen(false)}
                className={`font-display text-xs font-bold uppercase tracking-[0.2em] py-2 px-3 border-t border-[rgba(255,0,255,0.2)] mt-2 ${userRole ? 'text-[#00f2ff]' : 'text-[#ff00ff]'}`}
              >
                &gt; {userRole ? "DASHBOARD" : "LOG IN"}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
