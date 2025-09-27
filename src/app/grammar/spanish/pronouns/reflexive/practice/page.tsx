import { Metadata } from 'next';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';

export const metadata: Metadata = {
  title: 'Spanish Reflexive Pronouns Practice | Language Gems',
  description: 'Practice Spanish reflexive pronouns with interactive exercises. Master me, te, se, nos, os, se and reflexive verbs.',
  keywords: 'spanish reflexive pronouns practice, reflexive verbs practice, spanish grammar exercises',
  openGraph: {
    title: 'Spanish Reflexive Pronouns Practice | Language Gems',
    description: 'Practice Spanish reflexive pronouns with interactive exercises. Master me, te, se, nos, os, se and reflexive verbs.',
    type: 'website',
    url: 'https://languagegems.com/grammar/spanish/pronouns/reflexive/practice'
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/pronouns/reflexive/practice'
  }
};

export default function SpanishReflexivePronounsPracticePage() {
  return (
    <GrammarPractice
      language="spanish"
      category="pronouns"
      topic="reflexive"
      title="Spanish Reflexive Pronouns Practice"
      description="Practice Spanish reflexive pronouns with interactive exercises"
      backUrl="/grammar/spanish/pronouns/reflexive"
      lessonUrl="/grammar/spanish/pronouns/reflexive"
      quizUrl="/grammar/spanish/pronouns/reflexive/quiz"
    />
  );
}
