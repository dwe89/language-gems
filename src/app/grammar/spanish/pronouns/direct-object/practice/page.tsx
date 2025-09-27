import { Metadata } from 'next';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';

export const metadata: Metadata = {
  title: 'Spanish Direct Object Pronouns Practice | Language Gems',
  description: 'Practice Spanish direct object pronouns with interactive exercises. Master me, te, lo, la, nos, os, los, las.',
  keywords: 'spanish direct object pronouns practice, lo la los las practice, spanish grammar exercises',
  openGraph: {
    title: 'Spanish Direct Object Pronouns Practice | Language Gems',
    description: 'Practice Spanish direct object pronouns with interactive exercises. Master me, te, lo, la, nos, os, los, las.',
    type: 'website',
    url: 'https://languagegems.com/grammar/spanish/pronouns/direct-object/practice'
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/pronouns/direct-object/practice'
  }
};

export default function SpanishDirectObjectPronounsPracticePage() {
  return (
    <GrammarPractice
      language="spanish"
      category="pronouns"
      topic="direct-object"
      title="Spanish Direct Object Pronouns Practice"
      description="Practice Spanish direct object pronouns with interactive exercises"
      backUrl="/grammar/spanish/pronouns/direct-object"
      lessonUrl="/grammar/spanish/pronouns/direct-object"
      quizUrl="/grammar/spanish/pronouns/direct-object/quiz"
    />
  );
}
