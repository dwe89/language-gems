import { Metadata } from 'next';
import GrammarTopicTemplate from '../../../../../components/grammar/GrammarTopicTemplate';

export const metadata: Metadata = {
  title: 'Spanish Superlative Adjectives - LanguageGems',
  description: 'Learn Spanish superlative adjectives. Master el más, la más, los más, las más and absolute superlatives with -ísimo.',
  keywords: 'Spanish superlatives, superlative adjectives, el más, la más, -ísimo, Spanish grammar, most least',
  openGraph: {
    title: 'Spanish Superlative Adjectives - LanguageGems',
    description: 'Learn Spanish superlative adjectives and superlative structures.',
    type: 'article',
  },
};

export default function SpanishSuperlativesPage() {
  return (
    <GrammarTopicTemplate
      language="spanish"
      category="adjectives"
      topic="superlatives"
      title="Superlatives"
      description="Learn how to express the highest degree with Spanish adjectives"
      backUrl="/grammar/spanish"
      content={{
        overview: "Master Spanish superlative forms to express the highest or lowest degree of a quality.",
        keyPoints: [
          "el/la/los/las + más + adjective: el más alto (the tallest)",
          "el/la/los/las + menos + adjective: la menos cara (the least expensive)",
          "Irregular superlatives: el mejor, el peor, el mayor, el menor",
          "Absolute superlatives with -ísimo: altísimo (very tall)",
          "Use 'de' to specify the group: el más alto de la clase"
        ],
        examples: [
          {
            spanish: "Es el estudiante más inteligente de la clase.",
            english: "He is the most intelligent student in the class.",
            explanation: "el + más + adjective + de structure"
          },
          {
            spanish: "Esta es la mejor película del año.",
            english: "This is the best movie of the year.",
            explanation: "mejor is the irregular superlative of bueno"
          }
        ]
      }}
    />
  );
}
