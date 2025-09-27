import { Metadata } from 'next';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';

export const metadata: Metadata = {
  title: 'Spanish Possessive Pronouns Practice | Language Gems',
  description: 'Practice Spanish possessive pronouns with interactive exercises. Master mi, tu, su, nuestro, vuestro and their forms.',
  keywords: 'spanish possessive pronouns practice, mi tu su practice, spanish grammar exercises',
  openGraph: {
    title: 'Spanish Possessive Pronouns Practice | Language Gems',
    description: 'Practice Spanish possessive pronouns with interactive exercises. Master mi, tu, su, nuestro, vuestro and their forms.',
    type: 'website',
    url: 'https://languagegems.com/grammar/spanish/pronouns/possessive/practice'
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/pronouns/possessive/practice'
  }
};

export default function SpanishPossessivePronounsPracticePage() {
  return (
    <GrammarPractice
      language="spanish"
      category="pronouns"
      topic="possessive"
      title="Spanish Possessive Pronouns Practice"
      description="Practice Spanish possessive pronouns with interactive exercises"
      backUrl="/grammar/spanish/pronouns/possessive"
      lessonUrl="/grammar/spanish/pronouns/possessive"
      quizUrl="/grammar/spanish/pronouns/possessive/quiz"
    />
  );
}
