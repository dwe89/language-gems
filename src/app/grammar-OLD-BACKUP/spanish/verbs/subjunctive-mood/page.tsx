import { Metadata } from 'next';
import GrammarTopicTemplate from '../../../../../components/grammar/GrammarTopicTemplate';

export const metadata: Metadata = {
  title: 'Spanish Subjunctive Mood - Language Gems',
  description: 'Master the Spanish subjunctive mood for expressing doubt, emotion, desire, and hypothetical situations.',
  keywords: 'Spanish subjunctive mood, subjunctive conjugation, doubt emotion desire, Spanish grammar, hypothetical',
};

export default function SpanishSubjunctiveMoodPage() {
  return (
    <GrammarTopicTemplate
      language="spanish"
      category="verbs"
      topic="subjunctive-mood"
      title="Subjunctive Mood"
      description="Express doubt, emotion, desire, and hypothetical situations with the subjunctive"
      backUrl="/grammar/spanish"
      content={{
        overview: "The subjunctive mood expresses subjective attitudes like doubt, emotion, desire, or hypothetical situations rather than facts.",
        keyPoints: [
          "Triggered by expressions of doubt: 'Dudo que...' (I doubt that...)",
          "Used after emotions: 'Me alegra que...' (I'm happy that...)",
          "Follows desires: 'Quiero que...' (I want that...)",
          "Present subjunctive: take yo form, drop -o, add opposite endings",
          "Common triggers: es importante que, ojalá que, cuando (future)"
        ],
        examples: [
          {
            spanish: "Espero que tengas un buen día.",
            english: "I hope you have a good day.",
            explanation: "Subjunctive after 'espero que' expressing hope/desire"
          },
          {
            spanish: "Es importante que estudies para el examen.",
            english: "It's important that you study for the exam.",
            explanation: "Subjunctive after impersonal expression 'es importante que'"
          }
        ]
      }}
    />
  );
}
