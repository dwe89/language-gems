import { Metadata } from 'next';
import GrammarTopicTemplate from '../../../../../components/grammar/GrammarTopicTemplate';

export const metadata: Metadata = {
  title: 'Spanish Present Tense Regular Verbs - Language Gems',
  description: 'Learn Spanish regular verb conjugation in present tense. Master -ar, -er, and -ir verb patterns with practice and examples.',
  keywords: 'Spanish regular verbs, present tense conjugation, ar er ir verbs, Spanish grammar, verb patterns',
};

export default function SpanishPresentRegularPage() {
  return (
    <GrammarTopicTemplate
      language="spanish"
      category="verbs"
      topic="present-regular"
      title="Present Tense Regular Verbs"
      description="Master the three regular verb patterns in Spanish present tense"
      backUrl="/grammar/spanish"
      content={{
        overview: "Learn the foundation of Spanish verb conjugation with the three regular patterns: -ar, -er, and -ir verbs.",
        keyPoints: [
          "AR verbs: -o, -as, -a, -amos, -áis, -an (hablar → hablo, hablas...)",
          "ER verbs: -o, -es, -e, -emos, -éis, -en (comer → como, comes...)",
          "IR verbs: -o, -es, -e, -imos, -ís, -en (vivir → vivo, vives...)",
          "Remove the infinitive ending and add the appropriate ending",
          "These patterns work for hundreds of Spanish verbs"
        ],
        examples: [
          {
            spanish: "Yo hablo español y como paella.",
            english: "I speak Spanish and eat paella.",
            explanation: "AR verb (hablar) and ER verb (comer) conjugated for 'yo'"
          },
          {
            spanish: "Nosotros estudiamos y vivimos en Madrid.",
            english: "We study and live in Madrid.",
            explanation: "AR verb (estudiar) and IR verb (vivir) conjugated for 'nosotros'"
          }
        ]
      }}
    />
  );
}
