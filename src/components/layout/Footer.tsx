import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full mt-auto relative">
      {/* Top neon line */}
      <div className="neon-line" />

      <div style={{ backgroundColor: '#020617' }} className="py-12 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            {/* Brand */}
            <div className="text-center md:text-left">
              <span className="font-display text-xl font-bold tracking-wider">
                <span className="text-[#00f2ff] text-glow-cyan">PLAY</span>
                <span className="text-[#ff00ff] text-glow-magenta">IQ</span>
              </span>
              <p className="mt-2 text-sm text-slate-500 max-w-xs">
                Imagine. Build. Grow. — The future of hands-on STEM learning.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              <Link href="/how-it-works" className="text-sm text-slate-500 hover:text-[#00f2ff] transition-colors">How It Works</Link>
              <Link href="/parents" className="text-sm text-slate-500 hover:text-[#00f2ff] transition-colors">Parents</Link>
              <Link href="/contact" className="text-sm text-slate-500 hover:text-[#00f2ff] transition-colors">Contact</Link>
              <Link href="#" className="text-sm text-slate-500 hover:text-[#00f2ff] transition-colors">Terms</Link>
              <Link href="#" className="text-sm text-slate-500 hover:text-[#00f2ff] transition-colors">Privacy</Link>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 pt-6 border-t border-slate-800/50">
            <p className="text-center text-xs text-slate-600">
              &copy; {new Date().getFullYear()} PlayIQ Learning. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
