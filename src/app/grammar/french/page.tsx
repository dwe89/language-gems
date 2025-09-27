import { Metadata } from 'next';
import FrenchGrammarClient from './FrenchGrammarClient';

export const metadata: Metadata = {
  title: 'French Grammar Guide - Complete Learning Resource | Language Gems',
  description: 'Master French grammar with comprehensive guides covering verbs, nouns, adjectives, and more. Interactive lessons, practice exercises, and quizzes for all levels.',
  keywords: 'french grammar, learn french, french verbs, french nouns, french lessons, grammar guide, language learning',
  openGraph: {
    title: 'French Grammar Guide - Complete Learning Resource | Language Gems',
    description: 'Master French grammar with comprehensive guides covering verbs, nouns, adjectives, and more. Interactive lessons, practice exercises, and quizzes for all levels.',
    type: 'website',
    url: 'https://languagegems.com/grammar/french',
    images: [
      {
        url: 'https://languagegems.com/images/french-grammar-og.jpg',
        width: 1200,
        height: 630,
        alt: 'French Grammar Guide - Language Gems'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'French Grammar Guide - Complete Learning Resource | Language Gems',
    description: 'Master French grammar with comprehensive guides covering verbs, nouns, adjectives, and more. Interactive lessons, practice exercises, and quizzes for all levels.',
    images: ['https://languagegems.com/images/french-grammar-twitter.jpg']
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/french'
  }
};

export default function FrenchGrammarPage() {
  return <FrenchGrammarClient />;
}
