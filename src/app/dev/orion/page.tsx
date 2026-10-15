import { notFound } from 'next/navigation';
import { OrionCharacter } from '@/components/guided-ai/OrionCharacter';

export const metadata = {
  title: 'Orion preview (dev)',
  robots: { index: false },
};

/** Development-only stage for checking Orion's poses without signing in. */
export default function OrionDevPreviewPage() {
  if (process.env.NODE_ENV !== 'development') notFound();
  return (
    <main className="mx-auto max-w-md space-y-6 p-8">
      <h1 className="text-lg font-bold text-[var(--text-primary)]">Orion preview</h1>
      <OrionCharacter studentName="Tester" />
      <div className="max-w-xs">
        <OrionCharacter compact studentName="Tester" />
      </div>
    </main>
  );
}
