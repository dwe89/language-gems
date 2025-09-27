import { Metadata } from 'next';
import React from 'react';
import { ArrowLeft, BookOpen, Target, Award, Clock, Users, Gem, Star, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../../components/ui/GemTheme';
import FlagIcon from '../../../components/ui/FlagIcon';
import { SpanishGrammarClient } from './SpanishGrammarClient';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Spanish Grammar Guide - Complete Learning Resource | Language Gems',
  description: 'Master Spanish grammar with comprehensive guides covering verbs, nouns, adjectives, and more. Interactive lessons, practice exercises, and quizzes for all levels.',
  keywords: 'spanish grammar, learn spanish, spanish verbs, spanish nouns, spanish lessons, grammar guide, language learning',
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish'
  },
  openGraph: {
    title: 'Spanish Grammar Guide - Complete Learning Resource | Language Gems',
    description: 'Master Spanish grammar with comprehensive guides covering verbs, nouns, adjectives, and more.',
    url: 'https://languagegems.com/grammar/spanish',
    siteName: 'Language Gems',
    locale: 'en_US',
    type: 'website',
  }
};

export default function SpanishGrammarPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationalResource',
            name: 'Spanish Grammar Guide',
            description: 'Comprehensive Spanish grammar learning resource with interactive lessons and exercises',
            url: 'https://languagegems.com/grammar/spanish',
            author: {
              '@type': 'Organization',
              name: 'Language Gems'
            },
            educationalLevel: ['beginner', 'intermediate', 'advanced'],
            learningResourceType: 'Grammar Guide',
            inLanguage: 'es',
            about: {
              '@type': 'Thing',
              name: 'Spanish Grammar',
              description: 'Complete guide to Spanish grammar including verbs, nouns, adjectives, and pronouns'
            }
          })
        }}
      />

      <SpanishGrammarClient />
    </>
  );
}
