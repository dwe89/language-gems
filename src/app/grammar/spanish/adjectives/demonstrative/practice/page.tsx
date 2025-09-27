import { Metadata } from 'next';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';

export const metadata: Metadata = {
  title: 'Spanish Demonstrative Adjectives Practice | Language Gems',
  description: 'Practice Spanish demonstrative adjectives with interactive exercises. Master este, ese, aquel and their forms.',
  keywords: 'spanish demonstrative practice, este ese aquel practice, spanish grammar exercises',
  openGraph: {
    title: 'Spanish Demonstrative Adjectives Practice | Language Gems',
    description: 'Practice Spanish demonstrative adjectives with interactive exercises. Master este, ese, aquel and their forms.',
    type: 'website',
    url: 'https://languagegems.com/grammar/spanish/adjectives/demonstrative/practice'
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/adjectives/demonstrative/practice'
  }
};

export default function SpanishDemonstrativeAdjectivesPracticePage() {
  return (
    <GrammarPractice
      language="spanish"
      category="adjectives"
      topic="demonstrative"
      title="Spanish Demonstrative Adjectives Practice"
      description="Practice Spanish demonstrative adjectives with interactive exercises"
      backUrl="/grammar/spanish/adjectives/demonstrative"
      lessonUrl="/grammar/spanish/adjectives/demonstrative"
      quizUrl="/grammar/spanish/adjectives/demonstrative/quiz"
    />
  );
}
