import { Metadata } from 'next';
import GrammarQuiz from '../../../../../../components/grammar/GrammarQuiz';

export const metadata: Metadata = {
  title: 'Spanish Direct Object Pronouns Quiz | Language Gems',
  description: 'Test your knowledge of Spanish direct object pronouns with this comprehensive quiz. Master pronoun placement and agreement.',
  keywords: 'spanish direct object pronouns quiz, lo la los las quiz, spanish grammar test',
  openGraph: {
    title: 'Spanish Direct Object Pronouns Quiz | Language Gems',
    description: 'Test your knowledge of Spanish direct object pronouns with this comprehensive quiz. Master pronoun placement and agreement.',
    type: 'website',
    url: 'https://languagegems.com/grammar/spanish/pronouns/direct-object/quiz'
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/pronouns/direct-object/quiz'
  }
};

export default function SpanishDirectObjectPronounsQuizPage() {
  return (
    <GrammarQuiz
      language="spanish"
      category="pronouns"
      topic="direct-object"
      title="Spanish Direct Object Pronouns Quiz"
      description="Test your knowledge of Spanish direct object pronouns"
      backUrl="/grammar/spanish/pronouns/direct-object"
      lessonUrl="/grammar/spanish/pronouns/direct-object"
      practiceUrl="/grammar/spanish/pronouns/direct-object/practice"
    />
  );
}
