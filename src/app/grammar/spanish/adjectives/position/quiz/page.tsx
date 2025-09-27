import { Metadata } from 'next';
import GrammarQuiz from '../../../../../../components/grammar/GrammarQuiz';

export const metadata: Metadata = {
  title: 'Spanish Adjective Position Quiz | Language Gems',
  description: 'Test your knowledge of Spanish adjective position with this comprehensive quiz. Master adjective placement rules.',
  keywords: 'spanish adjective position quiz, adjective placement quiz, spanish grammar test',
  openGraph: {
    title: 'Spanish Adjective Position Quiz | Language Gems',
    description: 'Test your knowledge of Spanish adjective position with this comprehensive quiz. Master adjective placement rules.',
    type: 'website',
    url: 'https://languagegems.com/grammar/spanish/adjectives/position/quiz'
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/adjectives/position/quiz'
  }
};

export default function SpanishAdjectivePositionQuizPage() {
  return (
    <GrammarQuiz
      language="spanish"
      category="adjectives"
      topic="position"
      title="Spanish Adjective Position Quiz"
      description="Test your knowledge of Spanish adjective position"
      backUrl="/grammar/spanish/adjectives/position"
      lessonUrl="/grammar/spanish/adjectives/position"
      practiceUrl="/grammar/spanish/adjectives/position/practice"
    />
  );
}
