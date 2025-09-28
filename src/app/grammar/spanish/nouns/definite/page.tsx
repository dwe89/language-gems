import { Metadata } from 'next';
import GrammarTopicTemplate from '../../../../../components/grammar/GrammarTopicTemplate';

export const metadata: Metadata = {
  title: 'Spanish Definite Articles - Language Gems',
  description: 'Master Spanish definite articles (el, la, los, las) with interactive practice and quizzes. Learn when and how to use definite articles correctly.',
  keywords: 'Spanish definite articles, el la los las, Spanish grammar, definite articles practice',
};

export default function SpanishDefiniteArticlesPage() {
  return (
    <GrammarTopicTemplate
      language="spanish"
      category="nouns"
      topic="definite"
      title="Definite Articles"
      description="Master the Spanish definite articles: el, la, los, las"
      backUrl="/grammar/spanish"
      content={{
        overview: "Learn how to use Spanish definite articles correctly with nouns of different genders and numbers.",
        keyPoints: [
          "El - masculine singular (el libro)",
          "La - feminine singular (la mesa)", 
          "Los - masculine plural (los libros)",
          "Las - feminine plural (las mesas)",
          "Some exceptions: el problema, la mano"
        ],
        examples: [
          {
            spanish: "El gato está en la mesa.",
            english: "The cat is on the table.",
            explanation: "El (masculine) with gato, la (feminine) with mesa"
          },
          {
            spanish: "Los estudiantes leen las revistas.",
            english: "The students read the magazines.",
            explanation: "Los (masculine plural), las (feminine plural)"
          }
        ]
      }}
    />
  );
}
