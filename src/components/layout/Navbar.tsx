import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
          Play<span className="text-indigo-600">IQ</span>
        </Link>
        <div className="hidden md:flex flex-row gap-8 items-center">
          <Link href="/apprentice" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Apprentice</Link>
          <Link href="/parents" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Parents</Link>
          <Link href="/how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How It Works</Link>
          <Link href="/proof" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Proof</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block">Log In</Link>
          <Link href="/beta" className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-indigo-600 hover:bg-indigo-500 transition-all">
            Join Beta
          </Link>
        </div>
      </div>
    </nav>
  );
}
