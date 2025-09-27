import { Metadata } from 'next';
import GrammarIndexClient from './GrammarIndexClient';

export const metadata: Metadata = {
  title: 'Grammar Guides - Spanish, French & German | Language Gems',
  description: 'Master grammar in Spanish, French, and German with comprehensive guides, interactive exercises, and quizzes. Perfect for all skill levels.',
  keywords: 'grammar guides, spanish grammar, french grammar, german grammar, language learning, grammar rules, conjugation, tenses',
  openGraph: {
    title: 'Grammar Guides - Spanish, French & German | Language Gems',
    description: 'Master grammar in Spanish, French, and German with comprehensive guides, interactive exercises, and quizzes. Perfect for all skill levels.',
    type: 'website',
    url: 'https://languagegems.com/grammar',
    images: [
      {
        url: 'https://languagegems.com/images/grammar-guides-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Grammar Guides - Language Gems'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grammar Guides - Spanish, French & German | Language Gems',
    description: 'Master grammar in Spanish, French, and German with comprehensive guides, interactive exercises, and quizzes. Perfect for all skill levels.',
    images: ['https://languagegems.com/images/grammar-guides-twitter.jpg']
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar'
  }
};

export default function GrammarIndexPage() {
  return <GrammarIndexClient />;
}


