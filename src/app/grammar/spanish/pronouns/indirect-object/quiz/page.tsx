import { Metadata } from 'next';
import GrammarQuiz from '../../../../../../components/grammar/GrammarQuiz';

export const metadata: Metadata = {
  title: 'Spanish Indirect Object Pronouns Quiz | Language Gems',
  description: 'Test your knowledge of Spanish indirect object pronouns with this comprehensive quiz. Master to whom and for whom.',
  keywords: 'spanish indirect object pronouns quiz, le les quiz, spanish grammar test',
  openGraph: {
    title: 'Spanish Indirect Object Pronouns Quiz | Language Gems',
    description: 'Test your knowledge of Spanish indirect object pronouns with this comprehensive quiz. Master to whom and for whom.',
    type: 'website',
    url: 'https://languagegems.com/grammar/spanish/pronouns/indirect-object/quiz'
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/pronouns/indirect-object/quiz'
  }
};

export default function SpanishIndirectObjectPronounsQuizPage() {
  return (
    <GrammarQuiz
      language="spanish"
      category="pronouns"
      topic="indirect-object"
      title="Spanish Indirect Object Pronouns Quiz"
      description="Test your knowledge of Spanish indirect object pronouns"
      backUrl="/grammar/spanish/pronouns/indirect-object"
      lessonUrl="/grammar/spanish/pronouns/indirect-object"
      practiceUrl="/grammar/spanish/pronouns/indirect-object/practice"
    />
  );
}
