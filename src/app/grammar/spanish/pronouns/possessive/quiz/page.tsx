import { Metadata } from 'next';
import GrammarQuiz from '../../../../../../components/grammar/GrammarQuiz';

export const metadata: Metadata = {
  title: 'Spanish Possessive Pronouns Quiz | Language Gems',
  description: 'Test your knowledge of Spanish possessive pronouns with this comprehensive quiz. Master ownership expressions.',
  keywords: 'spanish possessive pronouns quiz, mi tu su quiz, spanish grammar test',
  openGraph: {
    title: 'Spanish Possessive Pronouns Quiz | Language Gems',
    description: 'Test your knowledge of Spanish possessive pronouns with this comprehensive quiz. Master ownership expressions.',
    type: 'website',
    url: 'https://languagegems.com/grammar/spanish/pronouns/possessive/quiz'
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/pronouns/possessive/quiz'
  }
};

export default function SpanishPossessivePronounsQuizPage() {
  return (
    <GrammarQuiz
      language="spanish"
      category="pronouns"
      topic="possessive"
      title="Spanish Possessive Pronouns Quiz"
      description="Test your knowledge of Spanish possessive pronouns"
      backUrl="/grammar/spanish/pronouns/possessive"
      lessonUrl="/grammar/spanish/pronouns/possessive"
      practiceUrl="/grammar/spanish/pronouns/possessive/practice"
    />
  );
}
