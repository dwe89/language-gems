import { Metadata } from 'next';
import GrammarQuiz from '../../../../../../components/grammar/GrammarQuiz';

export const metadata: Metadata = {
  title: 'Spanish Reflexive Pronouns Quiz | Language Gems',
  description: 'Test your knowledge of Spanish reflexive pronouns with this comprehensive quiz. Master reflexive verbs and self-directed actions.',
  keywords: 'spanish reflexive pronouns quiz, reflexive verbs quiz, spanish grammar test',
  openGraph: {
    title: 'Spanish Reflexive Pronouns Quiz | Language Gems',
    description: 'Test your knowledge of Spanish reflexive pronouns with this comprehensive quiz. Master reflexive verbs and self-directed actions.',
    type: 'website',
    url: 'https://languagegems.com/grammar/spanish/pronouns/reflexive/quiz'
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/pronouns/reflexive/quiz'
  }
};

export default function SpanishReflexivePronounsQuizPage() {
  return (
    <GrammarQuiz
      language="spanish"
      category="pronouns"
      topic="reflexive"
      title="Spanish Reflexive Pronouns Quiz"
      description="Test your knowledge of Spanish reflexive pronouns"
      backUrl="/grammar/spanish/pronouns/reflexive"
      lessonUrl="/grammar/spanish/pronouns/reflexive"
      practiceUrl="/grammar/spanish/pronouns/reflexive/practice"
    />
  );
}
