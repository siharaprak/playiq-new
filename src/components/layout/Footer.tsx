import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between">
        <div className="flex justify-center flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 md:order-2">
          <Link href="/approach" className="text-sm text-gray-500 hover:text-gray-900">Our Approach</Link>
          <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900">Contact & Support</Link>
          <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</Link>
          <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</Link>
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-sm text-gray-500">&copy; 2026 PlayIQ Learning. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
