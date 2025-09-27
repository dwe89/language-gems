import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'verb-conjugation-patterns',
  title: 'Spanish Verb Conjugation Patterns - Regular and Irregular',
  description: 'Learn Spanish verb conjugation patterns including regular -ar, -er, -ir verbs, stem-changing patterns, and irregular conjugation groups.',
  difficulty: 'intermediate',
  keywords: ['spanish conjugation', 'verb patterns', 'regular verbs', 'irregular verbs', 'stem changes', 'conjugation groups'],
  examples: ['hablar → hablo, hablas', 'dormir → duermo, duermes', 'tener → tengo, tienes']
});

const sections = [
  {
    title: 'Understanding Spanish Verb Conjugation Patterns',
    content: 'Spanish verbs follow predictable patterns based on their infinitive endings and stem changes. Mastering these patterns helps you conjugate thousands of verbs correctly.',
    examples: [
      {
        spanish: 'hablar → hablo, hablas, habla',
        english: 'to speak → I speak, you speak, he/she speaks',
        highlight: ['hablar', 'hablo', 'hablas', 'habla']
      },
      {
        spanish: 'comer → como, comes, come',
        english: 'to eat → I eat, you eat, he/she eats',
        highlight: ['comer', 'como', 'comes', 'come']
      }
    ]
  },
  {
    title: 'Regular Verb Patterns',
    content: 'Regular verbs follow consistent patterns based on their infinitive endings: **-ar**, **-er**, and **-ir**.',
    subsections: [
      {
        title: '-AR Verbs (First Conjugation)',
        content: 'The largest group of Spanish verbs. Remove **-ar** and add the appropriate endings.',
        conjugationTable: {
          title: 'Present Tense -AR Pattern (hablar)',
          conjugations: [
            { pronoun: 'yo', form: 'hablo', english: 'I speak' },
            { pronoun: 'tú', form: 'hablas', english: 'you speak' },
            { pronoun: 'él/ella/usted', form: 'habla', english: 'he/she/you speak' },
            { pronoun: 'nosotros', form: 'hablamos', english: 'we speak' },
            { pronoun: 'vosotros', form: 'habláis', english: 'you all speak' },
            { pronoun: 'ellos/ellas/ustedes', form: 'hablan', english: 'they/you all speak' }
          ]
        }
      },
      {
        title: '-ER Verbs (Second Conjugation)',
        content: 'Remove **-er** and add the appropriate endings.',
        conjugationTable: {
          title: 'Present Tense -ER Pattern (comer)',
          conjugations: [
            { pronoun: 'yo', form: 'como', english: 'I eat' },
            { pronoun: 'tú', form: 'comes', english: 'you eat' },
            { pronoun: 'él/ella/usted', form: 'come', english: 'he/she/you eat' },
            { pronoun: 'nosotros', form: 'comemos', english: 'we eat' },
            { pronoun: 'vosotros', form: 'coméis', english: 'you all eat' },
            { pronoun: 'ellos/ellas/ustedes', form: 'comen', english: 'they/you all eat' }
          ]
        }
      },
      {
        title: '-IR Verbs (Third Conjugation)',
        content: 'Remove **-ir** and add the appropriate endings.',
        conjugationTable: {
          title: 'Present Tense -IR Pattern (vivir)',
          conjugations: [
            { pronoun: 'yo', form: 'vivo', english: 'I live' },
            { pronoun: 'tú', form: 'vives', english: 'you live' },
            { pronoun: 'él/ella/usted', form: 'vive', english: 'he/she/you live' },
            { pronoun: 'nosotros', form: 'vivimos', english: 'we live' },
            { pronoun: 'vosotros', form: 'vivís', english: 'you all live' },
            { pronoun: 'ellos/ellas/ustedes', form: 'viven', english: 'they/you all live' }
          ]
        }
      }
    ]
  },
  {
    title: 'Stem-Changing Patterns',
    content: 'Many verbs change their stem vowel in certain conjugations. The most common patterns are **e→ie**, **o→ue**, and **e→i**.',
    examples: [
      {
        spanish: 'pensar → pienso, piensas, piensa',
        english: 'to think → I think, you think, he/she thinks',
        highlight: ['pensar', 'pienso', 'piensas', 'piensa']
      },
      {
        spanish: 'dormir → duermo, duermes, duerme',
        english: 'to sleep → I sleep, you sleep, he/she sleeps',
        highlight: ['dormir', 'duermo', 'duermes', 'duerme']
      }
    ],
    subsections: [
      {
        title: 'E → IE Pattern',
        content: 'The stem vowel **e** changes to **ie** in stressed syllables.',
        conjugationTable: {
          title: 'E→IE Pattern (pensar)',
          conjugations: [
            { pronoun: 'yo', form: 'pienso', english: 'I think' },
            { pronoun: 'tú', form: 'piensas', english: 'you think' },
            { pronoun: 'él/ella/usted', form: 'piensa', english: 'he/she/you think' },
            { pronoun: 'nosotros', form: 'pensamos', english: 'we think (no change)' },
            { pronoun: 'vosotros', form: 'pensáis', english: 'you all think (no change)' },
            { pronoun: 'ellos/ellas/ustedes', form: 'piensan', english: 'they/you all think' }
          ]
        }
      }
    ]
  },
  {
    title: 'Irregular Conjugation Groups',
    content: 'Some verbs have unique patterns that don\'t follow regular rules. Learning these groups helps you recognize patterns.',
    examples: [
      {
        spanish: 'tener → tengo, tienes, tiene',
        english: 'to have → I have, you have, he/she has',
        highlight: ['tener', 'tengo', 'tienes', 'tiene']
      },
      {
        spanish: 'hacer → hago, haces, hace',
        english: 'to do/make → I do, you do, he/she does',
        highlight: ['hacer', 'hago', 'haces', 'hace']
      }
    ]
  },
  {
    title: 'Pattern Recognition Tips',
    content: 'Learning to recognize verb patterns will help you conjugate new verbs correctly.',
    subsections: [
      {
        title: 'Key Strategies',
        content: '1. **Learn the infinitive ending** (-ar, -er, -ir)\n2. **Identify stem changes** in the infinitive\n3. **Memorize irregular first person** (yo) forms\n4. **Practice common verb families** together\n5. **Use pattern recognition** for new verbs'
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Gerunds', url: '/grammar/spanish/verbs/gerunds', difficulty: 'intermediate' },
  { title: 'Imperative', url: '/grammar/spanish/verbs/imperative', difficulty: 'intermediate' },
  { title: 'Irregular Verbs', url: '/grammar/spanish/verbs/irregular-verbs', difficulty: 'intermediate' },
  { title: 'Future Tense', url: '/grammar/spanish/verbs/future', difficulty: 'intermediate' }
];

export default function SpanishVerbConjugationPatternsPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Verb Conjugation Patterns - Regular and Irregular',
            description: 'Learn Spanish verb conjugation patterns including regular -ar, -er, -ir verbs, stem-changing patterns, and irregular conjugation groups.',
            keywords: ['spanish conjugation', 'verb patterns', 'regular verbs', 'irregular verbs', 'stem changes'],
            language: 'spanish',
            category: 'verbs',
            topic: 'verb-conjugation-patterns'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="verb-conjugation-patterns"
        title="Spanish Verb Conjugation Patterns"
        description="Learn Spanish verb conjugation patterns including regular -ar, -er, -ir verbs, stem-changing patterns, and irregular conjugation groups."
        difficulty="intermediate"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/verb-conjugation-patterns/practice"
        quizUrl="/grammar/spanish/verbs/verb-conjugation-patterns/quiz"
        songUrl="/songs/es?theme=grammar&topic=verb-conjugation-patterns"
        youtubeVideoId="verb-conjugation-patterns-spanish"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
