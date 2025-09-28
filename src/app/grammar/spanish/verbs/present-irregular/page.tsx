import { Metadata } from 'next';
import GrammarTopicTemplate from '../../../../../components/grammar/GrammarTopicTemplate';

export const metadata: Metadata = {
  title: 'Spanish Present Tense Irregular Verbs - Language Gems',
  description: 'Master Spanish irregular verbs in the present tense. Learn ser, estar, tener, hacer, ir and other common irregular verbs.',
  keywords: 'Spanish irregular verbs, present tense irregular, ser estar tener, Spanish grammar, irregular verb conjugation',
};

export default function SpanishPresentIrregularPage() {
  return (
    <GrammarTopicTemplate
      language="spanish"
      category="verbs"
      topic="present-irregular"
      title="Present Tense Irregular Verbs"
      description="Master the most common Spanish irregular verbs in present tense"
      backUrl="/grammar/spanish"
      content={{
        overview: "Learn the essential irregular verbs that don't follow standard conjugation patterns in Spanish present tense.",
        keyPoints: [
          "Ser (to be): soy, eres, es, somos, sois, son",
          "Estar (to be): estoy, estás, está, estamos, estáis, están",
          "Tener (to have): tengo, tienes, tiene, tenemos, tenéis, tienen",
          "Hacer (to do/make): hago, haces, hace, hacemos, hacéis, hacen",
          "Ir (to go): voy, vas, va, vamos, vais, van"
        ],
        examples: [
          {
            spanish: "Yo soy estudiante y tengo veinte años.",
            english: "I am a student and I am twenty years old.",
            explanation: "Ser for identity, tener for age"
          },
          {
            spanish: "¿Qué haces? Voy al cine.",
            english: "What are you doing? I'm going to the cinema.",
            explanation: "Hacer (what you do) and ir (where you go)"
          }
        ]
      }}
    />
  );
}
