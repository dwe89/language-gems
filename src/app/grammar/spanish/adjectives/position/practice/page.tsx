import { Metadata } from 'next';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';

export const metadata: Metadata = {
  title: 'Spanish Adjective Position Practice | Language Gems',
  description: 'Practice Spanish adjective position with interactive exercises. Learn when adjectives go before or after nouns.',
  keywords: 'spanish adjective position practice, adjective placement practice, spanish grammar exercises',
  openGraph: {
    title: 'Spanish Adjective Position Practice | Language Gems',
    description: 'Practice Spanish adjective position with interactive exercises. Learn when adjectives go before or after nouns.',
    type: 'website',
    url: 'https://languagegems.com/grammar/spanish/adjectives/position/practice'
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/adjectives/position/practice'
  }
};

export default function SpanishAdjectivePositionPracticePage() {
  return (
    <GrammarPractice
      language="spanish"
      category="adjectives"
      topic="position"
      title="Spanish Adjective Position Practice"
      description="Practice Spanish adjective position with interactive exercises"
      backUrl="/grammar/spanish/adjectives/position"
      lessonUrl="/grammar/spanish/adjectives/position"
      quizUrl="/grammar/spanish/adjectives/position/quiz"
    />
  );
}
