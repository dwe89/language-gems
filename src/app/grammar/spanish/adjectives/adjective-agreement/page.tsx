import { Metadata } from 'next';
import GrammarTopicTemplate from '../../../../../components/grammar/GrammarTopicTemplate';
export const metadata: Metadata = {
  title: 'Spanish Adjective Agreement - LanguageGems',
  description: 'Master Spanish adjective agreement rules with comprehensive lessons and practice exercises. Learn how adjectives change to match nouns in gender and number.',
  keywords: 'Spanish adjectives, adjective agreement, Spanish grammar, gender agreement, number agreement, masculine feminine, singular plural',
  openGraph: {
    title: 'Spanish Adjective Agreement - LanguageGems',
    description: 'Master Spanish adjective agreement rules with comprehensive lessons and practice exercises.',
    type: 'article',
  },
};

export default function SpanishAdjectiveAgreementPage() {
  return (
    <GrammarTopicTemplate
      language="spanish"
      category="adjectives"
      topic="adjective-agreement"
      title="Adjective Agreement"
      description="Learn how Spanish adjectives agree with nouns in gender and number"
      backUrl="/grammar/spanish"
      content={{
        overview: "Master Spanish adjective agreement rules to match adjectives with nouns correctly.",
        keyPoints: [
          "Adjectives must agree with nouns in gender (masculine/feminine)",
          "Adjectives must agree with nouns in number (singular/plural)",
          "Masculine singular: -o (alto), feminine singular: -a (alta)",
          "Masculine plural: -os (altos), feminine plural: -as (altas)",
          "Some adjectives end in -e or consonants and don't change for gender"
        ],
        examples: [
          {
            spanish: "el chico alto, la chica alta",
            english: "the tall boy, the tall girl",
            explanation: "Adjective changes from -o to -a to match gender"
          },
          {
            spanish: "los libros interesantes, las películas interesantes",
            english: "the interesting books, the interesting movies",
            explanation: "Adjective ending in -e doesn't change for gender, only adds -s for plural"
          }
        ]
      }}
    />
  );
}
