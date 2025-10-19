import { Metadata } from 'next';
import GermanCasesClient from './GermanCasesClient';

export const metadata: Metadata = {
  title: 'German Cases - Complete Guide to Nominativ, Akkusativ, Dativ, Genitiv | Language Gems',
  description: 'Master the four German cases with comprehensive guides, examples, and practice exercises. Essential for German grammar mastery.',
  keywords: 'german cases, nominativ akkusativ dativ genitiv, german grammar cases, der die das, german articles, case system german',
  openGraph: {
    title: 'German Cases - Complete Guide to Nominativ, Akkusativ, Dativ, Genitiv | Language Gems',
    description: 'Master the four German cases with comprehensive guides, examples, and practice exercises. Essential for German grammar mastery.',
    type: 'website',
    url: 'https://languagegems.com/grammar/german/cases',
    images: [
      {
        url: 'https://languagegems.com/images/german-cases-og.jpg',
        width: 1200,
        height: 630,
        alt: 'German Cases Guide - Language Gems'
      }
    ]
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/german/cases'
  }
};

export default function GermanCasesPage() {
  return <GermanCasesClient />;
}
