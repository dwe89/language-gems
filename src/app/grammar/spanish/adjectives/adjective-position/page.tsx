import { Metadata } from 'next';
import GrammarTopicTemplate from '../../../../../components/grammar/GrammarTopicTemplate';

export const metadata: Metadata = {
  title: 'Spanish Adjective Position - LanguageGems',
  description: 'Learn the rules for Spanish adjective position. Understand when adjectives go before or after nouns and how position affects meaning.',
  keywords: 'Spanish adjectives, adjective position, Spanish grammar, before after nouns, adjective placement, Spanish word order',
  openGraph: {
    title: 'Spanish Adjective Position - LanguageGems',
    description: 'Learn the rules for Spanish adjective position and placement.',
    type: 'article',
  },
};

export default function SpanishAdjectivePositionPage() {
  return (
    <GrammarTopicTemplate
      language="spanish"
      category="adjectives"
      topic="adjective-position"
      title="Adjective Position"
      description="Learn when Spanish adjectives go before or after nouns"
      backUrl="/grammar/spanish"
      content={{
        overview: "Learn the rules for Spanish adjective position and how placement affects meaning.",
        keyPoints: [
          "Most adjectives go after the noun (casa blanca)",
          "Some adjectives go before the noun (buen amigo)",
          "Position can change meaning (gran hombre vs hombre grande)",
          "Descriptive adjectives usually follow the noun",
          "Limiting adjectives usually precede the noun"
        ],
        examples: [
          {
            spanish: "una casa blanca",
            english: "a white house",
            explanation: "Color adjectives go after the noun"
          },
          {
            spanish: "un buen estudiante",
            english: "a good student",
            explanation: "Bueno shortens to buen before masculine singular nouns"
          }
        ]
      }}
    />
  );
}
