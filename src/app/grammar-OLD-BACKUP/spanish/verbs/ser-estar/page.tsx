import { Metadata } from 'next';
import GrammarTopicTemplate from '../../../../../components/grammar/GrammarTopicTemplate';

export const metadata: Metadata = {
  title: 'Spanish Ser vs Estar - Language Gems',
  description: 'Master the difference between ser and estar in Spanish. Learn when to use each verb "to be" with clear rules and examples.',
  keywords: 'ser vs estar, Spanish to be verbs, ser estar difference, Spanish grammar, permanent temporary',
};

export default function SpanishSerEstarPage() {
  return (
    <GrammarTopicTemplate
      language="spanish"
      category="verbs"
      topic="ser-estar"
      title="Ser vs Estar"
      description="Master the crucial difference between the two Spanish verbs meaning 'to be'"
      backUrl="/grammar/spanish"
      content={{
        overview: "Both ser and estar mean 'to be' but are used in different contexts. Understanding when to use each is essential for Spanish fluency.",
        keyPoints: [
          "SER: permanent characteristics, identity, professions, time, origin",
          "ESTAR: temporary states, location, ongoing actions, conditions",
          "SER: Soy médico (I am a doctor - profession)",
          "ESTAR: Estoy cansado (I am tired - temporary state)",
          "Some adjectives change meaning: ser listo (clever) vs estar listo (ready)"
        ],
        examples: [
          {
            spanish: "Mi hermana es doctora y está trabajando en el hospital.",
            english: "My sister is a doctor and is working at the hospital.",
            explanation: "SER for profession (permanent), ESTAR for ongoing action"
          },
          {
            spanish: "La comida es deliciosa pero está fría.",
            english: "The food is delicious but it's cold.",
            explanation: "SER for inherent quality, ESTAR for temporary temperature"
          }
        ]
      }}
    />
  );
}
