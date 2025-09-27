import { Metadata } from 'next';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';

export const metadata: Metadata = {
  title: 'Spanish Personal Pronouns Practice | Language Gems',
  description: 'Practice Spanish personal pronouns with interactive exercises. Master yo, tú, él, ella, nosotros, and more.',
  keywords: 'spanish personal pronouns practice, subject pronouns practice, spanish grammar exercises',
  openGraph: {
    title: 'Spanish Personal Pronouns Practice | Language Gems',
    description: 'Practice Spanish personal pronouns with interactive exercises. Master yo, tú, él, ella, nosotros, and more.',
    type: 'website',
    url: 'https://languagegems.com/grammar/spanish/pronouns/personal/practice'
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/pronouns/personal/practice'
  }
};

export default function SpanishPersonalPronounsPracticePage() {
  return (
    <GrammarPractice
      language="spanish"
      category="pronouns"
      topic="personal"
      title="Spanish Personal Pronouns Practice"
      description="Practice Spanish personal pronouns with interactive exercises"
      backUrl="/grammar/spanish/pronouns/personal"
      lessonUrl="/grammar/spanish/pronouns/personal"
      quizUrl="/grammar/spanish/pronouns/personal/quiz"
    />
  );
}
