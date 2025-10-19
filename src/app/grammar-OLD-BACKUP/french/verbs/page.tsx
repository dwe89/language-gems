import { Metadata } from 'next';
import FrenchVerbsClient from './FrenchVerbsClient';

export const metadata: Metadata = {
  title: 'French Verbs - Complete Conjugation Guide | Language Gems',
  description: 'Master French verb conjugations with comprehensive guides covering all tenses, moods, and irregular verbs. Interactive practice and quizzes included.',
  keywords: 'french verbs, french conjugation, french tenses, present tense french, passé composé, imparfait, subjunctive french',
  openGraph: {
    title: 'French Verbs - Complete Conjugation Guide | Language Gems',
    description: 'Master French verb conjugations with comprehensive guides covering all tenses, moods, and irregular verbs. Interactive practice and quizzes included.',
    type: 'website',
    url: 'https://languagegems.com/grammar/french/verbs',
    images: [
      {
        url: 'https://languagegems.com/images/french-verbs-og.jpg',
        width: 1200,
        height: 630,
        alt: 'French Verbs Guide - Language Gems'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'French Verbs - Complete Conjugation Guide | Language Gems',
    description: 'Master French verb conjugations with comprehensive guides covering all tenses, moods, and irregular verbs. Interactive practice and quizzes included.',
    images: ['https://languagegems.com/images/french-verbs-twitter.jpg']
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/french/verbs'
  }
};

export default function FrenchVerbsPage() {
  return <FrenchVerbsClient />;
}
