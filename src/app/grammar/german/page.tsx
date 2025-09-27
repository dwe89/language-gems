import { Metadata } from 'next';
import GermanGrammarClient from './GermanGrammarClient';

export const metadata: Metadata = {
  title: 'German Grammar Guide - Complete Learning Resource | Language Gems',
  description: 'Master German grammar with comprehensive guides covering verbs, nouns, cases, adjectives, and more. Interactive lessons, practice exercises, and quizzes for all levels.',
  keywords: 'german grammar, learn german, german verbs, german cases, german nouns, german lessons, grammar guide, language learning',
  openGraph: {
    title: 'German Grammar Guide - Complete Learning Resource | Language Gems',
    description: 'Master German grammar with comprehensive guides covering verbs, nouns, cases, adjectives, and more. Interactive lessons, practice exercises, and quizzes for all levels.',
    type: 'website',
    url: 'https://languagegems.com/grammar/german',
    images: [
      {
        url: 'https://languagegems.com/images/german-grammar-og.jpg',
        width: 1200,
        height: 630,
        alt: 'German Grammar Guide - Language Gems'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German Grammar Guide - Complete Learning Resource | Language Gems',
    description: 'Master German grammar with comprehensive guides covering verbs, nouns, cases, adjectives, and more. Interactive lessons, practice exercises, and quizzes for all levels.',
    images: ['https://languagegems.com/images/german-grammar-og.jpg']
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/german'
  }
};

export default function GermanGrammarPage() {
  return <GermanGrammarClient />;
}
