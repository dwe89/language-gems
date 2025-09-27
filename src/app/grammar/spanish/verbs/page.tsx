import { Metadata } from 'next';
import React from 'react';
import { SpanishVerbsClient } from './SpanishVerbsClient';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Spanish Verbs - Complete Conjugation Guide | Language Gems',
  description: 'Master Spanish verb conjugations with comprehensive guides covering present tense, past tense, future, subjunctive, and irregular verbs. Interactive practice and quizzes.',
  keywords: 'spanish verbs, spanish conjugation, present tense, past tense, subjunctive, irregular verbs, ser vs estar',
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/verbs'
  },
  openGraph: {
    title: 'Spanish Verbs - Complete Conjugation Guide | Language Gems',
    description: 'Master Spanish verb conjugations with comprehensive guides and interactive practice.',
    url: 'https://languagegems.com/grammar/spanish/verbs',
    siteName: 'Language Gems',
    locale: 'en_US',
    type: 'website',
  }
};

export default function SpanishVerbsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationalResource',
            name: 'Spanish Verbs Guide',
            description: 'Complete guide to Spanish verb conjugations including present, past, future, and subjunctive tenses',
            url: 'https://languagegems.com/grammar/spanish/verbs',
            author: {
              '@type': 'Organization',
              name: 'Language Gems'
            },
            educationalLevel: ['beginner', 'intermediate', 'advanced'],
            learningResourceType: 'Grammar Guide',
            inLanguage: 'es',
            about: {
              '@type': 'Thing',
              name: 'Spanish Verbs',
              description: 'Spanish verb conjugations, tenses, and irregular verbs'
            }
          })
        }}
      />

      <SpanishVerbsClient />
    </>
  );
}
