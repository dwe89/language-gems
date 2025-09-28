import { Metadata } from 'next';
import GrammarTopicTemplate from '../../../../../components/grammar/GrammarTopicTemplate';

export const metadata: Metadata = {
  title: 'Spanish Plural Formation - Language Gems',
  description: 'Master Spanish plural formation rules. Learn how to make Spanish nouns plural with comprehensive rules and examples.',
  keywords: 'Spanish plurals, plural formation, Spanish grammar rules, noun plurals Spanish',
};

export default function SpanishPluralFormationPage() {
  return (
    <GrammarTopicTemplate
      language="spanish"
      category="nouns"
      topic="plural-formation"
      title="Plural Formation"
      description="Master the rules for forming plurals in Spanish"
      backUrl="/grammar/spanish"
      content={{
        overview: "Learn the comprehensive rules for forming plurals in Spanish, including regular patterns and exceptions.",
        keyPoints: [
          "Words ending in vowels: add -s (casa → casas)",
          "Words ending in consonants: add -es (animal → animales)",
          "Words ending in -z: change to -ces (lápiz → lápices)",
          "Words ending in stressed vowel + s: add -es (autobús → autobuses)",
          "Some words don't change: crisis → crisis, virus → virus"
        ],
        examples: [
          {
            spanish: "libro → libros",
            english: "book → books",
            explanation: "Vowel ending: add -s"
          },
          {
            spanish: "profesor → profesores",
            english: "teacher → teachers",
            explanation: "Consonant ending: add -es"
          },
          {
            spanish: "feliz → felices",
            english: "happy → happy (plural)",
            explanation: "Z ending: change to -ces"
          },
          {
            spanish: "café → cafés",
            english: "coffee → coffees",
            explanation: "Stressed vowel: add -s"
          }
        ]
      }}
    />
  );
}
