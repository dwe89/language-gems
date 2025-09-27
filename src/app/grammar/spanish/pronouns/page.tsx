import { Metadata } from 'next';
import SpanishPronounsClient from './SpanishPronounsClient';

export const metadata: Metadata = {
  title: 'Spanish Pronouns - Complete Guide to Personal, Possessive & Object Pronouns | Language Gems',
  description: 'Master Spanish pronouns with comprehensive guides covering personal, possessive, direct object, indirect object, and reflexive pronouns.',
  keywords: 'spanish pronouns, personal pronouns spanish, possessive pronouns spanish, object pronouns spanish, reflexive pronouns spanish, spanish grammar pronouns',
  openGraph: {
    title: 'Spanish Pronouns - Complete Guide to Personal, Possessive & Object Pronouns | Language Gems',
    description: 'Master Spanish pronouns with comprehensive guides covering personal, possessive, direct object, indirect object, and reflexive pronouns.',
    type: 'website',
    url: 'https://languagegems.com/grammar/spanish/pronouns',
    images: [
      {
        url: 'https://languagegems.com/images/spanish-pronouns-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Spanish Pronouns Guide - Language Gems'
      }
    ]
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/pronouns'
  }
};

export default function SpanishPronounsPage() {
  return <SpanishPronounsClient />;
}
