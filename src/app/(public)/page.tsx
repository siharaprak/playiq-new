import { buildPublicPageJsonLd } from '@/lib/seo';
import type { Metadata } from 'next';
import HomeContent from './HomeContent';

// Title, description and Open Graph come from the root layout defaults
export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildPublicPageJsonLd('/')).replace(/</g, "\\u003c"),
        }}
      />
      <HomeContent />
    </>
  );
}
