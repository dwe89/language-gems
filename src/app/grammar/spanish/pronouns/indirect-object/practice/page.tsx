import { Metadata } from 'next';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';

export const metadata: Metadata = {
  title: 'Spanish Indirect Object Pronouns Practice | Language Gems',
  description: 'Practice Spanish indirect object pronouns with interactive exercises. Master me, te, le, nos, os, les.',
  keywords: 'spanish indirect object pronouns practice, le les practice, spanish grammar exercises',
  openGraph: {
    title: 'Spanish Indirect Object Pronouns Practice | Language Gems',
    description: 'Practice Spanish indirect object pronouns with interactive exercises. Master me, te, le, nos, os, les.',
    type: 'website',
    url: 'https://languagegems.com/grammar/spanish/pronouns/indirect-object/practice'
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/pronouns/indirect-object/practice'
  }
};

export default function SpanishIndirectObjectPronounsPracticePage() {
  return (
    <GrammarPractice
      language="spanish"
      category="pronouns"
      topic="indirect-object"
      title="Spanish Indirect Object Pronouns Practice"
      description="Practice Spanish indirect object pronouns with interactive exercises"
      backUrl="/grammar/spanish/pronouns/indirect-object"
      lessonUrl="/grammar/spanish/pronouns/indirect-object"
      quizUrl="/grammar/spanish/pronouns/indirect-object/quiz"
    />
  );
}
