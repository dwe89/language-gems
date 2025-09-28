import { Metadata } from 'next';
import GrammarTopicTemplate from '../../../../../components/grammar/GrammarTopicTemplate';

export const metadata: Metadata = {
  title: 'Spanish Comparative Adjectives - LanguageGems',
  description: 'Master Spanish comparative adjectives. Learn how to compare things using más que, menos que, tan como and irregular comparatives.',
  keywords: 'Spanish comparatives, comparative adjectives, más que, menos que, tan como, Spanish grammar, comparing things',
  openGraph: {
    title: 'Spanish Comparative Adjectives - LanguageGems',
    description: 'Master Spanish comparative adjectives and comparison structures.',
    type: 'article',
  },
};

export default function SpanishComparativesPage() {
  return (
    <GrammarTopicTemplate
      language="spanish"
      category="adjectives"
      topic="comparatives"
      title="Comparatives"
      description="Learn how to make comparisons with Spanish adjectives"
      backUrl="/grammar/spanish"
      content={{
        overview: "Master Spanish comparative forms to compare people, places, and things.",
        keyPoints: [
          "más + adjective + que (more...than): más alto que",
          "menos + adjective + que (less...than): menos caro que",
          "tan + adjective + como (as...as): tan rápido como",
          "Irregular comparatives: mejor, peor, mayor, menor",
          "Use 'de' instead of 'que' before numbers"
        ],
        examples: [
          {
            spanish: "María es más alta que Juan.",
            english: "María is taller than Juan.",
            explanation: "más + adjective + que structure"
          },
          {
            spanish: "Este libro es mejor que ese.",
            english: "This book is better than that one.",
            explanation: "mejor is the irregular comparative of bueno"
          }
        ]
      }}
    />
  );
}
