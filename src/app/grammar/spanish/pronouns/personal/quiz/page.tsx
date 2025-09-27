import { Metadata } from 'next';
import GrammarQuiz from '../../../../../../components/grammar/GrammarQuiz';

export const metadata: Metadata = {
  title: 'Spanish Personal Pronouns Quiz | Language Gems',
  description: 'Test your knowledge of Spanish personal pronouns with this comprehensive quiz. Master subject pronouns.',
  keywords: 'spanish personal pronouns quiz, subject pronouns quiz, spanish grammar test',
  openGraph: {
    title: 'Spanish Personal Pronouns Quiz | Language Gems',
    description: 'Test your knowledge of Spanish personal pronouns with this comprehensive quiz. Master subject pronouns.',
    type: 'website',
    url: 'https://languagegems.com/grammar/spanish/pronouns/personal/quiz'
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/pronouns/personal/quiz'
  }
};

export default function SpanishPersonalPronounsQuizPage() {
  return (
    <GrammarQuiz
      language="spanish"
      category="pronouns"
      topic="personal"
      title="Spanish Personal Pronouns Quiz"
      description="Test your knowledge of Spanish personal pronouns"
      backUrl="/grammar/spanish/pronouns/personal"
      lessonUrl="/grammar/spanish/pronouns/personal"
      practiceUrl="/grammar/spanish/pronouns/personal/practice"
    />
  );
}
