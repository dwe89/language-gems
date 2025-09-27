import { Metadata } from 'next';
import GrammarQuiz from '../../../../../../components/grammar/GrammarQuiz';

export const metadata: Metadata = {
  title: 'Spanish Demonstrative Adjectives Quiz | Language Gems',
  description: 'Test your knowledge of Spanish demonstrative adjectives with this comprehensive quiz. Master este, ese, aquel forms.',
  keywords: 'spanish demonstrative quiz, este ese aquel quiz, spanish grammar test',
  openGraph: {
    title: 'Spanish Demonstrative Adjectives Quiz | Language Gems',
    description: 'Test your knowledge of Spanish demonstrative adjectives with this comprehensive quiz. Master este, ese, aquel forms.',
    type: 'website',
    url: 'https://languagegems.com/grammar/spanish/adjectives/demonstrative/quiz'
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/adjectives/demonstrative/quiz'
  }
};

export default function SpanishDemonstrativeAdjectivesQuizPage() {
  return (
    <GrammarQuiz
      language="spanish"
      category="adjectives"
      topic="demonstrative"
      title="Spanish Demonstrative Adjectives Quiz"
      description="Test your knowledge of Spanish demonstrative adjectives"
      backUrl="/grammar/spanish/adjectives/demonstrative"
      lessonUrl="/grammar/spanish/adjectives/demonstrative"
      practiceUrl="/grammar/spanish/adjectives/demonstrative/practice"
    />
  );
}
