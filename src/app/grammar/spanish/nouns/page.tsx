import { Metadata } from 'next';
import React from 'react';
import { SpanishNounsClient } from './SpanishNounsClient';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Spanish Nouns - Gender, Articles & Plurals Guide | Language Gems',
  description: 'Master Spanish nouns with comprehensive guides covering gender rules, articles (el, la, los, las), and plural formation. Interactive practice and quizzes.',
  keywords: 'spanish nouns, spanish gender, spanish articles, el la los las, spanish plurals, noun gender rules',
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/nouns'
  },
  openGraph: {
    title: 'Spanish Nouns - Gender, Articles & Plurals Guide | Language Gems',
    description: 'Master Spanish nouns with comprehensive guides and interactive practice.',
    url: 'https://languagegems.com/grammar/spanish/nouns',
    siteName: 'Language Gems',
    locale: 'en_US',
    type: 'website',
  }
};

export default function SpanishNounsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationalResource',
            name: 'Spanish Nouns Guide',
            description: 'Complete guide to Spanish nouns including gender, articles, and plural formation',
            url: 'https://languagegems.com/grammar/spanish/nouns',
            author: {
              '@type': 'Organization',
              name: 'Language Gems'
            },
            educationalLevel: ['beginner', 'intermediate'],
            learningResourceType: 'Grammar Guide',
            inLanguage: 'es',
            about: {
              '@type': 'Thing',
              name: 'Spanish Nouns',
              description: 'Spanish noun gender, articles, and plural formation'
            }
          })
        }}
      />

      <SpanishNounsClient />
    </>
  );
}
