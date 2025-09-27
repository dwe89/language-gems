import { Metadata } from 'next';
import SpanishAdjectivesClient from './SpanishAdjectivesClient';

export const metadata: Metadata = {
  title: 'Spanish Adjectives - Complete Guide to Agreement, Position & Comparison | Language Gems',
  description: 'Master Spanish adjectives with comprehensive guides covering agreement, position, comparison, and demonstrative adjectives.',
  keywords: 'spanish adjectives, adjective agreement spanish, spanish grammar adjectives, comparative superlative spanish, demonstrative adjectives spanish',
  openGraph: {
    title: 'Spanish Adjectives - Complete Guide to Agreement, Position & Comparison | Language Gems',
    description: 'Master Spanish adjectives with comprehensive guides covering agreement, position, comparison, and demonstrative adjectives.',
    type: 'website',
    url: 'https://languagegems.com/grammar/spanish/adjectives',
    images: [
      {
        url: 'https://languagegems.com/images/spanish-adjectives-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Spanish Adjectives Guide - Language Gems'
      }
    ]
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/adjectives'
  }
};

export default function SpanishAdjectivesPage() {
  return <SpanishAdjectivesClient />;
}
