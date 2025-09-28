import { Metadata } from 'next';
import GrammarTopicTemplate from '../../../../../components/grammar/GrammarTopicTemplate';

export const metadata: Metadata = {
  title: 'Spanish Preterite Tense - Language Gems',
  description: 'Master the Spanish preterite tense for completed past actions. Learn regular and irregular preterite conjugations.',
  keywords: 'Spanish preterite tense, past tense Spanish, preterite conjugation, Spanish grammar, completed actions',
};

export default function SpanishPreteriteTensePage() {
  return (
    <GrammarTopicTemplate
      language="spanish"
      category="verbs"
      topic="preterite-tense"
      title="Preterite Tense"
      description="Express completed past actions with the Spanish preterite tense"
      backUrl="/grammar/spanish"
      content={{
        overview: "The preterite tense is used to describe completed actions in the past with a definite beginning and end.",
        keyPoints: [
          "Regular AR verbs: -é, -aste, -ó, -amos, -asteis, -aron",
          "Regular ER/IR verbs: -í, -iste, -ió, -imos, -isteis, -ieron",
          "Common irregular verbs: ser/ir (fui), tener (tuve), hacer (hice)",
          "Used for specific completed actions: 'Ayer comí pizza'",
          "Different from imperfect which describes ongoing past states"
        ],
        examples: [
          {
            spanish: "Ayer hablé con mi madre por teléfono.",
            english: "Yesterday I spoke with my mother on the phone.",
            explanation: "Completed action in the past with specific time reference"
          },
          {
            spanish: "Ellos fueron al cine y vieron una película.",
            english: "They went to the cinema and watched a movie.",
            explanation: "Two completed sequential actions using irregular 'ir' and regular 'ver'"
          }
        ]
      }}
    />
  );
}
