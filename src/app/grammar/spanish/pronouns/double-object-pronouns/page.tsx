import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'pronouns',
  topic: 'double-object-pronouns',
  title: 'Spanish Double Object Pronouns',
  description: 'Master Spanish double object pronouns with clear rules and practical examples.',
  difficulty: 'intermediate',
  keywords: [
    'spanish double object pronouns',
    'indirect and direct object pronouns',
    'me lo',
    'te la',
    'se los',
    'pronoun order'
  ],
  examples: [
    'Me lo das (You give it to me)',
    'Se la recomiendo (I recommend it to him/her)',
    'Nos los traen (They bring them to us)'
  ]
});

const sections = [
  {
    title: 'What are Double Object Pronouns?',
    content: `When a sentence has both an indirect object pronoun and a direct object pronoun, they appear together as **double object pronouns**.

The order is always: **Indirect Object Pronoun + Direct Object Pronoun**

Example: Me lo das = I.O. + D.O. (You give it to me)`,
    examples: [
      {
        spanish: 'Me lo das.',
        english: 'You give it to me.',
        highlight: ['Me lo']
      },
      {
        spanish: 'Te la compro.',
        english: 'I buy it for you.',
        highlight: ['Te la']
      }
    ]
  },
  {
    title: 'The Order Rule',
    content: `The fundamental rule for double object pronouns is simple:

**Indirect Object Pronoun ALWAYS comes before Direct Object Pronoun**`,
    subsections: [
      {
        title: 'Indirect Object Pronouns',
        content: 'me, te, le, nos, os, les',
        examples: [
          {
            spanish: 'Me lo das.',
            english: 'You give it to me.',
            highlight: ['Me']
          }
        ]
      },
      {
        title: 'Direct Object Pronouns',
        content: 'lo, la, los, las',
        examples: [
          {
            spanish: 'Me lo das.',
            english: 'You give it to me.',
            highlight: ['lo']
          }
        ]
      }
    ]
  },
  {
    title: 'The SE Substitution Rule',
    content: `When the indirect object pronoun is **le** or **les**, it changes to **se** before a direct object pronoun.

This is a special rule to avoid the awkward combination "le lo", "le la", etc.`,
    subsections: [
      {
        title: 'LE becomes SE',
        content: 'When you have le + direct object pronoun:',
        examples: [
          {
            spanish: 'Se lo doy. (NOT: Le lo doy)',
            english: 'I give it to him/her.',
            highlight: ['Se lo']
          },
          {
            spanish: 'Se la recomiendo. (NOT: Le la recomiendo)',
            english: 'I recommend it to him/her.',
            highlight: ['Se la']
          }
        ]
      },
      {
        title: 'LES becomes SE',
        content: 'When you have les + direct object pronoun:',
        examples: [
          {
            spanish: 'Se las doy. (NOT: Les las doy)',
            english: 'I give them to them.',
            highlight: ['Se las']
          },
          {
            spanish: 'Se los presento. (NOT: Les los presento)',
            english: 'I introduce them to them.',
            highlight: ['Se los']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Examples',
    content: `Practical examples of double object pronouns in use.`,
    examples: [
      {
        spanish: 'Me lo das.',
        english: 'You give it to me.',
        highlight: ['Me lo']
      },
      {
        spanish: 'Te la compro.',
        english: 'I buy it for you.',
        highlight: ['Te la']
      },
      {
        spanish: 'Se lo doy.',
        english: 'I give it to him/her.',
        highlight: ['Se lo']
      },
      {
        spanish: 'Nos los traen.',
        english: 'They bring them to us.',
        highlight: ['Nos los']
      },
      {
        spanish: 'Os la muestro.',
        english: 'I show it to you all.',
        highlight: ['Os la']
      },
      {
        spanish: 'Se la explico.',
        english: 'I explain it to him/her.',
        highlight: ['Se la']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Direct Object Pronouns', url: '/grammar/spanish/pronouns', difficulty: 'beginner' },
  { title: 'Indirect Object Pronouns', url: '/grammar/spanish/pronouns', difficulty: 'beginner' },
  { title: 'Pronouns', url: '/grammar/spanish/pronouns', difficulty: 'intermediate' }
];

export default function SpanishDoubleObjectPronounsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'pronouns',
              topic: 'double-object-pronouns',
              title: 'Spanish Double Object Pronouns',
              description: 'Master Spanish double object pronouns',
              difficulty: 'intermediate',
              estimatedTime: 20
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'pronouns',
              topic: 'double-object-pronouns',
              title: 'Spanish Double Object Pronouns'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="pronouns"
        topic="double-object-pronouns"
        title="Spanish Double Object Pronouns"
        description="Master Spanish double object pronouns with clear rules and practical examples"
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/pronouns"
        practiceUrl="/grammar/spanish/pronouns/double-object-pronouns/practice"
        quizUrl="/grammar/spanish/pronouns/double-object-pronouns/quiz"
        songUrl="/songs/es?theme=grammar&topic=double-object-pronouns"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}

