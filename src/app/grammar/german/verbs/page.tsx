import { Metadata } from 'next';
import GermanVerbsClient from './GermanVerbsClient';

export const metadata: Metadata = {
  title: 'German Verbs - Complete Conjugation Guide | Language Gems',
  description: 'Master German verb conjugations, tenses, and modal verbs. Comprehensive guide covering present, past, future, and subjunctive forms.',
  keywords: 'german verbs, german conjugation, german tenses, modal verbs german, german grammar verbs, verb conjugation german',
  openGraph: {
    title: 'German Verbs - Complete Conjugation Guide | Language Gems',
    description: 'Master German verb conjugations, tenses, and modal verbs. Comprehensive guide covering present, past, future, and subjunctive forms.',
    type: 'website',
    url: 'https://languagegems.com/grammar/german/verbs',
    images: [
      {
        url: 'https://languagegems.com/images/german-verbs-og.jpg',
        width: 1200,
        height: 630,
        alt: 'German Verbs Guide - Language Gems'
      }
    ]
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/german/verbs'
  }
};

export default function GermanVerbsPage() {
  return <GermanVerbsClient />;
}
