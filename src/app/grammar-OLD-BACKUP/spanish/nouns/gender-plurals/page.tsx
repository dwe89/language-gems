import { Metadata } from 'next';
import GrammarTopicTemplate from '../../../../../components/grammar/GrammarTopicTemplate';

export const metadata: Metadata = {
  title: 'Spanish Gender and Plurals - Language Gems',
  description: 'Learn Spanish noun gender and plural formation rules. Master masculine/feminine nouns and how to make them plural.',
  keywords: 'Spanish gender, Spanish plurals, masculine feminine nouns, plural formation Spanish',
};

export default function SpanishGenderPluralsPage() {
  return (
    <GrammarTopicTemplate
      language="spanish"
      category="nouns"
      topic="gender-plurals"
      title="Gender and Plurals"
      description="Master Spanish noun gender and plural formation"
      backUrl="/grammar/spanish"
      content={{
        overview: "Learn how Spanish nouns have gender (masculine/feminine) and how to form plurals correctly.",
        keyPoints: [
          "Masculine nouns usually end in -o (el libro → los libros)",
          "Feminine nouns usually end in -a (la mesa → las mesas)",
          "Add -s to words ending in vowels for plurals",
          "Add -es to words ending in consonants",
          "Words ending in -z change to -ces (lápiz → lápices)"
        ],
        examples: [
          {
            spanish: "el gato → los gatos",
            english: "the cat → the cats",
            explanation: "Masculine singular to masculine plural"
          },
          {
            spanish: "la profesora → las profesoras",
            english: "the teacher → the teachers",
            explanation: "Feminine singular to feminine plural"
          },
          {
            spanish: "el animal → los animales",
            english: "the animal → the animals",
            explanation: "Consonant ending adds -es"
          }
        ]
      }}
    />
  );
}
